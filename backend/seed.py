"""
Database Seeding Script for Spendly Backend
Creates tables and seeds:
1. Demo User with 2,450 coins
2. 5 Active Reward Vouchers
3. All Transactions from Transactions_.json
"""

import json
import os
import sys
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.database import engine, SessionLocal
from app.models.base import Base
from app.models.user import User
from app.models.reward import Reward
from app.models.transaction import Transaction


INITIAL_REWARDS = [
    {
        "id": "rew_1",
        "name": "₹250 Shopping Voucher",
        "description": "Valid across Amazon, Myntra, and Flipkart on all categories.",
        "coin_cost": 500,
        "category": "Shopping",
        "value": "₹250",
        "partner": "Amazon & Myntra",
        "icon_name": "ShoppingBag",
        "badge": "Popular",
    },
    {
        "id": "rew_2",
        "name": "₹500 Food Voucher",
        "description": "Instant discount on Swiggy and Zomato orders above ₹299.",
        "coin_cost": 900,
        "category": "Food",
        "value": "₹500",
        "partner": "Swiggy & Zomato",
        "icon_name": "Utensils",
        "badge": "Best Value",
    },
    {
        "id": "rew_3",
        "name": "₹100 Instant Cashback",
        "description": "Direct credit to your linked primary bank account within 24 hours.",
        "coin_cost": 300,
        "category": "Cashback",
        "value": "₹100",
        "partner": "Spendly Direct",
        "icon_name": "Coins",
        "badge": None,
    },
    {
        "id": "rew_4",
        "name": "₹200 Entertainment Voucher",
        "description": "Use on BookMyShow movie tickets, events, or streaming subscriptions.",
        "coin_cost": 400,
        "category": "Entertainment",
        "value": "₹200",
        "partner": "BookMyShow",
        "icon_name": "Film",
        "badge": None,
    },
    {
        "id": "rew_5",
        "name": "₹500 Travel Voucher",
        "description": "Flat discount on flights, hotels, and Uber premier bookings.",
        "coin_cost": 1000,
        "category": "Travel",
        "value": "₹500",
        "partner": "MakeMyTrip & Uber",
        "icon_name": "Plane",
        "badge": "Premium",
    },
]


def parse_timestamp(ts_val) -> datetime:
    if isinstance(ts_val, (int, float)):
        return datetime.fromtimestamp(ts_val / 1000.0, tz=timezone.utc)
    if isinstance(ts_val, str):
        if ts_val.isdigit():
            return datetime.fromtimestamp(int(ts_val) / 1000.0, tz=timezone.utc)
        cleaned = ts_val.replace("Z", "+00:00")
        try:
            return datetime.fromisoformat(cleaned)
        except ValueError:
            pass
        # Try common date/time formats
        for fmt in (
            "%d/%m/%Y %H:%M:%S",
            "%m/%d/%Y %H:%M:%S",
            "%Y/%m/%d %H:%M:%S",
            "%d-%m-%Y %H:%M:%S",
            "%Y-%m-%d %H:%M:%S",
            "%d/%m/%Y %H:%M",
            "%m/%d/%Y %H:%M",
            "%d/%m/%Y",
            "%m/%d/%Y",
            "%Y-%m-%d",
        ):
            try:
                dt = datetime.strptime(ts_val, fmt)
                return dt.replace(tzinfo=timezone.utc)
            except ValueError:
                continue
    return datetime.now(timezone.utc)


def seed():
    print("Recreating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 1. Seed or update User
        user = db.query(User).filter(User.id == 1).first()
        if not user:
            print("Seeding demo user...")
            user = User(id=1, name="Saloni", coin_balance=2450)
            db.add(user)
            db.commit()
        else:
            print("Demo user already exists.")

        # 2. Seed Rewards
        print("Seeding reward catalog...")
        for r_data in INITIAL_REWARDS:
            existing = db.query(Reward).filter(Reward.id == r_data["id"]).first()
            if not existing:
                reward = Reward(
                    id=r_data["id"],
                    name=r_data["name"],
                    description=r_data["description"],
                    coin_cost=r_data["coin_cost"],
                    category=r_data["category"],
                    value=r_data["value"],
                    partner=r_data["partner"],
                    icon_name=r_data["icon_name"],
                    badge=r_data["badge"],
                    active=True,
                )
                db.add(reward)
        db.commit()

        # 3. Seed Transactions from root Transactions_.json
        json_paths = [
            Path(__file__).resolve().parent.parent / "Transactions_.json",
            Path(__file__).resolve().parent.parent / "transactions.json",
            Path(__file__).resolve().parent / "transactions.json",
        ]

        json_file = next((p for p in json_paths if p.exists()), None)
        if json_file:
            print(f"Found dataset at {json_file}. Seeding transactions...")
            with open(json_file, "r", encoding="utf-8") as f:
                raw_txns = json.load(f)

            existing_count = db.query(Transaction).count()
            if existing_count < len(raw_txns):
                print(f"Loading {len(raw_txns)} transactions into database...")
                # Bulk insert in batches
                batch = []
                now = datetime.now(timezone.utc)
                seen_ids = set()
                for item in raw_txns:
                    raw_id = str(item.get("id") or "")
                    if not raw_id or raw_id in seen_ids:
                        continue
                    seen_ids.add(raw_id)

                    ts = parse_timestamp(item["timestamp"])
                    try:
                        amt = abs(Decimal(str(item["amount"])))
                    except Exception:
                        amt = Decimal("0.00")
                    status = (item.get("status") or "SUCCESS").upper()
                    if status not in ("SUCCESS", "FAILED"):
                        status = "SUCCESS"

                    cat = item.get("category")
                    if not cat or cat is None:
                        cat = "Other"

                    merch = item.get("merchant")
                    if not merch or merch is None:
                        merch = "Unknown Merchant"

                    pm = item.get("payment_method")
                    if not pm or pm is None:
                        pm = "Credit Card"

                    curr = item.get("currency")
                    if not curr or curr is None:
                        curr = "INR"

                    txn = Transaction(
                        id=raw_id,
                        timestamp=ts,
                        merchant=str(merch),
                        category=str(cat),
                        amount=amt,
                        currency=str(curr),
                        status=status,
                        payment_method=str(pm),
                        created_at=now,
                    )
                    batch.append(txn)

                    if len(batch) >= 1000:
                        db.bulk_save_objects(batch)
                        db.commit()
                        batch = []

                if batch:
                    db.bulk_save_objects(batch)
                    db.commit()

                print(f"Successfully seeded {len(raw_txns)} transactions!")
            else:
                print(f"Transactions already seeded ({existing_count} records).")
        else:
            print("No Transactions_.json found to seed.")

        print("Database setup & seeding completed successfully!")
    finally:
        db.close()


if __name__ == "__main__":
    seed()

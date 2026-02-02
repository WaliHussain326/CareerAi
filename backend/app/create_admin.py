"""
Create admin user script
Run with: python -m app.create_admin
"""
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User

def create_admin_user(email: str, password: str, full_name: str = "Admin User"):
    """Create an admin user"""
    db = SessionLocal()
    
    try:
        # Check if admin already exists
        existing_admin = db.query(User).filter(User.email == email).first()
        if existing_admin:
            print(f"User with email {email} already exists!")
            return
        
        # Truncate password to 72 bytes if needed (bcrypt limitation)
        password_bytes = password.encode('utf-8')[:72]
        password_truncated = password_bytes.decode('utf-8', errors='ignore')
        
        # Create admin user
        admin = User(
            email=email,
            full_name=full_name,
            hashed_password=get_password_hash(password_truncated),
            role="admin",
            is_active=True
        )
        
        db.add(admin)
        db.commit()
        db.refresh(admin)
        
        print(f"✅ Admin user created successfully!")
        print(f"   Email: {email}")
        print(f"   Role: {admin.role}")
        print(f"   You can now login with these credentials.")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

def make_user_admin(email: str):
    """Make an existing user an admin"""
    db = SessionLocal()
    
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"❌ User with email {email} not found!")
            return
        
        if user.role == "admin":
            print(f"User {email} is already an admin!")
            return
        
        user.role = "admin"
        db.commit()
        
        print(f"✅ User {email} is now an admin!")
        
    except Exception as e:
        print(f"❌ Error updating user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  Create new admin: python -m app.create_admin create <email> <password> [full_name]")
        print("  Make user admin:  python -m app.create_admin promote <email>")
        print("")
        print("Examples:")
        print("  python -m app.create_admin create admin@example.com SecurePass123 'Admin User'")
        print("  python -m app.create_admin promote user@example.com")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "create":
        if len(sys.argv) < 4:
            print("Usage: python -m app.create_admin create <email> <password> [full_name]")
            sys.exit(1)
        email = sys.argv[2]
        password = sys.argv[3]
        full_name = sys.argv[4] if len(sys.argv) > 4 else "Admin User"
        create_admin_user(email, password, full_name)
    elif command == "promote":
        if len(sys.argv) < 3:
            print("Usage: python -m app.create_admin promote <email>")
            sys.exit(1)
        email = sys.argv[2]
        make_user_admin(email)
    else:
        # Legacy support - treat as create with email, password
        email = command
        password = sys.argv[2] if len(sys.argv) > 2 else None
        if not password:
            print("Usage: python -m app.create_admin <email> <password> [full_name]")
            sys.exit(1)
        full_name = sys.argv[3] if len(sys.argv) > 3 else "Admin User"
        create_admin_user(email, password, full_name)

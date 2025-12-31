from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.services.data_service import data_service

# Secret key for JWT (in production, use environment variable)
SECRET_KEY = "coreterra-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and verify a JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def authenticate_user(username: str, password: str) -> Optional[dict]:
    """Authenticate a user using data from data_service"""
    # Get auth credentials from data_service (unified data entry point)
    auth_cred = data_service.get_auth_credentials(username)
    if not auth_cred:
        return None
    
    # Check if password matches
    # If password_hash exists, verify against it; otherwise check plain password
    if "password_hash" in auth_cred:
        if verify_password(password, auth_cred["password_hash"]):
            return {
                "username": username,
                "user_id": auth_cred["user_id"]
            }
    elif "password" in auth_cred:
        # For MVP: if plain password is stored, verify directly
        # In production, always use password_hash
        if password == auth_cred["password"]:
            return {
                "username": username,
                "user_id": auth_cred["user_id"]
            }
    
    return None


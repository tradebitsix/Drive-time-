from slowapi import Limiter
from slowapi.util import get_remote_address

# Conservative defaults. Override per-route as needed.
limiter = Limiter(key_func=get_remote_address, default_limits=["120/minute"])

from pydantic import BaseModel

class DashboardStats(BaseModel):
    total: int
    active: int
    completed: int

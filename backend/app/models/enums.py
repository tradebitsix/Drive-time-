from enum import Enum

class Role(str, Enum):
    admin = "admin"
    instructor = "instructor"

class StudentStatus(str, Enum):
    enrolled = "enrolled"
    active = "active"
    completed = "completed"

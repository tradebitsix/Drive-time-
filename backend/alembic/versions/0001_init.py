"""init

Revision ID: 0001_init
Revises: 
Create Date: 2026-01-21

"""
from alembic import op
import sqlalchemy as sa

revision = "0001_init"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("CREATE TYPE role_enum AS ENUM ('admin','instructor')")
    op.execute("CREATE TYPE student_status_enum AS ENUM ('enrolled','active','completed')")

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("username", sa.String(length=50), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("role", sa.Enum("admin","instructor", name="role_enum"), nullable=False, server_default="instructor"),
    )
    op.create_index("ix_users_username", "users", ["username"], unique=True)

    op.create_table(
        "students",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("status", sa.Enum("enrolled","active","completed", name="student_status_enum"), nullable=False, server_default="enrolled"),
        sa.Column("progress_hours", sa.Float(), nullable=False, server_default="0"),
        sa.Column("notes", sa.Text(), nullable=True),
    )
    op.create_index("ix_students_name", "students", ["name"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_students_name", table_name="students")
    op.drop_table("students")

    op.drop_index("ix_users_username", table_name="users")
    op.drop_table("users")

    op.execute("DROP TYPE student_status_enum")
    op.execute("DROP TYPE role_enum")

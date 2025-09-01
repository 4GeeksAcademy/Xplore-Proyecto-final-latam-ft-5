"""Merge multiple heads

Revision ID: a2a64c45f8b5
Revises: 0763d677d453, 29f6be5f6362
Create Date: 2025-08-31 20:30:24.320804

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a2a64c45f8b5'
down_revision = ('0763d677d453', '29f6be5f6362')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass

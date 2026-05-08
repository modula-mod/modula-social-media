"""Database namespace notes for Social module tables.

Host-owned production tables should keep the `modula_social_` prefix.
Module-loaded migrations must not mutate existing ledger or identity history.
"""

TABLE_PREFIX = "modula_social_"

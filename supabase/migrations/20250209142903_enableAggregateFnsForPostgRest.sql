-- Enable aggregate functions for PostgREST, needed for count() in joins (used in the sidebar)
ALTER ROLE authenticator SET pgrst.db_aggregates_enabled = 'true';
NOTIFY pgrst, 'reload config';
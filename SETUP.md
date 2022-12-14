## Database Setup

If your database does not seed properly, manually create your user as seen below:

```sql
-- create a new user
CREATE USER medusa_admin WITH PASSWORD 'medusa_admin_password';

-- create a new database and the newly created user as the owner
CREATE DATABASE medusa_db OWNER medusa_admin;

-- grant all privileges on medusa_db to the medusa_admin user
GRANT ALL PRIVILEGES ON DATABASE medusa_db TO medusa_admin;
```

Then in your .env file add the following:

```bash
DATABASE_URL=postgresql://medusa_admin:medusa_admin_password@localhost:5432/medusa_db
```
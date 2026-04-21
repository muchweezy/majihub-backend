# 🗄️ Neon Serverless + Drizzle ORM Setup Guide

## ✅ Setup Complete!

Your MajiHub backend has been configured with **Neon Serverless (HTTP)** and **Drizzle ORM**. Here's what was installed and configured:

### 📦 Installed Packages
- `drizzle-orm` - ORM for type-safe database queries
- `@neondatabase/serverless` - Neon HTTP client (stateless, perfect for serverless)
- `dotenv` - Environment variable management
- `drizzle-kit` - CLI tool for generating migrations

### 📁 Created Files

1. **`.env`** - Environment configuration (⚠️ UPDATE THIS)
2. **`drizzle.config.ts`** - Drizzle Kit configuration
3. **`src/schema.ts`** - Database schema definition
4. **`src/db.ts`** - Database client setup
5. **`src/crud-demo.ts`** - CRUD example script

---

## 🔑 Next Steps

### Step 1: Configure Your Database URL
Edit the `.env` file in your backend root directory and replace the placeholder:

```env
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

**Where to find this:**
- Go to **Neon Console** → Your Project → **Dashboard** → **Connect**
- Copy the full connection string and paste it in `.env`

⚠️ **IMPORTANT:** Make sure `.env` is listed in `.gitignore` to prevent credentials from being exposed.

### Step 2: Generate Initial Migration
Run this command to create your first migration:

```bash
npm run db:generate
```

This will create a migration file in the `drizzle/` directory based on your schema.

### Step 3: Apply Migration to Neon
Run this command to apply the migration to your Neon database:

```bash
npm run db:migrate
```

This creates the `demo_users` table in your Neon database.

### Step 4: Test with CRUD Demo
Run the demo script to verify everything works:

```bash
npm run demo
```

Expected output:
```
🚀 Starting CRUD operations demo...

📝 CREATE: Inserting a new user...
✅ CREATE successful: { id: 1, name: 'Admin User', email: 'admin@example.com', createdAt: ... }

📖 READ: Fetching the user...
✅ READ successful: { id: 1, name: 'Admin User', email: 'admin@example.com', createdAt: ... }

✏️  UPDATE: Updating user name...
✅ UPDATE successful: { id: 1, name: 'Super Admin', email: 'admin@example.com', createdAt: ... }

🗑️  DELETE: Removing the user...
✅ DELETE successful: User removed from database

🎉 CRUD operations completed successfully!
```

---

## 📚 File Reference

### Schema Definition (`src/schema.ts`)
Defines the `demo_users` table with columns:
- `id` (primary key)
- `name` (required)
- `email` (required, unique)
- `createdAt` (timestamp, auto-set)

Types exported:
- `User` - Inferred select type
- `NewUser` - Inferred insert type

### Database Client (`src/db.ts`)
- Uses Neon's HTTP client (stateless)
- Perfect for serverless/Edge environments
- No connection pool (each query is independent HTTP request)

### CRUD Demo (`src/crud-demo.ts`)
Demonstrates:
- **CREATE**: Insert a new user with `.insert().values().returning()`
- **READ**: Query user with `.select().from().where()`
- **UPDATE**: Modify user with `.update().set().where().returning()`
- **DELETE**: Remove user with `.delete().where()`

---

## 🚀 Integrating with Express Routes

To use the database in your Express routes, import and use `db`:

```typescript
import { db } from './db';
import { demoUsers } from './schema';
import { eq } from 'drizzle-orm';

// In your route handler:
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  
  const [newUser] = await db
    .insert(demoUsers)
    .values({ name, email })
    .returning();
  
  res.json(newUser);
});

app.get('/api/users/:id', async (req, res) => {
  const users = await db
    .select()
    .from(demoUsers)
    .where(eq(demoUsers.id, parseInt(req.params.id)));
  
  res.json(users[0]);
});
```

---

## 📝 Available Commands

```bash
npm run dev           # Start Express server with hot reload
npm run db:generate   # Generate migration based on schema changes
npm run db:migrate    # Apply migrations to Neon database
npm run demo          # Run CRUD example script
npm run build         # Compile TypeScript to JavaScript
```

---

## ⚠️ Troubleshooting

**Error: `DATABASE_URL is not defined`**
- Make sure `.env` file exists in the backend root
- Verify it contains a valid `DATABASE_URL`

**Error: `Connection refused`**
- Check that your Neon database is running
- Verify the connection string is correct
- Ensure you have internet connectivity

**Error: `SSL error`**
- Neon requires SSL connections
- Your connection string should include `?sslmode=require`

---

## 🔗 Resources

- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Neon Serverless Docs](https://neon.tech/docs/serverless/overview)
- [PostgreSQL with Drizzle](https://orm.drizzle.team/docs/get-started-postgresql)

---

Happy coding! 🚀


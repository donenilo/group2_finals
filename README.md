# NUHanap? - Setup & Navigation Guide

---

## 1. How to run (do this in order)

### a. Database (MySQL)
```
mysql -u root < database/users_table.sql   # drops/recreates only the users table + seed accounts
```
On Windows with XAMPP, you can also import either `.sql` file through
phpMyAdmin (http://localhost/phpmyadmin) instead of the terminal.

### b. Backend (Express API)
```
cd backend
npm install
npm run dev
```

### c. Frontend (React + Vite)
```
cd frontend
npm install
npm run dev
```

Run the backend and frontend at the same time (two terminals). The frontend
talks to the backend at `http://localhost:5000`.

---

## 2. Seed logins

Every seed account uses the password: **Password123**

| Role                              | Email                      | What they see                                   |
|-----------------------------------|----------------------------|-------------------------------------------------|
| Estudyanteng Brainrot             | student@nu-laguna.edu.ph   | My Account, My Reports, Report an Item          |
| Sir Joey                          | faculty@nu-laguna.edu.ph   | Same as student                                 |
| DO                                | do@nu-laguna.edu.ph        | My Account, All Reports                         |
| Admin                             | admin@nu-laguna.edu.ph     | All of the above + Manage Accounts + Inventory  |
| Carlos Jiro Reano (SUSPENDED)     | carlos@nu-laguna.edu.ph    | Used to test that suspended users are blocked   |

---

## 3. How to navigate the app (UI map)

### Logged OUT
- **Navbar:** Home · Items · Login
- **Home page:** a single hero button - "Browse Items".
- **Register:** reachable from the Login page ("Register here" link at the bottom).
- After you **register, you are logged in automatically** and dropped on the
  dashboard

### Logged IN
- **Navbar:** Home · Items · **Welcome, [name] ▾**
- Click **"Welcome, [name] ▾"** (top right) to open a dropdown. This is the main
  hub - it shows the dashboard menu for your role, plus **Logout**. Clicking
  anywhere outside the dropdown closes it.
- The dropdown contents depend on your role (see the table above). For example a
  student sees: My Account, My Reports, Report an Item, then Logout.
- **`/dashboard`** has its own sidebar too (same role-based menu). Both the
  dropdown and the sidebar lead to the same pages.

### Key pages
- **Items gallery (`/items`)** - browse/search all lost & found items. Open any
  item to see details.
- **Item detail → "I Know This Item"** - jumps to the report form with the
  **item name pre-filled** for you.
- **Report an Item (`/report-item`)** - file a lost/found report. If you're
  logged in, your **name and email auto-fill and are locked** (shown lightly
  greyed/transparent) so reports are always tied to the right person. Guests can
  still type these in manually.
- **My Account (`/dashboard/my-account`)** - your profile card (name, role, ID).
- **My Reports (`/dashboard/my-reports`)** - the reports YOU submitted, pulled
  live from the database (matched by your name/email).
- **All Reports (`/dashboard/all-reports`)** - DO/Admin view of every report.
- **Manage Accounts (`/admin/manage-accounts`)** - ADMIN ONLY. Add / Edit /
  Suspend / Delete user accounts. Saves to the `users` table.
- **Inventory (`/admin/inventory`)** - ADMIN view of all items with edit access.

---

## 4. Project structure

```
backend/
  server.js              # mounts routes, starts the API on :5000
  db.js                  # MySQL connection pool
  routes/
    items.js             # /api/items  (lost & found items CRUD)
    users.js             # /api/users  (register, login, account management)
database/
  items_db.sql           # items + item_images + users (full schema + seed data)
  users_table.sql        # accounts seed script for the users table
frontend/src/
  components/
    Navbar.jsx           # top bar + "Welcome, [name]" dropdown
    Login.jsx            # login -> /dashboard
    Register.jsx         # register -> auto-login -> /dashboard
    User/ReportItem.jsx  # report form (auto-fills logged-in user)
    User/MyReports.jsx   # your own reports (live from DB)
    Admin/Inventory.jsx, Admin/EditReport.jsx
  pages/
    Home.jsx             # hero (single "Browse Items" button)
    Items.jsx            # gallery
    ItemDetailPage.jsx   # single item + "I Know This Item"
    Account.jsx          # just redirects to /dashboard/my-account
    Dashboard/
      Dashboard.jsx      # dashboard shell + role-based sidebar
      MyAccount.jsx, AllReports.jsx, ManageAccounts.jsx
```

---

## 5. API reference (backend)

### Items - `/api/items`
- `GET /api/items` - list items (supports `?sort=newest|oldest|lost|found|name`)
- `GET /api/items/:id` - one item (with images)
- `POST /api/items` - create a report (multipart, optional image upload)
- `PUT /api/items/:id` - update an item

### Users - `/api/users`
- `POST /api/users/register` - public sign-up (hashes password, returns user)
- `POST /api/users/login` - verify credentials, blocks suspended accounts
- `GET  /api/users/me/reports?email=&name=` - a user's own reports
- `GET  /api/users` - admin: list all accounts
- `POST /api/users` - admin: add account (temp password `changeme123`)
- `PUT  /api/users/:id` - admin: edit account
- `PATCH /api/users/:id/suspend` - admin: toggle active/suspended
- `DELETE /api/users/:id` - admin: delete account

---

## 6. Updates

### Authentication
Originally, Login/Register called `/api/users/...` endpoints that **did not
exist** - there was no users table and no users route, so nobody could log in.
Added:
- `users` table (bcrypt-hashed passwords) + seed accounts.
- `backend/routes/users.js` (register, login, full admin account management).
- Mounted `/api/users` in `server.js`; added `bcryptjs` dependency.

### Removed placeholders
- **Manage Accounts** now reads/writes the real `users` table (was mock data).
- **My Reports** now shows the logged-in user's real reports (was sample data).

### Navigation & UX cleanup
- Navbar now **reacts to login state on every route change** (the dashboard link
  used to "disappear" because the navbar only checked once on first load).
- Top-right is now a **"Welcome, [name] ▾" dropdown** (role-based menu + Logout)
  instead of a bare Logout button.
- Navbar trimmed to **Home · Items · (Welcome / Login)** - Report, Dashboard, and
  Account links moved into the dropdown / removed as redundant (change if needed).
- **Register auto-logs you in** and goes straight to the dashboard.
- **Account.jsx** is replaced with MyAccount which directs to the dashboard.
- Dashboard sidebar no longer duplicates the "Lost & Found Items" link.
- **Home hero** trimmed to a single "Browse Items" button.
- **Report form** auto-fills + locks name/email for logged-in users.
- **"I Know This Item"** (item detail) pre-fills the item name in the report form.

---

## 7. Notes / possible next steps
  until the user changes it.
  `backend/node_modules` and re-run `npm install` in each.

---

## 8. Vercel deployment

The frontend can be deployed to Vercel, but the current backend should stay on a host that supports Express, MySQL, and persistent uploads. Vercel is not a good fit for the existing API because `backend/routes/items.js` writes uploaded images to local disk under `backend/uploads`.

Recommended setup:
- Deploy the backend separately first.
- In the Vercel project for the frontend, set `VITE_API_BASE_URL` to the backend URL, for example `https://your-api.example.com`.
- Deploy the `frontend` directory as the Vercel project root.
- Keep `frontend/vercel.json` in place so React Router routes like `/item/123` refresh correctly.

For local development, copy `frontend/.env.example` to `frontend/.env` and keep `VITE_API_BASE_URL=http://localhost:5000`.

---

## 9. Backend serverless-ready notes

The backend has been refactored so uploads can be stored in S3 (serverless-compatible) or on the local filesystem. By default the backend uses local storage.

Required environment variables when using S3 storage:

- `STORAGE_PROVIDER=s3`
- `S3_BUCKET` — name of your S3 bucket
- `AWS_REGION` — region for the bucket (e.g. `us-east-1`)
- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` — AWS credentials with PutObject permissions

When `STORAGE_PROVIDER` is not `s3` the server will continue to write files to `backend/uploads` and serve them at `/uploads/<image_key>`.

To deploy the backend as serverless functions (Vercel / Netlify), deploy the API endpoints as serverless functions and set the S3 environment variables in the hosting platform. The Express server is still present and can be run as a normal Node server if preferred.

Files changed for serverless compatibility:
- `backend/lib/storage.js` — new storage abstraction (S3 + local fallback)
- `backend/routes/items.js` — now uses `saveItemImage` from the storage abstraction
- `backend/server.js` — serves `/uploads` only when using local storage

Seed files
---------

Seed data is provided as example files but is intentionally excluded from the repository to avoid accidentally deploying sample data. If you need to load seed data locally, copy the example seed files and remove the `.example` suffix:

```bash
cp database/items_db.seeds.sql.example database/items_db.seeds.sql
cp database/users_table.seeds.sql.example database/users_table.seeds.sql
```

Because `.gitignore` includes `database/*.seeds.sql`, those copied files will remain local and won't be committed or deployed.

After setting env vars for S3, uploads will be saved to S3 and public URLs will be used by the frontend (the frontend reads the same image_key values and resolves them via the API helper).

---

## 10. Complete Vercel Deployment Guide

This section covers deploying **frontend to Vercel** and **backend to a separate service** (recommended for simplicity).

### Frontend Deployment (Vercel)

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Vercel deployment setup"
   git push origin vercel-deployment
   ```

2. **Create Vercel project:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository (`donenilo/group2_finals`)
   - Vercel will auto-detect the root `vercel.json` configuration

3. **Configure environment variables in Vercel:**
   - In Project Settings → Environment Variables
   - Add variable `VITE_API_BASE_URL` 
   - Set value to your backend API URL (e.g., `https://your-backend.onrender.com` — see Backend Deployment below)
   - Deploy

4. **Verify deployment:**
   - Visit your Vercel URL and confirm the home page loads
   - Navigate to Items gallery and check that data loads (requires backend running)

### Backend Deployment (Render — Recommended)

1. **Push backend code to GitHub:**
   ```bash
   # Ensure vercel-deployment branch contains all backend changes
   git push origin vercel-deployment
   ```

2. **Deploy to Render.com:**
   - Go to [render.com](https://render.com)
   - Sign up/Log in with GitHub
   - Click "New +" → "Web Service"
   - Select your GitHub repo (`donenilo/group2_finals`)
   - Choose branch `vercel-deployment`

3. **Configure Render settings:**
   - **Name:** `nuhanap-api` (or any name)
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Instances:** Free tier is fine for testing

4. **Set environment variables in Render:**
   - Go to Environment (on the web service page)
   - Add:
     - `DATABASE_URL` → your MySQL connection string (e.g., `mysql://user:pass@host:port/items_db`)
     - `STORAGE_PROVIDER` → `local` (or `s3` if using S3)
     - (Optional) `S3_BUCKET`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` if using S3

5. **Get your backend URL:**
   - Once deployed, Render shows your URL: `https://nuhanap-api.onrender.com`
   - Use this as `VITE_API_BASE_URL` in Vercel

### Connecting Frontend to Backend

After both are deployed:

1. In Vercel project, add/update environment variable:
   - `VITE_API_BASE_URL` → your Render backend URL (e.g., `https://nuhanap-api.onrender.com`)

2. Trigger a redeployment in Vercel (or do a manual redeploy via Vercel dashboard)

3. Test the full stack:
   - Visit your Vercel URL
   - Navigate to Items → should see items from the backend
   - Try logging in → should connect to backend authentication

### Alternative: Backend on Other Services

- **Railway:** Similar to Render; deploy via `railway up` after linking your GitHub
- **AWS Elastic Beanstalk:** More complex but scalable
- **Heroku:** Deprecated free tier, but still an option if you have a paid account

### Troubleshooting

**Frontend shows 404 on page refresh:**
- Confirmed fixed by `vercel.json` SPA routing. If still an issue, check Vercel build logs.

**Frontend can't reach backend API:**
- Verify `VITE_API_BASE_URL` is set correctly in Vercel environment
- Check backend service is running (visit the backend URL in browser, should see API health response at `/api/health`)
- Ensure CORS is enabled (backend enables `cors()` in `server.js`)

**Backend database connection fails:**
- Verify `DATABASE_URL` environment variable is set and correct
- Ensure your MySQL server is accessible from the hosting region
- For local testing, use `STORAGE_PROVIDER=local` and ensure backend has write permissions to `backend/uploads/`
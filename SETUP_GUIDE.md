# HRDC Calculator — Complete Setup Guide
## From Zero to Live App (No Coding Required)

---

## WHAT YOU'LL HAVE AT THE END
- A live URL (e.g. `https://hrdc-calculator.vercel.app`) you share with your team
- All deals saved in Airtable — your private backend database
- Your team never sees Airtable — they just use the app

---

## STEP 1 — Set Up Airtable (Your Database)

### 1a. Create a free Airtable account
1. Go to **https://airtable.com** and sign up for free
2. Click **"+ Create a base"** → choose **"Start from scratch"**
3. Name it: `HRDC Calculator`

### 1b. Create the DEALS table
Your base already has a default table called "Table 1" — rename it:
1. Double-click "Table 1" → type `Deals` → press Enter
2. Delete all default fields (click field name → Delete field), then add these exact fields:

| Field Name   | Field Type        |
|--------------|-------------------|
| Client       | Single line text  |
| Date         | Date              |
| Pax          | Number            |
| Duration     | Number (decimal)  |
| PreSST       | Number (decimal)  |
| NetRev       | Number (decimal)  |
| Margin       | Number (decimal)  |
| Status       | Single line text  |
| Prizes       | Number (decimal)  |
| Banner       | Number (decimal)  |
| TShirts      | Number (decimal)  |
| Marketing    | Number (decimal)  |
| TeamBudget   | Number (decimal)  |
| Notes        | Long text         |
| CreatedAt    | Single line text  |

> ⚠️ Field names must be EXACTLY as above — capital letters matter.

### 1c. Create the TARGETS table
1. Click **"+"** next to "Deals" tab at the bottom → **"Create new table"**
2. Name it: `Targets`
3. Add these fields:

| Field Name | Field Type       |
|------------|------------------|
| MonthKey   | Single line text |
| Bookings   | Number           |
| Revenue    | Number (decimal) |
| Margin     | Number (decimal) |

### 1d. Get your Base ID
1. Go to **https://airtable.com/api** — you'll see your base listed
2. Click on **"HRDC Calculator"**
3. Look for the line that says: `The ID of this base is appXXXXXXXXXXXXXX`
4. Copy and save that ID — it starts with `app`

### 1e. Get your API Key
1. Go to **https://airtable.com/create/tokens**
2. Click **"Create new token"**
3. Name it: `hrdc-calculator`
4. Under **Scopes**, add:
   - `data.records:read`
   - `data.records:write`
5. Under **Access**, select your **HRDC Calculator** base
6. Click **Create token** → Copy and save the token (starts with `pat`)

> 🔒 Keep these two values private. Never share them or put them in your code files.

---

## STEP 2 — Set Up GitHub (Where Your Code Lives)

### 2a. Create a GitHub account
1. Go to **https://github.com** and sign up (free)
2. Verify your email

### 2b. Create a new repository
1. Click the **"+"** icon top right → **"New repository"**
2. Repository name: `hrdc-calculator`
3. Set to **Private** (so your code isn't public)
4. Click **"Create repository"**

### 2c. Upload your files
1. On your new repository page, click **"uploading an existing file"**
2. You need to upload these files from your downloaded zip:
   ```
   index.html          ← the main app
   vercel.json         ← Vercel config
   api/
     deals.js          ← deals API
     targets.js        ← targets API
   ```
3. **Important:** For the `api/` folder, you need to upload files inside a folder.
   - Click "uploading an existing file"
   - Drag the entire `api` folder into the upload area (most browsers support this)
   - OR create the folder manually: type `api/deals.js` in the filename field — GitHub will auto-create the folder
4. Click **"Commit changes"** → **"Commit directly to main"** → **Commit**

---

## STEP 3 — Deploy to Vercel (Makes It Live)

### 3a. Create a Vercel account
1. Go to **https://vercel.com** and sign up
2. Choose **"Continue with GitHub"** — this links your accounts

### 3b. Import your project
1. On Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories listed
3. Click **"Import"** next to `hrdc-calculator`

### 3c. Add your secret keys (Environment Variables)
**This is the most important step — this keeps your Airtable key hidden from the public.**

Before clicking Deploy, scroll down to **"Environment Variables"** and add:

| Variable Name       | Value                          |
|---------------------|--------------------------------|
| AIRTABLE_API_KEY    | `pat...` (your token from 1e)  |
| AIRTABLE_BASE_ID    | `app...` (your base ID from 1d)|

Click **"Add"** after each one.

### 3d. Deploy
1. Click **"Deploy"**
2. Wait ~60 seconds for it to build
3. You'll see a success page with your live URL, e.g.:
   `https://hrdc-calculator-yourname.vercel.app`

---

## STEP 4 — Test It

1. Open your Vercel URL in your browser
2. Go to **Deals Database** tab
3. Add a test deal — fill in client name and click **Add Deal**
4. Go to **https://airtable.com** and open your HRDC Calculator base
5. You should see the deal appear in the **Deals** table ✅
6. Delete it from the app — it should disappear from Airtable ✅

---

## STEP 5 — Share With Your Team

Just send them the Vercel URL. That's it. They see only the app.

**Recommended:** Bookmark it on their browsers as "HRDC Calculator"

---

## UPDATING THE APP IN FUTURE

When you want to make changes to the calculator:
1. Edit the files on your computer
2. Go to your GitHub repository
3. Click the file → click the pencil (edit) icon → paste new content → Commit
4. Vercel auto-detects the change and re-deploys in ~60 seconds

---

## TROUBLESHOOTING

| Problem | Fix |
|---------|-----|
| "Could not connect to database" | Check Environment Variables in Vercel — make sure AIRTABLE_API_KEY and AIRTABLE_BASE_ID are set correctly |
| Deal saves but doesn't show fields | Check Airtable field names match exactly (capital letters, no spaces) |
| "Method not allowed" error | Make sure `vercel.json` is uploaded and committed |
| App loads but blank | Open browser DevTools (F12) → Console tab → share the error message |

---

## YOUR CREDENTIALS CHECKLIST

Save these somewhere safe (e.g. your password manager):

- [ ] Airtable Base ID: `app_________________`
- [ ] Airtable API Token: `pat_________________`
- [ ] GitHub repo: `https://github.com/YOUR_USERNAME/hrdc-calculator`
- [ ] Vercel live URL: `https://______.vercel.app`

---

*Built for Trident Talents — HRDC Training Provider*

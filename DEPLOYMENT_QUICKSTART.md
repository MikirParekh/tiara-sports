# 🚀 Quick Deployment Guide

Get your Tiara Sports website live on SmarterASP.NET in 3 steps!

---

## ⚡ Quick Start (5 minutes)

### Step 1: Add Deploy Key to GitHub (2 min)

1. Open this file and copy the **PUBLIC KEY**: `DEPLOY_KEYS.txt`
2. Go to: https://github.com/MikirParekh/tiara-sports/settings/keys
3. Click **"Add deploy key"**
4. Paste the key, title it "SmarterASP Deploy", click **"Add key"**

### Step 2: Configure SmarterASP.NET (2 min)

1. Login to: https://cp.smarterasp.net/
2. Find **"Git Deployment"** section
3. Enter:
   - **Repository:** `git@github.com:MikirParekh/tiara-sports.git`
   - **Branch:** `main`
   - **SSH Key:** Copy **PRIVATE KEY** from `DEPLOY_KEYS.txt`
4. Click **"Deploy"**

### Step 3: Build on Server (1 min)

Run these commands on your server:
```bash
npm install
npm run build
```

Point your web server to the `dist` folder.

**Done!** 🎉 Your site is live!

---

## 🔄 Daily Workflow

Make updates and deploy:

```powershell
# Quick deploy (PowerShell)
.\deploy.ps1 -message "Your update description"
```

Or manually:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Then on SmarterASP.NET: Click "Pull Latest" → Run `npm run build`

---

## 📚 Full Documentation

Need detailed instructions? See `SSH_DEPLOY_SETUP.md`

---

## ⚠️ Before Going Live

- [ ] Add deploy key to GitHub
- [ ] Configure SmarterASP.NET
- [ ] Set environment variables (SMTP credentials)
- [ ] Install SSL certificate
- [ ] Test all forms and features
- [ ] Enable automatic backups

---

## 🆘 Need Help?

- **Full Guide:** `SSH_DEPLOY_SETUP.md`
- **Deploy Keys:** `DEPLOY_KEYS.txt`
- **SmarterASP Support:** https://www.smarterasp.net/support

---

**Your Repository:** https://github.com/MikirParekh/tiara-sports

Good luck! 🍀

# 🚀 SSH Deployment Guide for SmarterASP.NET

**Project:** Tiara Sports Club  
**Repository:** https://github.com/MikirParekh/tiara-sports  
**Generated:** October 13, 2026

---

## 🔑 SSH Deploy Keys

### Key Files Location:
- **Private Key:** `C:\Users\harsh\.ssh\tiara_sports_new_deploy`
- **Public Key:** `C:\Users\harsh\.ssh\tiara_sports_new_deploy.pub`

### Your Public Key (Copy This):
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIF/SHk7F6Yj5JK2emxgXbtdDkmHsWAFivcfS+/yM/se6 tiara-sports-mikir-deploy
```

---

## 📋 Complete Setup Guide

### Step 1: Add Deploy Key to GitHub

1. **Go to GitHub Deploy Keys page:**  
   👉 https://github.com/MikirParekh/tiara-sports/settings/keys

2. **Click** "Add deploy key" button (top right)

3. **Fill in the form:**
   - **Title:** `SmarterASP.NET Production Deploy`
   - **Key:** Paste the public key shown above
   - **Allow write access:** ❌ Leave **unchecked** (read-only is more secure)

4. **Click** "Add key"

5. **Verify:** You should see the key listed with a green checkmark ✅

---

### Step 2: Configure SmarterASP.NET Deployment

#### Option A: Using SmarterASP.NET Control Panel (Recommended)

1. **Login to SmarterASP.NET:**  
   Go to your control panel: https://cp.smarterasp.net/

2. **Navigate to Deployment:**
   - Look for **"Git Deployment"** or **"Deploy"** in the sidebar
   - Or check under **"Website"** → **"Deploy from Git"**

3. **Configure Git Repository:**
   - **Repository Type:** Git
   - **Repository URL:** `git@github.com:MikirParekh/tiara-sports.git`
   - **Branch:** `main`
   - **Deploy Path:** `/wwwroot` or `/site/wwwroot` (check your plan)

4. **Add SSH Private Key:**
   - Look for "SSH Key" or "Deploy Key" field
   - Copy the **PRIVATE KEY** from `DEPLOY_KEYS.txt`
   - Paste the entire key including:
     ```
     -----BEGIN OPENSSH PRIVATE KEY-----
     ... (all content)
     -----END OPENSSH PRIVATE KEY-----
     ```

5. **Set Build Commands (if available):**
   ```bash
   npm install
   npm run build
   ```

6. **Set Deploy Directory:**
   - Point to `dist` folder after build
   - Or configure web root to serve from `/wwwroot/dist`

7. **Click** "Save" or "Deploy Now"

---

#### Option B: Manual Deployment via FTP/SSH

If SmarterASP.NET provides SSH or FTP access:

##### Using SSH (if available):

```bash
# 1. Connect to your server
ssh your-username@yoursite.smarterasp.net

# 2. Navigate to web root
cd /site/wwwroot
# or
cd /httpdocs

# 3. Setup SSH for Git
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 4. Create SSH key file
nano ~/.ssh/tiara_deploy
# Paste the PRIVATE KEY from DEPLOY_KEYS.txt
# Save: Ctrl+X, Y, Enter
chmod 600 ~/.ssh/tiara_deploy

# 5. Configure SSH for GitHub
nano ~/.ssh/config
```

Add this content to SSH config:
```
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/tiara_deploy
    StrictHostKeyChecking no
```

```bash
# 6. Test GitHub connection
ssh -T git@github.com
# You should see: "Hi MikirParekh/tiara-sports! You've successfully authenticated..."

# 7. Clone repository
git clone git@github.com:MikirParekh/tiara-sports.git
cd tiara-sports

# 8. Install and build
npm install
npm run build

# 9. Configure web server to serve from 'dist' folder
```

##### Using FTP:

```bash
# 1. Build locally
npm install
npm run build

# 2. Upload contents of 'dist' folder to:
#    - /site/wwwroot or /httpdocs via FTP client
#    - Use FileZilla, WinSCP, or SmarterASP.NET File Manager
```

---

### Step 3: Environment Configuration

#### Create `.env` file on server:

If your server supports environment variables, create a `.env` file:

```env
NODE_ENV=production
SMTP_HOST=smtp.zoho.com
SMTP_PORT=465
SMTP_USER=web@uniqtechsolutions.com
SMTP_PASS=Web@281989#
ADMIN_EMAIL=mikir@uniqtechsolutions.com
```

#### Or configure via SmarterASP.NET Control Panel:

1. Go to **Website** → **Environment Variables**
2. Add each variable listed above
3. Save and restart the application

⚠️ **Security Note:** Consider using SmarterASP.NET's environment variables instead of storing credentials in files.

---

## 🔄 Deployment Workflow

### Initial Deployment:

```bash
# On SmarterASP.NET server:
cd /site/wwwroot
git clone git@github.com:MikirParekh/tiara-sports.git .
npm install
npm run build
```

### Continuous Deployment:

**On your local machine:**

```bash
# 1. Make your changes
code .

# 2. Test locally
npm run dev
# Visit http://localhost:3000

# 3. Build and test production build
npm run build
npm run preview

# 4. Commit and push
git add .
git commit -m "Update: description of changes"
git push origin main
```

**On SmarterASP.NET server:**

```bash
# Option A: Using control panel
# - Click "Deploy" or "Pull Latest" button

# Option B: Via SSH
cd /site/wwwroot
git pull origin main
npm install  # Only if package.json changed
npm run build
```

---

## 🔧 Build & Deploy Scripts

You can add these helper scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build",
    "preview": "vite preview",
    "deploy:build": "npm run build && echo Build complete! Upload dist/ folder",
    "deploy:check": "npm run lint && npm run build",
    "clean": "rm -rf dist"
  }
}
```

---

## 🌐 Web Server Configuration

### For Node.js hosting:

If SmarterASP.NET runs Node.js apps:

```javascript
// server.js or app.js
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### For Static Hosting:

Point your web root to the `dist` folder:
- **Document Root:** `/site/wwwroot/dist`
- Configure URL rewriting for SPA (if needed)

**web.config** for IIS (if SmarterASP.NET uses IIS):

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <mimeMap fileExtension=".json" mimeType="application/json" />
      <mimeMap fileExtension=".woff" mimeType="application/font-woff" />
      <mimeMap fileExtension=".woff2" mimeType="application/font-woff2" />
    </staticContent>
  </system.webServer>
</configuration>
```

---

## ✅ Post-Deployment Testing

After deployment, verify everything works:

### 1. **Website Loads:**
- Visit your domain: `http://your-domain.com`
- Check all pages load correctly

### 2. **Navigation:**
- ✅ Home page
- ✅ About page
- ✅ Facilities page
- ✅ Blog page
- ✅ Contact page
- ✅ Legal/Privacy page

### 3. **Booking System:**
- Test the booking modal
- Submit a test booking
- Check form validation

### 4. **Images & Assets:**
- Verify all images load
- Check hero images
- Test facility images

### 5. **Contact Form:**
- Test form submission
- Verify email delivery
- Check admin receives emails

### 6. **Performance:**
- Test page load speed
- Check mobile responsiveness
- Verify animations work

---

## 🆘 Troubleshooting

### Issue: "Permission denied (publickey)"

**Cause:** SSH key not properly configured

**Solution:**
```bash
# 1. Verify public key is added to GitHub Deploy Keys
# 2. Check private key permissions on server
chmod 600 ~/.ssh/tiara_deploy

# 3. Test SSH connection
ssh -T git@github.com
```

---

### Issue: "Host key verification failed"

**Solution:**
```bash
# Accept GitHub's host key
ssh-keyscan github.com >> ~/.ssh/known_hosts

# Or disable strict checking (less secure)
echo "StrictHostKeyChecking no" >> ~/.ssh/config
```

---

### Issue: Build fails with "npm: command not found"

**Solution:**
1. Install Node.js on the server
2. Contact SmarterASP.NET support for Node.js installation
3. Or build locally and upload `dist` folder via FTP

---

### Issue: "Cannot find module" errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

### Issue: Email not sending

**Possible causes:**
- SMTP credentials incorrect
- Firewall blocking SMTP ports
- Environment variables not set

**Solution:**
```bash
# 1. Verify SMTP settings in .env or environment variables
# 2. Test SMTP connection:
telnet smtp.zoho.com 465

# 3. Check server logs for errors
# 4. Contact SmarterASP.NET support about SMTP access
```

---

### Issue: 404 errors on page refresh (SPA routing)

**Solution:**
- Configure URL rewriting (see Web Server Configuration above)
- Add `web.config` for IIS
- Or use hash routing in React Router

---

## 📊 Monitoring & Maintenance

### Regular Tasks:

1. **Monitor uptime:** Use UptimeRobot or similar
2. **Check logs:** Review error logs weekly
3. **Update dependencies:** Monthly security updates
4. **Backup:** Regular database and file backups
5. **Test:** Monthly functionality testing

### Update Dependencies:

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Update to latest (careful!)
npm install package@latest

# Test after updates
npm run build
npm run preview
```

---

## 📞 Support & Resources

### SmarterASP.NET Support:
- **Website:** https://www.smarterasp.net/support
- **Knowledge Base:** https://www.smarterasp.net/kb
- **Ticket System:** Via control panel

### Project Repository:
- **GitHub:** https://github.com/MikirParekh/tiara-sports
- **Issues:** Report bugs via GitHub Issues

### Deployment Resources:
- [SmarterASP.NET Git Deploy Guide](https://www.smarterasp.net/kb)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [React Deployment](https://react.dev/learn/start-a-new-react-project#deploying-to-production)

---

## 🔐 Security Checklist

Before going live:

- [ ] Public key added to GitHub Deploy Keys
- [ ] Private key securely stored on server
- [ ] Environment variables configured (not hardcoded)
- [ ] SMTP credentials secured
- [ ] `.env` file in `.gitignore`
- [ ] HTTPS/SSL certificate installed
- [ ] Security headers configured
- [ ] CORS policy set (if using API)
- [ ] Rate limiting enabled (if applicable)
- [ ] Backup strategy in place

---

## 📝 Quick Reference

### Git Commands:
```bash
git status                    # Check status
git add .                     # Stage all changes
git commit -m "message"       # Commit changes
git push origin main          # Push to GitHub
git pull origin main          # Pull latest changes
```

### Build Commands:
```bash
npm install                   # Install dependencies
npm run dev                   # Development server
npm run build                 # Production build
npm run preview               # Preview production build
```

### Server Commands:
```bash
cd /site/wwwroot             # Navigate to web root
git pull origin main         # Update code
npm install                  # Install dependencies
npm run build                # Build production
```

---

**Last Updated:** October 13, 2026  
**Version:** 2.0  
**Status:** ✅ Ready for deployment


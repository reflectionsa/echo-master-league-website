# Website Deployment Debugging Guide

## Current Status

- **Local Dev Server**: Running at <http://localhost:3004/>
- **Live Website**: <https://reflectionsa.github.io/echo-master-league-website/>
- **Repository**: <https://github.com/reflectionsa/echo-master-league-website>

## What to Check

### 1. **Test Locally First** (Important!)

Visit <http://localhost:3004/> in your browser right now and check:

- [ ] Do you see the teams listed?
- [ ] Do you see the correct player counts?
- [ ] Do you see all 60 subs?
- [ ] Do rank images show for "Diamond 1", "Diamond 2", etc.?
- [ ] Open browser console (F12) - any errors?

**If it works locally but NOT on live site** → Deployment issue  
**If it doesn't work locally either** → Data fetching issue

---

### 2. **Check Google Sheets Access**

Open these URLs in your browser:

**Team Roles Sheet:**

```
https://sheets.googleapis.com/v4/spreadsheets/1Xxui4vb0j8dkIJgprfyYgUV2G-EeBfQ2ijrABxZGgoc/values/Team%20Roles!A1:Z10?key=AIzaSyBASNrr1R2CIXcyEFDQNpcRVdJ9-SU54Kc
```

**Rankings Sheet:**

```
https://sheets.googleapis.com/v4/spreadsheets/1Xxui4vb0j8dkIJgprfyYgUV2G-EeBfQ2ijrABxZGgoc/values/Rankings!A1:Z10?key=AIzaSyBASNrr1R2CIXcyEFDQNpcRVdJ9-SU54Kc
```

**League Subs Sheet:**

```
https://sheets.googleapis.com/v4/spreadsheets/1Xxui4vb0j8dkIJgprfyYgUV2G-EeBfQ2ijrABxZGgoc/values/Registered%20League%20Subs!A1:Z10?key=AIzaSyBASNrr1R2CIXcyEFDQNpcRVdJ9-SU54Kc
```

**What you should see:** JSON data with "range" and "values" fields  
**If you see an error:** The sheet isn't publicly accessible or the API key is wrong

---

### 3. **Check GitHub Actions Deployment**

1. Go to: <https://github.com/reflectionsa/echo-master-league-website/actions>
2. Look for the latest "Deploy to GitHub Pages" workflow
3. Check if it's green ✅ or red ❌
4. If red, click on it to see the error

---

### 4. **Check GitHub Pages Settings**

1. Go to: <https://github.com/reflectionsa/echo-master-league-website/settings/pages>
2. Verify:
   - Source: GitHub Actions
   - Branch: main
   - Custom domain: (leave blank)

---

### 5. **Clear Browser Cache**

Sometimes the live site is cached:

1. Press `Ctrl + Shift + R` (hard refresh)
2. Or press `F12` → Network tab → Check "Disable cache"
3. Refresh the page

---

### 6. **Force New Deployment**

Run this command to trigger a new deployment:

```bash
git commit --allow-empty -m "trigger deployment"
git push origin main
```

Then wait 2-3 minutes and check:<https://github.com/reflectionsa/echo-master-league-website/actions>

---

## Common Issues & Fixes

### Issue: "No data showing"

**Cause:** Google Sheets not publicly accessible  
**Fix:**

1. Open your Google Sheet
2. Click "Share" → "Anyone with the link can view"
3. Save and wait 5 minutes

### Issue: "Some teams missing"

**Cause:** Sheet tab name doesn't match exactly  
**Fix:** Verify tab names are EXACTLY:

- `Team Roles` (not "TeamRoles" or "team roles")
- `Rankings` (not "Ranking")
- `Registered League Subs` (exact spacing)

### Issue: "Changes not live"

**Cause:** GitHub Actions not running or failed  
**Fix:** Check <https://github.com/reflectionsa/echo-master-league-website/actions>

### Issue: "Rank images not showing for Diamond 1, etc."

**Cause:** Code update needed  
**Fix:** This has been fixed in latest commit - wait for deployment

---

## Quick Test Commands

**Test local dev server:**

```bash
npm run dev
```

Then visit <http://localhost:3004/>

**Build locally to test:**

```bash
npm run build
npm run preview
```

**Deploy manually (if GitHub Actions fails):**

```bash
npm run deploy
```

---

## What I've Already Fixed

✅ Tier images now work for all divisions (Diamond 1-4, Platinum 1-4, etc.)  
✅ Team Roles sheet parsing (supports both row-per-player and row-per-team)  
✅ Active/Inactive status based on Rankings sheet  
✅ League Subs parsing (all 60 subs)  
✅ Rankings data with MMR

**Next Steps:**

1. Test the local dev server at <http://localhost:3004/>
2. Tell me what you see (or don't see)
3. Check the browser console for any error messages

# Google Sheets Data Integration Guide

This guide explains how the Echo Master League application integrates with your Google Sheets to display rankings, matches, and team information.

## Sheet Reference

**Spreadsheet ID:** `1jK1FRzc044wq2miNZQbcqDDPoVAA3dR5knd8MZEpKdw`  
**URL:** [View Spreadsheet](https://docs.google.com/spreadsheets/d/1jK1FRzc044wq2miNZQbcqDDPoVAA3dR5knd8MZEpKdw/edit)

---

## 📊 NA Pblc Rnkngs (Team Rankings)

### Purpose

Displays team rankings with MMR, tier/division information, and win/loss records.

### Required Columns

| Column Name | Type | Example | Notes |
|-------------|------|---------|-------|
| **Position** / Rank / Rank # | Number | `1` | Team's rank position |
| **Team** / Team Name | Text | `Phoenix Rising` | Official team name |
| **MMR** / Rating | Number | `1250` | Match-making rating |
| **Tier** | Text | `Diamond 1` | See tier format below |
| **Region** | Text | `NA` / `North America` | Team's region |
| **Wins** / W | Number | `12` | Total wins |
| **Losses** / L | Number | `3` | Total losses |

### Optional Columns

| Column Name | Type | Example | Notes |
|-------------|------|---------|-------|
| Captain | Text | `PlayerName123` | Team captain |
| Logo | URL | `https://...` | Team logo image URL |
| Points / League Points | Number | `36` | League points |

### Tier/Division Format

The **Tier** column supports multiple formats:

#### Full Format (Recommended)

- `Diamond 1`, `Diamond 2`, `Diamond 3`, `Diamond 4`
- `Platinum 1`, `Platinum 2`, `Platinum 3`, `Platinum 4`
- `Gold 1`, `Gold 2`, `Gold 3`, `Gold 4`
- `Silver 1`, `Silver 2`, `Silver 3`, `Silver 4`
- `Bronze 1`, `Bronze 2`, `Bronze 3`, `Bronze 4`

#### Short Format

- `D1`, `D2`, `D3`, `D4` (Diamond)
- `P1`, `P2`, `P3`, `P4` (Platinum)
- `G1`, `G2`, `G3`, `G4` (Gold)
- `S1`, `S2`, `S3`, `S4` (Silver)
- `B1`, `B2`, `B3`, `B4` (Bronze)

#### No Division

- `Diamond`, `Platinum`, `Gold`, `Silver`, `Bronze`

**Display Example:**

- Input: `Diamond 1` → Displays as: **Diamond 1** badge
- Input: `D2` → Displays as: **Diamond 2** badge
- Input: `Platinum` → Displays as: **Platinum** badge

---

## 🎮 NA PBLC MATCHES (Match Schedule)

### Purpose

Shows scheduled, live, and completed matches with team assignments and stream information.

### Required Columns

| Column Name | Type | Example | Notes |
|-------------|------|---------|-------|
| **Team 1** / Home Team | Text | `Phoenix Rising` | First team in matchup |
| **Team 2** / Away Team | Text | `Storm Chasers` | Second team in matchup |
| **Status** | Text | `Scheduled` / `Live` / `Completed` | Match status |

### Optional Columns

| Column Name | Type | Example | Notes |
|-------------|------|---------|-------|
| Match Date / Date | Date | `2/20/2026` | Match date |
| Match Time / Time | Time | `7:00 PM EST` | Match time |
| Score / Final Score | Text | `3-2` | Final score (Team1-Team2) |
| Week | Text/Number | `Week 5` / `5` | Tournament week |
| Round | Text | `Quarterfinals` | Tournament round |
| Stream Link / Stream URL | URL | `https://twitch.tv/...` | Stream link |
| Stream Platform | Text | `Twitch` / `YouTube` | Platform name |
| Division | Text | `Diamond Division` | Division/bracket |
| Bracket | Text | `Upper Bracket` | Tournament bracket |
| Court / Court Assignment | Text | `Court 1` | Assigned court |
| Referee | Text | `RefName` | Match referee |
| Notes | Text | `Rescheduled` | Additional notes |

### Status Values

- **Scheduled** - Future match
- **Live** - Currently in progress (displays with red pulse)
- **Completed** - Finished match

---

## 🏆 How Rankings are Used

The application automatically:

1. **Fetches rankings** from `NA Pblc Rnkngs` sheet
2. **Parses tier information** into rank + division
3. **Sorts by MMR** (highest to lowest)
4. **Displays top 10** on the rankings section
5. **Shows tier badges** with color coding:
   - Diamond: Purple
   - Platinum: Blue
   - Gold: Yellow
   - Silver: Gray
   - Bronze: Orange

## 🎯 How Matches are Used

The application automatically:

1. **Fetches matches** from `NA PBLC MATCHES` sheet
2. **Parses dates** into readable format
3. **Filters by status** (can show scheduled, live, or completed)
4. **Links to streams** if URL provided
5. **Shows court assignments** for players
6. **Displays live indicator** for ongoing matches

---

## 📝 Data Entry Tips

### For Rankings Sheet

1. Keep team names consistent across all sheets
2. Update MMR after each match
3. Use consistent tier format (recommend full format: "Diamond 1")
4. Update wins/losses regularly
5. Keep one team per row

### For Matches Sheet

1. Update status to "Live" when match starts
2. Add final score when match completes
3. Keep team names exactly as they appear in rankings
4. Include stream links for better engagement
5. Use consistent date format (MM/DD/YYYY recommended)

---

## 🔄 Data Refresh

Data is automatically fetched when:

- Page loads
- Component mounts
- Manual refresh (if implemented)

**Typical refresh interval:** On page load (real-time updates require manual refresh or auto-polling)

---

## ⚙️ Technical Details

### Hooks Used

- `useRankings()` - Fetches from `NA Pblc Rnkngs`
- `useMatches()` - Fetches from `NA PBLC MATCHES`
- `useStandings()` - Fetches tournament standings

### Configuration

Defined in `config/sheets.js`:

```javascript
ranges: {
  rankings: 'NA Pblc Rnkngs!A:Z',
  matches: 'NA PBLC MATCHES!A:Z',
}
```

### Components

- `RankingsSection.jsx` - Displays top 10 teams with tier badges
- `MatchesView.jsx` - Shows match schedule with live indicators
- `StandingsView.jsx` - Tournament standings table

---

## 🐛 Troubleshooting

### Rankings not showing

- ✅ Check sheet name is exactly `NA Pblc Rnkngs`
- ✅ Verify MMR column exists and has numbers
- ✅ Ensure team names are filled in
- ✅ Check sheet is publicly accessible

### Tier badges not displaying correctly

- ✅ Use supported tier format (Diamond 1, D1, etc.)
- ✅ Check for typos in tier names
- ✅ Ensure no extra spaces

### Matches not appearing

- ✅ Check sheet name is exactly `NA PBLC MATCHES`
- ✅ Verify Team 1 and Team 2 columns exist and are filled
- ✅ Check Status column has valid values
- ✅ Ensure sheet is publicly accessible

### MMR showing as 0

- ✅ Ensure MMR/Rating column exists
- ✅ Check that values are numbers, not text
- ✅ Remove any formatting that might interfere

---

## 📞 Support

For issues with data integration:

1. Check the [main setup guide](../GOOGLE_SHEETS_SETUP.md)
2. Verify API key is configured in `.env`
3. Check browser console for errors
4. Ensure sheets are published/publicly viewable

**Last Updated:** February 16, 2026

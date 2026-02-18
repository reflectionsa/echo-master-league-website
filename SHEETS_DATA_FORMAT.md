# Google Sheets Data Format Guide

This guide shows the expected format for each sheet tab that feeds data into the EML website.

## Required Sheet Tabs

### 1. Player Stats
**Tab Name**: `Player Stats`  
**Range**: `A:M`  
**Purpose**: Individual player statistics for leaderboard

| Column | Header | Type | Example | Description |
|--------|--------|------|---------|-------------|
| A | Player Name | Text | "ShadowKnight" | Player's display name |
| B | Team | Text | "Phoenix Rising" | Current team name |
| C | Wins | Number | 15 | Total wins |
| D | Losses | Number | 8 | Total losses |
| E | Goals | Number | 234 | Total goals scored |
| F | Assists | Number | 187 | Total assists |
| G | Saves | Number | 312 | Total saves |
| H | MVPs | Number | 5 | Number of MVP awards |
| I | Games Played | Number | 23 | Total games |
| J | Win Rate | Number | 65.2 | Win percentage |
| K | Goals Per Game | Number | 10.2 | Average goals |
| L | Assists Per Game | Number | 8.1 | Average assists |
| M | Saves Per Game | Number | 13.6 | Average saves |

**Sample Data**:
```
Player Name    Team              Wins  Losses  Goals  Assists  Saves  MVPs  Games  Win%   GPG   APG   SPG
ShadowKnight   Phoenix Rising    15    8       234    187      312    5     23     65.2   10.2  8.1   13.6
FlashPlayer    Thunder Wolves    12    11      198    156      289    3     23     52.2   8.6   6.8   12.6
```

### 2. Player History
**Tab Name**: `Player History`  
**Range**: `A:G`  
**Purpose**: Historical season data for players

| Column | Header | Type | Example |
|--------|--------|------|---------|
| A | Player Name | Text | "ShadowKnight" |
| B | Season | Text | "Season 3" |
| C | Team | Text | "Phoenix Rising" |
| D | Placement | Text | "2nd" |
| E | Stats | Text | "15W-8L, 234G" |
| F | Achievements | Text | "Finals MVP" |
| G | Notes | Text | "Team captain" |

**Sample Data**:
```
Player Name    Season     Team              Placement  Stats          Achievements   Notes
ShadowKnight   Season 3   Phoenix Rising    2nd        15W-8L, 234G   Finals MVP     Team captain
ShadowKnight   Season 2   Thunder Wolves    1st        18W-5L, 298G   Champion       
```

### 3. Trophies
**Tab Name**: `Trophies`  
**Range**: `A:F`  
**Purpose**: Team achievements and tournament placements

| Column | Header | Type | Example |
|--------|--------|------|---------|
| A | Team Name | Text | "Phoenix Rising" |
| B | Tournament | Text | "EML" |
| C | Season | Text | "Season 3" |
| D | Placement | Text | "1st" |
| E | Date | Date | "2026-02-15" |
| F | Trophy Type | Text | "Champion" |

**Valid Placement Values**: `1st`, `2nd`, `3rd`, `Finalist`  
**Valid Tournament Values**: `EML`, `ECF`, or custom tournament name

**Sample Data**:
```
Team Name        Tournament  Season     Placement  Date         Trophy Type
Phoenix Rising   EML         Season 3   1st        2026-02-15   Champion
Thunder Wolves   EML         Season 3   2nd        2026-02-15   Runner-up
Sky Raiders      ECF         Winter     1st        2026-01-20   Champion
```

### 4. Highlights
**Tab Name**: `Highlights`  
**Range**: `A:H`  
**Purpose**: Video highlights with embedded player support

| Column | Header | Type | Example |
|--------|--------|------|---------|
| A | Title | Text | "Epic Overtime Goal!" |
| B | URL | URL | "https://youtube.com/watch?v=..." |
| C | Platform | Text | "YouTube" |
| D | Date | Date | "2026-02-10" |
| E | Featured | Boolean | "TRUE" or "1" |
| F | Player | Text | "ShadowKnight" |
| G | Description | Text | "Game-winning goal in overtime" |
| H | Thumbnail | URL | "https://..." |

**Valid Platform Values**: `YouTube`, `Twitch`, `TikTok`

**Sample Data**:
```
Title                   URL                           Platform  Date        Featured  Player        Description
Epic Overtime Goal!     youtube.com/watch?v=abc123    YouTube   2026-02-10  TRUE      ShadowKnight  Game-winning goal
Best Saves Compilation  youtube.com/watch?v=def456    YouTube   2026-02-08  FALSE                   Top 10 saves
```

### 5. Predictions
**Tab Name**: `Predictions`  
**Range**: `A:F`  
**Purpose**: Community match predictions

| Column | Header | Type | Example |
|--------|--------|------|---------|
| A | Match ID | Text | "Phoenix-vs-Thunder" |
| B | Team A Votes | Number | 127 |
| C | Team B Votes | Number | 93 |
| D | Total Votes | Number | 220 |
| E | Closed | Boolean | "FALSE" or "0" |
| F | Result | Text | "Phoenix Rising 3-2" |

**Sample Data**:
```
Match ID              Team A Votes  Team B Votes  Total Votes  Closed  Result
Phoenix-vs-Thunder    127           93            220          FALSE   
Sky-vs-Storm          156           144           300          TRUE    Sky Raiders 3-1
```

### 6. Announcements
**Tab Name**: `Announcements`  
**Range**: `A:F`  
**Purpose**: League news and updates

| Column | Header | Type | Example |
|--------|--------|------|---------|
| A | Title | Text | "Week 3 Matches Posted" |
| B | Content | Text | "Check the matches tab..." |
| C | Date | Date | "2026-02-16T14:00:00Z" |
| D | Author | Text | "EML Staff" |
| E | Category | Text | "League Updates" |
| F | Priority | Text | "High" |

**Valid Category Values**: `League Updates`, `Management`, `Schedule`, `Major Events`, `General`  
**Valid Priority Values**: `High`, `Normal`

**Sample Data**:
```
Title                 Content                          Date                   Author      Category        Priority
Week 3 Matches Posted Check the matches tab for...     2026-02-16T14:00:00Z   EML Staff   League Updates  High
Roster Lock Soon      Reminder: Roster lock is...      2026-02-15T10:00:00Z   Admin       Management      Normal
```

### 7. Player Tags
**Tab Name**: `Player Tags`  
**Range**: `A:D`  
**Purpose**: Cosmetic player titles and badges

| Column | Header | Type | Example |
|--------|--------|------|---------|
| A | Player Name | Text | "ShadowKnight" |
| B | Tag | Text | "Champion" |
| C | Type | Text | "Achievement" |
| D | Description | Text | "Season 3 Champion" |

**Valid Type Values**: `Achievement`, `Champion`, `Fun`, `Legacy`, `Finalist`

**Sample Data**:
```
Player Name    Tag                      Type         Description
ShadowKnight   Champion                 Champion     Season 3 Champion
FlashPlayer    11.5                     Fun          Legendary overtime player
StormBreaker   Finals MVP               Achievement  Finals MVP Award
```

### 8. Tips And Tricks
**Tab Name**: `Tips And Tricks`  
**Range**: `A:G`  
**Purpose**: Educational and entertainment videos

| Column | Header | Type | Example |
|--------|--------|------|---------|
| A | Title | Text | "How to Save Like a Pro" |
| B | URL | URL | "https://youtube.com/..." |
| C | Category | Text | "Instructional" |
| D | Date | Date | "2026-02-01" |
| E | Description | Text | "Advanced save techniques" |
| F | Thumbnail | URL | "https://..." |
| G | Duration | Text | "5:32" |

**Valid Category Values**: `Humorous`, `Instructional`, `Strategy`, `General`

**Sample Data**:
```
Title                    URL                     Category       Date        Description              Thumbnail  Duration
How to Save Like a Pro   youtube.com/watch?v=... Instructional  2026-02-01  Advanced techniques      ...        5:32
Funny Moments Vol 1      youtube.com/watch?v=... Humorous       2026-01-28  Best fails compilation   ...        3:15
```

### 9. Interviews
**Tab Name**: `Interviews`  
**Range**: `A:G`  
**Purpose**: Team interview videos

| Column | Header | Type | Example |
|--------|--------|------|---------|
| A | Title | Text | "Phoenix Rising Post-Finals" |
| B | Team | Text | "Phoenix Rising" |
| C | Date | Date | "2026-02-15" |
| D | URL | URL | "https://youtube.com/..." |
| E | Interviewer | Text | "EML Caster" |
| F | Description | Text | "Champions discuss their victory" |
| G | Thumbnail | URL | "https://..." |

**Sample Data**:
```
Title                        Team             Date        URL                     Interviewer  Description
Phoenix Rising Post-Finals   Phoenix Rising   2026-02-15  youtube.com/watch?v=... EML Caster   Champions discuss victory
```

## Setup Instructions

1. **Create Google Sheet**: Create a new Google Sheet or use existing EML sheet
2. **Add Tabs**: Create each tab with the exact names listed above
3. **Add Headers**: First row of each tab should be the column headers
4. **Add Data**: Add your data starting from row 2
5. **Share Sheet**: Make sheet publicly viewable or share with API service account
6. **Update Config**: Set the spreadsheet ID in `config/sheets.js`

## Data Entry Tips

### Dates
- Use ISO 8601 format: `YYYY-MM-DDTHH:mm:ssZ`
- Or simple date: `YYYY-MM-DD`
- Google Sheets will auto-format dates

### Booleans
- Use `TRUE`/`FALSE` (preferred)
- Or use `1`/`0`
- Case insensitive

### URLs
- Full URLs work best: `https://youtube.com/watch?v=...`
- YouTube embed format also supported
- Twitch clip URLs: `https://clips.twitch.tv/ClipName`

### Numbers
- No commas or special characters
- Decimals are fine: `65.2`
- Percentages without % symbol: `65.2` not `65.2%`

## Bot Integration

The EML Discord bot can write to these sheets automatically:
- See `BOT_INTEGRATION.md` for bot command documentation
- Bot should have service account with edit permissions
- Website has read-only access via API key
- Data updates appear on website within 30 seconds

## Validation

The website will:
- Show error messages if sheets are missing
- Handle missing columns gracefully
- Display "No data" if sheet is empty
- Log errors to browser console for debugging

## Testing

1. Add sample data to each sheet
2. Open website and check each view
3. Verify data displays correctly
4. Test search and filter functions
5. Check responsive design on mobile

## Common Issues

**Data not showing**:
- Check sheet name matches exactly (case-sensitive)
- Verify column headers in row 1
- Ensure data starts in row 2
- Check API key has access to sheet

**Wrong data format**:
- Check column order matches guide
- Verify data types (numbers not text)
- Check date formats
- Look for extra spaces or special characters

**Performance issues**:
- Keep data under 1000 rows per sheet
- Remove old/archived data
- Use separate sheets for historical data

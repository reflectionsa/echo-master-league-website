
$apiKey = "AIzaSyBASNrr1R2CIXcyEFDQNpcRVdJ9-SU54Kc"
$ssId = "1Xxui4vb0j8dkIJgprfyYgUV2G-EeBfQ2ijrABxZGgoc"
$out = "public\data.json"

function Fetch-Rows($range) {
    $enc = [uri]::EscapeDataString($range)
    $url = "https://sheets.googleapis.com/v4/spreadsheets/$ssId/values/${enc}?key=$apiKey"
    $resp = Invoke-RestMethod -Uri $url -ErrorAction SilentlyContinue
    $vals = $resp.values
    if (-not $vals -or $vals.Count -lt 2) { return @() }
    # Build de-duplicated headers (mirrors useGoogleSheets.jsx logic)
    $rawHdr = $vals[0]
    $hdrCounts = @{}
    $headers = for ($i = 0; $i -lt $rawHdr.Count; $i++) {
        $h = [string]$rawHdr[$i]; $h = $h.Trim()
        if (-not $h) { "_empty_$i" }
        elseif ($hdrCounts.ContainsKey($h)) { $hdrCounts[$h]++; "${h}_$($hdrCounts[$h])" }
        else { $hdrCounts[$h] = 1; $h }
    }
    $id = 1
    $rows = foreach ($row in $vals[1..($vals.Count - 1)]) {
        $obj = [ordered]@{ id = $id++ }
        for ($i = 0; $i -lt $headers.Count; $i++) {
            $obj[$headers[$i]] = if ($i -lt $row.Count) { [string]$row[$i] } else { "" }
        }
        [pscustomobject]$obj
    }
    return @($rows)
}

function ToInt($v) { $n = 0; if ([int]::TryParse([string]$v, [ref]$n)) { return $n } else { return 0 } }

# â”€â”€ Fetch all tabs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
Write-Host "Fetching sheets..."
$rosterWide = Fetch-Rows "_RosterWide!A:H"
$rankings = Fetch-Rows "Rankings!A:D"
$proposed = Fetch-Rows "Proposed Match Results!A:J"
$matchResults = Fetch-Rows "Match Results!A:P"
$forfeitsRaw = Fetch-Rows "Forfeits!A:P"
$cooldown = Fetch-Rows "Cooldown List!A:C"
$teamRolesRaw = Fetch-Rows "Team Roles!A:D"
$leagueSubsRaw = Fetch-Rows "Registered League Subs!A:B"
Write-Host "rosterWide=$($rosterWide.Count) rankings=$($rankings.Count) proposed=$($proposed.Count) matchResults=$($matchResults.Count) forfeits=$($forfeitsRaw.Count) cooldown=$($cooldown.Count) teamRoles=$($teamRolesRaw.Count) leagueSubs=$($leagueSubsRaw.Count)"

# â”€â”€ Transform teams (from _RosterWide) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$teams = foreach ($row in $rosterWide) {
    $name = if ($row.'Team Name') { $row.'Team Name' } elseif ($row.Team) { $row.Team } else { "" }
    if (-not $name) { continue }
    $cc = if ($row.'Co-Captain (CC) Player') { $row.'Co-Captain (CC) Player' } `
        elseif ($row.'Co-Captain') { $row.'Co-Captain' } `
        elseif ($row.'Co Captain') { $row.'Co Captain' } else { "" }
    $cc = $cc -replace '^\(CC\)\s*', ''
    $players = @()
    foreach ($p in @($row.'Player 1', $row.'Player', $row.'Player_2', $row.'Player_3', $row.'Player_4')) {
        if ($p) { $players += $p }
    }
    # Remove duplicates (Player 1 / Player overlap)
    $players = $players | Select-Object -Unique
    [pscustomobject]@{
        id           = [int]($row.id)
        name         = $name
        captain      = if ($row.Captain) { $row.Captain } else { "" }
        coCaptain    = $cc
        players      = @($players | Where-Object { $_ })
        tier         = if ($row.Tier) { $row.Tier } else { "" }
        region       = if ($row.Region) { $row.Region } else { "NA" }
        status       = if ($row.Status) { $row.Status } else { "Active" }
        leaguePoints = ToInt $row.'League Points'
        wins         = ToInt $row.Wins
        losses       = ToInt $row.Losses
        teamLogo     = if ($row.'Team Logo') { $row.'Team Logo' } else { "" }
    }
}

# â”€â”€ Transform standings (from Rankings) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$standings = $rankings | ForEach-Object -Begin { $idx = 0 } -Process {
    $tn = if ($_.'team name') { $_.'team name' } elseif ($_.Team) { $_.Team } else { "" }
    if (-not $tn) { continue }
    [pscustomobject]@{
        id       = [int]($_.id)
        position = ++$idx
        tier     = if ($_.Rank) { $_.Rank } else { "" }
        team     = $tn
        region   = if ($_.Region) { $_.Region } else { "NA" }
        wins     = ToInt $_.Wins
        losses   = ToInt $_.Losses
        mmr      = ToInt $_.Rating
        points   = ToInt $_.Points
        active   = if ($_.Active) { $_.Active } else { "Active" }
    }
}

# â”€â”€ Parse rank tier â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Parse-Tier($s) {
    if (-not $s) { return @{ rank = "Unranked"; division = $null } }
    $rankMap = @{M = 'Master'; MASTER = 'Master'; D = 'Diamond'; DIAMOND = 'Diamond'; P = 'Platinum'; PLATINUM = 'Platinum'; G = 'Gold'; GOLD = 'Gold'; S = 'Silver'; SILVER = 'Silver'; B = 'Bronze'; BRONZE = 'Bronze' }
    if ($s -match '^(Master|M|Diamond|D|Platinum|P|Gold|G|Silver|S|Bronze|B)\s*(\d)?') {
        $r = $rankMap[$matches[1].ToUpper()]
        if (-not $r) { $r = $matches[1] }
        $div = if ($matches[2]) { [int]$matches[2] } else { $null }
        return @{ rank = $r; division = $div }
    }
    return @{ rank = $s; division = $null }
}

# â”€â”€ Transform rankings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$rankingsOut = $rankings | ForEach-Object -Begin { $idx = 0 } -Process {
    $tn = if ($_.'team name') { $_.'team name' } elseif ($_.Team) { $_.Team } else { "" }
    if (-not $tn) { continue }
    $tierStr = if ($_.Rank) { $_.Rank } else { $_.Tier }
    $tier = Parse-Tier $tierStr
    [pscustomobject]@{
        id       = [int]($_.id)
        position = ++$idx
        name     = $tn
        captain  = if ($_.Captain) { $_.Captain } else { "" }
        tier     = $tier.rank
        division = $tier.division
        mmr      = ToInt $_.Rating
        region   = if ($_.Region) { $_.Region } else { "North America" }
        wins     = ToInt $_.Wins
        losses   = ToInt $_.Losses
        active   = if ($_.Active) { $_.Active } else { "Yes" }
        teamLogo = [pscustomobject]@{
            url   = if ($_.Logo) { $_.Logo } else { "https://cdn.discordapp.com/avatars/1461558413971554392/791aa1c1bae16f1a423fa2e008279e39.webp?size=1024" }
            label = $tn
        }
    }
}

# â”€â”€ Transform match results (used for both matchResults and forfeits) â”€â”€â”€â”€â”€
function Transform-MatchResults($data) {
    $out = foreach ($row in $data) {
        $t1 = if ($row.'Team A') { $row.'Team A' } else { "" }
        $t2 = if ($row.'Team B') { $row.'Team B' } else { "" }
        if (-not $t1 -or -not $t2) { continue }
        $ms = if ($row.'Match Status') { $row.'Match Status' } else { "" }
        $isFF = $ms.ToLower().Contains("forfeit")
        $t1s = (ToInt $row.'Round 1') + (ToInt $row.'Round 2') + (ToInt $row.'Round 3')
        $t2s = (ToInt $row.'_empty_8') + (ToInt $row.'_empty_10') + (ToInt $row.'_empty_12')
        if ($t1s -eq 0 -and $t2s -eq 0 -and -not $isFF) { continue }
        [pscustomobject]@{
            id          = [int]($row.id)
            week        = if ($row.Week) { $row.Week } else { "" }
            matchDate   = if ($row.'Match Date') { $row.'Match Date' } else { "" }
            matchTime   = if ($row.'Match Time (ET)') { $row.'Match Time (ET)' } else { "" }
            matchType   = if ($row.'Match Type') { $row.'Match Type' } else { "" }
            team1       = $t1
            team2       = $t2
            team1Score  = $t1s
            team2Score  = $t2s
            team1Won    = $t1s -gt $t2s
            team2Won    = $t2s -gt $t1s
            isForfeit   = $isFF
            matchStatus = $ms
        }
    }
    return @($out)
}

$matchResultsOut = Transform-MatchResults $matchResults
$forfeitsOut = Transform-MatchResults $forfeitsRaw

# â”€â”€ Transform proposed matches â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$proposedOut = foreach ($row in $proposed) {
    $t1 = if ($row.'Team Submitting Scores') { $row.'Team Submitting Scores' } elseif ($row.'Team 1') { $row.'Team 1' } else { "" }
    $t2 = if ($row.'Team Accepting Scores') { $row.'Team Accepting Scores' } elseif ($row.'Team 2') { $row.'Team 2' } else { "" }
    if (-not $t1 -or -not $t2) { continue }
    $t1s = (ToInt $row.'Team A Round 1') + (ToInt $row.'Team A Round 2') + (ToInt $row.'Team A Round 3')
    $t2s = (ToInt $row.'Team B Round 1') + (ToInt $row.'Team B Round 2') + (ToInt $row.'Team B Round 3')
    [pscustomobject]@{
        id             = [int]($row.id)
        team1          = $t1
        team2          = $t2
        matchDate      = $null
        matchTime      = ""
        score          = if ($t1s -or $t2s) { "$t1s - $t2s" } else { "" }
        status         = if ($row.'Match Status') { $row.'Match Status' } else { "Pending" }
        matchType      = if ($row.'Match Type') { $row.'Match Type' } else { "" }
        week           = if ($row.Week) { $row.Week } else { "" }
        round          = if ($row.Round) { $row.Round } else { "" }
        proposedResult = if ($row.'Proposed Result') { $row.'Proposed Result' } else { "" }
        streamLink     = [pscustomobject]@{ url = ""; platform = "Twitch" }
    }
}

# â”€â”€ Transform cooldown list â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$cooldownOut = foreach ($row in $cooldown) {
    $pn = if ($row.'Player Name') { $row.'Player Name' } elseif ($row.Player) { $row.Player } else { "" }
    if (-not $pn) { continue }
    $exp = if ($row.Expires) { $row.Expires } elseif ($row.'Cooldown Until') { $row.'Cooldown Until' } else { "" }
    [pscustomobject]@{
        id            = [int]($row.id)
        playerName    = $pn
        team          = if ($row.'Team Left') { $row.'Team Left' } elseif ($row.Team) { $row.Team } else { "" }
        cooldownUntil = $exp
        reason        = if ($row.Reason) { $row.Reason } else { "Team Transfer" }
        eligibleDate  = $exp
    }
}

# â”€â”€ Transform league subs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$leagueSubsOut = foreach ($row in $leagueSubsRaw) {
    $pn = if ($row.'Player Name') { $row.'Player Name' } `
        elseif ($row.Player) { $row.Player } `
        elseif ($row.name) { $row.name } `
        elseif ($row.Name) { $row.Name } else { "" }
    if ($pn.Trim()) { $pn.Trim() }
}

# â”€â”€ Transform teamRoles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$activeTeamNamesSet = @{}
foreach ($row in $rankings) {
    $tn = if ($row.'team name') { $row.'team name' } elseif ($row.Team) { $row.Team } else { "" }
    if ($tn.Trim()) { $activeTeamNamesSet[$tn.ToLower().Trim()] = $true }
}

$firstTR = if ($teamRolesRaw.Count -gt 0) { $teamRolesRaw[0] } else { $null }
$hasPlayerNameCol = $firstTR -and ($firstTR.PSObject.Properties.Name -contains 'Player Name' -or $firstTR.PSObject.Properties.Name -contains 'Player')

$trMap = [ordered]@{}
if ($hasPlayerNameCol) {
    foreach ($row in $teamRolesRaw) {
        $pn = if ($row.'Player Name') { $row.'Player Name' } elseif ($row.Player) { $row.Player } else { "" }
        $tn = if ($row.'Team Name') { $row.'Team Name' } elseif ($row.Team) { $row.Team } else { "" }
        if (-not $pn -or -not $tn) { continue }
        $isCap = ($row.Captain -ne $null -and $row.Captain.ToString().ToLower() -eq 'yes')
        $isCC = (($row.'Co-Captain' -ne $null -and $row.'Co-Captain'.ToString().ToLower() -eq 'yes') -or ($row.'Co-Captain ' -ne $null -and $row.'Co-Captain '.ToString().ToLower() -eq 'yes'))
        $rank = if ($row.Rank) { $row.Rank } else { "" }
        if (-not $trMap.Contains($tn)) { $trMap[$tn] = @{ name = $tn; captain = ""; coCaptain = ""; players = @(); ranks = @() } }
        $t = $trMap[$tn]
        if ($isCap) { $t.captain = $pn }
        elseif ($isCC) { $t.coCaptain = $pn }
        else { $t.players += $pn }
        if ($rank) { $t.ranks += $rank }
    }
}
else {
    foreach ($row in $teamRolesRaw) {
        $vals = $row.PSObject.Properties | Where-Object { $_.Name -ne 'id' -and $_.Value -and [string]$_.Value -ne '' } | ForEach-Object { [string]$_.Value }
        if (-not $vals -or $vals.Count -eq 0) { continue }
        $tn = $vals[0].Trim()
        if (-not $tn -or $tn -eq 'Active' -or $tn -eq 'Inactive') { continue }
        $playerVals = $vals[1..($vals.Count - 1)] | Where-Object { $_ -and $_ -ne 'Active' -and $_ -ne 'Inactive' }
        if (-not $trMap.Contains($tn)) { $trMap[$tn] = @{ name = $tn; captain = ""; coCaptain = ""; players = @(); ranks = @() } }
        $t = $trMap[$tn]
        $capAssigned = $false
        foreach ($pv in $playerVals) {
            $s = $pv.Trim()
            if ($s.StartsWith('(CC)')) { $t.coCaptain = $s.Replace('(CC)', '').Trim() }
            elseif (-not $capAssigned) { $t.captain = $s; $capAssigned = $true }
            else { $t.players += $s }
        }
    }
}

$trIdx = 0
$teamRolesOut = $trMap.Keys | Sort-Object | ForEach-Object {
    $t = $trMap[$_]
    $allMembers = @($t.captain, $t.coCaptain) + $t.players | Where-Object { $_ }
    $isActive = $activeTeamNamesSet.ContainsKey($t.name.ToLower().Trim())
    $trIdx++
    [pscustomobject]@{
        id           = $trIdx
        name         = $t.name
        captain      = $t.captain
        coCaptain    = $t.coCaptain
        players      = @($t.players | Where-Object { $_ })
        status       = if ($isActive) { "Active" } else { "Inactive" }
        totalPlayers = $allMembers.Count
        ranks        = @($t.ranks)
    }
}

# â”€â”€ Assemble final object â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$dataObj = [ordered]@{
    lastUpdated     = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    teams           = @($teams)
    teamRoles       = @($teamRolesOut)
    standings       = @($standings)
    rankings        = @($rankingsOut)
    matchResults    = @($matchResultsOut)
    forfeits        = @($forfeitsOut)
    proposedMatches = @($proposedOut)
    cooldownPlayers = @($cooldownOut)
    leagueSubs      = @($leagueSubsOut)
}

$json = $dataObj | ConvertTo-Json -Depth 10
Set-Content -Path $out -Value $json -Encoding UTF8
Write-Host "Done. teams=$($teams.Count) teamRoles=$($teamRolesOut.Count) standings=$($standings.Count) rankings=$($rankingsOut.Count) matchResults=$($matchResultsOut.Count) forfeits=$($forfeitsOut.Count) proposed=$($proposedOut.Count) cooldown=$($cooldownOut.Count) subs=$(@($leagueSubsOut).Count)"


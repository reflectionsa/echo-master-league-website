/**
 * PlayerFlipCard — trading-card-style flip card.
 * Front: avatar initials, name, team, rank badge.
 * Back: win/loss record, role, season stats.
 *
 * Usage: <PlayerFlipCard player={playerObj} theme={theme} onClick={fn} />
 * playerObj: { name, team, role, wins, losses, rank, region }
 */
import { Box, Text, VStack, HStack, Badge } from '@chakra-ui/react';
import { Shield, Award, User, Trophy, TrendingUp } from 'lucide-react';
import { getThemedColors } from '../theme/colors';

const initials = (name) =>
  (name || '?').split(/[\s-]/).filter(Boolean).map(w => w[0].toUpperCase()).slice(0, 2).join('');

const ROLE_COLORS = {
  Captain: { badge: 'yellow', icon: Shield, accentIdx: 0 },
  'Co-Captain': { badge: 'orange', icon: Award, accentIdx: 1 },
  Player: { badge: 'blue', icon: User, accentIdx: 2 },
};

const BG_ACCENTS = [
  'linear-gradient(135deg, #ff6b2b22, #7c3aed18)',
  'linear-gradient(135deg, #ff8c4222, #ef444418)',
  'linear-gradient(135deg, #00bfff22, #10b98118)',
];

const PlayerFlipCard = ({ player, theme, onClick, width = '180px', height = '240px' }) => {
  const colors = getThemedColors(theme);
  const { name = '?', team = '', role = 'Player', wins = 0, losses = 0, rank = '—', region = '' } = player || {};
  const total = wins + losses;
  const winPct = total > 0 ? Math.round((wins / total) * 100) : 0;
  const roleConfig = ROLE_COLORS[role] || ROLE_COLORS.Player;
  const RoleIcon = roleConfig.icon;
  const bgGradient = BG_ACCENTS[roleConfig.accentIdx];

  return (
    <>
      <style>{`
        @keyframes eml-drift {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          25%       { transform: translateX(18px) translateY(-12px); }
          50%       { transform: translateX(-10px) translateY(-22px); }
          75%       { transform: translateX(-20px) translateY(-8px); }
        }
      `}</style>
    <div
      className="eml-flip-card"
      style={{ width, height, display: 'inline-block' }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${name} player card — hover or tap to flip`}
      onKeyDown={e => e.key === 'Enter' && onClick?.()}
    >
      <div className="eml-flip-inner" style={{ width: '100%', height: '100%' }}>

        {/* ── FRONT ──────────────────────────────────────────────── */}
        <div
          className="eml-flip-front"
          style={{
            background: bgGradient,
            border: `1px solid ${colors.borderMedium}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '16px',
          }}
        >
          {/* Holographic shimmer strip */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
            background: 'linear-gradient(90deg, #ff6b2b, #00bfff, #7c3aed, #ff6b2b)',
            backgroundSize: '200%',
            animation: 'eml-drift 4s linear infinite',
          }} />

          {/* Avatar */}
          <div style={{
            width: 72, height: 72,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.accentOrange}, ${colors.accentBlue})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 900, color: '#fff',
            boxShadow: `0 4px 20px ${colors.accentOrange}55`,
            flexShrink: 0,
          }}>
            {initials(name)}
          </div>

          <VStack gap="1" style={{ textAlign: 'center' }}>
            <Text fontSize="sm" fontWeight="800" color={colors.textPrimary} lineHeight="1.2" noOfLines={2}>
              {name}
            </Text>
            <Text fontSize="xs" color={colors.textMuted} noOfLines={1}>{team || 'Free Agent'}</Text>
          </VStack>

          <HStack gap="1.5" justify="center" flexWrap="wrap">
            <Badge colorPalette={roleConfig.badge} size="sm" gap="1">
              <RoleIcon size={10} />
              {role}
            </Badge>
            {region && <Badge variant="outline" size="sm" colorPalette="gray">{region}</Badge>}
          </HStack>

          {/* Rank */}
          {rank && rank !== '—' && (
            <HStack gap="1" fontSize="xs" color={colors.textSubtle}>
              <Trophy size={11} color={colors.accentOrange} />
              <Text>Rank {rank}</Text>
            </HStack>
          )}

          <Text fontSize="2xs" color={colors.textSubtle} style={{ position: 'absolute', bottom: 8 }}>
            Flip for stats →
          </Text>
        </div>

        {/* ── BACK ───────────────────────────────────────────────── */}
        <div
          className="eml-flip-back"
          style={{
            background: `linear-gradient(160deg, ${colors.bgElevated}, ${colors.bgCard})`,
            border: `1px solid ${colors.accentOrange}44`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '16px',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: `linear-gradient(90deg, ${colors.accentOrange}, ${colors.accentBlue})`,
          }} />

          <Text fontSize="xs" fontWeight="800" color={colors.accentOrange} textTransform="uppercase" letterSpacing="wider">
            Season Stats
          </Text>

          <VStack gap="2" w="full">
            {[
              { label: 'Wins', value: wins, color: '#22c55e' },
              { label: 'Losses', value: losses, color: '#ef4444' },
              { label: 'Win %', value: `${winPct}%`, color: colors.accentBlue },
            ].map(s => (
              <HStack key={s.label} justify="space-between" w="full"
                bg={`${colors.bgPrimary}88`} px="3" py="1.5" rounded="lg">
                <Text fontSize="xs" color={colors.textMuted}>{s.label}</Text>
                <Text fontSize="sm" fontWeight="800" color={s.color}>{s.value}</Text>
              </HStack>
            ))}
          </VStack>

          <HStack gap="1.5" mt="1">
            <TrendingUp size={12} color={colors.accentOrange} />
            <Text fontSize="2xs" color={colors.textSubtle}>{team || 'Free Agent'}</Text>
          </HStack>
        </div>
      </div>
    </div>
    </>
  );
};

export default PlayerFlipCard;

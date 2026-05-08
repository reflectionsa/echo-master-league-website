import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, HStack, Text, Button, CloseButton } from '@chakra-ui/react';
import { RefreshCw } from 'lucide-react';
import { getThemedColors } from '../theme/colors';

const SECTION_LABELS = {
  // useDataJson sections
  cooldownPlayers: 'Cooldown List',
  leagueSubs: 'League Subs',
  proposedMatches: 'Upcoming Matches',
  matchResults: 'Match Results',
  playerLeaderboard: 'Leaderboard',
  rankings: 'Rankings',
  productionStats: 'Production Stats',
  teams: 'Teams',
  teamRoles: 'Team Roles',
  standings: 'Standings',
  // Google Sheets sheet names (from range like 'Teams!A:H')
  Teams: 'Teams',
  Standings: 'Standings',
  Matches: 'Matches',
  Members: 'Members',
  Subs: 'League Subs',
  Leaderboard: 'Leaderboard',
  Rankings: 'Rankings',
  Schedule: 'Schedule',
};

const AUTO_DISMISS_MS = 15000;

const DataChangeNotifier = ({ theme }) => {
  const colors = getThemedColors(theme);
  const [changedSections, setChangedSections] = useState([]);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setChangedSections([]);
    }, AUTO_DISMISS_MS);
  }, []);

  useEffect(() => {
    const handle = (e) => {
      const raw = e.detail?.section;
      const label = SECTION_LABELS[raw] || raw || 'the site';
      setChangedSections(prev => prev.includes(label) ? prev : [...prev, label]);
      setVisible(true);
      resetTimer();
    };
    window.addEventListener('eml:datachanged', handle);
    return () => window.removeEventListener('eml:datachanged', handle);
  }, [resetTimer]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const dismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
    setChangedSections([]);
  };

  if (!visible || changedSections.length === 0) return null;

  const sectionText = changedSections.length === 1
    ? changedSections[0]
    : changedSections.slice(0, -1).join(', ') + ' & ' + changedSections.at(-1);

  return (
    <Box
      position="fixed"
      bottom={{ base: '80px', md: '24px' }}
      left="50%"
      transform="translateX(-50%)"
      zIndex={9999}
      maxW="520px"
      w="calc(100% - 32px)"
      bg={colors.bgCard}
      border={`1px solid ${colors.accentOrange}66`}
      borderRadius="xl"
      boxShadow="0 8px 32px rgba(0,0,0,0.45)"
      p="3"
      style={{ animation: 'slideUp 0.25s ease' }}
    >
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateX(-50%) translateY(12px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
      <HStack gap="3" align="center">
        <RefreshCw size={16} color={colors.accentOrange} style={{ flexShrink: 0 }} />
        <Text flex="1" fontSize="sm" color={colors.textPrimary} fontWeight="500" lineHeight="1.4">
          Some data has changed in{' '}
          <Text as="span" color={colors.accentOrange} fontWeight="700">{sectionText}</Text>
          {' '}— refresh to see what's changed!
        </Text>
        <Button
          size="xs"
          px="3"
          bg={colors.accentOrange}
          color="white"
          _hover={{ opacity: 0.85 }}
          onClick={() => window.location.reload()}
          flexShrink={0}
        >
          Refresh
        </Button>
        <CloseButton size="sm" color={colors.textSecondary} _hover={{ color: colors.textPrimary }} onClick={dismiss} />
      </HStack>
    </Box>
  );
};

export default DataChangeNotifier;

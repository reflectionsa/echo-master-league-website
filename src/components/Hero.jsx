import { Box, Container, VStack, Text, HStack, Center, Image } from '@chakra-ui/react';
// lucide-react icons (unused removed)
import { useTeamRoles } from '../hooks/useTeamRoles';
import { useLeagueSubs } from '../hooks/useLeagueSubs';
import { useMemo } from 'react';
import { getThemedColors } from '../theme/colors';

const Hero = ({ theme, onTeamsClick, onPlayersClick, onSubsClick }) => {
  const { teams, loading: teamsLoading } = useTeamRoles();
  const { count: subsCount, loading: subsLoading } = useLeagueSubs();
  const colors = getThemedColors(theme);

  // Calculate real stats from live data
  const stats = useMemo(() => {
    if (teamsLoading || !teams || teams.length === 0) {
      return {
        activeTeams: '...',
        activePlayers: '...',
        leagueSubs: '...'
      };
    }

    console.log('All teams:', teams.length); // DEBUG
    console.log('Teams status breakdown:', {
      active: teams.filter(t => t.status === 'Active').length,
      inactive: teams.filter(t => t.status === 'Inactive').length
    }); // DEBUG

    // Only count active teams (4+ players)
    const activeTeams = teams.filter(t => t.status === 'Active').length;

    // Count only players from active teams
    const allPlayers = new Set();
    teams.forEach(team => {
      if (team.status === 'Active') {
        if (team.captain) allPlayers.add(team.captain);
        if (team.coCaptain) allPlayers.add(team.coCaptain);
        if (team.players) {
          team.players.forEach(player => {
            if (player) allPlayers.add(player);
          });
        }
      }
    });

    const activePlayers = allPlayers.size;

    console.log('Stats calculated:', { activeTeams, activePlayers, subsCount }); // DEBUG

    return {
      activeTeams: activeTeams.toString(),
      activePlayers: activePlayers.toString(),
      leagueSubs: subsLoading ? '...' : subsCount.toString()
    };
  }, [teams, teamsLoading, subsCount, subsLoading]);

  const statBlocks = [
    { label: 'Active Teams', value: stats.activeTeams, onClick: onTeamsClick },
    { label: 'Active Players', value: stats.activePlayers, onClick: onPlayersClick },
    { label: 'League Subs', value: stats.leagueSubs, onClick: onSubsClick }
  ];

  return (
    <Box
      position="relative"
      minH="70vh"
      bg={`linear-gradient(135deg, ${colors.bgPrimary} 0%, ${colors.bgSecondary} 50%, ${colors.bgTertiary} 100%)`}
      overflow="hidden"
    >
      {/* Animated background elements */}
      <Box position="absolute" top="10%" left="10%" w="300px" h="300px" bg={`${colors.accentOrange}20`} rounded="full" filter="blur(80px)" />
      <Box position="absolute" bottom="10%" right="10%" w="400px" h="400px" bg={`${colors.accentBlue}20`} rounded="full" filter="blur(100px)" />

      <Container maxW="6xl" py={{ base: '16', md: '24' }} position="relative" zIndex="1">
        <VStack gap="8" textAlign="center">
          {/* EML Logo */}
          <Box
            w={{ base: '130px', md: '200px' }}
            h={{ base: '130px', md: '200px' }}
            bg={`${colors.bgElevated}99`}
            backdropFilter="blur(20px)"
            border="3px solid"
            borderColor={colors.accentOrange}
            rounded="3xl"
            boxShadow={`0 8px 32px ${colors.accentOrange}66`}
            _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
            transition="all 0.3s"
            overflow="hidden"
            p="4"
          >
            <Image
              src="https://cdn.discordapp.com/avatars/1461558413971554392/791aa1c1bae16f1a423fa2e008279e39.webp?size=1024"
              alt="Echo Master League Logo"
              w="full"
              h="full"
              objectFit="contain"
            />
          </Box>

          {/* Tagline */}
          <VStack gap="4">
            <Text
              fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
              fontWeight="900"
              bg={`linear-gradient(to right, ${colors.accentOrange}, ${colors.accentBlue})`}
              bgClip="text"
              color="transparent"
              letterSpacing="-0.02em"
            >
              Echo Master League
            </Text>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color={colors.textMuted}
              maxW="2xl"
            >
              The Future of Competitive Echo VR
            </Text>
          </VStack>

          {/* Stats */}
          <HStack gap={{ base: '3', md: '8' }} flexWrap="wrap" justify="center" mt="6">
            {statBlocks.map(stat => (
              <Box
                key={stat.label}
                bg={`${colors.bgElevated}80`}
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor={colors.borderMedium}
                px={{ base: '4', md: '6' }}
                py={{ base: '3', md: '4' }}
                rounded="xl"
                textAlign="center"
                cursor="pointer"
                onClick={stat.onClick}
                transition="all 0.3s ease"
                _hover={{
                  transform: 'translateY(-4px)',
                  borderColor: colors.accentOrange,
                  boxShadow: `0 12px 24px ${colors.accentOrange}40`,
                  bg: `${colors.bgElevated}99`
                }}
              >
                <Text fontSize="2xl" fontWeight="800" color={colors.accentOrange}>{stat.value}</Text>
                <Text fontSize="sm" color={colors.textMuted}>{stat.label}</Text>
              </Box>
            ))}
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Hero;

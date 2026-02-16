import { Box, Container, VStack, Text, HStack, Center, Image } from '@chakra-ui/react';
import { Trophy, Zap } from 'lucide-react';
import { useTeams } from '../hooks/useTeams';
import { useMemo } from 'react';
import { emlColors } from '../theme/colors';

const Hero = ({ theme, onTeamsClick, onPlayersClick, onSubsClick }) => {
  const isDark = theme === 'dark';
  const { teams, loading } = useTeams();

  // Calculate real stats from live data
  const stats = useMemo(() => {
    if (loading || !teams || teams.length === 0) {
      return {
        activeTeams: '...',
        activePlayers: '...',
        leagueSubs: '...'
      };
    }

    const activeTeams = teams.filter(t => t.status === 'Active').length;

    // Count unique players (captain + co-captain + players array)
    const allPlayers = new Set();
    teams.forEach(team => {
      if (team.captain) allPlayers.add(team.captain);
      if (team.coCaptain) allPlayers.add(team.coCaptain);
      if (team.players) {
        team.players.forEach(player => {
          if (player) allPlayers.add(player);
        });
      }
    });

    const activePlayers = allPlayers.size;
    // Estimate subs as roughly 30% of active players
    const leagueSubs = Math.floor(activePlayers * 0.3);

    return {
      activeTeams: activeTeams.toString(),
      activePlayers: activePlayers.toString(),
      leagueSubs: leagueSubs > 0 ? leagueSubs.toString() : '...'
    };
  }, [teams, loading]);

  const statBlocks = [
    { label: 'Active Teams', value: stats.activeTeams, onClick: onTeamsClick },
    { label: 'Active Players', value: stats.activePlayers, onClick: onPlayersClick },
    { label: 'League Subs', value: stats.leagueSubs, onClick: onSubsClick }
  ];

  return (
    <Box
      position="relative"
      minH="70vh"
      bg={`linear-gradient(135deg, ${emlColors.bgPrimary} 0%, ${emlColors.bgSecondary} 50%, ${emlColors.bgTertiary} 100%)`}
      overflow="hidden"
    >
      {/* Animated background elements */}
      <Box position="absolute" top="10%" left="10%" w="300px" h="300px" bg={`${emlColors.accentOrange}20`} rounded="full" filter="blur(80px)" />
      <Box position="absolute" bottom="10%" right="10%" w="400px" h="400px" bg={`${emlColors.accentBlue}20`} rounded="full" filter="blur(100px)" />

      <Container maxW="6xl" py={{ base: '16', md: '24' }} position="relative" zIndex="1">
        <VStack gap="8" textAlign="center">
          {/* EML Logo */}
          <Box
            w="200px"
            h="200px"
            bg={`${emlColors.bgElevated}99`}
            backdropFilter="blur(20px)"
            border="3px solid"
            borderColor={emlColors.accentOrange}
            rounded="3xl"
            boxShadow={`0 8px 32px ${emlColors.accentOrange}66`}
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
              bgGradient={`linear(to-r, ${emlColors.accentOrange}, ${emlColors.accentBlue})`}
              bgClip="text"
              letterSpacing="-0.02em"
            >
              Echo Master League
            </Text>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color={emlColors.textMuted}
              maxW="2xl"
            >
              The Future of Competitive Echo VR
            </Text>
          </VStack>

          {/* Stats */}
          <HStack gap="8" flexWrap="wrap" justify="center" mt="6">
            {statBlocks.map(stat => (
              <Box
                key={stat.label}
                bg={`${emlColors.bgElevated}80`}
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor={emlColors.borderMedium}
                px="6"
                py="4"
                rounded="xl"
                textAlign="center"
                cursor="pointer"
                onClick={stat.onClick}
                transition="all 0.3s ease"
                _hover={{
                  transform: 'translateY(-4px)',
                  borderColor: emlColors.accentOrange,
                  boxShadow: `0 12px 24px ${emlColors.accentOrange}40`,
                  bg: `${emlColors.bgElevated}99`
                }}
              >
                <Text fontSize="2xl" fontWeight="800" color={emlColors.accentOrange}>{stat.value}</Text>
                <Text fontSize="sm" color={emlColors.textMuted}>{stat.label}</Text>
              </Box>
            ))}
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Hero;

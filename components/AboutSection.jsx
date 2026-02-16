import { Box, Container, VStack, Text, Grid, HStack, Center } from '@chakra-ui/react';
import { Target, Users, Trophy, Zap } from 'lucide-react';

const features = [
  { icon: Target, title: 'Competitive Excellence', desc: 'Elite tournaments with professional-grade competition and fair play standards.' },
  { icon: Users, title: 'Thriving Community', desc: 'Join thousands of passionate players in the fastest-growing VR esports scene.' },
  { icon: Trophy, title: 'Champion Recognition', desc: 'Earn your place among the best players and teams in competitive Echo VR.' },
  { icon: Zap, title: 'Cutting Edge', desc: 'Experience the future of competitive gaming with advanced VR technology.' }
];

const AboutSection = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <Box id="about" py="20" bg={isDark ? 'gray.950' : 'gray.50'}>
      <Container maxW="6xl">
        <VStack gap="12">
          <VStack gap="4" textAlign="center">
            <Text fontSize="sm" fontWeight="700" color={isDark ? 'orange.400' : 'blue.600'} textTransform="uppercase" letterSpacing="wider">About EML</Text>
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={isDark ? 'white' : 'gray.900'}>
              The Premier Echo VR League
            </Text>
            <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="700" color={isDark ? 'orange.400' : 'blue.600'}>
              Season 4
            </Text>
            <Text fontSize="lg" color={isDark ? 'gray.400' : 'gray.600'} maxW="3xl">
              Echo Master League is the premier competitive Echo Arena league and runs multiple MMR-based tournaments per year.
            </Text>
            <Text fontSize="md" color={isDark ? 'gray.500' : 'gray.600'} maxW="3xl">
              Founded by players, for players, EML is a community-driven competitive platform dedicated to fostering 
              the highest level of Echo VR gameplay.
            </Text>
          </VStack>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="6" w="full">
            {features.map(feature => (
              <Box
                key={feature.title}
                bg={isDark ? 'whiteAlpha.50' : 'white'}
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor={isDark ? 'whiteAlpha.100' : 'blackAlpha.100'}
                p="6"
                rounded="2xl"
                _hover={{
                  transform: 'translateY(-4px)',
                  borderColor: isDark ? 'orange.500' : 'blue.500',
                  boxShadow: isDark ? '0 8px 24px rgba(251, 146, 60, 0.2)' : '0 8px 24px rgba(59, 130, 246, 0.2)'
                }}
                transition="all 0.3s"
              >
                <HStack gap="4" align="start">
                  <Center
                    w="12"
                    h="12"
                    bg={isDark ? 'orange.500/20' : 'blue.500/20'}
                    rounded="xl"
                    flexShrink={0}
                  >
                    <feature.icon size={24} color={isDark ? '#fb923c' : '#3b82f6'} />
                  </Center>
                  <VStack align="start" gap="2">
                    <Text fontSize="lg" fontWeight="700" color={isDark ? 'white' : 'gray.900'}>{feature.title}</Text>
                    <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>{feature.desc}</Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default AboutSection;

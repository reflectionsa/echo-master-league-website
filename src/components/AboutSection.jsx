import { Box, Container, VStack, Text, Grid, HStack, Center } from '@chakra-ui/react';
import { Target, Users, Trophy, Zap } from 'lucide-react';
import { emlColors } from '../theme/colors';

const features = [
  { icon: Target, title: 'Competitive Excellence', desc: 'Elite tournaments with professional-grade competition and fair play standards.' },
  { icon: Users, title: 'Thriving Community', desc: 'Join thousands of passionate players in the fastest-growing VR esports scene.' },
  { icon: Trophy, title: 'Champion Recognition', desc: 'Earn your place among the best players and teams in competitive Echo VR.' },
  { icon: Zap, title: 'Cutting Edge', desc: 'Experience the future of competitive gaming with advanced VR technology.' }
];

const AboutSection = ({ theme }) => {
  return (
    <Box id="about" py="20" bg={emlColors.bgPrimary}>
      <Container maxW="6xl">
        <VStack gap="12">
          <VStack gap="4" textAlign="center">
            <Text fontSize="sm" fontWeight="700" color={emlColors.accentOrange} textTransform="uppercase" letterSpacing="wider">About EML</Text>
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={emlColors.textPrimary}>
              The Premier Echo VR League
            </Text>
            <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="700" color={emlColors.accentOrange}>
              Season 4
            </Text>
            <Text fontSize="lg" color={emlColors.textMuted} maxW="3xl">
              Echo Master League is the premier competitive Echo Arena league and runs multiple MMR-based tournaments per year.
            </Text>
            <Text fontSize="md" color={emlColors.textMuted} maxW="3xl">
              Founded by players, for players, EML is a community-driven competitive platform dedicated to fostering
              the highest level of Echo VR gameplay.
            </Text>
          </VStack>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="6" w="full">
            {features.map(feature => (
              <Box
                key={feature.title}
                bg={emlColors.bgElevated}
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor={emlColors.borderMedium}
                p="6"
                rounded="2xl"
                _hover={{
                  transform: 'translateY(-4px)',
                  borderColor: emlColors.accentOrange,
                  boxShadow: `0 8px 24px ${emlColors.accentOrange}33`
                }}
                transition="all 0.3s"
              >
                <HStack gap="4" align="start">
                  <Center
                    w="12"
                    h="12"
                    bg={`${emlColors.accentOrange}33`}
                    rounded="xl"
                    flexShrink={0}
                  >
                    <feature.icon size={24} color={emlColors.accentOrange} />
                  </Center>
                  <VStack align="start" gap="2">
                    <Text fontSize="lg" fontWeight="700" color={emlColors.textPrimary}>{feature.title}</Text>
                    <Text fontSize="sm" color={emlColors.textMuted}>{feature.desc}</Text>
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

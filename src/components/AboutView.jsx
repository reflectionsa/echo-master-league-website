import { Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Grid, Heading } from '@chakra-ui/react';
import { Info, Users, Trophy, Zap, Target } from 'lucide-react';
import { getThemedColors } from '../theme/colors';

const AboutView = ({ theme, open, onClose }) => {
  const emlColors = getThemedColors(theme);

  const features = [
    { icon: Target, title: 'Competitive Excellence', desc: 'Face the best teams in structured tournaments with professional casters' },
    { icon: Users, title: 'Community Driven', desc: 'Founded by players, for players. Your feedback shapes the league' },
    { icon: Trophy, title: 'Champion Recognition', desc: 'Earn prestige and rank among the best Echo VR players' },
    { icon: Zap, title: 'Cutting-Edge VR', desc: 'Experience competitive VR esports at its finest' }
  ];

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="lg">
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.700" backdropFilter="blur(10px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="900px"
            maxH="90vh"
            bg={emlColors.bgPrimary}
            border="1px solid"
            borderColor={emlColors.borderMedium}
            rounded="2xl"
            overflow="hidden"
          >
            <Dialog.Header bg={`${emlColors.bgPrimary}dd`} borderBottom="1px solid" borderColor={emlColors.borderMedium}>
              <HStack justify="space-between">
                <HStack gap="2">
                  <Info size={24} color={emlColors.accentOrange} />
                  <Dialog.Title fontSize="2xl" fontWeight="800" color={emlColors.textPrimary}>
                    About EML
                  </Dialog.Title>
                </HStack>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="lg" />
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>
            <Dialog.Body p="6" overflowY="auto">
              <VStack align="stretch" gap="8">
                <VStack align="center" gap="4" textAlign="center">
                  <Heading fontSize={{ base: '3xl', md: '4xl' }} fontWeight="900" color={emlColors.textPrimary}>
                    Season 4
                  </Heading>
                  <Text fontSize="lg" color={emlColors.textMuted} maxW="600px">
                    Echo Master League is the premier competitive Echo Arena league and runs multiple MMR-based tournaments per year.
                  </Text>
                  <Text fontSize="md" color={emlColors.textMuted} maxW="600px">
                    Founded by players, for players. We're building the most competitive VR esports experience.
                  </Text>
                </VStack>

                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="6">
                  {features.map((feature, idx) => (
                    <Box
                      key={idx}
                      bg={emlColors.bgElevated}
                      p="6"
                      rounded="2xl"
                      border="1px solid"
                      borderColor={emlColors.borderMedium}
                      _hover={{ transform: 'translateY(-4px)', borderColor: emlColors.accentOrange }}
                      transition="all 0.3s"
                    >
                      <VStack align="start" gap="3">
                        <Box p="3" bg={`${emlColors.accentOrange}1a`} rounded="xl">
                          <feature.icon size={24} color={emlColors.accentOrange} />
                        </Box>
                        <Text fontSize="lg" fontWeight="700" color={emlColors.textPrimary}>
                          {feature.title}
                        </Text>
                        <Text fontSize="sm" color={emlColors.textMuted} lineHeight="1.6">
                          {feature.desc}
                        </Text>
                      </VStack>
                    </Box>
                  ))}
                </Grid>
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default AboutView;

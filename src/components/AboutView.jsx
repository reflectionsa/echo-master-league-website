import { Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Grid, Heading } from '@chakra-ui/react';
import { Info, Users, Trophy, Zap, Target } from 'lucide-react';

const AboutView = ({ theme, open, onClose }) => {
  const isDark = theme === 'dark';

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
            bg={isDark ? 'gray.900' : 'white'}
            border="1px solid"
            borderColor={isDark ? 'gray.700' : 'gray.200'}
            rounded="2xl"
            overflow="hidden"
          >
            <Dialog.Header bg={isDark ? 'gray.850' : 'gray.50'} borderBottom="1px solid" borderColor={isDark ? 'gray.700' : 'gray.200'}>
              <HStack justify="space-between">
                <HStack gap="2">
                  <Info size={24} color={isDark ? 'var(--chakra-colors-orange-400)' : 'var(--chakra-colors-blue-600)'} />
                  <Dialog.Title fontSize="2xl" fontWeight="800" color={isDark ? 'white' : 'gray.900'}>
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
                  <Heading fontSize={{ base: '3xl', md: '4xl' }} fontWeight="900" color={isDark ? 'white' : 'gray.900'}>
                    Season 4
                  </Heading>
                  <Text fontSize="lg" color={isDark ? 'gray.400' : 'gray.600'} maxW="600px">
                    Echo Master League is the premier competitive Echo Arena league and runs multiple MMR-based tournaments per year.
                  </Text>
                  <Text fontSize="md" color={isDark ? 'gray.500' : 'gray.600'} maxW="600px">
                    Founded by players, for players. We're building the most competitive VR esports experience.
                  </Text>
                </VStack>

                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="6">
                  {features.map((feature, idx) => (
                    <Box
                      key={idx}
                      bg={isDark ? 'whiteAlpha.50' : 'white'}
                      p="6"
                      rounded="2xl"
                      border="1px solid"
                      borderColor={isDark ? 'whiteAlpha.100' : 'blackAlpha.100'}
                      _hover={{ transform: 'translateY(-4px)', borderColor: isDark ? 'orange.500' : 'blue.500' }}
                      transition="all 0.3s"
                    >
                      <VStack align="start" gap="3">
                        <Box p="3" bg={isDark ? 'orange.500/10' : 'blue.500/10'} rounded="xl">
                          <feature.icon size={24} color={isDark ? '#fb923c' : '#3b82f6'} />
                        </Box>
                        <Text fontSize="lg" fontWeight="700" color={isDark ? 'white' : 'gray.900'}>
                          {feature.title}
                        </Text>
                        <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'} lineHeight="1.6">
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

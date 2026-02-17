import { Box, Container, VStack, Text, Button, HStack, Grid, Center } from '@chakra-ui/react';
import { Users, Gamepad2, ArrowRight, Zap } from 'lucide-react';
import { emlColors } from '../theme/colors';

const EchoVRLoungeSection = ({ theme }) => {
  return (
    <Box id="lounge" py="20" bg={emlColors.bgPrimary}>
      <Container maxW="6xl">
        <VStack gap="12">
          <VStack gap="4" textAlign="center">
            <HStack gap="2" justify="center">
              <Gamepad2 size={20} color={emlColors.accentOrange} />
              <Text fontSize="sm" fontWeight="700" color={emlColors.accentOrange} textTransform="uppercase" letterSpacing="wider">
                Echo VR Community
              </Text>
            </HStack>
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={emlColors.textPrimary}>
              Join the Echo VR Lounge
            </Text>
            <Text fontSize="lg" color={emlColors.textMuted} maxW="3xl">
              The main community server where Echo VR comes alive. Connect with thousands of players,
              find teammates, and access everything you need to play Echo VR.
            </Text>
          </VStack>

          <Box
            w="full"
            bg="linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)"
            p={{ base: '8', md: '12' }}
            rounded="3xl"
            position="relative"
            overflow="hidden"
          >
            <Box position="absolute" top="-10%" left="-5%" w="400px" h="400px" bg="whiteAlpha.200" rounded="full" filter="blur(100px)" />
            <Box position="absolute" bottom="-10%" right="-5%" w="350px" h="350px" bg="whiteAlpha.300" rounded="full" filter="blur(100px)" />

            <VStack gap="8" position="relative" zIndex="1">
              <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="6" w="full">
                {[
                  { icon: Users, label: 'Active Community', desc: '10,000+ players online daily' },
                  { icon: Gamepad2, label: 'Play Echo VR', desc: 'Find matches and teammates' },
                  { icon: Zap, label: 'Live Support', desc: 'Help and resources 24/7' }
                ].map(item => (
                  <VStack key={item.label} gap="3" textAlign="center">
                    <Center w="14" h="14" bg="whiteAlpha.200" backdropFilter="blur(10px)" rounded="2xl">
                      <item.icon size={28} color="white" />
                    </Center>
                    <VStack gap="1">
                      <Text fontSize="lg" fontWeight="700" color="white">{item.label}</Text>
                      <Text fontSize="sm" color="whiteAlpha.800">{item.desc}</Text>
                    </VStack>
                  </VStack>
                ))}
              </Grid>

              <VStack gap="4" mt="4">
                <Text fontSize="xl" fontWeight="700" color="white" textAlign="center">
                  Ready to Play?
                </Text>
                <Button
                  size="lg"
                  bg="white"
                  color="purple.600"
                  _hover={{ transform: 'scale(1.05)', boxShadow: '2xl' }}
                  transition="all 0.2s"
                  onClick={() => window.open('https://discord.gg/yG6speErHC', '_blank')}
                >
                  <Users size={20} />
                  Join Echo VR Lounge
                  <ArrowRight size={20} />
                </Button>
                <Text fontSize="sm" color="whiteAlpha.800">
                  Required to participate in EML matches
                </Text>
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default EchoVRLoungeSection;

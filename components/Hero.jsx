import { Box, Container, VStack, Text, HStack, Center, Image } from '@chakra-ui/react';
import { Trophy, Zap } from 'lucide-react';

const Hero = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <Box
      position="relative"
      minH="70vh"
      bg={isDark 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)'
        : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)'
      }
      overflow="hidden"
    >
      {/* Animated background elements */}
      <Box position="absolute" top="10%" left="10%" w="300px" h="300px" bg={isDark ? 'orange.500/10' : 'blue.500/10'} rounded="full" filter="blur(80px)" />
      <Box position="absolute" bottom="10%" right="10%" w="400px" h="400px" bg={isDark ? 'blue.500/10' : 'orange.500/10'} rounded="full" filter="blur(100px)" />

      <Container maxW="6xl" py={{ base: '16', md: '24' }} position="relative" zIndex="1">
        <VStack gap="8" textAlign="center">
          {/* EML Logo */}
          <Box
            w="200px"
            h="200px"
            bg={isDark ? 'whiteAlpha.100' : 'blackAlpha.100'}
            backdropFilter="blur(20px)"
            border="3px solid"
            borderColor={isDark ? 'orange.400' : 'blue.500'}
            rounded="3xl"
            boxShadow={isDark ? '0 8px 32px rgba(251, 146, 60, 0.4)' : '0 8px 32px rgba(59, 130, 246, 0.4)'}
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
              bgGradient={isDark ? 'to-r' : 'to-r'}
              gradientFrom={isDark ? 'orange.300' : 'blue.600'}
              gradientTo={isDark ? 'blue.400' : 'orange.500'}
              bgClip="text"
              letterSpacing="-0.02em"
            >
              Echo Master League
            </Text>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color={isDark ? 'gray.400' : 'gray.600'}
              maxW="2xl"
            >
              The Future of Competitive Echo VR
            </Text>
          </VStack>

          {/* Stats */}
          <HStack gap="8" flexWrap="wrap" justify="center" mt="6">
            {[
              { label: 'Active Teams', value: '50+' },
              { label: 'Active Players', value: '400+' },
              { label: 'League Subs', value: '150+' }
            ].map(stat => (
              <Box
                key={stat.label}
                bg={isDark ? 'whiteAlpha.100' : 'blackAlpha.100'}
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor={isDark ? 'whiteAlpha.200' : 'blackAlpha.200'}
                px="6"
                py="4"
                rounded="xl"
                textAlign="center"
              >
                <Text fontSize="2xl" fontWeight="800" color={isDark ? 'orange.300' : 'blue.600'}>{stat.value}</Text>
                <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>{stat.label}</Text>
              </Box>
            ))}
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Hero;

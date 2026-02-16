import { Box, Container, VStack, Text, Button, HStack } from '@chakra-ui/react';
import { UserPlus, ArrowRight } from 'lucide-react';

const JoinSection = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <Box id="join" py="20" bg={isDark ? 'gray.900' : 'white'}>
      <Container maxW="4xl">
        <Box
          bg={isDark ? 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'}
          p={{ base: '10', md: '16' }}
          rounded="3xl"
          textAlign="center"
          position="relative"
          overflow="hidden"
        >
          <Box position="absolute" top="0" right="0" w="300px" h="300px" bg="whiteAlpha.200" rounded="full" filter="blur(80px)" />
          
          <VStack gap="6" position="relative" zIndex="1">
            <UserPlus size={48} color="white" />
            <Text fontSize={{ base: '3xl', md: '4xl' }} fontWeight="900" color="white" letterSpacing="-0.02em">
              Ready to Compete?
            </Text>
            <Text fontSize="lg" color="whiteAlpha.900" maxW="2xl">
              Join Echo Master League today and start your journey to becoming a champion. 
              Register your team and compete in professional tournaments.
            </Text>
            <HStack gap="4" flexWrap="wrap" justify="center">
              <Button
                size="lg"
                bg="white"
                color={isDark ? 'orange.600' : 'blue.600'}
                _hover={{ transform: 'scale(1.05)', boxShadow: '2xl' }}
                transition="all 0.2s"
                onClick={() => window.open('https://discord.gg/YhKGzPhaUw', '_blank')}
              >
                <UserPlus size={20} />
                Join EML Now
                <ArrowRight size={20} />
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default JoinSection;

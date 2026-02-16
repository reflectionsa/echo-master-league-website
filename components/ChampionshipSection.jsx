import { Box, Container, VStack, Heading, Text } from '@chakra-ui/react';
import { Trophy } from 'lucide-react';

const ChampionshipSection = ({ theme, hidden = true }) => {
  const isDark = theme === 'dark';

  if (hidden) return null;

  return (
    <Box
      id="championship"
      py="20"
      bg={isDark ? 'gray.900' : 'white'}
      display={hidden ? 'none' : 'block'}
    >
      <Container maxW="6xl">
        <VStack gap="8" textAlign="center">
          <Trophy size={64} color={isDark ? 'var(--chakra-colors-orange-400)' : 'var(--chakra-colors-blue-600)'} />
          <Heading fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={isDark ? 'white' : 'gray.900'}>
            Championship
          </Heading>
          <Text color={isDark ? 'gray.400' : 'gray.600'} maxW="2xl">
            Championship content coming soon
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default ChampionshipSection;

import { Box, Container, VStack, Heading, Text } from '@chakra-ui/react';
import { Trophy } from 'lucide-react';
import { emlColors } from '../theme/colors';

const ChampionshipSection = ({ theme, hidden = true }) => {
  if (hidden) return null;

  return (
    <Box
      id="championship"
      py="20"
      bg={emlColors.bgPrimary}
      display={hidden ? 'none' : 'block'}
    >
      <Container maxW="6xl">
        <VStack gap="8" textAlign="center">
          <Trophy size={64} color={emlColors.accentOrange} />
          <Heading fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={emlColors.textPrimary}>
            Championship
          </Heading>
          <Text color={emlColors.textMuted} maxW="2xl">
            Championship content coming soon
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default ChampionshipSection;

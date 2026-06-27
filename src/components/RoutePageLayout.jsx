import { Box } from '@chakra-ui/react';

const RoutePageLayout = ({ children }) => (
  <Box w="full" px={{ base: '3', md: '6' }} py={{ base: '4', md: '6' }}>
    <Box
      minH={{ base: 'calc(100vh - 144px)', md: 'calc(100vh - 116px)' }}
      display="flex"
      flexDirection="column"
    >
      {children}
    </Box>
  </Box>
);

export default RoutePageLayout;

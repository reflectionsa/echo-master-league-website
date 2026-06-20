import { Box } from '@chakra-ui/react';

const RoutePageLayout = ({ children, maxW = '1200px', ...surfaceProps }) => (
  <Box maxW={maxW} w="full" mx="auto" px={{ base: '4', md: '6' }} py={{ base: '6', md: '8' }}>
    <Box
      minH={{ base: 'calc(100vh - 144px)', md: 'calc(100vh - 116px)' }}
      display="flex"
      flexDirection="column"
      {...surfaceProps}
    >
      {children}
    </Box>
  </Box>
);

export default RoutePageLayout;

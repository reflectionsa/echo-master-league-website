import { useLocation } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

// Fades route content in on each navigation for a smoother feel.
// Reuses the `fadeIn` keyframe already defined in the app's CSS.
const PageTransition = ({ children }) => {
  const { pathname } = useLocation();
  return (
    <Box key={pathname} style={{ animation: 'fadeIn 0.22s ease' }}>
      {children}
    </Box>
  );
};

export default PageTransition;

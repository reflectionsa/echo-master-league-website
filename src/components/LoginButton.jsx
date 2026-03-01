import { Button, Spinner, Tooltip } from '@chakra-ui/react';
import { LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const DISCORD_BLURPLE = '#5865F2';

const LoginButton = ({ size = 'sm' }) => {
  const { login, loading, error } = useAuth();

  if (error) {
    return (
      <Tooltip content={error} placement="bottom">
        <Button
          size={size}
          disabled
          bg="red.600"
          color="white"
          _hover={{ bg: 'red.700' }}
          fontWeight="600"
          gap="2"
          cursor="not-allowed"
        >
          <AlertCircle size={14} />
          Login unavailable
        </Button>
      </Tooltip>
    );
  }

  return (
    <Button
      size={size}
      onClick={login}
      disabled={loading}
      bg={DISCORD_BLURPLE}
      color="white"
      _hover={{ bg: '#4752C4', transform: 'translateY(-1px)' }}
      _active={{ bg: '#3C45A5' }}
      transition="all 0.15s ease"
      fontWeight="600"
      gap="2"
    >
      {loading ? <Spinner size="xs" color="white" /> : <LogIn size={14} />}
      {loading ? 'Signing in...' : 'Login with Discord'}
    </Button>
  );
};

export default LoginButton;

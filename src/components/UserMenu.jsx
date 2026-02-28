import { Box, Button, Menu, Portal, HStack, VStack, Text, Badge, Image } from '@chakra-ui/react';
import { ChevronDown, LogOut, Shield, Mic2, User, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getThemedColors } from '../theme/colors';

const ROLE_CONFIG = {
  admin: { label: 'Admin', colorPalette: 'red', Icon: Shield },
  mod: { label: 'Mod', colorPalette: 'purple', Icon: Shield },
  caster: { label: 'Caster', colorPalette: 'orange', Icon: Mic2 },
  player: { label: 'Player', colorPalette: 'blue', Icon: Users },
  viewer: { label: 'Viewer', colorPalette: 'gray', Icon: User },
};

const UserMenu = ({ theme, onProductionSignupClick, onAdminPanelClick }) => {
  const { user, logout, isAdmin, isMod, isCaster } = useAuth();
  const colors = getThemedColors(theme);

  if (!user) return null;

  const role = ROLE_CONFIG[user.appRole] || ROLE_CONFIG.viewer;
  const { Icon } = role;

  const handleSelect = (details) => {
    if (details.value === 'production-signup') onProductionSignupClick?.();
    if (details.value === 'admin-panel') onAdminPanelClick?.();
    if (details.value === 'logout') logout();
  };

  return (
    <Menu.Root positioning={{ placement: 'bottom-end' }} onSelect={handleSelect}>
      <Menu.Trigger asChild>
        <Button
          size="sm"
          variant="ghost"
          bg={`${colors.bgElevated}80`}
          border="1px solid"
          borderColor={colors.borderMedium}
          _hover={{ bg: colors.bgHover, borderColor: '#5865F2' }}
          gap="2"
          px="2"
          h="9"
        >
          {/* Discord Avatar */}
          <Box w="6" h="6" rounded="full" overflow="hidden" flexShrink={0}>
            <Image
              src={user.avatar}
              alt={user.username}
              w="full"
              h="full"
              objectFit="cover"
            />
          </Box>
          <Text
            fontSize="sm"
            fontWeight="600"
            color={colors.textPrimary}
            display={{ base: 'none', md: 'block' }}
            maxW="120px"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {user.globalName || user.username}
          </Text>
          <Badge
            colorPalette={role.colorPalette}
            size="xs"
            display={{ base: 'none', sm: 'flex' }}
          >
            {role.label}
          </Badge>
          <ChevronDown size={12} color={colors.textMuted} />
        </Button>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content
            minW="220px"
            bg={colors.bgSecondary}
            border="1px solid"
            borderColor={colors.borderMedium}
            rounded="xl"
            boxShadow="2xl"
            p="2"
          >
            {/* User info header (not a clickable item) */}
            <Box px="3" py="3" mb="1">
              <HStack gap="3">
                <Box w="10" h="10" rounded="full" overflow="hidden" flexShrink={0}>
                  <Image src={user.avatar} alt={user.username} w="full" h="full" objectFit="cover" />
                </Box>
                <VStack align="start" gap="0">
                  <Text fontSize="sm" fontWeight="700" color={colors.textPrimary} lineClamp={1}>
                    {user.globalName || user.username}
                  </Text>
                  <Text fontSize="xs" color={colors.textMuted}>@{user.username}</Text>
                </VStack>
              </HStack>
              <HStack mt="2" gap="1">
                <Icon size={12} color={colors.textMuted} />
                <Badge colorPalette={role.colorPalette} size="xs">{role.label}</Badge>
              </HStack>
            </Box>

            <Menu.Separator borderColor={colors.borderMedium} mb="1" />

            {/* Caster-only: Production Signup */}
            {isCaster && (
              <Menu.Item
                value="production-signup"
                rounded="lg"
                color={colors.accentOrange}
                _hover={{ bg: colors.bgHover }}
                cursor="pointer"
              >
                <HStack gap="2">
                  <Mic2 size={14} />
                  <Text fontSize="sm">Production Signup</Text>
                </HStack>
              </Menu.Item>
            )}

            {/* Admin / Mod: Admin Panel */}
            {(isAdmin || isMod) && (
              <Menu.Item
                value="admin-panel"
                rounded="lg"
                color={colors.accentPurple}
                _hover={{ bg: colors.bgHover }}
                cursor="pointer"
              >
                <HStack gap="2">
                  <Shield size={14} />
                  <Text fontSize="sm">Admin Panel</Text>
                </HStack>
              </Menu.Item>
            )}

            {(isCaster || isAdmin || isMod) && (
              <Menu.Separator borderColor={colors.borderMedium} my="1" />
            )}

            {/* Sign Out */}
            <Menu.Item
              value="logout"
              rounded="lg"
              color={colors.textSecondary}
              _hover={{ bg: `${colors.accentRose}20`, color: colors.accentRose }}
              cursor="pointer"
            >
              <HStack gap="2">
                <LogOut size={14} />
                <Text fontSize="sm">Sign Out</Text>
              </HStack>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default UserMenu;

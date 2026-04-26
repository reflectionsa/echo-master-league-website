import { Dialog, Portal, Box, VStack, HStack, Text, Button, CloseButton, Badge, Spinner } from '@chakra-ui/react';
import { Bell, Users, Swords, Trophy, Shield, Check, CheckCheck } from 'lucide-react';
import { getThemedColors } from '../theme/colors';
import { useNotifications } from '../hooks/useNotifications';

const TYPE_CONFIG = {
  team_invite: { icon: Users, color: '#00bfff', bg: 'rgba(0,191,255,0.1)', border: 'rgba(0,191,255,0.25)' },
  challenge: { icon: Swords, color: '#ff6b2b', bg: 'rgba(255,107,43,0.1)', border: 'rgba(255,107,43,0.25)' },
  challenge_response: { icon: Swords, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' },
  kicked: { icon: Shield, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' },
  team_disbanded: { icon: Trophy, color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)' },
  captain_transfer: { icon: Trophy, color: '#ffd700', bg: 'rgba(255,215,0,0.1)', border: 'rgba(255,215,0,0.25)' },
  invite_accepted: { icon: Users, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' },
  dispute: { icon: Shield, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' },
};

const getRelativeTime = (isoStr) => {
  const diff = Date.now() - new Date(isoStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const NotifItem = ({ notif, onMarkRead, colors }) => {
  const conf = TYPE_CONFIG[notif.type] || { icon: Bell, color: '#ff6b2b', bg: 'rgba(255,107,43,0.1)', border: 'rgba(255,107,43,0.25)' };
  const Icon = conf.icon;

  return (
    <Box
      bg={notif.read ? '#0d0d0d' : '#111111'}
      border="1px solid"
      borderColor={notif.read ? 'rgba(255,255,255,0.06)' : conf.border}
      rounded="xl"
      p="4"
      position="relative"
    >
      {!notif.read && <Box position="absolute" top="3" right="3" w="2" h="2" bg={conf.color} rounded="full" />}
      <HStack gap="3" align="start">
        <Box bg={conf.bg} border={`1px solid ${conf.border}`} p="2" rounded="lg" flexShrink="0">
          <Icon size={14} color={conf.color} />
        </Box>
        <VStack align="start" gap="0.5" flex="1">
          <Text fontSize="sm" fontWeight={notif.read ? '500' : '700'} color={notif.read ? 'rgba(255,255,255,0.6)' : colors.textPrimary}>{notif.title}</Text>
          <Text fontSize="xs" color={colors.textMuted} lineClamp={2}>{notif.body}</Text>
          <Text fontSize="2xs" color="rgba(255,255,255,0.3)" mt="0.5">{getRelativeTime(notif.createdAt)}</Text>
        </VStack>
        {!notif.read && (
          <Button size="xs" bg="transparent" color="rgba(255,255,255,0.3)" _hover={{ color: '#ff6b2b' }} p="1" onClick={() => onMarkRead([notif.id])}>
            <Check size={12} />
          </Button>
        )}
      </HStack>
    </Box>
  );
};

const NotificationsPanel = ({ open, onClose, theme }) => {
  const colors = getThemedColors(theme);
  const { notifications, loading, markRead, unreadCount } = useNotifications();

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="md">
      <Portal>
        <Dialog.Backdrop bg="rgba(0,0,0,0.75)" backdropFilter="blur(8px)" />
        <Dialog.Positioner>
          <Dialog.Content bg="#0d0d0d" border="1px solid rgba(255,255,255,0.1)" rounded="2xl" overflow="hidden" boxShadow="0 24px 80px rgba(0,0,0,0.6)" maxH="85vh" display="flex" flexDir="column">
            <Dialog.Header bg="#111111" borderBottom="1px solid rgba(255,255,255,0.08)" px="5" py="4">
              <HStack justify="space-between">
                <HStack gap="3">
                  <Box position="relative">
                    <Bell size={18} color="#ff6b2b" />
                    {unreadCount > 0 && (
                      <Box position="absolute" top="-1" right="-1" w="3.5" h="3.5" bg="#ff6b2b" rounded="full" display="flex" alignItems="center" justifyContent="center">
                        <Text fontSize="2xs" color="white" fontWeight="800" lineHeight="1">{Math.min(unreadCount, 9)}</Text>
                      </Box>
                    )}
                  </Box>
                  <Dialog.Title fontSize="md" fontWeight="800" color={colors.textPrimary}>Notifications</Dialog.Title>
                  {unreadCount > 0 && <Badge bg="rgba(255,107,43,0.15)" color="#ff6b2b" border="1px solid rgba(255,107,43,0.3)" fontSize="xs">{unreadCount} new</Badge>}
                </HStack>
                <HStack gap="2">
                  {unreadCount > 0 && (
                    <Button size="xs" bg="rgba(255,107,43,0.1)" border="1px solid rgba(255,107,43,0.25)" color="#ff6b2b" rounded="lg" fontWeight="700" onClick={() => markRead(null)}>
                      <CheckCheck size={12} /> Mark all read
                    </Button>
                  )}
                  <Dialog.CloseTrigger asChild><CloseButton size="sm" color={colors.textPrimary} _hover={{ color: colors.accentOrange }} /></Dialog.CloseTrigger>
                </HStack>
              </HStack>
            </Dialog.Header>

            <Dialog.Body flex="1" overflowY="auto" p="4">
              {loading && <HStack justify="center" py="8"><Spinner color="#ff6b2b" /></HStack>}
              {!loading && notifications.length === 0 && (
                <VStack gap="3" py="12" textAlign="center">
                  <Bell size={40} color="rgba(255,255,255,0.15)" />
                  <Text fontSize="sm" color={colors.textMuted}>No notifications yet</Text>
                </VStack>
              )}
              <VStack gap="2" align="stretch">
                {notifications.map(n => (
                  <NotifItem key={n.id} notif={n} onMarkRead={markRead} colors={colors} />
                ))}
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default NotificationsPanel;

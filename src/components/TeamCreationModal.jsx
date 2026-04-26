import { Dialog, Portal, Box, VStack, HStack, Text, Button, CloseButton, Input, Badge, Image } from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { Users, Image as ImageIcon, CheckCircle, AlertCircle, Upload, X } from 'lucide-react';
import { getThemedColors } from '../theme/colors';
import { useTeamManagement } from '../hooks/useTeamManagement';
import { emlApi } from '../hooks/useEmlApi';

const _slug = (s) => (s || '').replace(/\s+/g, '_').toLowerCase();

const readFile = (file, maxMb) => new Promise((resolve, reject) => {
  if (!['image/png', 'image/jpeg'].includes(file.type)) { reject(new Error('Only PNG and JPG allowed.')); return; }
  if (file.size > maxMb * 1024 * 1024) { reject(new Error(`File must be under ${maxMb} MB.`)); return; }
  const reader = new FileReader();
  reader.onload = (e) => resolve(e.target.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const REGIONS = ['NA', 'EU', 'OCE'];

const Field = ({ label, children }) => (
  <VStack align="start" gap="1.5" w="full">
    <Text fontSize="xs" fontWeight="700" color="rgba(255,255,255,0.5)" textTransform="uppercase" letterSpacing="wider">{label}</Text>
    {children}
  </VStack>
);

const inputStyle = {
  bg: '#111111',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'white',
  rounded: 'xl',
  _placeholder: { color: 'rgba(255,255,255,0.25)' },
  _focus: { borderColor: '#ff6b2b', outline: 'none' },
};

const TeamCreationModal = ({ open, onClose, theme, onCreated }) => {
  const colors = getThemedColors(theme);
  const { createTeam, loading, error } = useTeamManagement();
  const [form, setForm] = useState({ name: '', tag: '', region: 'NA', logoUrl: '', bannerUrl: '' });
  const [done, setDone] = useState(false);
  const [createdTeam, setCreatedTeam] = useState(null);
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const [fileError, setFileError] = useState(null);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const valid = form.name.trim().length >= 2 && form.tag.trim().length >= 2;

  const handleLogoFile = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    try { set('logoUrl', await readFile(file, 2)); setFileError(null); } catch (err) { setFileError(err.message); }
    e.target.value = '';
  };
  const handleBannerFile = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    try { set('bannerUrl', await readFile(file, 2)); setFileError(null); } catch (err) { setFileError(err.message); }
    e.target.value = '';
  };

  const handleCreate = async () => {
    if (!valid) return;
    try {
      const result = await createTeam(form);
      setCreatedTeam(result.team);
      // Save logo/banner to team assets KV so others see them
      if ((form.logoUrl || form.bannerUrl) && result.team?.name) {
        emlApi('POST', '/team/assets', {
          teamSlug: _slug(result.team.name),
          captainDiscordId: result.team.captainDiscordId,
          ...(form.logoUrl ? { logoUrl: form.logoUrl } : {}),
          ...(form.bannerUrl ? { bannerUrl: form.bannerUrl } : {}),
        }).catch(() => {});
      }
      setDone(true);
      onCreated?.(result.team);
    } catch { /* shown via error */ }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="lg">
      <Portal>
        <Dialog.Backdrop bg="rgba(0,0,0,0.85)" backdropFilter="blur(12px)" />
        <Dialog.Positioner>
          <Dialog.Content bg="#0d0d0d" border="1px solid rgba(255,107,43,0.3)" rounded="2xl" boxShadow="0 0 60px rgba(255,107,43,0.15)">
            <Dialog.Header bg="#111111" borderBottom="1px solid rgba(255,255,255,0.08)" px="6" py="4">
              <HStack justify="space-between">
                <HStack gap="3">
                  <Box bg="rgba(255,107,43,0.15)" border="1px solid rgba(255,107,43,0.3)" p="2" rounded="lg">
                    <Users size={18} color="#ff6b2b" />
                  </Box>
                  <VStack align="start" gap="0">
                    <Dialog.Title fontSize="md" fontWeight="800" color={colors.textPrimary}>Create Team</Dialog.Title>
                    <Text fontSize="xs" color={colors.textMuted}>You'll be set as Captain</Text>
                  </VStack>
                </HStack>
                <Dialog.CloseTrigger asChild><CloseButton size="sm" color={colors.textMuted} /></Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>

            <Dialog.Body p="6">
              {done ? (
                <VStack gap="4" py="8" textAlign="center">
                  <CheckCircle size={48} color="#22c55e" />
                  <Text fontSize="lg" fontWeight="700" color={colors.textPrimary}>Team Created!</Text>
                  <Box bg="rgba(34,197,94,0.1)" border="1px solid rgba(34,197,94,0.3)" rounded="xl" px="4" py="2">
                    <Text fontSize="sm" color="#22c55e" fontWeight="700">{createdTeam?.name} [{createdTeam?.tag}]</Text>
                  </Box>
                  <Text fontSize="xs" color={colors.textMuted}>Invite players from your team panel.</Text>
                </VStack>
              ) : (
                <VStack gap="4" align="stretch">
                  <HStack gap="3">
                    <Field label="Team Name">
                      <Input {...inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Echo Warriors" maxLength={32} />
                    </Field>
                    <Field label="Tag (2-4 chars)">
                      <Input {...inputStyle} value={form.tag} onChange={e => set('tag', e.target.value.toUpperCase())} placeholder="EW" maxLength={4} w="28" />
                    </Field>
                  </HStack>

                  <Field label="Region">
                    <HStack gap="2">
                      {REGIONS.map(r => (
                        <Button
                          key={r}
                          size="sm"
                          bg={form.region === r ? 'rgba(255,107,43,0.2)' : '#111111'}
                          border="1px solid"
                          borderColor={form.region === r ? 'rgba(255,107,43,0.5)' : 'rgba(255,255,255,0.1)'}
                          color={form.region === r ? '#ff6b2b' : colors.textMuted}
                          rounded="lg"
                          onClick={() => set('region', r)}
                          fontWeight="700"
                          _hover={{ borderColor: 'rgba(255,107,43,0.35)' }}
                        >{r}</Button>
                      ))}
                    </HStack>
                  </Field>

                  <Field label="Logo (optional)">
                    <HStack gap="2" align="center" w="full">
                      {form.logoUrl ? (
                        <Box w="10" h="10" rounded="lg" overflow="hidden" border="1px solid rgba(255,107,43,0.3)" flexShrink={0}>
                          <Image src={form.logoUrl} alt="logo preview" w="full" h="full" objectFit="contain" />
                        </Box>
                      ) : (
                        <Box w="10" h="10" bg="rgba(255,107,43,0.08)" border="1px solid rgba(255,107,43,0.2)" rounded="lg" display="flex" alignItems="center" justifyContent="center">
                          <ImageIcon size={16} color="#ff6b2b" />
                        </Box>
                      )}
                      <input ref={logoInputRef} type="file" accept=".png,.jpg,.jpeg" style={{ display: 'none' }} onChange={handleLogoFile} />
                      <Button size="sm" flex="1" bg="#111111" border="1px solid rgba(255,255,255,0.1)" color={colors.textMuted} rounded="lg"
                        onClick={() => logoInputRef.current?.click()}>
                        <Upload size={13} /> {form.logoUrl ? 'Change Logo' : 'Choose Logo'}
                      </Button>
                      {form.logoUrl && (
                        <Button size="sm" bg="rgba(239,68,68,0.1)" border="1px solid rgba(239,68,68,0.3)" color="#ef4444" rounded="lg"
                          onClick={() => set('logoUrl', '')} title="Reset logo">
                          <X size={13} />
                        </Button>
                      )}
                    </HStack>
                  </Field>

                  <Field label="Banner (optional)">
                    {form.bannerUrl && (
                      <Box mb="2" rounded="lg" overflow="hidden" border="1px solid rgba(255,107,43,0.2)" w="full" h="14">
                        <Image src={form.bannerUrl} alt="banner preview" w="full" h="full" objectFit="cover" />
                      </Box>
                    )}
                    <HStack gap="2" w="full">
                      <input ref={bannerInputRef} type="file" accept=".png,.jpg,.jpeg" style={{ display: 'none' }} onChange={handleBannerFile} />
                      <Button size="sm" flex="1" bg="#111111" border="1px solid rgba(255,255,255,0.1)" color={colors.textMuted} rounded="lg"
                        onClick={() => bannerInputRef.current?.click()}>
                        <Upload size={13} /> {form.bannerUrl ? 'Change Banner' : 'Choose Banner'}
                      </Button>
                      {form.bannerUrl && (
                        <Button size="sm" bg="rgba(239,68,68,0.1)" border="1px solid rgba(239,68,68,0.3)" color="#ef4444" rounded="lg"
                          onClick={() => set('bannerUrl', '')} title="Reset banner">
                          <X size={13} />
                        </Button>
                      )}
                    </HStack>
                  </Field>

                  {fileError && (
                    <HStack gap="2" bg="rgba(239,68,68,0.1)" border="1px solid rgba(239,68,68,0.3)" p="3" rounded="lg">
                      <AlertCircle size={14} color="#ef4444" />
                      <Text fontSize="xs" color="#ef4444">{fileError}</Text>
                    </HStack>
                  )}

                  {/* Preview strip */}
                  {(form.name || form.tag) && (
                    <Box bg="#111111" border="1px solid rgba(255,255,255,0.08)" rounded="xl" p="3">
                      <HStack gap="3">
                        <Box w="10" h="10" bg="rgba(255,107,43,0.15)" border="1px solid rgba(255,107,43,0.3)" rounded="lg" display="flex" alignItems="center" justifyContent="center">
                          {form.logoUrl ? (
                            <img src={form.logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} onError={e => e.target.style.display = 'none'} />
                          ) : (
                            <ImageIcon size={16} color="#ff6b2b" />
                          )}
                        </Box>
                        <VStack align="start" gap="0">
                          <Text fontSize="sm" fontWeight="800" color={colors.textPrimary} textTransform="uppercase">{form.name || 'Team Name'}</Text>
                          <HStack gap="1">
                            <Badge bg="rgba(255,107,43,0.15)" color="#ff6b2b" border="1px solid rgba(255,107,43,0.3)" fontSize="2xs" fontWeight="800">{form.tag || 'TAG'}</Badge>
                            <Badge bg="rgba(255,255,255,0.07)" color={colors.textMuted} fontSize="2xs">{form.region}</Badge>
                          </HStack>
                        </VStack>
                      </HStack>
                    </Box>
                  )}

                  {error && (
                    <HStack gap="2" bg="rgba(239,68,68,0.1)" border="1px solid rgba(239,68,68,0.3)" p="3" rounded="lg">
                      <AlertCircle size={14} color="#ef4444" />
                      <Text fontSize="xs" color="#ef4444">{error}</Text>
                    </HStack>
                  )}

                  <Button
                    bg="linear-gradient(135deg, #ff6b2b 0%, #ff8c42 100%)"
                    color="white"
                    fontWeight="700"
                    size="lg"
                    rounded="xl"
                    disabled={!valid || loading}
                    loading={loading}
                    onClick={handleCreate}
                    _hover={{ opacity: 0.9 }}
                    mt="2"
                  >
                    Create Team
                  </Button>
                </VStack>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default TeamCreationModal;

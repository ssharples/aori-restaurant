'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Settings, Clock, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useGroupSessionStore } from '@/stores/groupSession';
import { useCartStore } from '@/stores/cart';
import { GroupSessionSettings } from '@/types/menu';

interface GroupSessionCreatorProps {
  onSessionCreated?: (sessionId: string, shareLink: string) => void;
}

export default function GroupSessionCreator({ onSessionCreated }: GroupSessionCreatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hostName, setHostName] = useState('');
  const [sessionTitle, setSessionTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Advanced settings
  const [settings, setSettings] = useState<Partial<GroupSessionSettings>>({
    allowGuestEdits: true,
    requireHostApproval: false,
    autoExpireAfterHours: 24,
    maxOrdersPerPerson: undefined
  });

  const { createSession, currentSession } = useGroupSessionStore();
  const { enableGroupMode } = useCartStore();

  const handleCreateSession = async () => {
    if (!hostName.trim()) return;

    setIsCreating(true);
    try {
      const session = await createSession(hostName.trim(), settings);
      
      // Enable group mode in cart
      enableGroupMode();
      
      // Optional: Clear existing cart items to start fresh
      // clearCart();
      
      setIsOpen(false);
      onSessionCreated?.(session.id, session.shareableLink);
      
      // Reset form
      setHostName('');
      setSessionTitle('');
      setSettings({
        allowGuestEdits: true,
        requireHostApproval: false,
        autoExpireAfterHours: 24,
        maxOrdersPerPerson: undefined
      });
      
    } catch (error) {
      console.error('Failed to create session:', error);
      // TODO: Show error message to user
    } finally {
      setIsCreating(false);
    }
  };

  if (currentSession) {
    return null; // Don't show if already in a session
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-aori-green text-aori-green hover:bg-aori-green hover:text-white"
        >
          <Users className="w-4 h-4" />
          Start Group Order
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-aori-green" />
            Start a Group Order
          </DialogTitle>
          <DialogDescription>
            Create a shared ordering session where friends can add their items together
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Host Name */}
          <div className="space-y-2">
            <label htmlFor="hostName" className="text-sm font-medium">
              Your Name
            </label>
            <Input
              id="hostName"
              placeholder="Enter your name"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Session Title (Optional) */}
          <div className="space-y-2">
            <label htmlFor="sessionTitle" className="text-sm font-medium">
              Group Name (Optional)
            </label>
            <Input
              id="sessionTitle"
              placeholder="e.g., Office Lunch, Friend's Dinner"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Quick Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Allow guests to edit orders</label>
                <p className="text-xs text-muted-foreground">
                  Let participants modify their own items
                </p>
              </div>
              <Switch
                checked={settings.allowGuestEdits}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, allowGuestEdits: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Session expires in 24 hours</label>
                <p className="text-xs text-muted-foreground">
                  Automatically close after this time
                </p>
              </div>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Advanced Settings Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full text-muted-foreground"
          >
            <Settings className="w-4 h-4 mr-2" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
          </Button>

          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pt-2 border-t"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Require host approval</label>
                  <p className="text-xs text-muted-foreground">
                    You approve each item before it&apos;s added
                  </p>
                </div>
                <Switch
                  checked={settings.requireHostApproval}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, requireHostApproval: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="maxParticipants" className="text-sm font-medium">
                  Max participants (optional)
                </label>
                <Input
                  id="maxParticipants"
                  type="number"
                  placeholder="Unlimited"
                  min="2"
                  max="20"
                  value={settings.maxOrdersPerPerson || ''}
                  onChange={(e) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      maxOrdersPerPerson: e.target.value ? parseInt(e.target.value) : undefined 
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="expireHours" className="text-sm font-medium">
                  Auto-expire after (hours)
                </label>
                <Input
                  id="expireHours"
                  type="number"
                  min="1"
                  max="168"
                  value={settings.autoExpireAfterHours}
                  onChange={(e) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      autoExpireAfterHours: parseInt(e.target.value) || 24 
                    }))
                  }
                />
              </div>
            </motion.div>
          )}

          {/* Create Button */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSession}
              disabled={!hostName.trim() || isCreating}
              className="flex-1 bg-aori-green hover:bg-aori-green-dark text-white"
            >
              {isCreating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </>
              )}
            </Button>
          </div>

          {/* Info Card */}
          <Card className="bg-aori-green/5 border-aori-green/20">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-aori-green/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <UserPlus className="w-4 h-4 text-aori-green" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-aori-dark">How it works</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• You&apos;ll get a shareable link to send to friends</li>
                    <li>• Everyone can add items under their name</li>
                    <li>• See the group total and individual contributions</li>
                    <li>• Place one order for the entire group</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
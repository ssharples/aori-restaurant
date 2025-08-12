'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGroupSessionStore } from '@/stores/groupSession';

interface GuestNameModalProps {
  sessionId: string;
  isOpen: boolean;
  onClose: () => void;
  onJoinSuccess?: (participantName: string) => void;
}

export default function GuestNameModal({ 
  sessionId, 
  isOpen, 
  onClose, 
  onJoinSuccess 
}: GuestNameModalProps) {
  const [participantName, setParticipantName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  
  const { joinSession, currentSession } = useGroupSessionStore();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setParticipantName('');
      setError('');
      setIsJoining(false);
    }
  }, [isOpen]);

  const handleJoinSession = async () => {
    if (!participantName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (participantName.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      await joinSession(sessionId, participantName.trim());
      onJoinSuccess?.(participantName.trim());
      onClose();
    } catch (error: unknown) {
      console.error('Failed to join session:', error);
      setError(error.message || 'Failed to join group order. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isJoining && participantName.trim()) {
      handleJoinSession();
    }
  };

  // Don't show if already in a session
  if (currentSession) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-aori-green/10 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-aori-green" />
            </div>
            Join Group Order
          </DialogTitle>
          <DialogDescription>
            Enter your name to join this group order and start adding items
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Session Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-aori-cream/50 rounded-lg p-3 border border-aori-green/10"
          >
            <div className="flex items-center gap-2 text-sm text-aori-dark">
              <User className="w-4 h-4 text-aori-green" />
              <span>You&apos;re joining a group order session</span>
            </div>
          </motion.div>

          {/* Name Input */}
          <div className="space-y-2">
            <label htmlFor="participantName" className="text-sm font-medium text-gray-900">
              Your Name
            </label>
            <Input
              id="participantName"
              placeholder="Enter your name"
              value={participantName}
              onChange={(e) => {
                setParticipantName(e.target.value);
                setError(''); // Clear error when typing
              }}
              onKeyPress={handleKeyPress}
              className="w-full"
              autoFocus
              disabled={isJoining}
            />
            <p className="text-xs text-muted-foreground">
              This will be shown with your orders so others know who ordered what
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          {/* Join Button */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isJoining}
            >
              Cancel
            </Button>
            <Button
              onClick={handleJoinSession}
              disabled={!participantName.trim() || isJoining}
              className="flex-1 bg-aori-green hover:bg-aori-green-dark text-white"
            >
              {isJoining ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Joining...
                </div>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Join Group
                </>
              )}
            </Button>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-700 space-y-1">
                <p className="font-medium">What happens next:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>You&apos;ll be added to the group order</li>
                  <li>Browse the menu and add items under your name</li>
                  <li>See what others have ordered</li>
                  <li>The host will place the final order</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Crown, 
  Settings, 
  Clock, 
  UserMinus, 
  Share2, 
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useGroupSessionStore } from '@/stores/groupSession';
import { useCartStore } from '@/stores/cart';
import { GroupSessionStatus } from '@/types/menu';
import ShareSessionLink from '@/components/ShareSessionLink';

export default function GroupSessionManager() {
  const [showSettings, setShowSettings] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'end' | 'remove_participant' | 'clear_cart';
    data?: any;
  } | null>(null);

  const { 
    currentSession, 
    currentParticipant, 
    isHost,
    updateSessionStatus,
    removeParticipant,
    leaveSession
  } = useGroupSessionStore();

  const { items, clearCart, getTotal } = useCartStore();

  if (!currentSession) {
    return null;
  }

  const handleStatusChange = (status: GroupSessionStatus) => {
    updateSessionStatus(status);
  };

  const handleRemoveParticipant = (participantId: string) => {
    removeParticipant(participantId);
    setConfirmAction(null);
  };

  const handleEndSession = () => {
    updateSessionStatus('completed');
    setConfirmAction(null);
  };

  const getStatusIcon = (status: GroupSessionStatus) => {
    switch (status) {
      case 'active':
      case 'ordering':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'checkout':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
      case 'cancelled':
      case 'expired':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: GroupSessionStatus) => {
    switch (status) {
      case 'active':
      case 'ordering':
        return 'bg-green-100 text-green-800';
      case 'checkout':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const timeLeft = expiresAt.getTime() - now.getTime();
    
    if (timeLeft <= 0) return 'Expired';
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''} left`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    } else {
      return `${minutes}m left`;
    }
  };

  return (
    <>
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="w-4 h-4" />
            Manage Session
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-aori-green" />
              Group Session Management
            </DialogTitle>
            <DialogDescription>
              {isHost ? 'Manage your group ordering session' : 'View session details'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Session Info */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Session Details</CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(currentSession.status)}
                    <Badge className={getStatusColor(currentSession.status)}>
                      {currentSession.status.charAt(0).toUpperCase() + currentSession.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Host</p>
                    <p className="text-sm text-muted-foreground">{currentSession.hostName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Participants</p>
                    <p className="text-sm text-muted-foreground">
                      {currentSession.participants.length} member{currentSession.participants.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Items Ordered</p>
                    <p className="text-sm text-muted-foreground">
                      {items.length} item{items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Total Amount</p>
                    <p className="text-sm font-semibold text-aori-green">
                      £{getTotal().toFixed(2)}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm font-medium mb-1">Session Expires</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {formatTimeRemaining(new Date(currentSession.expiresAt))}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Participants */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Participants ({currentSession.participants.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentSession.participants.map((participant) => {
                    const participantItems = items.filter(item => item.participantId === participant.id);
                    const subtotal = participantItems.reduce((sum, item) => {
                      const price = item.variant?.price || item.menuItem.price;
                      return sum + (price * item.quantity);
                    }, 0);
                    const itemCount = participantItems.reduce((sum, item) => sum + item.quantity, 0);

                    return (
                      <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: participant.color || '#6B7C5F' }}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{participant.name}</p>
                              {participant.isHost && (
                                <Badge variant="secondary" className="text-xs">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Host
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {itemCount} item{itemCount !== 1 ? 's' : ''} • £{subtotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        {isHost && !participant.isHost && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmAction({
                              type: 'remove_participant',
                              data: participant
                            })}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <UserMinus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Share Session (Host Only) */}
            {isHost && (
              <ShareSessionLink
                sessionId={currentSession.id}
                shareableLink={currentSession.shareableLink}
                hostName={currentSession.hostName}
                participantCount={currentSession.participants.length}
              />
            )}

            {/* Host Actions */}
            {isHost && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Session Actions</CardTitle>
                  <CardDescription>
                    Manage your group ordering session
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange('checkout')}
                      disabled={currentSession.status === 'checkout' || currentSession.status === 'completed'}
                      className="justify-start"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Move to Checkout
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setConfirmAction({ type: 'end' })}
                      disabled={currentSession.status === 'completed'}
                      className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      End Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Leave Session (Non-Host) */}
            {!isHost && (
              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-700">Leave Session</CardTitle>
                  <CardDescription>
                    You can leave this group order at any time. Your items will be removed.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    onClick={leaveSession}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    Leave Group Order
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialogs */}
      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction?.type === 'end' && 'End Session'}
              {confirmAction?.type === 'remove_participant' && 'Remove Participant'}
              {confirmAction?.type === 'clear_cart' && 'Clear Cart'}
            </DialogTitle>
            <DialogDescription>
              {confirmAction?.type === 'end' && 
                'Are you sure you want to end this group session? This action cannot be undone.'
              }
              {confirmAction?.type === 'remove_participant' && 
                `Remove ${confirmAction.data?.name} from the group session? Their items will be removed from the cart.`
              }
              {confirmAction?.type === 'clear_cart' && 
                'Are you sure you want to clear all items from the cart? This will remove everyone\'s orders.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setConfirmAction(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmAction?.type === 'end') handleEndSession();
                if (confirmAction?.type === 'remove_participant') {
                  handleRemoveParticipant(confirmAction.data.id);
                }
                if (confirmAction?.type === 'clear_cart') {
                  clearCart();
                  setConfirmAction(null);
                }
              }}
            >
              {confirmAction?.type === 'end' && 'End Session'}
              {confirmAction?.type === 'remove_participant' && 'Remove'}
              {confirmAction?.type === 'clear_cart' && 'Clear Cart'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
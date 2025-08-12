'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Clock, User, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import GuestNameModal from '@/components/GuestNameModal';
import { useGroupSessionStore } from '@/stores/groupSession';
import { useCartStore } from '@/stores/cart';
import { GroupSession } from '@/types/menu';
import Link from 'next/link';

export default function JoinGroupSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  
  const [sessionData, setSessionData] = useState<GroupSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);

  const { currentSession, currentParticipant } = useGroupSessionStore();
  const { enableGroupMode } = useCartStore();

  // Fetch session data
  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/group-sessions/${sessionId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Group order not found. It may have expired or been cancelled.');
          } else if (response.status === 410) {
            setError('This group order has expired.');
          } else {
            setError('Failed to load group order. Please try again.');
          }
          return;
        }
        
        const session = await response.json();
        setSessionData(session);
        
        // If user is already in this session, redirect to menu
        if (currentSession?.id === sessionId && currentParticipant) {
          router.push('/menu');
          return;
        }
        
        // Auto-show name modal if session is found and active
        if (session.status === 'active' || session.status === 'ordering') {
          setShowNameModal(true);
        }
        
      } catch (err) {
        console.error('Error fetching session:', err);
        setError('Failed to load group order. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, currentSession, currentParticipant, router]);

  const handleJoinSuccess = () => {
    setJoinSuccess(true);
    setShowNameModal(false);
    
    // Enable group mode in cart
    enableGroupMode();
    
    // Redirect to menu after a brief success message
    setTimeout(() => {
      router.push('/menu');
    }, 2000);
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

  const getStatusColor = (status: string) => {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'ordering':
        return 'Ordering';
      case 'checkout':
        return 'In Checkout';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'expired':
        return 'Expired';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-aori-cream flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-aori-green border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-muted-foreground">Loading group order...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-aori-cream flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Unable to Join</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button asChild>
              <Link href="/menu">Browse Menu Instead</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (joinSuccess) {
    return (
      <div className="min-h-screen bg-aori-cream flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-6 h-6 text-green-500" />
            </motion.div>
            <h2 className="text-lg font-semibold mb-2">Successfully Joined!</h2>
            <p className="text-muted-foreground mb-6">
              Taking you to the menu to start ordering...
            </p>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center justify-center gap-2 text-aori-green"
            >
              <span>Redirecting</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!sessionData) return null;

  const canJoin = sessionData.status === 'active' || sessionData.status === 'ordering';

  return (
    <>
      <div className="min-h-screen bg-aori-cream p-4">
        <div className="max-w-2xl mx-auto pt-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-aori-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-aori-green" />
            </div>
            <h1 className="text-2xl font-bold text-aori-dark mb-2">
              Join Group Order
            </h1>
            <p className="text-muted-foreground">
              {sessionData.hostName} invited you to order together
            </p>
          </motion.div>

          {/* Session Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {sessionData.title || `${sessionData.hostName}'s Group Order`}
                  </CardTitle>
                  <Badge className={getStatusColor(sessionData.status)}>
                    {getStatusText(sessionData.status)}
                  </Badge>
                </div>
                <CardDescription>
                  Hosted by {sessionData.hostName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Participants */}
                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Participants ({sessionData.participants.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sessionData.participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: participant.color || '#6B7C5F' }}
                        />
                        <span>{participant.name}</span>
                        {participant.isHost && (
                          <Badge variant="secondary" className="text-xs">Host</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Session Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimeRemaining(new Date(sessionData.expiresAt))}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>
                      {sessionData.items.length} item{sessionData.items.length !== 1 ? 's' : ''} ordered
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            {canJoin ? (
              <Button
                onClick={() => setShowNameModal(true)}
                size="lg"
                className="w-full sm:w-auto bg-aori-green hover:bg-aori-green-dark text-white px-8"
              >
                <Users className="w-5 h-5 mr-2" />
                Join This Group Order
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  This group order is no longer accepting new participants.
                </p>
                <Button asChild variant="outline">
                  <Link href="/menu">Browse Menu Instead</Link>
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Guest Name Modal */}
      <GuestNameModal
        sessionId={sessionId}
        isOpen={showNameModal}
        onClose={() => setShowNameModal(false)}
        onJoinSuccess={handleJoinSuccess}
      />
    </>
  );
}
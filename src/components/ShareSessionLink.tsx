'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Share2, QrCode, Check, ExternalLink, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import QRCode from 'qrcode';

interface ShareSessionLinkProps {
  sessionId: string;
  shareableLink: string;
  hostName: string;
  participantCount: number;
  className?: string;
}

export default function ShareSessionLink({
  sessionId,
  shareableLink,
  hostName,
  participantCount,
  className = ''
}: ShareSessionLinkProps) {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showQrCode, setShowQrCode] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareableLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateQrCode = async () => {
    if (!qrCodeUrl) {
      try {
        const url = await QRCode.toDataURL(shareableLink, {
          width: 200,
          margin: 2,
          color: {
            dark: '#6B7C5F', // Aori green
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error('Failed to generate QR code:', err);
      }
    }
    setShowQrCode(true);
  };

  const shareViaWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${hostName}'s Group Order - Aori Restaurant`,
          text: `${hostName} invited you to join their group order at Aori Restaurant. Click the link to add your items!`,
          url: shareableLink,
        });
      } catch (err) {
        console.error('Web Share failed:', err);
        // Fallback to copy
        copyToClipboard();
      }
    } else {
      // Fallback to copy
      copyToClipboard();
    }
  };

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(
      `🍽️ Hey! ${hostName} started a group order at Aori Restaurant.\n\nJoin here: ${shareableLink}\n\nAdd your Greek street food favorites and we'll order together!`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const shareViaSMS = () => {
    const message = encodeURIComponent(
      `${hostName} invited you to join their group order at Aori Restaurant! Join here: ${shareableLink}`
    );
    window.location.href = `sms:?body=${message}`;
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Share2 className="w-5 h-5 text-aori-green" />
            Share Group Order
          </CardTitle>
          <CardDescription>
            Invite others to join your group order
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Link Display and Copy */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Shareable Link</label>
            <div className="flex gap-2">
              <Input
                value={shareableLink}
                readOnly
                className="font-mono text-sm"
                onClick={(e) => e.target.select()}
              />
              <Button
                onClick={copyToClipboard}
                size="icon"
                variant="outline"
                className="flex-shrink-0"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Check className="w-4 h-4 text-green-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Copy className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>

          {/* Quick Share Options */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Share</label>
            <div className="grid grid-cols-2 gap-2">
              {/* Native Web Share / Copy */}
              <Button
                onClick={shareViaWebShare}
                variant="outline"
                size="sm"
                className="justify-start"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              {/* QR Code */}
              <Button
                onClick={generateQrCode}
                variant="outline"
                size="sm"
                className="justify-start"
              >
                <QrCode className="w-4 h-4 mr-2" />
                QR Code
              </Button>

              {/* WhatsApp */}
              <Button
                onClick={shareViaWhatsApp}
                variant="outline"
                size="sm"
                className="justify-start"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>

              {/* SMS */}
              <Button
                onClick={shareViaSMS}
                variant="outline"
                size="sm"
                className="justify-start"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Text
              </Button>
            </div>
          </div>

          {/* Session Stats */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
              <Badge variant="secondary" className="text-xs">
                Active
              </Badge>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
            >
              <a 
                href={shareableLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs"
              >
                Preview <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-aori-green" />
              QR Code
            </DialogTitle>
            <DialogDescription>
              Scan this QR code to join the group order
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4">
            {qrCodeUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-white rounded-lg border shadow-sm"
              >
                <img
                  src={qrCodeUrl}
                  alt="QR Code for group order"
                  className="w-48 h-48"
                />
              </motion.div>
            )}

            <div className="text-center space-y-2">
              <p className="text-sm font-medium">
                {hostName}'s Group Order
              </p>
              <p className="text-xs text-muted-foreground">
                Aori Restaurant • {participantCount} participant{participantCount !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex gap-2 w-full">
              <Button
                onClick={() => setShowQrCode(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  // Download QR code
                  const link = document.createElement('a');
                  link.download = `aori-group-order-${sessionId}.png`;
                  link.href = qrCodeUrl;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="flex-1 bg-aori-green hover:bg-aori-green-dark text-white"
                disabled={!qrCodeUrl}
              >
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
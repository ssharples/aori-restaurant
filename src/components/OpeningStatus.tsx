'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useOpeningStatus } from '@/hooks/useOpeningStatus';

interface OpeningStatusProps {
  className?: string;
}

export default function OpeningStatus({ className = '' }: OpeningStatusProps) {
  const { isOpen, message } = useOpeningStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-center ${className}`}
    >
      <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-white/20 backdrop-blur-sm">
        <div className="relative flex items-center">
          {isOpen ? (
            <>
              {/* Green glowing dot for open */}
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 5px #6B7C5F, 0 0 10px #6B7C5F, 0 0 15px #6B7C5F',
                    '0 0 10px #6B7C5F, 0 0 20px #6B7C5F, 0 0 30px #6B7C5F',
                    '0 0 5px #6B7C5F, 0 0 10px #6B7C5F, 0 0 15px #6B7C5F',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-3 h-3 bg-aori-green rounded-full mr-2"
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-sm font-medium flex items-center gap-1"
                style={{ color: '#6B7C5F' }}
              >
                {message}
              </motion.div>
            </>
          ) : (
            <>
              {/* Gray clock icon for closed */}
              <Clock className="w-3 h-3 text-gray-500 mr-2" />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-sm font-medium"
                style={{ color: '#374151' }}
              >
                {message}
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
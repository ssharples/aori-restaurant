'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Clock, MapPin, Phone, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { restaurantInfo } from '@/data/menu';
import Logo from '@/components/Logo';

interface OrderData {
  orderId: string;
  estimatedReadyTime: string;
  totalAmount: number;
  customerDetails: {
    name: string;
    phone: string;
    email?: string;
  };
  items: Array<{
    menuItem: { name: string; price: number };
    variant?: { name: string; price: number };
    quantity: number;
  }>;
}

export default function OrderConfirmationPage() {
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    // Get order data from localStorage
    const lastOrderData = localStorage.getItem('lastOrder');
    if (lastOrderData) {
      try {
        const parsed = JSON.parse(lastOrderData);
        setOrderData(parsed);
        // Clear the stored order data
        localStorage.removeItem('lastOrder');
      } catch (error) {
        console.error('Failed to parse order data:', error);
      }
    }
  }, []);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading order details...</p>
          <Link href="/" className="text-black hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const orderNumber = `AOI-${orderData.orderId}`;
  const estimatedTime = new Date(orderData.estimatedReadyTime);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link 
            href="/"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <Logo variant="light-bg" width={80} height={40} />
        </div>
      </header>

      <div className="px-4 py-6">
        {/* Success Message */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 font-heading">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">
            Thank you for your order. We&apos;re preparing your delicious Greek food!
          </p>
        </motion.div>

        {/* Order Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border border-gray-200 p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 font-heading">Order #{orderNumber}</h2>
            <div className="flex items-center gap-1 text-green-600">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">{formatTime(estimatedTime)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="font-medium text-green-800">Preparing Your Order</p>
              <p className="text-sm text-green-600">Estimated ready time: {formatTime(estimatedTime)}</p>
            </div>
          </div>
        </motion.div>

        {/* Map and Collection Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border border-gray-200 p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900 font-heading">Collection from Aori</h2>
          </div>
          
          {/* Simple Map Placeholder */}
          <div className="bg-gray-100 rounded-lg h-32 mb-4 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>
            <div className="relative z-10 text-center">
              <MapPin className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Aori Restaurant</p>
              <p className="text-xs text-gray-500">78 Old Mill St</p>
            </div>
            {/* Decorative elements to simulate map */}
            <div className="absolute top-2 left-2 w-20 h-1 bg-blue-300 rounded"></div>
            <div className="absolute bottom-3 right-3 w-16 h-1 bg-blue-300 rounded"></div>
            <div className="absolute top-1/2 left-1/4 w-1 h-12 bg-blue-300 rounded"></div>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">{restaurantInfo.address}</p>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{restaurantInfo.phone}</span>
            </div>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg border border-gray-200 p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 font-heading">Your Order</h2>
          <div className="space-y-3">
            {orderData.items.map((item, index) => {
              const price = item.variant?.price || item.menuItem.price;
              return (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900">{item.menuItem.name}</span>
                    {item.variant && <span className="text-sm text-gray-600"> - {item.variant.name}</span>}
                    <span className="text-sm text-gray-600"> x{item.quantity}</span>
                  </div>
                  <span className="font-semibold text-gray-900">£{(price * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">£{orderData.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <Link
            href="/menu"
            className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center block"
          >
            Order More Items
          </Link>
          
          <Link
            href="/"
            className="w-full border-2 border-gray-300 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center block"
          >
            Back to Home
          </Link>
        </motion.div>

        {/* Contact Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 p-4 bg-gray-50 rounded-lg"
        >
          <p className="text-sm text-gray-600">
            <strong>Need help?</strong> Call us at {restaurantInfo.phone} if you have any questions about your order.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Clock, MapPin, Phone } from 'lucide-react';
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
      <div className="min-h-screen bg-accent-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading order details...</p>
          <Link href="/" className="text-primary-green hover:underline">
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
    <div className="min-h-screen bg-accent-cream">
      {/* Header */}
      <header className="bg-primary-green text-accent-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <Logo variant="dark-bg" width={100} height={50} className="mx-auto" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Success Message */}
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary-dark mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">
            Thank you for your order. We&apos;re preparing your delicious Greek food!
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-accent-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4 text-primary-dark">Order Details</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Order Number:</span>
              <span className="font-mono text-primary-green">{orderNumber}</span>
            </div>
            
            <div className="flex justify-between items-start">
              <span className="font-medium">Estimated Ready Time:</span>
              <div className="text-right">
                <div className="flex items-center gap-1 text-primary-green font-semibold">
                  <Clock className="w-4 h-4" />
                  {formatTime(estimatedTime)}
                </div>
                <span className="text-sm text-gray-600">
                  (in about 20 minutes)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Info */}
        <div className="bg-accent-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary-green" />
            <h2 className="text-lg font-semibold text-primary-dark">Collection Address</h2>
          </div>
          
          <p className="text-gray-700 mb-3">{restaurantInfo.address}</p>
          
          <div className="flex items-center gap-2 text-primary-green">
            <Phone className="w-4 h-4" />
            <span className="font-medium">{restaurantInfo.phone}</span>
          </div>
        </div>

        {/* Status Updates */}
        <div className="bg-accent-white rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4 text-primary-dark">Order Status</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Order Confirmed</p>
                <p className="text-sm text-gray-600">Just now</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium">Preparing Your Order</p>
                <p className="text-sm text-gray-600">We&apos;ll notify you when ready</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-500">Ready for Collection</p>
                <p className="text-sm text-gray-400">Estimated {formatTime(estimatedTime)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/menu"
            className="w-full bg-primary-green text-accent-white py-3 rounded-full font-semibold hover:bg-primary-green/90 transition-colors text-center block"
          >
            Order More Items
          </Link>
          
          <Link
            href="/"
            className="w-full border-2 border-primary-green text-primary-green py-3 rounded-full font-semibold hover:bg-primary-green hover:text-accent-white transition-colors text-center block"
          >
            Back to Home
          </Link>
        </div>

        {/* Contact Info */}
        <div className="text-center mt-8 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Need help?</strong> Call us at {restaurantInfo.phone} if you have any questions about your order.
          </p>
        </div>
      </div>
    </div>
  );
}
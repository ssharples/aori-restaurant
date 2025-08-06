'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, CreditCard } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { CustomerDetails } from '@/types/menu';
import { restaurantInfo } from '@/data/menu';
import Logo from '@/components/Logo';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    phone: '',
    email: ''
  });
  const [collectionType, setCollectionType] = useState<'asap' | 'scheduled'>('asap');
  const [scheduledTime, setScheduledTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'at-restaurant'>('online');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<Date | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      router.push('/menu');
    }
  }, [items.length, router]);

  useEffect(() => {
    // Calculate estimated collection time
    const calculateEstimatedTime = () => {
      const now = new Date();
      const baseTime = 15; // Base preparation time in minutes
      const complexityFactor = Math.min(items.length * 2, 10); // Max 10 min extra
      const totalMinutes = baseTime + complexityFactor;
      
      const estimated = new Date(now.getTime() + totalMinutes * 60000);
      setEstimatedTime(estimated);
    };

    calculateEstimatedTime();
  }, [items]);

  const formatPrice = (price: number) => `£${price.toFixed(2)}`;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const startTime = new Date(now.getTime() + 30 * 60000); // Start 30 min from now
    
    for (let i = 0; i < 24; i++) { // 24 slots (6 hours worth)
      const slotTime = new Date(startTime.getTime() + i * 15 * 60000);
      const timeString = formatTime(slotTime);
      const dateString = slotTime.toISOString().slice(0, 16); // Format for datetime-local input
      
      slots.push({
        value: dateString,
        label: timeString,
        date: slotTime
      });
    }
    
    return slots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerDetails.name || !customerDetails.phone) {
      alert('Please fill in all required fields');
      return;
    }

    if (collectionType === 'scheduled' && !scheduledTime) {
      alert('Please select a collection time');
      return;
    }

    setIsSubmitting(true);

    try {
      const collectionDateTime = collectionType === 'scheduled' 
        ? new Date(scheduledTime)
        : estimatedTime || new Date(Date.now() + 20 * 60000);

      const orderData = {
        items,
        customerDetails,
        collectionTime: collectionDateTime.toISOString(),
        paymentMethod,
        notes: `Collection type: ${collectionType}`,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const result = await response.json();
      
      // Store order details in localStorage for confirmation page
      localStorage.setItem('lastOrder', JSON.stringify({
        orderId: result.orderId,
        estimatedReadyTime: result.estimatedReadyTime,
        totalAmount: result.totalAmount,
        customerDetails,
        items,
      }));

      // Clear cart and redirect to confirmation
      clearCart();
      router.push('/order-confirmation');
    } catch (error) {
      console.error('Order submission failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect via useEffect
  }

  const timeSlots = generateTimeSlots();

  return (
    <div className="min-h-screen bg-accent-cream">
      {/* Header */}
      <header className="bg-primary-green text-accent-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link 
            href="/menu"
            className="p-2 hover:bg-primary-green/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Logo variant="dark-bg" width={80} height={40} />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="bg-accent-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-primary-dark">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item) => {
                const price = item.variant?.price || item.menuItem.price;
                return (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{item.menuItem.name}</span>
                      {item.variant && <span className="text-sm text-gray-600"> - {item.variant.name}</span>}
                      <span className="text-sm text-gray-600"> x{item.quantity}</span>
                    </div>
                    <span className="font-semibold">{formatPrice(price * item.quantity)}</span>
                  </div>
                );
              })}
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold text-primary-green">{formatPrice(getTotal())}</span>
              </div>
            </div>
          </div>

          {/* Collection Info */}
          <div className="bg-accent-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary-green" />
              <h2 className="text-lg font-semibold text-primary-dark">Collection Details</h2>
            </div>
            <p className="text-gray-600 mb-4">{restaurantInfo.address}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection Time
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="collectionType"
                      value="asap"
                      checked={collectionType === 'asap'}
                      onChange={(e) => setCollectionType(e.target.value as 'asap')}
                      className="mr-3 text-primary-green focus:ring-primary-green"
                    />
                    <div>
                      <span className="font-medium">ASAP</span>
                      {estimatedTime && (
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Ready by {formatTime(estimatedTime)}
                        </div>
                      )}
                    </div>
                  </label>
                  
                  <label className="flex items-start">
                    <input
                      type="radio"
                      name="collectionType"
                      value="scheduled"
                      checked={collectionType === 'scheduled'}
                      onChange={(e) => setCollectionType(e.target.value as 'scheduled')}
                      className="mr-3 mt-1 text-primary-green focus:ring-primary-green"
                    />
                    <div className="flex-1">
                      <span className="font-medium">Schedule for later</span>
                      {collectionType === 'scheduled' && (
                        <select
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                          required
                        >
                          <option value="">Select a time</option>
                          {timeSlots.map((slot) => (
                            <option key={slot.value} value={slot.value}>
                              {slot.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-accent-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-primary-dark">Your Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={customerDetails.email}
                  onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-accent-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-primary-green" />
              <h2 className="text-lg font-semibold text-primary-dark">Payment Method</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'online')}
                  className="mr-3 text-primary-green focus:ring-primary-green"
                />
                <div className="flex-1">
                  <span className="font-medium">Pay Online</span>
                  <p className="text-sm text-gray-600">Secure payment with Stripe</p>
                </div>
              </label>
              
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="at-restaurant"
                  checked={paymentMethod === 'at-restaurant'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'at-restaurant')}
                  className="mr-3 text-primary-green focus:ring-primary-green"
                />
                <div className="flex-1">
                  <span className="font-medium">Pay at Restaurant</span>
                  <p className="text-sm text-gray-600">Cash or card on collection</p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-green text-accent-white py-4 rounded-full font-semibold hover:bg-primary-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Placing Order...' : `Place Order • ${formatPrice(getTotal())}`}
          </button>
        </form>
      </div>
    </div>
  );
}
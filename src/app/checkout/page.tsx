'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  // Payment is always at collection - no payment method selection needed
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<Date | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

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

  // Suggested extras based on order
  const suggestedExtras = [
    { id: 'chips', name: 'Chips', price: 3.50, category: 'sides' },
    { id: 'coke', name: 'Coke', price: 1.80, category: 'drinks' },
    { id: 'coke-zero', name: 'Coke Zero', price: 1.80, category: 'drinks' },
    { id: 'water', name: 'Water', price: 1.50, category: 'drinks' },
    { id: 'pita-bread', name: 'Extra Pita Bread', price: 1.50, category: 'sides' },
    { id: 'tzatziki', name: 'Extra Tzatziki', price: 5.00, category: 'sides' }
  ];

  const hasDrink = items.some(item => item.menuItem.category === 'drinks');
  const hasSide = items.some(item => item.menuItem.category === 'sides' || item.menuItem.name.toLowerCase().includes('chips'));

  const getExtrasTotal = () => {
    return selectedExtras.reduce((total, extraId) => {
      const extra = suggestedExtras.find(e => e.id === extraId);
      return total + (extra?.price || 0);
    }, 0);
  };

  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev => 
      prev.includes(extraId) 
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  };

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

      // Add selected extras to items
      const extrasAsItems = selectedExtras.map(extraId => {
        const extra = suggestedExtras.find(e => e.id === extraId);
        if (!extra) return null;
        return {
          id: `extra-${extraId}`,
          menuItem: {
            id: extraId,
            name: extra.name,
            price: extra.price,
            category: extra.category as 'sides' | 'drinks',
            description: '',
            image: '',
            allergens: [],
            variants: []
          },
          quantity: 1,
          variant: null
        };
      }).filter(Boolean);

      const orderData = {
        items: [...items, ...extrasAsItems],
        customerDetails,
        collectionTime: collectionDateTime.toISOString(),
        notes: `Collection type: ${collectionType}. Payment: Pay on collection.`,
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
        totalAmount: getTotal() + getExtrasTotal(),
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
          <AnimatePresence>
          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-900 font-heading">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item) => {
                const price = item.variant?.price || item.menuItem.price;
                return (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-900">{item.menuItem.name}</span>
                      {item.variant && <span className="text-sm text-gray-600"> - {item.variant.name}</span>}
                      <span className="text-sm text-gray-600"> x{item.quantity}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{formatPrice(price * item.quantity)}</span>
                  </div>
                );
              })}
              {selectedExtras.length > 0 && (
                <div className="border-t pt-3 space-y-2">
                  {selectedExtras.map(extraId => {
                    const extra = suggestedExtras.find(e => e.id === extraId);
                    if (!extra) return null;
                    return (
                      <div key={extraId} className="flex justify-between items-center text-sm">
                        <span className="text-gray-900">{extra.name}</span>
                        <span className="text-gray-900">{formatPrice(extra.price)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-gray-900">{formatPrice(getTotal() + getExtrasTotal())}</span>
              </div>
            </div>
          </motion.div>

          {/* Collection Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900 font-heading">Collection Details</h2>
            </div>
            
            {/* Interactive Map */}
            <div className="mb-4">
              <div 
                className="bg-gray-100 rounded-lg h-32 flex items-center justify-center relative overflow-hidden cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantInfo.address)}`, '_blank')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>
                <div className="relative z-10 text-center">
                  <MapPin className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Aori Restaurant</p>
                  <p className="text-xs text-gray-500">Click to open in Maps</p>
                </div>
                {/* Decorative elements to simulate map */}
                <div className="absolute top-2 left-2 w-20 h-1 bg-blue-300 rounded"></div>
                <div className="absolute bottom-3 right-3 w-16 h-1 bg-blue-300 rounded"></div>
                <div className="absolute top-1/2 left-1/4 w-1 h-12 bg-blue-300 rounded"></div>
              </div>
            </div>
            
            <p className="text-gray-900 mb-4 font-medium">{restaurantInfo.address}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
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
                      <span className="font-medium text-gray-900">ASAP</span>
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
                      <span className="font-medium text-gray-900">Schedule for later</span>
                      {collectionType === 'scheduled' && (
                        <select
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent text-gray-900 bg-white"
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
          </motion.div>

          {/* Optional Extras */}
          {(!hasDrink || !hasSide) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-900 font-heading">Add Extras</h2>
              <p className="text-sm text-gray-900 mb-4">Complete your order with these delicious additions</p>
              
              <div className="space-y-3">
                {!hasDrink && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Add a Drink</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {suggestedExtras.filter(extra => extra.category === 'drinks').map((extra) => (
                        <motion.label
                          key={extra.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedExtras.includes(extra.id)
                              ? 'border-primary-green bg-primary-green/5'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedExtras.includes(extra.id)}
                              onChange={() => toggleExtra(extra.id)}
                              className="mr-3 text-primary-green focus:ring-primary-green"
                            />
                            <span className="font-medium text-gray-900">{extra.name}</span>
                          </div>
                          <span className="text-primary-green font-semibold">{formatPrice(extra.price)}</span>
                        </motion.label>
                      ))}
                    </div>
                  </div>
                )}
                
                {!hasSide && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 mt-4">Add a Side</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {suggestedExtras.filter(extra => extra.category === 'sides').map((extra) => (
                        <motion.label
                          key={extra.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedExtras.includes(extra.id)
                              ? 'border-primary-green bg-primary-green/5'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedExtras.includes(extra.id)}
                              onChange={() => toggleExtra(extra.id)}
                              className="mr-3 text-primary-green focus:ring-primary-green"
                            />
                            <span className="font-medium text-gray-900">{extra.name}</span>
                          </div>
                          <span className="text-primary-green font-semibold">{formatPrice(extra.price)}</span>
                        </motion.label>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedExtras.length > 0 && (
                  <div className="border-t pt-3 mt-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Extras Total:</span>
                      <span className="font-semibold text-primary-green">{formatPrice(getExtrasTotal())}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Customer Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-900 font-heading">Your Details</h2>
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
          </motion.div>

          {/* Payment Information */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900 font-heading">Payment</h2>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-1">
                  <span className="font-medium text-green-800">Pay on Collection</span>
                  <p className="text-sm text-green-600 mt-1">Pay with cash or card when you collect your order</p>
                </div>
                <div className="text-green-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          </AnimatePresence>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <motion.span
              key={isSubmitting ? 'submitting' : 'ready'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {isSubmitting ? 'Placing Order...' : `Place Order • ${formatPrice(getTotal() + getExtrasTotal())}`}
            </motion.span>
          </motion.button>
        </form>
      </div>
    </div>
  );
}
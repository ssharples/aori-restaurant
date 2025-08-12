'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChefHat, Clock, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';
import { useCartStore } from '@/stores/cart';

interface TablePageProps {
  params: { tableNumber: string };
}

export default function TableOrderPage() {
  const params = useParams();
  const router = useRouter();
  const tableNumber = parseInt(params.tableNumber as string);
  
  const [isValidTable, setIsValidTable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { clearCart } = useCartStore();

  // Validate table number (1-6 for Aori restaurant)
  useEffect(() => {
    const validateTable = () => {
      if (isNaN(tableNumber) || tableNumber < 1 || tableNumber > 6) {
        setIsValidTable(false);
      } else {
        setIsValidTable(true);
        // Clear any existing cart for fresh table session
        clearCart();
        // Store table context in localStorage
        localStorage.setItem('aori-table-context', JSON.stringify({
          tableNumber,
          orderType: 'table-service',
          sessionStart: new Date().toISOString()
        }));
      }
      setIsLoading(false);
    };

    validateTable();
  }, [tableNumber, clearCart]);

  const handleStartOrdering = () => {
    router.push('/menu');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-aori-green flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-aori-green border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-muted-foreground">Setting up your table...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValidTable) {
    return (
      <div className="min-h-screen bg-aori-cream flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Invalid Table</h2>
            <p className="text-muted-foreground mb-6">
              Table {tableNumber} doesn't exist. Please check your QR code and try again.
            </p>
            <Button asChild>
              <a href="/menu">Browse Menu Instead</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aori-green p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Logo variant="dark-bg" width={120} height={60} className="mx-auto mb-6" />
          <div className="w-16 h-16 bg-aori-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-aori-white" />
          </div>
          <Badge className="bg-aori-white text-aori-green mb-4 text-lg px-6 py-2">
            Table {tableNumber}
          </Badge>
          <h1 className="text-3xl font-bold text-aori-white mb-2">
            Welcome to Aori!
          </h1>
          <p className="text-aori-cream text-lg">
            Order directly to your table with our digital menu
          </p>
        </motion.div>

        {/* Table Service Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-6 border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-aori-dark">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Table Service Activated
              </CardTitle>
              <CardDescription>
                Your order will be prepared and served directly to Table {tableNumber}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-aori-green/10 rounded-full flex items-center justify-center mb-2">
                    <ChefHat className="w-6 h-6 text-aori-green" />
                  </div>
                  <p className="text-sm font-medium">Fresh & Made to Order</p>
                  <p className="text-xs text-muted-foreground">All dishes prepared fresh</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-aori-green/10 rounded-full flex items-center justify-center mb-2">
                    <Clock className="w-6 h-6 text-aori-green" />
                  </div>
                  <p className="text-sm font-medium">Quick Service</p>
                  <p className="text-xs text-muted-foreground">15-25 min average</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-aori-green/10 rounded-full flex items-center justify-center mb-2">
                    <MapPin className="w-6 h-6 text-aori-green" />
                  </div>
                  <p className="text-sm font-medium">Served to Table</p>
                  <p className="text-xs text-muted-foreground">No need to collect</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-6 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-aori-dark">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { step: 1, title: "Browse our authentic Greek menu", desc: "Choose from gyros, souvlaki, salads & more" },
                  { step: 2, title: "Add items to your cart", desc: "Customize your order with our fresh ingredients" },
                  { step: 3, title: "Complete your order", desc: "Pay at the table when your food arrives" },
                  { step: 4, title: "Enjoy your meal!", desc: "We'll bring everything fresh to Table " + tableNumber }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-8 h-8 bg-aori-green text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-medium text-aori-dark">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Start Ordering Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <Button
            onClick={handleStartOrdering}
            size="lg"
            className="w-full sm:w-auto bg-aori-white text-aori-green hover:bg-aori-cream hover:text-aori-dark px-12 py-6 text-xl font-semibold rounded-full shadow-lg transition-all transform hover:scale-105"
          >
            Start Ordering
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        {/* Restaurant Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-aori-cream/80"
        >
          <p className="text-sm mb-2">
            78 Old Mill St, Manchester M4 6LW
          </p>
          <p className="text-xs">
            Please inform staff of any allergies before ordering
          </p>
        </motion.div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Clock, Phone, Star, Quote, ChefHat, Flame, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { restaurantInfo } from '@/data/menu';
import CartButton from '@/components/CartButton';
import WaveBackground from '@/components/WaveBackground';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Greek street food highlights
const highlights = [
  { icon: ChefHat, text: "Family Recipes", description: "Passed down through generations" },
  { icon: Flame, text: "Freshly Grilled", description: "Made to order on charcoal" },
  { icon: Leaf, text: "Local Ingredients", description: "Sourced from trusted suppliers" }
];

// Sample reviews data (will be replaced with Google Reviews API)
const sampleReviews = [
  { author: "Sarah M.", rating: 5, text: "Best Greek food in Manchester! The chicken gyros is absolutely divine.", time: "2 weeks ago" },
  { author: "James K.", rating: 5, text: "Authentic taste that reminds me of my holidays in Greece. Amazing!", time: "1 month ago" },
  { author: "Maria P.", rating: 5, text: "Fresh ingredients and generous portions. The tzatziki is homemade perfection!", time: "3 weeks ago" }
];

export default function Home() {
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % sampleReviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-aori-green relative overflow-hidden">
      <WaveBackground />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="relative z-10 bg-aori-green text-aori-white shadow-lg"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo variant="dark-bg" width={100} height={50} />
          <CartButton />
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 bg-aori-green text-aori-white py-20 px-4 min-h-[80vh] flex items-center">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-6"
              >
                <Logo variant="dark-bg" width={200} height={100} className="mx-auto lg:mx-0" />
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-2xl md:text-3xl mb-4 text-aori-cream font-light"
              >
                Authentic Greek Street Food
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-lg mb-8 text-aori-cream/80"
              >
                From the streets of Athens to the heart of Manchester
              </motion.p>
              
              {/* Highlights */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mb-8 space-y-3"
              >
                {highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <highlight.icon className="w-5 h-5 text-aori-cream" />
                    <span className="text-aori-cream">{highlight.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button 
                  asChild
                  size="lg"
                  className="bg-aori-white text-aori-green hover:bg-aori-cream px-8 py-6 text-lg font-semibold rounded-full shadow-lg transition-all transform hover:scale-105"
                >
                  <Link href="/menu">Order Now</Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-aori-white text-aori-white hover:bg-aori-white hover:text-aori-green px-8 py-6 text-lg font-semibold rounded-full bg-transparent transition-all"
                >
                  <Link href="/menu">View Menu</Link>
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Right side - Animated food showcase */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative">
                {/* Main circular showcase */}
                <motion.div 
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-80 h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-aori-white/20 to-aori-white/5 backdrop-blur-sm border-4 border-aori-white/30 flex items-center justify-center shadow-2xl overflow-hidden"
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Rotating food items */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-6xl">🥙</div>
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-6xl">🍢</div>
                      <div className="absolute left-8 top-1/2 -translate-y-1/2 text-6xl">🥗</div>
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 text-6xl">🫒</div>
                    </motion.div>
                    
                    {/* Center text */}
                    <div className="text-center text-aori-white z-10 bg-aori-green/50 backdrop-blur-sm rounded-full p-8">
                      <p className="text-xl font-bold mb-2">Made Fresh</p>
                      <p className="text-lg">Every Day</p>
                    </div>
                  </div>
                </motion.div>
                
                {/* Animated decorative elements */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 w-12 h-12 bg-aori-white/30 rounded-full"
                />
                <motion.div 
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-8 -left-8 w-8 h-8 bg-aori-white/25 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <section className="relative z-10 bg-aori-white py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-aori-dark">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-xl font-semibold text-aori-dark">4.8</span>
              <span className="text-muted-foreground">(127 reviews)</span>
            </div>
          </motion.div>

          {/* Reviews Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentReview}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-aori-cream border-0">
                  <CardContent className="p-8">
                    <Quote className="w-10 h-10 text-aori-green/30 mb-4" />
                    <p className="text-lg text-aori-dark mb-6 italic">
                      &ldquo;{sampleReviews[currentReview].text}&rdquo;
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-aori-dark">{sampleReviews[currentReview].author}</p>
                        <p className="text-sm text-muted-foreground">{sampleReviews[currentReview].time}</p>
                      </div>
                      <div className="flex">
                        {[...Array(sampleReviews[currentReview].rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Review dots */}
            <div className="flex justify-center gap-2 mt-6">
              {sampleReviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReview(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentReview ? 'bg-aori-green w-8' : 'bg-aori-green/30'
                  }`}
                />
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <a 
              href="https://maps.app.goo.gl/wziVRrUScngGV3b9A" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-aori-green hover:underline font-medium"
            >
              View all reviews on Google
            </a>
          </motion.div>
        </div>
      </section>

      {/* Authentic Greek Experience */}
      <section className="relative z-10 bg-aori-green/95 backdrop-blur-sm py-16 px-4">
        <div className="container mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12 text-aori-white"
          >
            The Aori Experience
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-20 h-20 bg-aori-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-aori-white/30 transition-colors"
                >
                  <highlight.icon className="w-10 h-10 text-aori-white" />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-2 text-aori-white">{highlight.text}</h3>
                <p className="text-aori-cream">{highlight.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurant Info */}
      <section className="relative z-10 bg-aori-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col items-center group"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 bg-aori-green/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-aori-green/30 transition-colors"
              >
                <MapPin className="w-8 h-8 text-aori-green" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-aori-dark">Location</h3>
              <p className="text-aori-dark/70">{restaurantInfo.address}</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center group"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 bg-aori-green/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-aori-green/30 transition-colors"
              >
                <Clock className="w-8 h-8 text-aori-green" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-aori-dark">Hours</h3>
              <div className="text-aori-dark/70 space-y-1">
                <p>Mon-Thu: 11:00-22:00</p>
                <p>Fri-Sat: 11:00-23:00</p>
                <p>Sun: 12:00-21:00</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col items-center group"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 bg-aori-green/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-aori-green/30 transition-colors"
              >
                <Phone className="w-8 h-8 text-aori-green" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-aori-dark">Call Us</h3>
              <p className="text-aori-dark/70">{restaurantInfo.phone}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Items with Animation */}
      <section className="relative z-10 bg-aori-cream py-16 px-4">
        <div className="container mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12 text-aori-dark"
          >
            Street Food Favorites
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { emoji: "🥙", name: "Chicken Gyros", desc: "Marinated chicken, tzatziki, fresh vegetables wrapped in warm pita", badge: "Best Seller" },
              { emoji: "🍢", name: "Pork Souvlaki", desc: "Tender pork skewers grilled over charcoal, served with pita and chips", badge: "Traditional" },
              { emoji: "🥗", name: "Greek Salad", desc: "Crisp vegetables, creamy feta, Kalamata olives, olive oil dressing", badge: "Vegetarian" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all group relative overflow-hidden"
              >
                {item.badge && (
                  <Badge className="absolute top-4 right-4 bg-aori-green text-white">
                    {item.badge}
                  </Badge>
                )}
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="w-24 h-24 bg-aori-green/10 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl"
                >
                  {item.emoji}
                </motion.div>
                <h3 className="text-2xl font-semibold mb-3 text-aori-dark">{item.name}</h3>
                <p className="text-aori-dark/70 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-aori-dark text-aori-white py-12 px-4">
        <div className="container mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <Logo variant="dark-bg" width={120} height={60} className="mx-auto mb-2" />
            <p className="text-aori-cream">Authentic Greek Street Food</p>
          </motion.div>
          <p className="text-sm text-aori-cream/80 max-w-2xl mx-auto leading-relaxed">
            Please be aware that our kitchen uses nuts, gluten, and other allergens, 
            and we cannot guarantee our food is completely allergen-free. 
            Please inform our team of any allergies before ordering.
          </p>
        </div>
      </footer>
    </div>
  );
}
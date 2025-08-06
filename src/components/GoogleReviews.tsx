'use client';

import { useState, useEffect } from 'react';
import { Star, Quote, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

// Google Place ID for Aori - this would be obtained from the Google Places API
// For now, using placeholder data
// const GOOGLE_PLACE_ID = 'ChIJYVqV6zOxe0gRPQEHgL3PYBA'; // This would be the actual place ID

interface Review {
  author_name: string;
  rating: number;
  text: string;
  time: string;
  profile_photo_url?: string;
}

// Sample reviews - in production, these would come from Google Places API
const sampleReviews: Review[] = [
  {
    author_name: "Sarah Mitchell",
    rating: 5,
    text: "Best Greek food in Manchester! The chicken gyros is absolutely divine. Fresh ingredients, generous portions, and authentic flavors.",
    time: "2 weeks ago"
  },
  {
    author_name: "James Kennedy",
    rating: 5,
    text: "Authentic taste that reminds me of my holidays in Greece. The souvlaki is grilled to perfection and the tzatziki is homemade!",
    time: "1 month ago"
  },
  {
    author_name: "Maria Papadopoulos",
    rating: 5,
    text: "As a Greek native, I can confirm this is the real deal! Fresh pita, quality meat, and the flavors are just like home. Highly recommend!",
    time: "3 weeks ago"
  },
  {
    author_name: "Tom Wilson",
    rating: 5,
    text: "Great value for money! The portions are huge and everything tastes fresh. The staff is friendly and the service is quick.",
    time: "1 week ago"
  },
  {
    author_name: "Emma Chen",
    rating: 5,
    text: "Love the vegetarian options here! The halloumi wrap is incredible and the Greek salad is so fresh. Will definitely be back!",
    time: "2 months ago"
  }
];

export default function GoogleReviews() {
  const [currentReview, setCurrentReview] = useState(0);
  const [reviews] = useState<Review[]>(sampleReviews);
  
  // In production, this would fetch real reviews from Google Places API
  // useEffect(() => {
  //   fetchGoogleReviews(GOOGLE_PLACE_ID).then(setReviews);
  // }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
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
          
          {/* Google Reviews Header */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium text-aori-dark">Google Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-xl font-semibold text-aori-dark">{averageRating.toFixed(1)}</span>
              <span className="text-muted-foreground">({reviews.length} reviews)</span>
            </div>
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
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Card className="bg-aori-cream border-0 shadow-lg">
                <CardContent className="p-8">
                  <Quote className="w-10 h-10 text-aori-green/30 mb-4" />
                  <p className="text-lg text-aori-dark mb-6 italic leading-relaxed">
                    &ldquo;{reviews[currentReview].text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-aori-green/20 rounded-full flex items-center justify-center">
                        <span className="text-aori-green font-semibold text-lg">
                          {reviews[currentReview].author_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-aori-dark">{reviews[currentReview].author_name}</p>
                        <p className="text-sm text-muted-foreground">{reviews[currentReview].time}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(reviews[currentReview].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Review navigation dots */}
          <div className="flex justify-center gap-2 mt-6">
            {reviews.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentReview(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentReview ? 'bg-aori-green w-8' : 'bg-aori-green/30'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>

        {/* View on Google button */}
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
            className="inline-flex items-center gap-2 text-aori-green hover:text-aori-dark font-medium transition-colors group"
          >
            <span>View all reviews on Google</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
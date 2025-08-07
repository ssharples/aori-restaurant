'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

// Restaurant images data - using high-quality stock images that represent the restaurant atmosphere
const restaurantImages = [
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop&q=80",
    alt: "Modern Restaurant Exterior",
    caption: "Welcome to Aori"
  },
  {
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&q=80",
    alt: "Open Kitchen with Professional Equipment",
    caption: "Fresh & Made to Order"
  },
  {
    src: "https://images.unsplash.com/photo-1552566292-a2c4a0e40dd1?w=400&h=400&fit=crop&q=80",
    alt: "Cozy Restaurant Interior",
    caption: "Comfortable Dining"
  }
];

export default function RestaurantCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % restaurantImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative flex justify-center lg:justify-end"
    >
      <div className="relative w-80 h-80 md:w-96 md:h-96">
        <Carousel className="w-full h-full">
          <CarouselContent>
            {restaurantImages.map((image, index) => (
              <CarouselItem key={index}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-0 bg-transparent">
                    <CardContent className="p-0">
                      <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 320px, 384px"
                        />
                        {/* Overlay with caption */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                          <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-white text-lg font-semibold text-center bg-black/20 backdrop-blur-sm rounded-full px-4 py-2"
                          >
                            {image.caption}
                          </motion.p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Navigation buttons */}
          <CarouselPrevious className="left-4 bg-white/80 hover:bg-white border-0 text-aori-green shadow-lg" />
          <CarouselNext className="right-4 bg-white/80 hover:bg-white border-0 text-aori-green shadow-lg" />
        </Carousel>

        {/* Dots indicator */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {restaurantImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-aori-white w-6' : 'bg-aori-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

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
  );
}
import Link from 'next/link';
import { MapPin, Clock, Phone } from 'lucide-react';
import { restaurantInfo } from '@/data/menu';
import CartButton from '@/components/CartButton';
import WaveBackground from '@/components/WaveBackground';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-aori-green relative overflow-hidden">
      <WaveBackground />
      
      {/* Header */}
      <header className="relative z-10 bg-aori-green text-aori-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-logo font-bold text-aori-white">Aori</h1>
          <CartButton />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 bg-aori-green text-aori-white py-20 px-4 min-h-[80vh] flex items-center">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-7xl font-logo font-bold mb-6 text-aori-white leading-tight">
                Aori
              </h1>
              <p className="text-2xl md:text-3xl mb-8 text-aori-cream font-light">
                Authentic Greek &amp; Street food
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
              </div>
            </div>
            
            {/* Right side - Food image placeholder */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Circular frame for food image */}
                <div className="w-80 h-80 md:w-96 md:h-96 rounded-full bg-aori-white/10 backdrop-blur-sm border-4 border-aori-white/20 flex items-center justify-center shadow-2xl">
                  <div className="text-center text-aori-white/80">
                    <div className="text-6xl mb-4">🥙</div>
                    <p className="text-lg font-medium">Greek Delights</p>
                    <p className="text-sm opacity-75">Fresh • Authentic • Delicious</p>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-aori-white/20 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-8 h-8 bg-aori-white/15 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 -left-12 w-6 h-6 bg-aori-white/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Info */}
      <section className="relative z-10 bg-aori-green/95 backdrop-blur-sm py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-aori-white/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-aori-white/30 transition-colors">
                <MapPin className="w-8 h-8 text-aori-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-aori-white">Location</h3>
              <p className="text-aori-cream">{restaurantInfo.address}</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-aori-white/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-aori-white/30 transition-colors">
                <Clock className="w-8 h-8 text-aori-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-aori-white">Hours</h3>
              <div className="text-aori-cream space-y-1">
                <p>Mon-Thu: 11:00-22:00</p>
                <p>Fri-Sat: 11:00-23:00</p>
                <p>Sun: 12:00-21:00</p>
              </div>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-aori-white/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-aori-white/30 transition-colors">
                <Phone className="w-8 h-8 text-aori-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-aori-white">Call Us</h3>
              <p className="text-aori-cream">{restaurantInfo.phone}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Preview */}
      <section className="relative z-10 bg-aori-white py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-aori-dark">
            Popular Items
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-aori-cream rounded-2xl p-8 text-center hover:shadow-xl transition-all group">
              <div className="w-24 h-24 bg-aori-green rounded-full mx-auto mb-6 flex items-center justify-center text-aori-white text-3xl font-bold group-hover:scale-110 transition-transform">
                🥙
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-aori-dark">Chicken Gyros</h3>
              <p className="text-aori-dark/70 leading-relaxed">Classic Greek wrapped goodness with fresh ingredients</p>
            </div>
            <div className="bg-aori-cream rounded-2xl p-8 text-center hover:shadow-xl transition-all group">
              <div className="w-24 h-24 bg-aori-green rounded-full mx-auto mb-6 flex items-center justify-center text-aori-white text-3xl font-bold group-hover:scale-110 transition-transform">
                🍢
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-aori-dark">Souvlaki</h3>
              <p className="text-aori-dark/70 leading-relaxed">Grilled perfection on skewers, authentic Greek flavors</p>
            </div>
            <div className="bg-aori-cream rounded-2xl p-8 text-center hover:shadow-xl transition-all group">
              <div className="w-24 h-24 bg-aori-green rounded-full mx-auto mb-6 flex items-center justify-center text-aori-white text-3xl font-bold group-hover:scale-110 transition-transform">
                🥗
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-aori-dark">Greek Salad</h3>
              <p className="text-aori-dark/70 leading-relaxed">Fresh Mediterranean flavors with feta and olives</p>
            </div>
          </div>
        </div>
      </section>

      {/* QR Code Section */}
      <section className="relative z-10 bg-aori-green text-aori-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Quick Order</h2>
          <p className="text-xl mb-8 text-aori-cream">Scan to order from your table</p>
          <div className="w-40 h-40 bg-aori-white rounded-2xl mx-auto flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
            <span className="text-aori-green font-bold text-lg">QR CODE</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-aori-dark text-aori-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-logo font-bold mb-2">Aori</h3>
            <p className="text-aori-cream">Authentic Greek Street Food</p>
          </div>
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

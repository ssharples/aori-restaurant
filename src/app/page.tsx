import Link from 'next/link';
import { MapPin, Clock, Phone } from 'lucide-react';
import { restaurantInfo } from '@/data/menu';
import CartButton from '@/components/CartButton';

export default function Home() {
  return (
    <div className="min-h-screen bg-accent-cream">
      {/* Header */}
      <header className="bg-primary-green text-accent-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-logo font-bold">Aori</h1>
          <CartButton />
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary-green text-accent-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-logo font-bold mb-4">
            Aori
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Authentic Greek Street Food
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/menu"
              className="bg-accent-white text-primary-green px-8 py-4 rounded-full font-semibold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
            >
              Order Now
            </Link>
            <Link 
              href="/menu"
              className="border-2 border-accent-white text-accent-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-accent-white hover:text-primary-green transition-all"
            >
              View Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Restaurant Info */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <MapPin className="w-12 h-12 text-primary-green mb-4" />
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p className="text-primary-dark">{restaurantInfo.address}</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-12 h-12 text-primary-green mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hours</h3>
              <div className="text-primary-dark">
                <p>Mon-Thu: 11:00-22:00</p>
                <p>Fri-Sat: 11:00-23:00</p>
                <p>Sun: 12:00-21:00</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <Phone className="w-12 h-12 text-primary-green mb-4" />
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-primary-dark">{restaurantInfo.phone}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Preview */}
      <section className="bg-accent-white py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary-dark">
            Popular Items
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-accent-cream rounded-lg p-6 text-center">
              <div className="w-20 h-20 bg-primary-green rounded-full mx-auto mb-4 flex items-center justify-center text-accent-white text-2xl font-bold">
                🥙
              </div>
              <h3 className="text-xl font-semibold mb-2">Chicken Gyros</h3>
              <p className="text-primary-dark">Classic Greek wrapped goodness</p>
            </div>
            <div className="bg-accent-cream rounded-lg p-6 text-center">
              <div className="w-20 h-20 bg-primary-green rounded-full mx-auto mb-4 flex items-center justify-center text-accent-white text-2xl font-bold">
                🍢
              </div>
              <h3 className="text-xl font-semibold mb-2">Souvlaki</h3>
              <p className="text-primary-dark">Grilled perfection on skewers</p>
            </div>
            <div className="bg-accent-cream rounded-lg p-6 text-center">
              <div className="w-20 h-20 bg-primary-green rounded-full mx-auto mb-4 flex items-center justify-center text-accent-white text-2xl font-bold">
                🥗
              </div>
              <h3 className="text-xl font-semibold mb-2">Greek Salad</h3>
              <p className="text-primary-dark">Fresh Mediterranean flavors</p>
            </div>
          </div>
        </div>
      </section>

      {/* QR Code Section */}
      <section className="bg-primary-green text-accent-white py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Quick Order</h2>
          <p className="mb-6">Scan to order from your table</p>
          <div className="w-32 h-32 bg-accent-white rounded-lg mx-auto flex items-center justify-center">
            <span className="text-primary-green font-bold">QR CODE</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-dark text-accent-white py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-sm opacity-75">
            Please be aware that our kitchen uses nuts, gluten, and other allergens, 
            and we cannot guarantee our food is completely allergen-free. 
            Please inform our team of any allergies before ordering.
          </p>
        </div>
      </footer>
    </div>
  );
}

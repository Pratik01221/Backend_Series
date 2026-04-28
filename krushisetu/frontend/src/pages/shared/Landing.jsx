import { Link } from 'react-router-dom'
import { Sprout, ArrowRight, Wheat, TrendingUp, MessageSquare, ShieldCheck, Star } from 'lucide-react'
import Navbar from '../../components/common/Navbar'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
              <Sprout size={15} /> A Bridge Between Farmer and Trader
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold leading-tight mb-6">
              Grow your farm.<br />
              <span className="text-earth-300">Sell directly.</span><br />
              Trade smarter.
            </h1>
            <p className="text-lg text-primary-100 mb-10 max-w-xl leading-relaxed">
              KrushiSetu connects farmers directly with traders — no middlemen, transparent pricing, real-time bidding, and secure payments.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn-earth flex items-center gap-2 text-base px-7 py-3">
                Get Started <ArrowRight size={17} />
              </Link>
              <Link to="/marketplace" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-7 py-3 rounded-xl transition-all text-base">
                Browse Crops
              </Link>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1440 30 1080 0 720 0C360 0 0 30 0 30L0 60Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '2,400+', label: 'Registered Farmers' },
              { value: '850+', label: 'Active Traders' },
              { value: '12,000+', label: 'Crops Listed' },
              { value: '₹4.2Cr+', label: 'Transactions Done' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-bold text-primary-700">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">Everything you need to trade</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">A complete digital marketplace designed for India's agricultural community</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🌱', title: 'List Your Crops', desc: 'Farmers can easily list crops with photos, price, quantity and location. Fixed price or bidding — your choice.' },
              { icon: '🔍', title: 'Discover Products', desc: 'Traders can browse and filter thousands of crop listings by category, location, and price range.' },
              { icon: '🔨', title: 'Competitive Bidding', desc: 'Open bidding lets traders compete fairly, ensuring farmers get the best price for their produce.' },
              { icon: '📦', title: 'Order Tracking', desc: 'End-to-end order management with real-time status updates from placement to delivery.' },
              { icon: '💬', title: 'Direct Messaging', desc: 'Built-in real-time chat so farmers and traders can communicate without leaving the platform.' },
              { icon: '⭐', title: 'Ratings & Reviews', desc: 'Build trust with a transparent review system that holds both buyers and sellers accountable.' },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-display font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl font-bold text-gray-900 text-center mb-14">How KrushiSetu Works</h2>
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h3 className="font-display text-xl font-bold text-primary-700 mb-6 flex items-center gap-2"><span>🌾</span> For Farmers</h3>
              {['Register & create your farm profile', 'List crops with details, quantity & price', 'Receive bids or direct orders from traders', 'Accept orders & coordinate delivery', 'Get paid securely & build your reputation'].map((s, i) => (
                <div key={i} className="flex items-start gap-4 mb-4">
                  <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</div>
                  <p className="text-gray-600">{s}</p>
                </div>
              ))}
              <Link to="/register" className="btn-primary inline-flex items-center gap-2 mt-4">Join as Farmer <ArrowRight size={15} /></Link>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-earth-600 mb-6 flex items-center gap-2"><span>🏪</span> For Traders</h3>
              {['Register & verify your business', 'Browse thousands of crop listings', 'Place bids or buy directly at fixed price', 'Manage all orders in one dashboard', 'Review farmers & build long-term connections'].map((s, i) => (
                <div key={i} className="flex items-start gap-4 mb-4">
                  <div className="w-7 h-7 rounded-full bg-earth-100 text-earth-700 font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</div>
                  <p className="text-gray-600">{s}</p>
                </div>
              ))}
              <Link to="/register" className="btn-earth inline-flex items-center gap-2 mt-4">Join as Trader <ArrowRight size={15} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="font-display text-4xl font-bold mb-4">Ready to transform your agricultural trade?</h2>
          <p className="text-primary-200 text-lg mb-8">Join thousands of farmers and traders already using KrushiSetu</p>
          <Link to="/register" className="btn-earth inline-flex items-center gap-2 text-base px-8 py-3.5">
            Start for Free <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <Sprout size={15} className="text-white" />
            </div>
            <span className="font-display font-bold text-white">KrushiSetu</span>
          </div>
          <p className="text-sm">© 2025 KrushiSetu. Built at IMCC Pune · MCA SEM-I</p>
        </div>
      </footer>
    </div>
  )
}

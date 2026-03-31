import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, MapPin, Star, Clock, Flame, Leaf, ShieldCheck, 
  ArrowRight, Menu, X, ArrowLeft, Copy, Upload, Plus, Trash2, 
  LayoutDashboard, Package, ShoppingCart, Bell, CheckCircle2
} from 'lucide-react';

// --- KOMPONEN ANIMASI SCROLL REVEAL ---
const Reveal = ({ children, className = "", delay = 0, direction = "up" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  let startClass = "translate-y-12";
  if (direction === "left") startClass = "-translate-x-12";
  if (direction === "right") startClass = "translate-x-12";
  if (direction === "scale") startClass = "scale-90";

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
        isVisible ? "opacity-100 translate-y-0 translate-x-0 scale-100" : `opacity-0 ${startClass}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- DATA AWAL MOCKUP ---
const initialProducts = [
  {
    id: 1,
    name: "Paket Juara 1",
    desc: "2 Pcs Ayam Crispy (Dada & Sayap), Nasi Hangat, dan Es Teh Manis.",
    price: 35000,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cbc6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "Terlaris"
  },
  {
    id: 2,
    name: "Sayap Pedas Mampus",
    desc: "6 Pcs Sayap Ayam berbalut saus pedas rahasia level 5. Berani coba?",
    price: 42000,
    image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "Pedas"
  },
  {
    id: 3,
    name: "Burger Ayam Sultan",
    desc: "Burger dengan patty ayam super tebal, keju lumer, dan sayuran segar.",
    price: 45000,
    image: "https://images.unsplash.com/photo-1615486171431-869850549f69?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "Baru"
  }
];

const features = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-orange-500" />,
    title: "100% Ayam Segar",
    desc: "Kami tidak pernah menggunakan ayam beku. Selalu segar dari peternakan lokal setiap pagi."
  },
  {
    icon: <Flame className="w-8 h-8 text-red-500" />,
    title: "Bumbu Meresap Sempurna",
    desc: "Dimarinasi selama 12 jam dengan 11 bumbu rahasia warisan keluarga."
  },
  {
    icon: <Leaf className="w-8 h-8 text-green-500" />,
    title: "Minyak Nabati Premium",
    desc: "Digoreng menggunakan minyak nabati rendah kolesterol yang diganti secara berkala."
  }
];

// Format Rupiah
const formatRp = (angka) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

export default function App() {
  // STATE MANAGEMENT
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'checkout', 'admin'
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- NAVIGATION HELPERS ---
  const goToCheckout = () => {
    if(cart.length > 0) {
      setCurrentView('checkout');
      window.scrollTo(0, 0);
    } else {
      alert("Keranjang masih kosong, yuk pilih menu dulu!");
    }
  };
  const goToLanding = () => {
    setCurrentView('landing');
    window.scrollTo(0, 0);
  };
  const goToAdmin = () => {
    setCurrentView('admin');
    window.scrollTo(0, 0);
  };

  // --- CART HANDLERS ---
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    
    // Animasi keranjang
    const cartBtn = document.getElementById('cart-btn-floating');
    if(cartBtn) {
      cartBtn.classList.add('scale-[1.02]', 'shadow-red-500/50');
      setTimeout(() => cartBtn.classList.remove('scale-[1.02]', 'shadow-red-500/50'), 300);
    }
  };

  const getCartTotal = () => cart.reduce((total, item) => total + (item.price * item.qty), 0);
  const getCartCount = () => cart.reduce((total, item) => total + item.qty, 0);

  // Scroll effect for Landing Page Navbar
  useEffect(() => {
    if (currentView !== 'landing') return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);


  // ==========================================
  // VIEW 1: LANDING PAGE (ANIMATED DESIGN)
  // ==========================================
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-800 overflow-x-hidden relative pb-20">
        
        {/* CSS KHUSUS UNTUK ANIMASI */}
        <style>{`
          html { scroll-behavior: smooth; }
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(3deg); }
            50% { transform: translateY(-20px) rotate(-1deg); }
          }
          .animate-float-img { animation: float 6s ease-in-out infinite; }
          @keyframes blob-spin {
            from { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.1); }
            to { transform: rotate(360deg) scale(1); }
          }
          .animate-blob { animation: blob-spin 25s linear infinite; }
        `}</style>

        {/* --- NAVBAR --- */}
        <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
          <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2 group cursor-pointer" onClick={goToLanding}>
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                K
              </div>
              <span className={`text-2xl font-extrabold tracking-tight transition-colors duration-300 ${isScrolled ? 'text-gray-900' : 'text-gray-900 lg:text-white'}`}>
                Kriuk<span className="text-red-600">Juara</span>
              </span>
            </div>

            {/* Desktop Links */}
            <div className={`hidden md:flex space-x-8 font-medium transition-colors duration-300 ${isScrolled ? 'text-gray-600' : 'text-gray-800 lg:text-white'}`}>
              <a href="#beranda" className="hover:text-red-500 hover:-translate-y-0.5 transition-all">Beranda</a>
              <a href="#keunggulan" className="hover:text-red-500 hover:-translate-y-0.5 transition-all">Keunggulan</a>
              <a href="#menu" className="hover:text-red-500 hover:-translate-y-0.5 transition-all">Menu Spesial</a>
              <button onClick={goToAdmin} className="text-gray-400 hover:text-red-500 transition-all text-sm ml-4">
                [Admin Panel]
              </button>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <button 
                onClick={cart.length > 0 ? goToCheckout : () => window.location.href='#menu'} 
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                <ShoppingBag className="w-4 h-4" />
                {getCartCount() > 0 ? `${getCartCount()} Item` : 'Pesan Sekarang'}
              </button>
              <button 
                className={`md:hidden p-2 rounded-md transition-colors ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <div className={`md:hidden absolute top-full left-0 w-full bg-white shadow-xl flex flex-col items-center py-6 space-y-4 font-medium text-gray-700 transition-all duration-500 origin-top ${mobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 h-0 overflow-hidden py-0'}`}>
            <a href="#beranda" onClick={() => setMobileMenuOpen(false)}>Beranda</a>
            <a href="#keunggulan" onClick={() => setMobileMenuOpen(false)}>Keunggulan</a>
            <a href="#menu" onClick={() => setMobileMenuOpen(false)}>Menu Spesial</a>
            <button onClick={() => { setMobileMenuOpen(false); goToAdmin(); }} className="text-gray-400 font-bold border-t border-gray-100 pt-4 w-full text-center">Admin Panel</button>
            <button 
              onClick={() => { setMobileMenuOpen(false); cart.length > 0 ? goToCheckout() : window.location.href='#menu'; }} 
              className="mt-2 flex items-center justify-center w-3/4 gap-2 bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-md"
            >
              <ShoppingBag className="w-5 h-5" /> {getCartCount() > 0 ? `Checkout (${getCartCount()})` : 'Pesan Sekarang'}
            </button>
          </div>
        </nav>

        {/* --- HERO SECTION --- */}
        <section id="beranda" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] lg:w-[900px] lg:h-[900px] bg-gradient-to-br from-yellow-300 via-orange-500 to-red-600 rounded-[40%_60%_70%_30%] blur-3xl opacity-30 lg:opacity-80 animate-blob"></div>
          </div>

          <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12">
            {/* Text Area */}
            <div className="w-full lg:w-1/2 flex flex-col items-start text-center lg:text-left z-10">
              <Reveal delay={0}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/80 backdrop-blur-sm text-orange-700 font-semibold text-sm mb-6 shadow-sm border border-orange-200">
                  <Flame className="w-4 h-4 animate-pulse text-red-500" />
                  Lebih Renyah & Gurih!
                </div>
              </Reveal>
              
              <Reveal delay={150}>
                <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                  Jagonya <br className="hidden lg:block"/> Ayam Goreng <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Nusantara</span>
                </h1>
              </Reveal>

              <Reveal delay={300}>
                <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Rasakan sensasi ayam goreng dengan bumbu rahasia warisan yang digoreng sempurna. Luarnya super renyah, daging dalamnya juicy dan lumer di mulut.
                </p>
              </Reveal>

              <Reveal delay={450}>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
                  <button onClick={() => window.location.href='#menu'} className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-red-500/30 hover:-translate-y-2 hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-2 group">
                    Pilih Menu <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="bg-white/80 backdrop-blur-sm text-gray-800 px-8 py-4 rounded-full font-bold text-lg shadow-md border border-gray-100 hover:bg-white hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group">
                    <MapPin className="w-5 h-5 text-red-500 group-hover:animate-bounce" /> Outlet Kami
                  </button>
                </div>
              </Reveal>
            </div>

            {/* Image Area */}
            <div className="w-full lg:w-1/2 relative z-10 mt-16 lg:mt-0">
              <Reveal delay={200} direction="left">
                <div className="relative w-full max-w-lg mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-red-500 rounded-[3rem] blur-2xl opacity-40 animate-pulse"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1626082927389-6cd097cbc6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                    alt="Ayam Goreng Super Renyah" 
                    className="relative z-10 w-full h-auto object-cover rounded-[2.5rem] shadow-2xl animate-float-img"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 animate-[float_4s_ease-in-out_infinite_reverse]">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Pesan Antar</p>
                      <p className="text-sm font-bold text-gray-900">Langsung Diproses</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section id="keunggulan" className="py-24 bg-white relative">
          <div className="container mx-auto px-6 lg:px-12">
            <Reveal direction="up">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">Mengapa KriukJuara Beda?</h2>
                <p className="text-gray-600 text-lg">Kami tidak kompromi soal kualitas. Setiap potong ayam disiapkan dengan dedikasi tinggi untuk kepuasan Anda.</p>
              </div>
            </Reveal>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {features.map((feature, idx) => (
                <Reveal key={idx} delay={idx * 200} direction="up">
                  <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-3 transition-all duration-500 group h-full">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* --- MENU SECTION (DINAMIS DARI STATE ADMIN) --- */}
        <section id="menu" className="py-24 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <Reveal>
              <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                <div className="max-w-xl">
                  <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">Menu Andalan Kami</h2>
                  <p className="text-gray-600 text-lg">Pilihan menu terbaik yang ludes terjual setiap harinya. Tambahkan ke keranjang Anda sekarang!</p>
                </div>
              </div>
            </Reveal>

            {products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-500">Belum ada menu yang ditambahkan</h3>
                <p className="text-gray-400">Silakan tambahkan menu melalui Admin Panel.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((item, idx) => (
                  <Reveal key={item.id} delay={idx * 150} direction="scale">
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group h-full flex flex-col">
                      <div className="relative h-64 overflow-hidden bg-gray-200">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          onError={(e) => {e.target.onerror = null; e.target.src="https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=800&q=80"}}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        {item.badge && (
                          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-red-600 shadow-lg transform group-hover:-translate-y-1 transition-transform duration-300">
                            {item.badge}
                          </div>
                        )}
                      </div>
                      <div className="p-8 flex flex-col flex-grow">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">{item.name}</h3>
                        <p className="text-gray-600 mb-8 flex-grow leading-relaxed">{item.desc}</p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                          <span className="text-2xl font-black text-gray-900">{formatRp(item.price)}</span>
                          <button 
                            onClick={() => addToCart(item)}
                            className="bg-gray-100 hover:bg-red-600 hover:text-white text-gray-800 p-4 rounded-2xl hover:rotate-12 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 group/btn"
                            title="Tambah ke Keranjang"
                          >
                            <Plus className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="bg-gray-900 text-white pt-24 pb-12 mt-10">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
              <Reveal delay={100} direction="up">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform">
                      K
                    </div>
                    <span className="text-2xl font-extrabold tracking-tight text-white">
                      Kriuk<span className="text-red-500">Juara</span>
                    </span>
                  </div>
                  <p className="text-gray-400 leading-relaxed max-w-sm">
                    Menyajikan ayam goreng paling renyah dan juicy. Dibuat dengan cinta dan resep rahasia yang bikin nagih.
                  </p>
                </div>
              </Reveal>
              
              <Reveal delay={200} direction="up">
                <div>
                  <h4 className="text-lg font-bold mb-6 text-gray-100">Hubungi Kami</h4>
                  <ul className="space-y-4 text-gray-400">
                    <li className="flex items-start gap-3 group cursor-pointer">
                      <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5 group-hover:animate-bounce" />
                      <span className="group-hover:text-gray-200 transition-colors">Jl. Sudirman No. 123, Jakarta Selatan</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-red-500 shrink-0" />
                      <span>Buka Setiap Hari: 09:00 - 22:00</span>
                    </li>
                  </ul>
                </div>
              </Reveal>
              
              <Reveal delay={300} direction="up">
                 <div>
                  <h4 className="text-lg font-bold mb-6 text-gray-100">Navigasi Admin</h4>
                  <button onClick={goToAdmin} className="text-gray-400 hover:text-white transition-colors underline decoration-gray-700 underline-offset-4">
                    Masuk ke Admin Panel
                  </button>
                  <p className="text-sm text-gray-600 mt-4">
                    Gunakan panel ini untuk menambah, menghapus menu, dan melihat pesanan yang masuk.
                  </p>
                </div>
              </Reveal>
            </div>
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
              <p>&copy; {new Date().getFullYear()} Kriuk Juara. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* --- FLOATING CART BUTTON (BOTTOM BAR) --- */}
        {cart.length > 0 && (
          <div id="cart-btn-floating" className="fixed bottom-6 left-0 right-0 px-6 z-50 flex justify-center transition-all duration-300">
            <button 
              onClick={goToCheckout}
              className="w-full max-w-md bg-gray-900 text-white p-4 rounded-3xl shadow-2xl flex justify-between items-center hover:bg-black hover:scale-105 transition-all animate-[float_3s_ease-in-out_infinite]"
            >
              <div className="flex items-center gap-4">
                <div className="relative bg-white/10 p-3 rounded-2xl">
                  <ShoppingBag className="w-6 h-6 text-red-400" />
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md border-2 border-gray-900">
                    {getCartCount()}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Total Keranjang</p>
                  <p className="font-bold text-lg">{formatRp(getCartTotal())}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 font-bold text-white bg-red-600 px-5 py-2.5 rounded-xl hover:bg-red-700 transition-colors">
                Lanjut <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        )}

      </div>
    );
  }

  // ==========================================
  // VIEW 2: CHECKOUT PAGE (Sesuai PDF Warung Akang)
  // ==========================================
  if (currentView === 'checkout') {
    const handleCheckoutSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const newOrder = {
        id: "ORD-" + Math.floor(Math.random() * 10000),
        name: formData.get('fullName'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        items: [...cart],
        total: getCartTotal(),
        status: 'Menunggu',
        date: new Date().toLocaleString(),
        bukti: formData.get('bukti')?.name || "Belum ada bukti"
      };
      
      // Simpan Pesanan ke State Admin
      setOrders([newOrder, ...orders]);
      // Kosongkan Keranjang
      setCart([]);
      
      // Format Pesan untuk WhatsApp Admin
      let waMessage = `Halo Admin KriukJuara!%0A%0ASaya ingin memesan:%0A`;
      newOrder.items.forEach(item => {
        waMessage += `- ${item.qty}x ${item.name} (${formatRp(item.price * item.qty)})%0A`;
      });
      waMessage += `%0A*Total: ${formatRp(newOrder.total)}*%0A%0A*Data Pengiriman:*%0ANama: ${newOrder.name}%0ANo HP: ${newOrder.phone}%0AAlamat: ${newOrder.address}%0A%0ABukti transfer sudah diupload di website. Terima kasih!`;
      
      alert("Checkout Sukses! Sistem akan mengarahkan Anda ke WhatsApp Admin.");
      window.open(`https://wa.me/6281234567890?text=${waMessage}`, '_blank');
      goToLanding();
    };

    const copyToClipboard = (text) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert("Tersalin ke Clipboard: " + text);
    };

    return (
      <div className="min-h-screen bg-gray-50 font-sans pb-16">
        {/* Header Minimalist */}
        <div className="bg-white shadow-sm py-4 px-6 mb-8">
          <div className="container mx-auto max-w-5xl flex items-center justify-between">
            <button onClick={goToLanding} className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold transition-colors">
              <ArrowLeft className="w-5 h-5" /> RETURN TO STORE
            </button>
            <div className="font-extrabold text-xl text-gray-900 tracking-tight flex items-center gap-2">
              Kriuk<span className="text-red-600">Juara</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-5xl px-4">
          <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* KOLOM KIRI: FORM & PAYMENT */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Shipping Details */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-extrabold text-gray-900 mb-2 uppercase tracking-wide">Shipping Details</h2>
                <p className="text-sm text-gray-500 mb-6">Pastikan informasi pengiriman sudah benar</p>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input required name="fullName" type="text" placeholder="e.g. Jonathan Doe" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-0 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nomor Telepon</label>
                    <input required name="phone" type="tel" placeholder="0812..." className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-0 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Delivery Address</label>
                    <textarea required name="address" rows="3" placeholder="Alamat lengkap, patokan, atau instruksi khusus..." className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-0 transition-colors"></textarea>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-extrabold text-gray-900 mb-2 uppercase tracking-wide">Payment Method</h2>
                <p className="text-sm text-gray-500 mb-6">Pilih salah satu metode pembayaran di bawah</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {/* Bank Transfer */}
                  <div className="border-2 border-gray-100 rounded-2xl p-5 flex flex-col items-center text-center hover:border-blue-500 transition-colors">
                    <div className="font-black text-blue-800 text-2xl tracking-tighter italic mb-2">BCA</div>
                    <p className="font-mono text-lg font-bold text-gray-800 mb-1">1234-5678-9012</p>
                    <p className="text-xs text-gray-500 mb-5 font-bold">A/N KRIUK JUARA</p>
                    <button type="button" onClick={() => copyToClipboard('123456789012')} className="text-xs font-bold text-blue-700 bg-blue-50 px-5 py-2 rounded-full flex items-center gap-2 hover:bg-blue-100 transition-colors w-full justify-center">
                      <Copy className="w-4 h-4" /> COPY REKENING
                    </button>
                  </div>

                  {/* E-Wallet */}
                  <div className="border-2 border-gray-100 rounded-2xl p-5 flex flex-col items-center text-center hover:border-purple-500 transition-colors">
                    <div className="font-black text-purple-700 text-2xl tracking-tighter italic mb-2">OVO / QRIS</div>
                    <p className="font-mono text-lg font-bold text-gray-800 mb-1">0812-3456-7890</p>
                    <p className="text-xs text-gray-500 mb-5 font-bold">A/N KRIUK JUARA</p>
                    <button type="button" onClick={() => copyToClipboard('081234567890')} className="text-xs font-bold text-purple-700 bg-purple-50 px-5 py-2 rounded-full flex items-center gap-2 hover:bg-purple-100 transition-colors w-full justify-center">
                      <Copy className="w-4 h-4" /> COPY NOMOR
                    </button>
                  </div>
                </div>

                {/* Upload Bukti */}
                <h2 className="text-md font-extrabold text-gray-900 mb-2 uppercase tracking-wide">Upload Bukti Pembayaran</h2>
                <p className="text-sm text-gray-500 mb-4">Upload bukti transfer untuk verifikasi pesanan</p>
                <label className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-red-50 hover:border-red-400 transition-colors group">
                  <div className="bg-white shadow-sm p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-red-600" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 mb-1">Drag & drop atau klik untuk browse</span>
                  <span className="text-xs text-gray-400">Format: JPG, PNG, PDF (Max 5MB)</span>
                  <input type="file" name="bukti" className="hidden" accept="image/*,.pdf" />
                </label>
              </div>
            </div>

            {/* KOLOM KANAN: ORDER SUMMARY */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-extrabold text-gray-900 mb-6 uppercase tracking-wide flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-red-500" /> Order Summary
                </h2>
                
                {/* Item List */}
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start border-b border-gray-50 pb-4">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.qty} UNIT</p>
                      </div>
                      <p className="font-bold text-gray-900 text-sm">{formatRp(item.price * item.qty)}</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="bg-gray-50 p-4 rounded-2xl mb-6 space-y-3">
                  <div className="flex justify-between text-gray-600 text-sm font-bold">
                    <span>SUBTOTAL</span>
                    <span>{formatRp(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm font-bold">
                    <span>DELIVERY FEE</span>
                    <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded text-xs uppercase">FREE / Promo</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm font-black text-gray-900 uppercase">Total Amount</span>
                    <span className="text-2xl font-black text-red-600">{formatRp(getCartTotal())}</span>
                  </div>
                </div>

                <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/30 transition-all mb-6">
                  UPLOAD & COMPLETE ORDER
                </button>

                <div className="text-center space-y-3 bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <p className="text-xs text-orange-800 font-bold uppercase tracking-wider leading-relaxed">
                    Pesanan akan diverifikasi setelah bukti pembayaran diupload.
                  </p>
                  <p className="text-xs text-orange-600/80">
                    Admin akan menghubungi Anda via WhatsApp setelah verifikasi selesai.
                  </p>
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: ADMIN PANEL (Pengelolaan Produk UMKM)
  // ==========================================
  if (currentView === 'admin') {
    // Simulasi suara notifikasi
    const playNotificationSound = () => {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    };

    const handleAddProduct = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const newProduct = {
        id: Date.now(),
        name: formData.get('name'),
        desc: formData.get('desc'),
        price: parseInt(formData.get('price')),
        image: formData.get('image') || "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        badge: formData.get('badge')
      };
      setProducts([newProduct, ...products]);
      e.target.reset();
      alert("Produk berhasil ditambahkan! Cek halaman depan untuk melihat perubahannya.");
    };

    const handleDeleteProduct = (id) => {
      if(window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
        setProducts(products.filter(p => p.id !== id));
      }
    };

    return (
      <div className="min-h-screen bg-gray-100 font-sans flex flex-col md:flex-row">
        {/* Sidebar Kiri */}
        <div className="w-full md:w-64 bg-gray-900 text-white flex flex-col shadow-2xl z-10 relative">
          <div className="p-6 border-b border-gray-800 flex justify-center items-center">
            <h1 className="text-xl font-extrabold tracking-tight">Kriuk<span className="text-red-500">Admin</span></h1>
          </div>
          <div className="p-4 flex-grow space-y-2 mt-4">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-xl text-red-500 font-bold shadow-sm">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-xl text-gray-300 font-medium transition-colors">
              <ShoppingCart className="w-5 h-5" /> Pesanan Masuk
              {orders.length > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{orders.length}</span>}
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-xl text-gray-300 font-medium transition-colors">
              <Package className="w-5 h-5" /> Kelola Produk
            </button>
          </div>
          <div className="p-6 border-t border-gray-800 bg-gray-900">
            <button onClick={goToLanding} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-red-500/30">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Toko
            </button>
          </div>
        </div>

        {/* Konten Utama Admin */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
          {/* Header Admin */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Selamat Datang, Admin!</h2>
              <p className="text-gray-500 mt-1">Kelola jualan Anda dengan mudah di sini.</p>
            </div>
            <button onClick={playNotificationSound} className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl shadow-sm text-sm font-bold text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all">
              <Bell className="w-4 h-4 text-yellow-500" /> Test Bunyi Notif
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Panel Kiri: Pesanan Masuk */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <ShoppingCart className="text-red-500" /> Daftar Pesanan Masuk
              </h3>
              
              {orders.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Belum ada pesanan baru hari ini.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>
                      <div className="flex justify-between items-start mb-3 pl-2">
                        <div>
                          <span className="text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded uppercase tracking-wider">{order.status}</span>
                          <h4 className="font-bold text-gray-900 mt-2 text-lg">{order.name}</h4>
                          <p className="text-sm text-gray-500">{order.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 mb-1">{order.date}</p>
                          <p className="font-black text-red-600 text-lg">{formatRp(order.total)}</p>
                        </div>
                      </div>
                      <div className="pl-2">
                        <p className="text-xs text-gray-500 mb-2 truncate" title={order.address}><MapPin className="w-3 h-3 inline mr-1" />{order.address}</p>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 mt-3">
                          <span className="text-xs font-bold text-gray-600 uppercase mb-2 block">Item Pesanan:</span>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {order.items.map((item, i) => <li key={i} className="flex justify-between"><span>{item.qty}x {item.name}</span> <span className="text-gray-400">{formatRp(item.price * item.qty)}</span></li>)}
                          </ul>
                          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500 font-medium flex items-center gap-2">
                            <Upload className="w-3 h-3" /> Bukti: <span className="text-blue-600 truncate">{order.bukti}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Panel Kanan: Kelola Produk */}
            <div className="space-y-8">
              
              {/* Form Tambah Produk */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                  <Plus className="text-red-500" /> Tambah Produk Baru
                </h3>
                <form onSubmit={handleAddProduct} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Produk</label>
                    <input required name="name" type="text" placeholder="Contoh: Ayam Geprek Spesial" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:ring-0 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Harga (Angka)</label>
                    <input required name="price" type="number" placeholder="Contoh: 25000" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:ring-0 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Deskripsi Menarik</label>
                    <textarea required name="desc" rows="2" placeholder="Jelaskan kelezatan makanan ini..." className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:ring-0 transition-colors"></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Badge (Opsional)</label>
                      <input name="badge" type="text" placeholder="Cth: Baru, Pedas" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:ring-0 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">URL Gambar Jelas</label>
                      <input name="image" type="url" placeholder="https://..." className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:ring-0 transition-colors" />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-colors shadow-lg mt-4">
                    Simpan & Publikasikan
                  </button>
                </form>
              </div>

              {/* Daftar Produk Aktif */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2"><Package className="text-red-500" /> Produk Tersedia</div>
                  <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full font-bold">{products.length} Menu</span>
                </h3>
                
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {products.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shadow-sm" onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/100?text=No+Img"}} />
                        <div>
                          <p className="font-bold text-sm text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{formatRp(item.price)}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteProduct(item.id)} className="text-gray-400 hover:bg-red-50 hover:text-red-600 p-2.5 rounded-xl transition-colors" title="Hapus Menu">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
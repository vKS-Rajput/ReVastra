import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-red-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-32 sm:pt-0">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-white/80 text-sm font-medium">India's Premier Fashion Rental Platform</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          <span className="block">Rent Fashion,</span>
          <span className="block bg-gradient-to-r from-red-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Not Closet Space
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Why buy when you can rent? Access premium fashion for any occasion.
          <span className="text-white font-semibold"> List your wardrobe</span> and earn, or
          <span className="text-white font-semibold"> discover unique pieces</span> at a fraction of the cost.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => navigate('/collection')}
            className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-full shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105"
          >
            <span className="relative z-10">Browse Collection</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>

          <button
            onClick={() => navigate('/lend')}
            className="group px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              List Your Fashion
            </span>
          </button>
        </div>


        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/50 text-xs">Scroll to explore</span>
          <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* Floating Fashion Cards (decorative) */}
        <div className="hidden lg:block absolute top-1/4 left-10 w-32 h-40 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/10 transform -rotate-12 hover:rotate-0 transition-transform duration-500">
          <div className="p-3">
            <div className="w-full h-24 bg-gradient-to-br from-red-400/30 to-pink-400/30 rounded-lg mb-2"></div>
            <div className="h-2 bg-white/20 rounded w-3/4"></div>
            <div className="h-2 bg-white/10 rounded w-1/2 mt-1"></div>
          </div>
        </div>

        <div className="hidden lg:block absolute bottom-1/4 right-10 w-32 h-40 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/10 transform rotate-12 hover:rotate-0 transition-transform duration-500">
          <div className="p-3">
            <div className="w-full h-24 bg-gradient-to-br from-purple-400/30 to-indigo-400/30 rounded-lg mb-2"></div>
            <div className="h-2 bg-white/20 rounded w-3/4"></div>
            <div className="h-2 bg-white/10 rounded w-1/2 mt-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

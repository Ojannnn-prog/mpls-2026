import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'

const ImageSlider = ({ images, altText }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) return null;

  const currentImage = typeof images[currentIndex] === 'string' ? images[currentIndex] : images[currentIndex].src;
  const currentCaption = typeof images[currentIndex] === 'object' ? images[currentIndex].caption : '';

  return (
    <div className="w-full h-48 sm:h-56 rounded-2xl mb-5 overflow-hidden flex items-center justify-center border border-white/10 relative group bg-black/50">
      <img 
        src={currentImage} 
        alt={`${altText} - ${currentIndex + 1}`} 
        className="w-full h-full object-cover transition-opacity duration-500" 
      />
      
      {currentCaption && (
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 pointer-events-none">
          <p className="text-white/90 text-xs sm:text-sm font-medium text-center drop-shadow-md">
            {currentCaption}
          </p>
        </div>
      )}
      
      {images.length > 1 && (
        <>
          <div 
            className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer bg-black/40 hover:bg-black/80 text-white rounded-full p-1 backdrop-blur-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300"
            onClick={prevSlide}
          >
            <ChevronLeft size={20} />
          </div>
          <div 
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer bg-black/40 hover:bg-black/80 text-white rounded-full p-1 backdrop-blur-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300"
            onClick={nextSlide}
          >
            <ChevronRight size={20} />
          </div>
          <div className="absolute top-2 right-2 flex gap-1.5 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${idx === currentIndex ? 'w-3 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function UIOverlay({ isPlaying, currentStop, onStart, onNext, onReturn, isReturning }) {
  const images2024 = [
    { src: "/WhatsApp%20Image%202026-07-07%20at%2018.10.28.jpeg", caption: "Semangat siswa baru di hari pertama MPLS." },
    { src: "/WhatsApp%20Image%202026-07-07%20at%2018.10.29.jpeg", caption: "Kegiatan perkenalan lingkungan sekolah." },
    { src: "/WhatsApp%20Image%202026-07-07%20at%2018.10.28%20(1).jpeg", caption: "Keseruan bermain sambil belajar." }
  ]

  const images2025 = [
    { src: "/WhatsApp%20Image%202026-07-07%20at%2018.11.21%20(1).jpeg", caption: "Eksplorasi bakat dan minat siswa." },
    { src: "/WhatsApp%20Image%202026-07-07%20at%2018.11.21%20(2).jpeg", caption: "Kekompakan bersama teman-teman baru." },
    { src: "/WhatsApp%20Image%202026-07-07%20at%2018.11.21.jpeg", caption: "Membangun karakter penerus bangsa." }
  ]

  const images2026 = [
    { src: "/Screenshot%202026-07-07%20190355.png", caption: "Bersiap untuk petualangan berikutnya!" }
  ]

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
      {/* Start Button */}
      {!isPlaying && !isReturning && (
        <button 
          onClick={onStart}
          className="pointer-events-auto px-8 py-4 sm:px-10 sm:py-5 bg-indigo-600/30 hover:bg-indigo-600/50 backdrop-blur-xl border border-indigo-400/50 rounded-3xl text-white font-bold text-xl sm:text-2xl tracking-widest uppercase transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] cursor-pointer"
        >
          Click n Play
        </button>
      )}

      {/* Info Panels */}
      {isPlaying && currentStop > 0 && !isReturning && (
        <div className="absolute left-4 right-4 bottom-4 md:left-auto md:right-12 md:bottom-12 md:w-[384px] animate-fade-in pointer-events-auto transition-opacity duration-1000 opacity-100 max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl">
          <div className="bg-black/40 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            {currentStop === 1 && <ImageSlider images={images2024} altText="MPLS 2024" />}
            {currentStop === 2 && <ImageSlider images={images2025} altText="MPLS 2025" />}
            {currentStop === 3 && <ImageSlider images={images2026} altText="MPLS 2026" />}
            
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
              {currentStop === 1 && "MPLS 2024"}
              {currentStop === 2 && "MPLS 2025"}
              {currentStop === 3 && "Coming soon : MPLS 2026 SDN 231 Sukaasih"}
            </h2>
            
            <p className="text-gray-300/90 leading-relaxed text-xs sm:text-sm font-light mb-5 sm:mb-6">
              {currentStop === 1 && "Mars is the fourth planet from the Sun, located in the Milky Way galaxy."}
              {currentStop === 2 && "Jupiter is a gas giant and the largest planet in our solar system."}
              {currentStop === 3 && "The final frontier for this year's exploration."}
            </p>
            
            {currentStop < 3 ? (
              <button 
                onClick={onNext}
                className="w-full py-3 sm:py-3.5 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-xl text-white text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 font-semibold border border-white/10 hover:border-white/30"
              >
                Next Destination
              </button>
            ) : (
              <button 
                onClick={onReturn}
                className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-red-600/30 hover:bg-red-600/50 active:bg-red-600/60 rounded-xl text-white text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 font-bold border border-red-400/50 hover:border-red-400/80 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                <RotateCcw size={18} />
                Kembali ke Awal
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Helper Text */}
      {isPlaying && currentStop > 0 && !isReturning && (
         <div className="absolute top-8 w-full text-center pointer-events-none animate-pulse opacity-60 text-white font-light tracking-widest text-xs sm:text-sm drop-shadow-md px-4">
           Geser (swipe) atau klik dan seret untuk memutar
         </div>
      )}

      {/* Returning Overlay Message */}
      {isReturning && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-[0.3em] uppercase drop-shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-pulse">
             Warp Speed!
           </h1>
        </div>
      )}
    </div>
  )
}

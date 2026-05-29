import React, { useEffect, useState } from 'react';
import { CheckSquare } from 'lucide-react'; 

export default function SplashScreen({ onFinished }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    
    const finishTimer = setTimeout(() => {
      onFinished();
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [onFinished]);

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070b19] transition-opacity duration-500 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      
      <div className="relative flex flex-col items-center gap-4">
        
       
        <div className="absolute w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        
       
        <div className="relative bg-white/5 border border-white/10 p-6 rounded-3xl shadow-2xl backdrop-blur-md transform animate-bounce duration-1000">
          <CheckSquare size={64} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
        </div>

        <h1 className="text-2xl font-black tracking-widest text-white mt-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent uppercase animate-pulse">
         Daily Taskify 
        </h1>
        
        <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full animate-[loading_2.5s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
}
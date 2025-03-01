import { useState } from 'react';

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-gradient-to-r from-green-800 to-green-600 text-white shadow-lg border-b-4 border-black">
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-wrap items-center justify-between">
          <div className="w-full text-center mb-4">
            <h1 className="text-3xl font-bold flex items-center justify-center">
              {/* Replace image components with SVG or emoji */}
              <span className="mr-3 text-4xl">🧱</span>
              Minecraft Block Art Generator
              <span className="ml-3 text-4xl">💎</span>
            </h1>
            <p className="text-sm mt-1 opacity-80 text-yellow-200">Transform your images into Minecraft block masterpieces</p>
          </div>
          
          <div className="w-full flex justify-center space-x-6">
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="flex items-center px-3 py-2 rounded-md bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
              >
                <span>Project Info</span>
                <svg 
                  className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute z-50 mt-2 w-80 rounded-md shadow-lg bg-gray-800 text-white ring-1 ring-black ring-opacity-5">
                  <div className="p-4">
                    <h3 className="text-lg font-medium border-b border-gray-700 pb-2 mb-3">Project Highlights</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✦</span>
                        <span>Advanced image processing with color matching algorithms</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✦</span>
                        <span>Full-stack application with React frontend and Python backend</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✦</span>
                        <span>Interactive UI with real-time feedback and animations</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✦</span>
                        <span>Optimized performance for processing large images</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✦</span>
                        <span>Responsive design that works on all devices</span>
                      </li>
                    </ul>
                    
                    <div className="mt-4 pt-3 border-t border-gray-700">
                      <p className="text-sm text-gray-300">
                        This project demonstrates skills in: React, Next.js, Python, FastAPI, image processing, 
                        responsive UI design, and algorithm optimization.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <a 
              href="https://github.com/shivaansh74/mc_image_processer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 rounded-md bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.934.359.31.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.16 22 16.417 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm opacity-80">
          <p>
            Developed by Shivaansh Dhingra 
            (<a 
              href="https://github.com/shivaansh74" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline hover:text-yellow-200"
            >
              @shivaansh74
            </a>)
          </p>
        </div>
      </div>
    </header>
  );
}

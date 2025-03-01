export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-8 border-t-4 border-gray-900 relative">
      {/* Minecraft-style dirt texture pattern using CSS */}
      <div className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: `linear-gradient(45deg, #5a3d25 25%, transparent 25%, transparent 75%, #5a3d25 75%, #5a3d25), linear-gradient(45deg, #5a3d25 25%, transparent 25%, transparent 75%, #5a3d25 75%, #5a3d25)`,
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 8px 8px',
          }}></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <p className="mb-2">
          <span className="font-bold">Minecraft Block Art Generator</span> | 
          <a 
            href="https://github.com/shivaansh74/mc_image_processer"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-300 hover:text-blue-200 transition-colors"
          >
            View on GitHub
          </a>
        </p>
        <p className="text-sm text-gray-400">
          Developed by Shivaansh Dhingra | &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

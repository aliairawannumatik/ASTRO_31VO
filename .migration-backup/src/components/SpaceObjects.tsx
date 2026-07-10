const SpaceObjects = () => {
  return (
    <>
      {/* Planets */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full opacity-40 blur-xl animate-float-slow">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-transparent opacity-60" />
      </div>

      <div className="absolute top-32 right-20 w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full opacity-30 blur-lg animate-float-slow" style={{ animationDelay: '1s' }}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-transparent opacity-50" />
      </div>

      <div className="absolute bottom-20 left-1/4 w-32 h-32 bg-gradient-to-br from-orange-500 to-red-700 rounded-full opacity-20 blur-2xl" style={{ animationDelay: '2s' }}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-transparent opacity-40" />
      </div>

      {/* Asteroids */}
      <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-gray-500 rounded-full opacity-50 animate-float-slow" style={{ animationDelay: '0.5s' }}>
        <div className="absolute inset-1 bg-gray-600 rounded-full opacity-60" />
        <div className="absolute w-2 h-2 bg-gray-400 rounded-full top-3 left-2 opacity-40" />
      </div>

      <div className="absolute bottom-1/3 right-1/3 w-8 h-8 bg-gray-500 rounded-full opacity-40 animate-float-slow" style={{ animationDelay: '1.5s' }}>
        <div className="absolute inset-1 bg-gray-600 rounded-full opacity-50" />
      </div>

      {/* Nebula effects */}
      <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-gradient-radial from-cyan-500/20 via-transparent to-transparent rounded-full filter blur-3xl opacity-20" />

      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-purple-500/20 via-transparent to-transparent rounded-full filter blur-3xl opacity-15" />

      {/* Shooting star effect */}
      <div className="absolute top-1/2 left-10 w-1 h-1 bg-cyan-300 rounded-full shadow-lg animate-pulse" style={{
        boxShadow: '0 0 15px 2px rgba(34, 211, 238, 0.6), 0 0 30px 4px rgba(34, 211, 238, 0.3)',
        animation: 'float 4s ease-in-out infinite'
      }} />

      {/* Decorative rings/orbits */}
      <div className="absolute top-1/4 right-1/3 w-40 h-40 border-2 border-cyan-500/20 rounded-full animate-rotate-slow" />
      <div className="absolute bottom-1/3 left-1/3 w-56 h-56 border-2 border-purple-500/15 rounded-full animate-rotate-slow" style={{ animationDelay: '-5s' }} />
    </>
  );
};

export default SpaceObjects;

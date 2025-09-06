export default function AppreciaView() {
  return (
    <div className="h-96 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden flex items-center justify-center">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Floating cubes */}
      <div className="absolute left-1/4 top-1/3 w-12 h-12 bg-purple-500 opacity-80 animate-bounce" 
           style={{ animationDelay: '0s', animationDuration: '3s' }} />
      <div className="absolute right-1/4 top-1/2 w-8 h-8 bg-blue-400 opacity-70 animate-bounce" 
           style={{ animationDelay: '1s', animationDuration: '4s' }} />
      <div className="absolute left-1/3 bottom-1/3 w-10 h-10 bg-indigo-400 opacity-60 animate-bounce" 
           style={{ animationDelay: '2s', animationDuration: '5s' }} />
      
      {/* Main content */}
      <div className="text-center z-10 text-white">
        <h1 className="text-5xl font-bold mb-4 animate-pulse">Apprecia</h1>
        <p className="text-xl opacity-90">Virtual Art Gallery Platform</p>
        <div className="mt-4 w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full animate-pulse" />
      </div>
    </div>
  );
}

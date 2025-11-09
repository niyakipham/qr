
import React from 'react';
import { QrGenerator } from './components/QrGenerator';
import { Sphere } from './components/Sphere';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      {/* Background Spheres */}
      <Sphere className="bg-purple-400/80 -top-24 -left-40" size={400} />
      <Sphere className="bg-cyan-300/80 -bottom-32 -right-32" size={500} />
      <Sphere className="bg-yellow-200/80 top-1/2 left-1/4" size={200} />
      <Sphere className="bg-pink-300/80 top-1/4 right-1/4" size={300} />
      
      <QrGenerator />
    </div>
  );
};

export default App;

import AppreciaView from '@/components/AppreciaView';
import Navbar from '../components/Nav/Navbar';
import { auth } from '@/firebase/config';
import { useState } from 'react';

export default function Home() {
  const user = auth.currentUser;
  const [isLoaded, setIsLoaded] = useState(false);

  const handleSplineLoad = () => {
    setIsLoaded(true);
    const { gl } = document.getElementsByTagName("canvas")[0];
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  };

  return (
    <div className="w-full">
      <Navbar user={user} />
      <main
        className="flex h-96 w-full flex-col items-center justify-center bg-fixed bg-center bg-cover bg-repeat"
        style={{
          background: isLoaded ? 'none' : 'url(/appreciabg.png)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'none',
        }}
      >
        <AppreciaView className="h-full w-full" onLoad={handleSplineLoad} />
      </main>
    </div>
  );
}

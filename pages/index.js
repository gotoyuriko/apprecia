import AppreciaView from '@/components/AppreciaView';
import Navbar from '../components/Nav/Navbar';
import { auth } from '@/firebase/config';
import { useEffect, useState } from 'react';

export default function Home() {
  const user = auth.currentUser;
  const [isLoaded, setIsLoaded] = useState(false);

  const handleSplineLoad = () => {
    setIsLoaded(true);
    const canvasElement = document.getElementsByTagName('canvas')[0];
    if (canvasElement) {
      try {
        const { gl } = canvasElement;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } catch (error) {
        console.error('Error binding framebuffer:', error);
      }
    }
  };

  // This will run one time after the component mounts
  useEffect(() => {
    // callback function to call when event triggers
    const onPageLoad = () => {
      console.log('page loaded');
      setIsLoaded(true);
    };

    // Check if the page has already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      onPageLoad();
    } else {
      document.addEventListener('DOMContentLoaded', onPageLoad);
      // Remove the event listener when component unmounts
      return () => document.removeEventListener('DOMContentLoaded', onPageLoad);
    }
  }, []);

  return (
    <div className="w-full">
      <Navbar user={user} />
      <main className="flex h-96 w-full flex-col items-center justify-center bg-fixed bg-center bg-cover bg-repeat">
        {!isLoaded && (
          <div
            style={{
              width: '100%',
              position: 'relative',
              zIndex: 0,
              background: 'url(/appreciabg.png)',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'none'
            }}
          />
        )}
        <AppreciaView className="h-full w-full" onLoad={handleSplineLoad} />
      </main>
    </div>
  );
}

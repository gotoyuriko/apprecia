import AppreciaView from '@/components/AppreciaView';
import Navbar from '../components/Nav/Navbar';
import { auth } from '@/firebase/config';
import { useEffect, useState } from 'react';

export default function Home() {
  const user = auth.currentUser;
  const [isLoaded, setIsLoaded] = useState(false);

  const handleSplineLoad = () => {
    setIsLoaded(true);
    const { gl } = document.getElementsByTagName("canvas")[0];
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  };

  // This will run one time after the component mounts
  useEffect(() => {
    // callback function to call when event triggers
    const onPageLoad = () => {
      console.log('page loaded');
      setIsLoaded(true);
    };

    // Check if the page has already loaded
    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad, false);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener('load', onPageLoad);
    }
  }, []);


  const backgroundStyles = isLoaded ?
    {} :
    {
      width: '100%',
      position: 'relative',
      zIndex: 0,
      background: 'url(/appreciabg.png)',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'none'
    }

  return (
    <div className="w-full">
      <Navbar user={user} />
      <main
        className="flex h-96 w-full flex-col items-center justify-center bg-fixed bg-center bg-cover bg-repeat"
        style={backgroundStyles}
      >
        <AppreciaView className="h-full w-full" onLoad={handleSplineLoad} />
      </main>
    </div>
  );
}

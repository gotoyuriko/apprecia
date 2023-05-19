import AppreciaView from '@/components/AppreciaView';
import Navbar from '../components/Nav/Navbar';
import { auth } from '@/firebase/config';
import { useState, useEffect } from 'react';

export default function Home() {
  const user = auth.currentUser;
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset the loaded state when the component mounts
  useEffect(() => {
    setIsLoaded(false);
  }, []);

  // const handleSceneLoad = () => {
  //   console.log('handleSceneLoad called');
  //   setIsLoaded(true);
  // };

  return (
    <div className="w-full">
      <Navbar user={user} />
      <div
        className="h-96"
        style={isLoaded ? {} : {
          width: '100%',
          position: 'relative',
          zIndex: 0,
          background: 'url(/appreciabg.png)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <AppreciaView />
      </div>
    </div>
  );
}

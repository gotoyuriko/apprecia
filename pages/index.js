import AppreciaView from '@/components/AppreciaView';
import Navbar from '../components/Nav/Navbar';
import { auth } from '@/firebase/config';
import { useState } from 'react';

export default function Home() {
  const user = auth.currentUser;
  const [isLoaded, setIsLoaded] = useState(false);

  const handleSceneLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="w-full">
      <Navbar user={user} />
      <div
        {
        ...isLoaded ? style = {
          width: '100%',
          position: 'relative',
          zIndex: 0,
          background: 'url(/appreciabg.png)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'none'
        } : null
        }
        className='h-96'
        onLoad={() => setIsLoaded(true)}

      >
        <AppreciaView onSceneLoad={handleSceneLoad} />
      </div>
    </div>
  );
}

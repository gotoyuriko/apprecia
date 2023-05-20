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

  return (
    <div className="w-full">
      <Navbar user={user} />
      <div
        className="h-96"

      >
        <AppreciaView />
      </div>
    </div>
  );
}

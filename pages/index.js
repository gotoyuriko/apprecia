import React, { useState, useEffect } from 'react';
import Navbar from '../components/Nav/Navbar';
import AppreciaView from '@/components/AppreciaView';
import SearchBar from '@/components/searchBar';
import { auth } from '@/firebase/config';

export default function Home() {
  const user = auth.currentUser;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, []);

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
      <SearchBar />
    </div>
  );
}

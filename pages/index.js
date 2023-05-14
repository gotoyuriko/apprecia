import AppreciaView from '@/components/AppreciaView';
import Navbar from '../components/Nav/Navbar';
import { auth } from '@/firebase/config';
import { useState } from 'react';

export default function Home() {

  // Get the current user
  const user = auth.currentUser;

  // const [isLoaded, setIsLoaded] = useState(false);
  // const backgroundImage = '/appreciabg.png';

  return (
    <div className="w-full">
      <Navbar user={user} />
      {/* onObjectLoad is the event when object is loaded */}
      <main className="flex h-96 w-full flex-col items-center justify-center bg-fixed bg-center bg-cover bg-repeat"
      // style={{
      //   background: isLoaded ? 'none' : `url(${backgroundImage})`,
      //   backgroundPosition: 'center',
      //   backgroundSize: 'cover',
      //   backgroundRepeat: 'none'
      // }}
      >
        {/* <AppreciaView className="h-full w-full" onLoad={() => setIsLoaded(true)} /> */}
        <AppreciaView className="h-full w-full" />
      </main>
    </div >
  );
}

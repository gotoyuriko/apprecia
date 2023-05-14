import ThreeApprecia from '@/components/ThreeApprecia';
import Navbar from '../components/Navbar';
import { useState } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleObjectLoad = () => {
    setIsLoading(false);
  };
  return (
    <div className="w-full">
      <Navbar />
      {/* First View */}
      <main className="flex h-96 w-full flex-col items-center justify-center 
                        bg-fixed bg-center bg-cover bg-repeat"
        style={{
          background: isLoading ? 'url(/appreciaBG.png)' : 'none',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'none'
        }}>

        <ThreeApprecia className="h-full w-full" onObjectLoad={handleObjectLoad} />
      </main>
    </div >
  );
}

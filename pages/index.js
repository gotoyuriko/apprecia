import ThreeApprecia from '@/components/ThreeApprecia';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="w-full">
      <Navbar />
      {/* First View */}
      <main className="flex h-96 w-full flex-col items-center justify-center 
                        bg-fixed bg-center bg-cover bg-repeat">
        {/* Overlay White Background */}

        <ThreeApprecia className='h-full w-full' />
      </main>
    </div >
  );
}

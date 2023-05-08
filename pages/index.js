import ThreeApprecia from '@/components/ThreeApprecia';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="w-full">
      <Navbar />
      {/* First View */}
      <main className="flex h-96 w-full flex-col items-center justify-between relative">
        <ThreeApprecia className='h-fit' />
      </main>
    </div >
  );
}

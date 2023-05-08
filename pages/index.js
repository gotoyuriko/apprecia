
import ThreeApprecia from '@/components/ThreeApprecia';
import Navbar from '../components/Navbar';
import { Inter } from 'next/font/google'
// import Image from 'next/image'
var firstViewImagePath = "/firstView.jpg";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className="w-full">
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-between p-24"
      // style={{
      //   backgroundImage: `url('${firstViewImagePath}')`,
      //   backgroundSize: 'cover',
      //   backgroundPosition: 'center',
      // }} >
      >
        <ThreeApprecia />
      </main>
    </div >
  )
}

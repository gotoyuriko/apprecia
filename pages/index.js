import AppreciaView from '@/components/AppreciaView';
import Navbar from '../components/Nav/Navbar';
import { auth } from '@/firebase/config';

export default function Home() {

  // Get the current user
  const user = auth.currentUser;

  return (
    <div className="w-full">
      <Navbar user={user} />
      {/* onObjectLoad is the event when object is loaded */}
      <AppreciaView className="h-full w-full" />
    </div >
  );
}

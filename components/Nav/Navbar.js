import { BiMenuAltLeft, BiX } from 'react-icons/bi';
import { useState } from 'react';
import Link from 'next/link';
import { menuList, profileList } from '@/data/data';
import Logo from './Logo';
import NavItem from './NavItem';
import SignInUpBtn from './SignInUpBtn';
import ProfileMenu from './ProfileMenu';

export default function Navbar({ currentUser }) {
    // Hamburger Toggle Button
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="w-full flex items-center justify-evenly bg-[#f8fafc] py-6 sticky top-0 z-50">
                {/* === Hamburger === */}
                <button className='text-4xl focus:outline-none md:hidden' onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <BiX /> : <BiMenuAltLeft />}
                </button>
                {/* === Logo === */}
                <Link passHref href='/'>
                    <Logo />
                </Link>
                {/* ==== Menu List Desktop === */}
                <ul className={`hidden md:block md:flex md:flex-row md:justify-evenly`}>
                    {/* Desktop Style : False */}
                    <NavItem menuList={menuList} device={false} />
                </ul>
                {/* === Sign In/Sign Up Button or Profile Button ==== */}
                <div>
                    {currentUser ?
                        // Profile Menu
                        <ProfileMenu profileList={profileList} currentUser={currentUser} />
                        :
                        // Sign In and Sign Up && Desktop Style : False
                        <SignInUpBtn device={false} />
                    }
                </div>
            </nav >

            {/* === Menu List Mobile === */}
            < ul className={`z-40 fixed top-0 pl-10 pt-40 h-screen w-full flex flex-col items-start ${isOpen ? 'block bg-white' : 'hidden bg-none'} md:hidden`}>
                <li>
                    <h1 className='text-3xl font-bold'>{currentUser ? `Hi, ${currentUser.displayName}` : 'Welcome to Apprecia !'}</h1>
                </li>
                {/* Mobile Style : True */}
                <NavItem menuList={menuList} device={true} />

                {/* === Sign in and up / Sign out Button === */}
                <li className='mt-10'>
                    {!currentUser &&
                        // Sign In and Sign Up && Mobile Style : True
                        <SignInUpBtn device={true} />
                    }
                </li>
            </ul >
        </>
    );
}

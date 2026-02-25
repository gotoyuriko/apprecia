import { BiMenuAltLeft, BiX } from 'react-icons/bi';
import { useState } from 'react';
import Link from 'next/link';
import { menuList, profileList } from '@/data/data';
import Logo from './Logo';
import NavItem from './NavItem';
import SignInUpBtn from './SignInUpBtn';
import ProfileMenu from './ProfileMenu';
import type { User } from 'firebase/auth';

interface NavbarProps {
    currentUser?: User | null;
}

export default function Navbar({ currentUser }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="w-full flex items-center justify-evenly bg-[#f8fafc] py-6 sticky top-0 z-50">
                <button className='text-4xl focus:outline-none md:hidden' onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <BiX /> : <BiMenuAltLeft />}
                </button>
                <Link passHref href='/'>
                    <Logo />
                </Link>
                <ul className={`hidden md:block md:flex md:flex-row md:justify-evenly`}>
                    <NavItem menuList={menuList} device={false} />
                </ul>
                <div>
                    {currentUser ?
                        <ProfileMenu profileList={profileList} currentUser={currentUser} />
                        :
                        <SignInUpBtn device={false} />
                    }
                </div>
            </nav>
            <ul className={`z-40 fixed top-0 pl-10 pt-40 h-screen w-full flex flex-col items-start ${isOpen ? 'block bg-white' : 'hidden bg-none'} md:hidden`}>
                <li>
                    <h1 className='text-3xl font-bold'>{currentUser ? `Hi, ${currentUser.displayName}` : 'Welcome to Apprecia !'}</h1>
                </li>
                <NavItem menuList={menuList} device={true} />
                <li className='mt-10'>
                    {!currentUser && <SignInUpBtn device={true} />}
                </li>
            </ul>
        </>
    );
}

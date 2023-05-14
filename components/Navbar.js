import { BiMenuAltLeft, BiX } from 'react-icons/bi';
import Logo from "./Logo";
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const menuList = [
        { name: 'Explore Work' },
        { name: 'About' },
        { name: 'FAQ' }
    ]

    // Hamburger Toggle Button
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <nav className="w-full flex items-center justify-evenly bg-[#f8fafc] py-6 sticky top-0 z-50">
                {/* Hamburger */}
                <button className='text-4xl focus:outline-none md:hidden' onClick={toggleMenu}>
                    {isOpen ? <BiX /> : <BiMenuAltLeft />}
                </button>
                {/* Logo */}
                <Link href='/'>
                    <Logo />
                </Link>
                {/* Menu List Desktop*/}
                <ul className={`hidden md:block md:flex md:flex-row md:justify-evenly`}>
                    {menuList.map((item, index) => (
                        <li key={index} className='py-2  md:mr-6 cursor-pointer'>
                            <Link href='/' className='text-xl'>{item.name}</Link>
                        </li>
                    ))}
                </ul>
                {/* Sign In Button */}
                <div>
                    <Link href="/signin" className='md:mr-5 '>Sign In</Link>
                    <Link href="/signup" className='p-3 bg-black font-bold text-white rounded-lg hidden md:inline-block'>Sign Up</Link>
                </div>
            </nav>
            {/* Menu List Mobile*/}
            <ul className={`h-40 flex flex-col items-center justify-center text-center ${isOpen ? 'block bg-white' : 'hidden bg-none'} md:hidden`}>
                {menuList.map((item, index) => (
                    <li key={index} className='py-2'>
                        <Link href='/' className='text-2xl'>{item.name}</Link>
                    </li>
                ))}
            </ul>
        </>
    );
}
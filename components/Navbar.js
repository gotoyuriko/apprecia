import { BiMenuAltLeft, BiX } from 'react-icons/bi';
import Logo from "./Logo";
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
    // Hamburger Toggle Button
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    return (
        <nav className="w-full flex items-center justify-evenly bg-[#f8fafc] py-6 sticky top-0 z-50">
            {/* Hamburger */}
            <button className='text-4xl focus:outline-none' onClick={toggleMenu}>
                {isOpen ? <BiX /> : <BiMenuAltLeft />}
            </button>
            {/* Logo */}
            <a>
                <Logo />
            </a>
            {/* Sign In Button */}
            <div>
                <Link href="/signin">Sign In</Link>
            </div>
        </nav>
    );
}
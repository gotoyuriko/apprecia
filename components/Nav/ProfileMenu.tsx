import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { IconContext } from 'react-icons';
import { BiUserCircle } from 'react-icons/bi';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SignOutBtn from './SignOutBtn';
import Image from 'next/image';
import GetUser from '@/firebase/users/GetUser';
import type { User } from 'firebase/auth';
import type { AppUser, MenuItem as MenuItemType } from '@/types';

interface ProfileMenuProps {
    profileList: MenuItemType[];
    currentUser: User | null;
}

export default function ProfileMenu({ profileList, currentUser }: ProfileMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openProfile = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement | SVGElement>) => {
        setAnchorEl(event.currentTarget as HTMLElement);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [userData, setUserData] = useState<AppUser | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (currentUser?.email) {
                const result = await GetUser(currentUser.email);
                if (result) setUserData(result.user);
            }
        };
        fetchData();
    }, [currentUser]);

    if (userData) profileList[0].link = `/profiles/${currentUser?.uid}`;

    return (
        <>
            <IconContext.Provider value={{ size: '2.5rem', className: 'text-center cursor-pointer' }}>
                {userData?.user_photoURL ? (
                    <Image
                        width={50}
                        height={50}
                        src={userData.user_photoURL}
                        alt="Profile"
                        className="rounded-full object-cover"
                        id="fade-button"
                        aria-controls={openProfile ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openProfile ? 'true' : undefined}
                        onClick={handleClick}
                        style={{ borderRadius: '50%', aspectRatio: '1/1' }}
                    />
                ) : (
                    <BiUserCircle
                        id="fade-button"
                        aria-controls={openProfile ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openProfile ? 'true' : undefined}
                        onClick={handleClick}
                    />
                )}
            </IconContext.Provider>
            <Menu
                id="fade-menu"
                MenuListProps={{ 'aria-labelledby': 'fade-button' }}
                anchorEl={anchorEl}
                open={openProfile}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                {profileList && profileList.map((item, index) => (
                    <MenuItem key={index} onClick={handleClose}>
                        <Link passHref href={item.link}>{item.name}</Link>
                    </MenuItem>
                ))}
                <MenuItem onClick={handleClose}>
                    <SignOutBtn />
                </MenuItem>
            </Menu>
        </>
    );
}

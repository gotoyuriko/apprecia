import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { IconContext } from 'react-icons';
import { BiUserCircle } from 'react-icons/bi';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SignOutBtn from './SignOutBtn';
import Image from 'next/image';
import GetUser from '../../firebase/users/GetUser';

export default function ProfileMenu({ profileList, currentUser }) {
    // Profile Icon
    const [anchorEl, setAnchorEl] = useState(null);
    const openProfile = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await GetUser(currentUser.uid);
                setUserData(data);
            } catch (error) {
                console.error("Error getting currentUser:", error);
            }
        };
        fetchData();
    }, [currentUser]);

    // Update Profile Link
    userData ? (profileList[0].link = `/profiles/${userData?.user_id}`) : null;

    return (
        <>
            {/* Profile */}
            <IconContext.Provider
                value={{
                    size: '2.5rem',
                    className: 'text-center cursor-pointer',
                    title: 'Profile menu',
                }}
            >
                {userData?.user_photoURL ? (
                    <Image
                        width={50}
                        height={50}
                        src={userData?.user_photoURL}
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
                {profileList &&
                    profileList.map((item, index) => (
                        <MenuItem key={index} onClick={handleClose}>
                            <Link href={item.link}>{item.name}</Link>
                        </MenuItem>
                    ))}
                <MenuItem onClick={handleClose}>
                    <SignOutBtn />
                </MenuItem>
            </Menu>
        </>
    );
}

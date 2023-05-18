import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { IconContext } from 'react-icons'
import { BiUserCircle } from 'react-icons/bi';
import { useState } from 'react';
import SignOutBtn from './SignOutBtn';

export default function ProfileMenu({ profileList }) {
    //Profile Icon
    const [anchorEl, setAnchorEl] = useState(null);
    const openProfile = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {/* Profile */}
            <IconContext.Provider value={{ size: '2.5rem', className: 'text-center cursor-pointer', title: 'Profile menu' }}>
                <BiUserCircle
                    id="fade-button"
                    aria-controls={openProfile ? 'fade-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openProfile ? 'true' : undefined}
                    onClick={handleClick} />
            </IconContext.Provider >
            <Menu
                id="fade-menu"
                MenuListProps={{ 'aria-labelledby': 'fade-button' }}
                anchorEl={anchorEl}
                open={openProfile}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                {
                    profileList && profileList.map((item, index) => (
                        <MenuItem key={index} onClick={handleClose}>{item.name}</MenuItem>
                    ))
                }
                <MenuItem onClick={handleClose}>
                    <SignOutBtn />
                </MenuItem>
            </Menu>
        </>
    );
}
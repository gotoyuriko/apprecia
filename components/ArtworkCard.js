import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, CardActions } from '@mui/material';
import { AiOutlineEye, AiOutlineHeart, AiTwotoneHeart } from 'react-icons/ai';

export default function ArtworkCard() {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image="/appreciabg.png"
                    alt="green iguana"
                />
            </CardActionArea>
            <CardActions className='flex justify-between items-center'>
                <div className='flex flex-col'>
                    <p className='text-xl font-bold'>
                        Title
                    </p>
                    <p className='text-sm text-gray-400'>
                        By Creator Name
                    </p>
                </div>
                <div className='flex flex-row'>
                    <div className='flex flex-row'>
                        <AiOutlineHeart className='w-6 h-6' />
                        {/* <AiTwotoneHeart /> */}
                        <span className='ml-2'>10</span>
                    </div>
                    <div className='flex flex-row'>
                        <AiOutlineEye className='ml-3 w-6 h-6' />
                        <span className='ml-2'>10</span>
                    </div>
                </div>
            </CardActions>
        </Card>
    );
}

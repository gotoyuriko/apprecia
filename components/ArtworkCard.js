import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, CardActions } from '@mui/material';
import { AiOutlineEye, AiOutlineHeart } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import GetUser from '@/firebase/GetUser';

export default function ArtworkCard({ title, description, imageUrls, uid }) {
    const [creatorData, setCreatorData] = useState(null);

    useEffect(() => {
        if (uid) {
            GetUser(uid)
                .then((data) => {
                    setCreatorData(data);
                })
                .catch((error) => {
                    console.log("Error getting user:", error);
                });
        }
    }, [uid]);

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    sx={{
                        height: "200px",
                        width: "100%",
                        objectFit: "cover",
                    }}
                    image={imageUrls[0]}
                    alt="green iguana"
                />
            </CardActionArea>
            <CardActions className="flex justify-between items-center">
                <div className="flex flex-col">
                    <p className="text-xl font-bold">{title}</p>
                    <p className="text-sm text-gray-400">
                        {creatorData?.user_name ? `By ${creatorData.user_name}` : ""}
                    </p>
                </div>
                <div className="flex flex-row">
                    <div className="flex flex-row">
                        <AiOutlineHeart className="w-6 h-6" />
                        <span className="ml-2">10</span>
                    </div>
                    <div className="flex flex-row">
                        <AiOutlineEye className="ml-3 w-6 h-6" />
                        <span className="ml-2">10</span>
                    </div>
                </div>
            </CardActions>
        </Card>
    );
}

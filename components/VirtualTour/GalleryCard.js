import { Card, CardActionArea, CardActions, CardMedia } from "@mui/material";
import { useEffect, useState } from "react";
import GetUser from "@/firebase/users/GetUser";
import Link from "next/link";
import GetTourId from "@/firebase/tours/GetTourId";

export default function GalleryCard({ uid, tourRoom, tourName, createdAt }) {

    const [userData, setUserData] = useState(null);
    const [galleryId, setGalleryId] = useState(null);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await GetUser(uid);
                setUserData(data);
            } catch (error) {
                console.error("Error getting user:", error);
            }

            try {
                const id = await GetTourId(uid, createdAt);
                setGalleryId(id);
            } catch (error) {
                console.error("Error getting gallery id:", error);
            }
        };
        fetchData();
    }, [uid, createdAt]);

    return (
        <>
            {/* Project Card */}
            <Card sx={{ maxWidth: 380 }}>
                <CardActionArea>
                    <Link
                        href={`/tour/room/${galleryId}`}
                        className="text-sm text-gray-400"
                    >
                        <CardMedia
                            component="img"
                            sx={{ height: "200px", width: "100%", objectFit: "cover" }}
                            image={tourRoom[0]?.room_background}
                        />
                    </Link>
                </CardActionArea>
                <CardActions className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <p className="text-xl font-bold">{tourName}</p>
                        <Link
                            href={`/profiles/${userData?.user_id}`}
                            className="text-sm text-gray-400"
                        >
                            {userData?.user_name ? `By ${userData.user_name}` : ""}
                        </Link>
                    </div>
                </CardActions>
            </Card>
        </>
    )
}
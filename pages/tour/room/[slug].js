import HomeButton from "@/components/VirtualTour/ViewTour/HomeButton";
import SwitchRoom from "@/components/VirtualTour/ViewTour/SwitchRoom";
import TourTitle from "@/components/VirtualTour/ViewTour/TourTitle";
import UserInfo from "@/components/VirtualTour/ViewTour/UserInfo";
import { useAuth } from "@/firebase/auth/AuthContext";
import GetSingleTour from "@/firebase/tours/GetSingleTour";
import GetUser from "@/firebase/users/GetUser";
import { Scene, Entity } from "aframe-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function VirtualTour() {
    const { currentUser } = useAuth();
    const router = useRouter();
    const { slug } = router.query;

    // Tour Data and room Data
    const [tourData, setTourData] = useState(null);
    const [userData, setUserData] = useState(null);

    // Switch Button
    const [roomNo, setRoomNo] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await GetUser(currentUser.uid);
                setUserData(userData);
            } catch (error) {
                console.error("Error getting user:", error);
            }
            try {
                const tourData = await GetSingleTour(slug);
                setTourData(tourData);
            } catch (error) {
                console.error("Error getting tour:", error);
            }
        };

        fetchData();
    }, [currentUser.uid, slug]);

    return (
        <>
            <SwitchRoom
                tourData={tourData}
                roomNo={roomNo}
                setRoomNo={setRoomNo} />
            <TourTitle tourData={tourData} roomNo={roomNo} />
            <UserInfo userData={userData} />
            <HomeButton />

            <Scene cursor="rayOrigin: mouse" raycaster="objects: .clickable">
                {
                    tourData?.tour_room[roomNo - 1]?.room_artwork
                        ?.filter((item) => item.src)
                        .map((artwork, index) => {
                            return (
                                <Entity
                                    key={index}
                                    geometry="primitive: plane;"
                                    material={{
                                        src: artwork.src,
                                        color: "#cfcfcf",
                                        side: "double"
                                    }}
                                    rotation={artwork.rotation}
                                    position={artwork.position}
                                    class="clickable"
                                />
                            );
                        })
                }

                <Entity
                    primitive="a-sky"
                    src={tourData?.tour_room[roomNo - 1]?.room_background}
                />
                <Entity
                    light={{
                        type: "hemisphere",
                        color: "#ffffff",
                        intensity: 1.180,
                        distance: 60.020
                    }}
                />
            </Scene>
        </>
    );
}

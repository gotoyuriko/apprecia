import AddRoomButton from "@/components/VirtualTour/CreateTour/AddRoomButton";
import EditEnvironment from "@/components/VirtualTour/CreateTour/EditEnvironment";
import Panel from "@/components/VirtualTour/CreateTour/Panel";
import RoomPublishButton from "@/components/VirtualTour/CreateTour/RoomPublishButton";
import SelectRoomModal from "@/components/VirtualTour/CreateTour/SelectRoomModal";
import UploadArtwork from "@/components/VirtualTour/CreateTour/UploadArtwork";
import UserInfo from "@/components/VirtualTour/ViewTour/UserInfo";
import GetArtwork from "@/firebase/artworks/GetArtwork";
import { useAuth } from "@/firebase/auth/AuthContext";
import GetSingleTour from "@/firebase/tours/GetSingleTour";
import GetUser from "@/firebase/users/GetUser";
import { Entity, Scene } from "aframe-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function TourUpdate() {
    const { currentUser } = useAuth();
    const router = useRouter();
    const { slug } = router.query;

    // Tour Data and room Data
    const [tourData, setTourData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [artworkData, setArtworkData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (slug) {
                    const tourData = await GetSingleTour(slug);
                    setTourData(tourData);
                    const userData = await GetUser(tourData?.user_id);
                    setUserData(userData);
                    const artworkdata = await GetArtwork();
                    setArtworkData(artworkdata?.filter((art) => art.user_id === tourData.user_id));
                }
            } catch (error) {
                console.error("Error getting tour or user or artwork:", error);
            }
        };

        fetchData();
    }, [slug]);

    // Select Panel to showcase your artwork
    const [selectPanel, setSelectPanel] = useState([]);
    // Switch Button
    const [roomNo, setRoomNo] = useState(1);

    // Modal
    const [openModalEnv, setOpenModalEnv] = useState(false);
    const [openModalArt, setOpenModalArt] = useState(false);

    // Artwork and its background
    const panoramaImages = tourData?.tour_room[roomNo - 1]?.room_artwork;
    const roomBackground = tourData?.tour_room[roomNo - 1]?.room_background;

    return (
        <>
            <UploadArtwork
                user={currentUser}
                openModalArt={openModalArt}
                setOpenModalArt={setOpenModalArt}
                artworkData={artworkData}
                selectPanel={selectPanel}
                setSelectPanel={setSelectPanel}
                setTourData={setTourData}
                roomNo={roomNo}
                tourData={tourData}
            />
            <SelectRoomModal
                openModalEnv={openModalEnv}
                setOpenModalEnv={setOpenModalEnv}
                setTourData={setTourData}
                tourData={tourData}
                roomNo={roomNo}
            />
            <AddRoomButton
                tourData={tourData}
                setTourData={setTourData}
                roomNo={roomNo}
                setRoomNo={setRoomNo}
                setOpenModalEnv={setOpenModalEnv}
            />
            <RoomPublishButton
                status='update'
                uid={currentUser.uid}
                setTourData={setTourData}
                tourData={tourData}
                slug={slug} />
            <EditEnvironment tourData={tourData} setOpenModalEnv={setOpenModalEnv} />
            <UserInfo userData={userData} />
            <Scene cursor="rayOrigin: mouse" raycaster="objects: .clickable">
                {panoramaImages && (
                    <Panel
                        panoramaImages={panoramaImages}
                        setSelectPanel={setSelectPanel}
                        setOpenModalArt={setOpenModalArt}
                    />
                )}
                <Entity
                    primitive="a-sky"
                    src={roomBackground}
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
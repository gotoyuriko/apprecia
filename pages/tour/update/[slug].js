import AddRoomButton from "@/components/VirtualTour/CreateTour/AddRoomButton";
import EditEnvironment from "@/components/VirtualTour/CreateTour/EditEnvironment";
import Panel from "@/components/VirtualTour/CreateTour/Panel";
import RoomPublishButton from "@/components/VirtualTour/CreateTour/RoomPublishButton";
import SelectRoomModal from "@/components/VirtualTour/CreateTour/SelectRoomModal";
import UploadArtwork from "@/components/VirtualTour/CreateTour/UploadArtwork";
import UserInfo from "@/components/VirtualTour/ViewTour/UserInfo";
import GetDoc from "@/firebase/GetDoc";
import GetArtworks from "@/firebase/artworks/GetArtworks";
import { useAuth } from "@/firebase/auth/AuthContext";
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
    const [artworksData, setArtworksData] = useState([]);

    useEffect(() => {
        if (!currentUser) {
            router.push('/');
        }
    }, [currentUser, router]);

    useEffect(() => {
        const fetchData = async () => {
            if (slug) {
                const tourData = await GetDoc("virtualArtGalleries", slug);
                setTourData(tourData);
                const { user } = await GetUser(tourData?.tour_user);
                setUserData(user);
                const artworksdata = await GetArtworks();
                setArtworksData(artworksdata?.filter((art) => art.project_creator === tourData.tour_user));
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
                currentUser={currentUser}
                openModalArt={openModalArt}
                setOpenModalArt={setOpenModalArt}
                artworksData={artworksData}
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
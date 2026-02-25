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
import type { ArtProject, AppUser, ArtGallery, RoomArtwork } from "@/types";
import { Entity, Scene as AFrameScene } from "aframe-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// Cast to any to suppress A-Frame custom attribute type errors
const Scene = AFrameScene as React.ComponentType<any>;

export default function TourUpdate() {
    const { currentUser } = useAuth();
    const router = useRouter();
    const { slug } = router.query;
    const slugStr = typeof slug === 'string' ? slug : '';

    const [tourData, setTourData] = useState<ArtGallery | null>(null);
    const [userData, setUserData] = useState<AppUser | null>(null);
    const [artworksData, setArtworksData] = useState<ArtProject[]>([]);

    useEffect(() => {
        if (!currentUser) {
            router.push('/');
        }
    }, [currentUser, router]);

    useEffect(() => {
        const fetchData = async () => {
            if (slugStr) {
                const tourDoc = await GetDoc("virtualArtGalleries", slugStr);
                setTourData(tourDoc as ArtGallery);
                const result = await GetUser((tourDoc as ArtGallery)?.tour_user);
                if (result) setUserData(result.user);
                const artworksdata = await GetArtworks();
                setArtworksData(
                    artworksdata?.filter(
                        (art) => art.project_creator === (tourDoc as ArtGallery)?.tour_user
                    )
                );
            }
        };
        fetchData();
    }, [slugStr]);

    const [selectPanel, setSelectPanel] = useState<RoomArtwork | null>(null);
    const [roomNo, setRoomNo] = useState(1);
    const [openModalEnv, setOpenModalEnv] = useState(false);
    const [openModalArt, setOpenModalArt] = useState(false);

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
                setTourData={setTourData as any}
                roomNo={roomNo}
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
                uid={currentUser?.uid ?? ''}
                setTourData={setTourData}
                tourData={tourData}
                slug={slugStr}
            />
            <EditEnvironment
                tourData={tourData}
                setOpenModalEnv={setOpenModalEnv}
                setTourData={setTourData}
                roomNo={roomNo}
                setRoomNo={setRoomNo}
            />
            <UserInfo tourUser={userData} />
            <Scene cursor="rayOrigin: mouse" raycaster="objects: .clickable">
                {panoramaImages && (
                    <Panel
                        panoramaImages={panoramaImages}
                        setSelectPanel={setSelectPanel}
                        setOpenModalArt={setOpenModalArt}
                    />
                )}
                <Entity primitive="a-sky" src={roomBackground} />
                <Entity
                    light={{ type: "hemisphere", color: "#ffffff", intensity: 1.18, distance: 60.02 }}
                />
            </Scene>
        </>
    );
}

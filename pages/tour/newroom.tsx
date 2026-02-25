import AddRoomButton from "@/components/VirtualTour/CreateTour/AddRoomButton";
import CreateRoomTitleText from "@/components/VirtualTour/CreateTour/CreateRoomTitleText";
import EditEnvironment from "@/components/VirtualTour/CreateTour/EditEnvironment";
import Panel from "@/components/VirtualTour/CreateTour/Panel";
import RoomPublishButton from "@/components/VirtualTour/CreateTour/RoomPublishButton";
import SelectRoomModal from "@/components/VirtualTour/CreateTour/SelectRoomModal";
import UploadArtwork from "@/components/VirtualTour/CreateTour/UploadArtwork";
import { panoramaArtworkImages } from "@/data/data";
import GetArtworks from "@/firebase/artworks/GetArtworks";
import { useAuth } from "@/firebase/auth/AuthContext";
import type { ArtProject, ArtGallery, RoomArtwork } from "@/types";
import { Entity, Scene as AFrameScene } from "aframe-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// Cast to any to suppress A-Frame custom attribute type errors
const Scene = AFrameScene as React.ComponentType<any>;

const NewRoom = () => {
    const { currentUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!currentUser) {
            router.push('/');
        }
    }, [currentUser, router]);

    const [tourData, setTourData] = useState<ArtGallery>({
        tour_name: "",
        tour_room: [
            {
                room_id: 1,
                room_background: "",
                room_artwork: [...panoramaArtworkImages],
            },
        ],
        tour_user: currentUser?.email ?? '',
        tour_createdAt: '',
    });

    const [artworksData, setArtworkData] = useState<ArtProject[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const artworksdata = await GetArtworks();
            setArtworkData(artworksdata);
        };
        fetchData();
    }, []);

    const [selectPanel, setSelectPanel] = useState<RoomArtwork | null>(null);
    const [roomNo, setRoomNo] = useState(1);
    const [openModalEnv, setOpenModalEnv] = useState(true);
    const [openModalArt, setOpenModalArt] = useState(false);

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
                status="new"
                uid={currentUser?.uid ?? ''}
                setTourData={setTourData}
                tourData={tourData}
                slug={undefined}
            />
            <EditEnvironment
                tourData={tourData}
                setTourData={setTourData}
                roomNo={roomNo}
                setRoomNo={setRoomNo}
                setOpenModalEnv={setOpenModalEnv}
            />
            <CreateRoomTitleText />
            <Scene cursor="rayOrigin: mouse" raycaster="objects: .clickable">
                <Panel
                    panoramaImages={tourData.tour_room[roomNo - 1]?.room_artwork}
                    setSelectPanel={setSelectPanel}
                    setOpenModalArt={setOpenModalArt}
                />
                <Entity
                    primitive="a-sky"
                    src={tourData.tour_room[roomNo - 1]?.room_background}
                />
                <Entity
                    light={{
                        type: "hemisphere",
                        color: "#ffffff",
                        intensity: 1.18,
                        distance: 60.02,
                    }}
                />
            </Scene>
        </>
    );
};

export default NewRoom;

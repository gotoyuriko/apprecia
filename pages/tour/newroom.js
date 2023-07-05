import AddRoomButton from "@/components/VirtualTour/CreateTour/AddRoomButton";
import CreateRoomTitleText from "@/components/VirtualTour/CreateTour/CreateRoomTitleText";
import EditEnvironment from "@/components/VirtualTour/CreateTour/EditEnvironment";
import Panel from "@/components/VirtualTour/CreateTour/Panel";
import RoomPublishButton from "@/components/VirtualTour/CreateTour/RoomPublishButton";
import SelectRoomModal from "@/components/VirtualTour/CreateTour/SelectRoomModal";
import UploadArtwork from "@/components/VirtualTour/CreateTour/UploadArtwork";
import { panoramaArtworkImages } from "@/data/data";
import GetArtwork from "@/firebase/artworks/GetArtwork";
import { useAuth } from "@/firebase/auth/AuthContext";
import { Entity, Scene } from "aframe-react";
import { useEffect, useState } from "react";

const NewRoom = () => {
    const { currentUser } = useAuth();

    // Room
    const [tourData, setTourData] = useState({
        tour_name: "",
        tour_room: [
            {
                room_id: 1,
                room_background: "",
                room_artwork: [...panoramaArtworkImages],
            },
        ],
        user_id: currentUser.uid,
    });

    // From Firebase
    const [artworkData, setArtworkData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const artworkdata = await GetArtwork();
            setArtworkData(artworkdata);
        };
        fetchData();
    }, []);

    // Select Panel to showcase your artwork
    const [selectPanel, setSelectPanel] = useState([]);
    // Switch Button
    const [roomNo, setRoomNo] = useState(1);

    // Modal
    const [openModalEnv, setOpenModalEnv] = useState(true);
    const [openModalArt, setOpenModalArt] = useState(false);

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
                status="new"
                uid={currentUser.uid}
                setTourData={setTourData}
                tourData={tourData}
            />
            <EditEnvironment tourData={tourData} setOpenModalEnv={setOpenModalEnv} />
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

import AddRoomButton from "@/components/VirtualTour/AddRoomButton";
import CreateRoomTitleText from "@/components/VirtualTour/CreateRoomTitleText";
import EditEnvironment from "@/components/VirtualTour/EditEnvironment";
import RoomPublishButton from "@/components/VirtualTour/RoomPublishButton";
import SelectRoomModal from "@/components/VirtualTour/SelectRoomModal";
import UploadArtwork from "@/components/VirtualTour/UploadArtwork";
import { panoramaArtworkImages } from "@/data/data";
import GetArtwork from "@/firebase/artworks/GetArtwork";
import { useAuth } from "@/firebase/auth/AuthContext";
import { Scene, Entity } from "aframe-react";
import { useEffect, useState } from "react";
import Panel from "@/components/VirtualTour/Panel";
import GetUser from "@/firebase/users/GetUser";

const NewRoom = () => {

    const { currentUser } = useAuth();

    // From Firebase
    const [artworkData, setArtworkData] = useState([]);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await GetUser(currentUser.uid);
                setUserData(data);
            } catch (error) {
                console.error("Error getting user:", error);
            }
            try {
                const data = await GetArtwork();
                setArtworkData(data);
            } catch (error) {
                console.error("Error getting artwork:", error);
            }
        };

        fetchData();
    }, [currentUser.uid]);

    // Room
    const [tourData, setTourData] = useState({
        tour_name: "",
        tour_room: [{
            room_id: 1,
            room_background: "",
            room_artwork: [...panoramaArtworkImages]
        }],
        user_id: currentUser.uid,
        user_name: userData?.user_name
    });
    // Select Panel to showcase your artwork
    const [selectPanel, setSelectPanel] = useState("");

    // Modal
    const [openModalEnv, setOpenModalEnv] = useState(true);
    const [openModalArt, setOpenModalArt] = useState(false);

    useEffect(() => {
        console.log(tourData);
    }, [tourData]);

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
            />
            <SelectRoomModal
                openModalEnv={openModalEnv}
                setOpenModalEnv={setOpenModalEnv}
                setTourData={setTourData}
                tourData={tourData}
            />
            <AddRoomButton
                tourData={tourData}
                setTourData={setTourData} />
            <RoomPublishButton />
            <EditEnvironment
                tourData={tourData}
                setOpenModalEnv={setOpenModalEnv} />
            <CreateRoomTitleText />
            <Scene cursor="rayOrigin: mouse" raycaster="objects: .clickable">
                <Panel
                    panoramaImages={tourData.tour_room[0].room_artwork}
                    setSelectPanel={setSelectPanel}
                    setOpenModalArt={setOpenModalArt} />
                <Entity
                    primitive="a-sky"
                    src={tourData.tour_room[0].room_background} />
            </Scene>
        </>
    );
};

export default NewRoom;

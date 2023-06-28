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

    // Room
    const [tourData, setTourData] = useState({
        tour_name: "",
        tour_room: [{
            room_id: 1,
            room_background: "",
            room_artwork: [...panoramaArtworkImages]
        }],
        user_id: currentUser.uid,
        user_name: ''
    });

    // From Firebase
    const [artworkData, setArtworkData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await GetUser(currentUser.uid);;
                setTourData(
                    {
                        ...tourData,
                        user_name: data?.user_name
                    }
                )
                console.log("tourData", tourData);
                console.log("data", data);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Select Panel to showcase your artwork
    const [selectPanel, setSelectPanel] = useState("");
    // Switch Button
    const [roomNo, setRoomNo] = useState(1);

    // Modal
    const [openModalEnv, setOpenModalEnv] = useState(true);
    const [openModalArt, setOpenModalArt] = useState(false);

    useEffect(() => {
        // console.log('tourData', tourData);
        console.log('roomNo', roomNo)
        console.log("tourData.tour_room.length", tourData.tour_room.length);
        // console.log('tourData.tour_room[(roomNo - 1)].room_artwork', tourData.tour_room[(roomNo - 1)]?.room_artwork)
    }, [tourData, roomNo]);

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
                setOpenModalEnv={setOpenModalEnv} />
            <RoomPublishButton />
            <EditEnvironment
                tourData={tourData}
                setOpenModalEnv={setOpenModalEnv} />
            <CreateRoomTitleText />
            <Scene cursor="rayOrigin: mouse" raycaster="objects: .clickable">
                <Panel
                    panoramaImages={tourData.tour_room[(roomNo - 1)]?.room_artwork}
                    setSelectPanel={setSelectPanel}
                    setOpenModalArt={setOpenModalArt} />
                <Entity
                    primitive="a-sky"
                    src={tourData.tour_room[(roomNo - 1)]?.room_background} />
            </Scene>
        </>
    );
};

export default NewRoom;

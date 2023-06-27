import AddRoomButton from "@/components/VirtualTour/AddRoomButton";
import CreateRoomTitleText from "@/components/VirtualTour/CreateRoomTitleText";
import EditEnvironment from "@/components/VirtualTour/EditEnvironment";
import RoomPublishButton from "@/components/VirtualTour/RoomPublishButton";
import SelectRoomModal from "@/components/VirtualTour/SelectRoomModal";
import UploadArtwork from "@/components/VirtualTour/UploadArtwork";
import { panoramaArtworkImages } from "@/data/data";
import GetArtwork from "@/firebase/artworks/GetArtwork";
import { useAuth } from "@/firebase/auth/AuthContext";
import GetUser from "@/firebase/users/GetUser";
import { Scene, Entity } from "aframe-react";
import { useEffect, useState } from "react";

const NewRoom = () => {
    const { currentUser } = useAuth();

    // Modal
    const [openModalEnv, setOpenModalEnv] = useState(true);
    const [openModalArt, setOpenModalArt] = useState(false);
    // Room
    const [selectRoom, setSelectRoom] = useState("");
    const [roomData, setRoomData] = useState({ tourName: "", roomImage: "" });
    // From Firebase
    const [userData, setUserData] = useState("");
    const [artworkData, setArtworkData] = useState([]);
    // Artwork
    const [panoramaImages, setPanoramaImages] = useState([...panoramaArtworkImages]);
    const [selectPanel, setSelectPanel] = useState("");

    useEffect(() => {
        console.log("panoramaImages", panoramaImages);
        console.log("selectArtwork", selectPanel);
    }, [selectPanel, panoramaImages]);

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
    }, []);

    useEffect(() => {
        // Unregister the component if it has already been registered
        if (AFRAME.components["artwork-click"]) {
            delete AFRAME.components["artwork-click"];
        }

        const handleClickEvent = (data) => {
            event.preventDefault();
            setSelectPanel(
                panoramaImages.filter((artwork) => {
                    return artwork.artworkId === data.id;
                })
            );
            setOpenModalArt(true);
        };

        AFRAME.registerComponent("artwork-click", {
            schema: {
                src: { type: "string" },
                id: { type: "number" },
            },
            init: function () {
                this.el.addEventListener("click", () => handleClickEvent(this.data));
            },
            remove: function () {
                this.el.removeEventListener("click", () => handleClickEvent(this.data));
            },
        });
    }, []);

    return (
        <>
            <UploadArtwork
                user={currentUser}
                openModalArt={openModalArt}
                setOpenModalArt={setOpenModalArt}
                artworkData={artworkData}
                selectPanel={selectPanel}
                setSelectPanel={setSelectPanel}
                setPanoramaImages={setPanoramaImages}
            />
            <SelectRoomModal
                setSelectRoom={setSelectRoom}
                openModalEnv={openModalEnv}
                setOpenModalEnv={setOpenModalEnv}
                setRoomData={setRoomData}
                roomData={roomData}
            />
            <AddRoomButton />
            <RoomPublishButton />
            <EditEnvironment roomData={roomData} setOpenModalEnv={setOpenModalEnv} />
            <CreateRoomTitleText />
            <Scene cursor="rayOrigin: mouse" raycaster="objects: .clickable">
                {panoramaImages.map((item, index) =>
                    item.src === "" ? (
                        <Entity
                            key={index}
                            geometry="primitive: plane;"
                            material="color:#2f2f2f; side: double;"
                            rotation={item.rotation}
                            position={item.position}
                            artwork-click={`src:${item.src}; id:${item.artworkId}`}
                            class="clickable"
                        >
                            <Entity
                                text={{
                                    value: "Select your Artwork",
                                    color: "#ffffff",
                                    align: "center",
                                }}
                                position="0 0 0"
                                scale="1.5 1.5 1.5"
                            />
                        </Entity>
                    ) : (
                        <Entity
                            key={index}
                            geometry="primitive: plane;"
                            material={`src: ${item.src}; side: double;`}
                            rotation={item.rotation}
                            position={item.position}
                            artwork-click
                            class="clickable"
                        />
                    )
                )}
                <Entity primitive="a-sky" src={selectRoom} />
            </Scene>
        </>
    );
};

export default NewRoom;

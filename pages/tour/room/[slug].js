import ArtworkModal from "@/components/VirtualTour/ViewTour/ArtworkModal";
import HomeButton from "@/components/VirtualTour/ViewTour/HomeButton";
import SwitchRoom from "@/components/VirtualTour/ViewTour/SwitchRoom";
import TourTitle from "@/components/VirtualTour/ViewTour/TourTitle";
import UserInfo from "@/components/VirtualTour/ViewTour/UserInfo";
import GetArtwork from "@/firebase/artworks/GetArtwork";
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
    const [artData, setArtData] = useState(null);
    const [showDesc, setShowDesc] = useState(null);

    // Switch Button
    const [roomNo, setRoomNo] = useState(1);

    //set modal
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tourData = await GetSingleTour(slug);
                setTourData(tourData);
                const userData = await GetUser(tourData?.user_id);
                setUserData(userData);
                const artworkData = await GetArtwork();
                setArtData(artworkData?.filter(art => art.user_id === tourData.user_id));
            } catch (error) {
                console.error("Error getting tour or user or artwork:", error);
            }
        };

        fetchData();


        // Unregister the component if it has already been registered
        if (AFRAME.components["link-control"]) {
            delete AFRAME.components["link-control"];
        }
        if (AFRAME.components["artwork-modal"]) {
            delete AFRAME.components["artwork-modal"];
        }

        // Click Sphere to travel to other room
        const handleClickTravel = (data) => {
            event.preventDefault();
            setRoomNo(data);
        };

        // Custom component registration
        AFRAME.registerComponent("link-control", {
            schema: {
                type: "number"
            },
            init: function () {
                this.el.addEventListener("click", () => handleClickTravel(this.data));
            },
            remove: function () {
                this.el.addEventListener("click", () => handleClickTravel(this.data));
            },
        });

        // Modify the component registration section
        AFRAME.registerComponent("artwork-modal", {
            schema: {
                src: { type: "asset" },
                artdata: { type: "array" }
            },
            init: function () {
                this.el.addEventListener("click", () => handleClickModal(this.data));
            },
            remove: function () {
                this.el.addEventListener("click", () => handleClickModal(this.data));
            },
        });

        // Modify the handleClickModal function to pass artData correctly
        const handleClickModal = async (data) => {
            event.preventDefault();
            const selectArtwork = data.artdata?.filter(art => art.project_imageUrls.includes(data.src));
            setShowDesc(selectArtwork);
            setOpen(true);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <ArtworkModal
                showDesc={showDesc}
                setOpen={setOpen}
                open={open}
                userData={userData}
                user={currentUser} />
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
                                    artwork-modal={{
                                        src: artwork.src,
                                        artdata: artData
                                    }}
                                />
                            );
                        })
                }


                {
                    (roomNo < tourData?.tour_room.length) ?
                        <Entity
                            geometry={{
                                primitive: "sphere",
                                radius: 0.5
                            }}
                            material={{
                                src: tourData?.tour_room[roomNo]?.room_background,
                                color: "#cfcfcf",
                                side: "double"
                            }}
                            position="0 1.8 2"
                            rotation="0 0 0"
                            animation__rotation={{
                                property: "rotation",
                                dur: 10000,
                                to: "0 360 0",
                                loop: true
                            }}
                            class="clickable"
                            link-control={roomNo + 1}
                        /> :
                        (roomNo === tourData?.tour_room.length) ?
                            <Entity
                                geometry={{
                                    primitive: "sphere",
                                    radius: 0.5
                                }}
                                material={{
                                    src: tourData?.tour_room[0]?.room_background,
                                    color: "#cfcfcf",
                                    side: "double"
                                }}
                                position="0 1.8 2"
                                rotation="0 0 0"
                                animation__rotation={{
                                    property: "rotation",
                                    dur: 10000,
                                    to: "0 360 0",
                                    loop: true
                                }}
                                class="clickable"
                                link-control={1}
                            />
                            :
                            null
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
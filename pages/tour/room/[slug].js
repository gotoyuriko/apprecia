import ArtworkModal from "@/components/VirtualTour/ViewTour/ArtworkModal";
import HomeButton from "@/components/VirtualTour/ViewTour/HomeButton";
import SwitchRoom from "@/components/VirtualTour/ViewTour/SwitchRoom";
import TourTitle from "@/components/VirtualTour/ViewTour/TourTitle";
import UserInfo from "@/components/VirtualTour/ViewTour/UserInfo";
import GetDoc from "@/firebase/GetDoc";
import GetArtworks from "@/firebase/artworks/GetArtworks";
import { useAuth } from "@/firebase/auth/AuthContext";
import GetComments from "@/firebase/comments/GetComments";
import UpdateView from "@/firebase/projectviews/UpdateView";
import GetUser from "@/firebase/users/GetUser";
import GetUsers from "@/firebase/users/GetUsers";
import { Entity, Scene } from "aframe-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function VirtualTour() {
    const { currentUser } = useAuth();
    const router = useRouter();
    const { slug } = router.query;

    useEffect(() => {
        if (!currentUser) {
            router.push("/");
        }
    }, [currentUser, router]);

    // Tour Data and room Data
    const [tourData, setTourData] = useState(null); // Tour Data
    const [tourUser, setTourUser] = useState(null); // Tour User Data
    const [tourUserId, setTourUserId] = useState(null); // Tour User's data
    const [artworksData, setArtworksData] = useState(null); // Art Data
    const [usersData, setUsersData] = useState(null);
    const [showDesc, setShowDesc] = useState(null); // Show Description
    const [roomNo, setRoomNo] = useState(1); // Switch Button
    const [open, setOpen] = useState(false); //set modal
    const [viewsNo, setViewsNo] = useState(0); //set views
    const [zoomIn, setZoomIn] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const tourData = await GetDoc("virtualArtGalleries", slug);
            setTourData(tourData);
            const { user, userid } = await GetUser(tourData?.tour_user);
            setTourUserId(userid);
            setTourUser(user);
            const artwroksdata = await GetArtworks();
            setArtworksData(
                artwroksdata?.filter(
                    (art) => art.project_creator === tourData.tour_user
                )
            );
            const usersdata = await GetUsers();
            setUsersData(usersdata);
        };
        fetchData();
    }, [slug]);

    // Comment Features
    const [commentData, setCommentData] = useState([]);
    const [commentCurrentUserData, setCommentCurrentUserData] = useState([]);
    // Fetch Data of art gallery comments
    const fetchDataComments = (creatorDocId, createdAt) => {
        const fetchData = async () => {
            // Fetch Comments
            const commentData = await GetComments(creatorDocId, createdAt);
            setCommentData(commentData.reverse());
            // Fetch Current User
            const { user } = await GetUser(currentUser.email);
            setCommentCurrentUserData(user);
        };
        fetchData();
    };

    useEffect(() => {
        // Unregister the component if it has already been registered
        if (AFRAME.components["link-control"]) {
            delete AFRAME.components["link-control"];
        }

        // Custom component registration
        AFRAME.registerComponent("link-control", {
            schema: {
                type: "number",
            },
            init: function () {
                this.el.addEventListener("click", () => handleClickTravel(this.data));
            },
            remove: function () {
                this.el.addEventListener("click", () => handleClickTravel(this.data));
            },
        });

        // Click Sphere to travel to other room
        const handleClickTravel = (data) => {
            setZoomIn(true);
            setTimeout(() => {
                setRoomNo(data);
                setZoomIn(false);
            }, 1500);
        };
    }, []);

    useEffect(() => {
        if (AFRAME.components["artwork-modal"]) {
            delete AFRAME.components["artwork-modal"];
        }

        // Modify the component registration section
        AFRAME.registerComponent("artwork-modal", {
            schema: {
                src: { type: "asset" },
                artworksData: { type: "array" },
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
            const selectArtwork = data.artworksData?.filter((art) =>
                art.project_imageUrls.includes(data.src)
            );
            if (selectArtwork && selectArtwork.length > 0) {
                setShowDesc(selectArtwork[0]);
                fetchDataComments(
                    selectArtwork[0].project_creator,
                    selectArtwork[0].project_createdAt
                );
                setOpen(true);
                const hasViewed = await UpdateView(
                    selectArtwork[0].project_creator,
                    selectArtwork[0].project_createdAt,
                    currentUser
                );
                hasViewed
                    ? setViewsNo((prevViewsNo) => prevViewsNo + 1)
                    : setViewsNo(selectArtwork[0].project_viewsCount);
            }
        };
    }, [currentUser]);


    const [muted, setMuted] = useState(true);
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);

    return (
        <>
            <ArtworkModal
                setOpen={setOpen}
                open={open}
                tourUser={tourUser}
                showDesc={showDesc}
                viewsNo={viewsNo}
                setViewsNo={setViewsNo}
                currentUser={currentUser}
                commentData={commentData}
                usersData={usersData}
                setCommentData={setCommentData}
                commentCurrentUserData={commentCurrentUserData}
                tourUserId={tourUserId}
            />
            <SwitchRoom tourData={tourData} roomNo={roomNo} setRoomNo={setRoomNo} />
            <TourTitle
                tourData={tourData}
                roomNo={roomNo}
                setMuted={setMuted}
                muted={muted}
                audioRef={audioRef}
                setCurrentTime={setCurrentTime}
                currentTime={currentTime} />
            <UserInfo tourUser={tourUser} />
            <HomeButton
                setMuted={setMuted}
                muted={muted}
                audioRef={audioRef}
            />
            <Scene cursor="rayOrigin: mouse" raycaster="objects: .clickable">
                {tourData?.tour_room[roomNo - 1]?.room_artwork
                    ?.filter((item) => item.src)
                    .map((artwork, index) => {
                        return (
                            <Entity
                                key={index}
                                geometry="primitive: plane;"
                                material={{
                                    src: artwork.src,
                                    color: "#cfcfcf",
                                    side: "double",
                                }}
                                rotation={artwork.rotation}
                                position={artwork.position}
                                class="clickable"
                                artwork-modal={{
                                    src: artwork.src,
                                    artworksData: artworksData,
                                }}
                            />
                        );
                    })}

                {roomNo < tourData?.tour_room.length ? (
                    <Entity
                        geometry={{
                            primitive: "sphere",
                            radius: 0.5,
                        }}
                        material={{
                            src: tourData?.tour_room[roomNo]?.room_background,
                            color: "#cfcfcf",
                            side: "double",
                        }}
                        position="0 1.8 2"
                        rotation="0 0 0"
                        animation__rotation={{
                            property: "rotation",
                            dur: 10000,
                            to: "0 360 0",
                            loop: true,
                        }}
                        class="clickable"
                        link-control={roomNo + 1}
                    />
                ) : roomNo !== 1 && roomNo === tourData?.tour_room.length ? (
                    <Entity
                        geometry={{
                            primitive: "sphere",
                            radius: 0.5,
                        }}
                        material={{
                            src: tourData?.tour_room[0]?.room_background,
                            color: "#cfcfcf",
                            side: "double",
                        }}
                        position="0 1.8 2"
                        rotation="0 0 0"
                        animation__rotation={{
                            property: "rotation",
                            dur: 10000,
                            to: "0 360 0",
                            loop: true,
                        }}
                        class="clickable"
                        link-control={1}
                    />
                ) : null}

                <Entity
                    primitive="a-sky"
                    src={tourData?.tour_room[roomNo - 1]?.room_background}
                />
                <Entity
                    light={{
                        type: "hemisphere",
                        color: "#ffffff",
                        intensity: 1.18,
                        distance: 60.02,
                    }}
                />
                <Entity
                    primitive='a-camera'
                    animation={zoomIn ? "property: camera.zoom; from: 1; to: 1.2; easing: easeInQuad; dur: 1300" : "property: camera.zoom; from: 1.2 ; to: 1 ; dur: 1000"}
                    look-controls="pointerLockEnabled: false"
                    position="0 1.6 0" />
            </Scene>
        </>
    );
}

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
import type { ArtProject, AppUser, ArtGallery, Comment } from "@/types";
import { Entity as AFrameEntity, Scene as AFrameScene } from "aframe-react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

// Cast to any to suppress A-Frame custom attribute type errors
const Scene = AFrameScene as React.ComponentType<any>;
const Entity = AFrameEntity as React.ComponentType<any>;

export default function VirtualTour() {
    const { currentUser } = useAuth();
    const router = useRouter();
    const { slug } = router.query;
    const slugStr = typeof slug === 'string' ? slug : '';

    useEffect(() => {
        if (!currentUser) {
            router.push("/");
        }
    }, [currentUser, router]);

    const [tourData, setTourData] = useState<ArtGallery | null>(null);
    const [tourUser, setTourUser] = useState<AppUser | null>(null);
    const [tourUserId, setTourUserId] = useState<string | null>(null);
    const [artworksData, setArtworksData] = useState<ArtProject[] | null>(null);
    const [usersData, setUsersData] = useState<AppUser[] | null>(null);
    const [showDesc, setShowDesc] = useState<ArtProject | null>(null);
    const [roomNo, setRoomNo] = useState(1);
    const [open, setOpen] = useState(false);
    const [viewsNo, setViewsNo] = useState(0);
    const [zoomIn, setZoomIn] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const tourDoc = await GetDoc("virtualArtGalleries", slugStr);
            setTourData(tourDoc as ArtGallery);
            const result = await GetUser((tourDoc as ArtGallery)?.tour_user);
            if (result) {
                setTourUserId(result.userid);
                setTourUser(result.user);
            }
            const artworksdata = await GetArtworks();
            setArtworksData(
                artworksdata?.filter(
                    (art) => art.project_creator === (tourDoc as ArtGallery)?.tour_user
                )
            );
            const usersdata = await GetUsers();
            setUsersData(usersdata);
        };
        if (slugStr) fetchData();
    }, [slugStr]);

    const [commentData, setCommentData] = useState<Comment[]>([]);
    const [commentCurrentUserData, setCommentCurrentUserData] = useState<AppUser | null>(null);

    const fetchDataComments = useCallback((creatorDocId: string, createdAt: string) => {
        const fetchData = async () => {
            const comments = await GetComments(creatorDocId, createdAt);
            setCommentData([...comments].reverse());
            if (currentUser?.email) {
                const result = await GetUser(currentUser.email);
                if (result) setCommentCurrentUserData(result.user);
            }
        };
        fetchData();
    }, [currentUser]);

    useEffect(() => {
        if (AFRAME.components["link-control"]) {
            delete AFRAME.components["link-control"];
        }
        AFRAME.registerComponent("link-control", {
            schema: { type: "number" },
            init: function (this: any) {
                this.el.addEventListener("click", () => handleClickTravel(this.data));
            },
            remove: function (this: any) {
                this.el.addEventListener("click", () => handleClickTravel(this.data));
            },
        });
        const handleClickTravel = (data: number) => {
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
        AFRAME.registerComponent("artwork-modal", {
            schema: {
                src: { type: "asset" },
                artworksData: { type: "array" },
            },
            init: function (this: any) {
                this.el.addEventListener("click", () => handleClickModal(this.data));
            },
            remove: function (this: any) {
                this.el.addEventListener("click", () => handleClickModal(this.data));
            },
        });
        const handleClickModal = async (data: any) => {
            const selectArtwork = data.artworksData?.filter((art: ArtProject) =>
                art.project_imageUrls.includes(data.src)
            );
            if (selectArtwork && selectArtwork.length > 0) {
                setShowDesc(selectArtwork[0]);
                fetchDataComments(
                    selectArtwork[0].project_creator,
                    selectArtwork[0].project_createdAt
                );
                setOpen(true);
                if (currentUser) {
                    const hasViewed = await UpdateView(
                        selectArtwork[0].project_creator,
                        selectArtwork[0].project_createdAt,
                        currentUser
                    );
                    hasViewed
                        ? setViewsNo((prevViewsNo) => prevViewsNo + 1)
                        : setViewsNo(selectArtwork[0].project_viewsCount);
                }
            }
        };
    }, [currentUser, fetchDataComments]);

    const [muted, setMuted] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);
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
                currentTime={currentTime}
            />
            <UserInfo tourUser={tourUser} />
            <HomeButton setMuted={setMuted} muted={muted} audioRef={audioRef} />
            <Scene cursor="rayOrigin: mouse" raycaster="objects: .clickable">
                {tourData?.tour_room[roomNo - 1]?.room_artwork
                    ?.filter((item) => item.src)
                    .map((artwork, index) => (
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
                    ))}

                {roomNo < (tourData?.tour_room.length ?? 0) ? (
                    <Entity
                        geometry={{ primitive: "sphere", radius: 0.5 }}
                        material={{
                            src: tourData?.tour_room[roomNo]?.room_background,
                            color: "#cfcfcf",
                            side: "double",
                        }}
                        position="0 1.8 2"
                        rotation="0 0 0"
                        animation__rotation={{ property: "rotation", dur: 10000, to: "0 360 0", loop: true }}
                        class="clickable"
                        link-control={roomNo + 1}
                    />
                ) : roomNo !== 1 && roomNo === tourData?.tour_room.length ? (
                    <Entity
                        geometry={{ primitive: "sphere", radius: 0.5 }}
                        material={{
                            src: tourData?.tour_room[0]?.room_background,
                            color: "#cfcfcf",
                            side: "double",
                        }}
                        position="0 1.8 2"
                        rotation="0 0 0"
                        animation__rotation={{ property: "rotation", dur: 10000, to: "0 360 0", loop: true }}
                        class="clickable"
                        link-control={1}
                    />
                ) : null}

                <Entity
                    primitive="a-sky"
                    src={tourData?.tour_room[roomNo - 1]?.room_background}
                />
                <Entity
                    light={{ type: "hemisphere", color: "#ffffff", intensity: 1.18, distance: 60.02 }}
                />
                <Entity
                    primitive='a-camera'
                    animation={zoomIn
                        ? "property: camera.zoom; from: 1; to: 1.2; easing: easeInQuad; dur: 1300"
                        : "property: camera.zoom; from: 1.2 ; to: 1 ; dur: 1000"}
                    look-controls="pointerLockEnabled: false"
                    position="0 1.6 0"
                />
            </Scene>
        </>
    );
}

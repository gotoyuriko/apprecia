import DeleteArtGallery from "@/firebase/tours/DeleteTour";
import GetArtGallery from "@/firebase/tours/GetArtGallery";
import GetUser from "@/firebase/users/GetUser";
import { Button, Card, CardActionArea, CardActions, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Popover, Tooltip } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { FiMoreVertical } from "react-icons/fi";
import type { User } from "firebase/auth";
import type { ArtGallery, AppUser } from "@/types";

interface GalleryCardProps {
    currentUserData: AppUser | null;
    currentUser: User | null;
    galleryItem: ArtGallery;
}

export default function GalleryCard({ currentUserData, currentUser, galleryItem }: GalleryCardProps) {
    const router = useRouter();
    const [galleryId, setGalleryId] = useState<string | null>(null);
    const [galleryUserData, setGalleryUserData] = useState<AppUser | null>(null);
    const [galleryUserId, setGalleryUserId] = useState<string | null>(null);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            const galleryResult = await GetArtGallery(galleryItem.tour_user, galleryItem.tour_createdAt);
            if (galleryResult) setGalleryId(galleryResult.galleryId);
            const userResult = await GetUser(galleryItem.tour_user);
            if (userResult) {
                setGalleryUserData(userResult.user);
                setGalleryUserId(userResult.userid);
            }
        };
        fetchData();
    }, [galleryItem]);

    // Tooltip
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleTooltip = (event: React.MouseEvent<HTMLElement | SVGElement>) => {
        setAnchorEl(event.currentTarget as HTMLElement);
    };
    const handleTooltipClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    // Edit Project
    const handleEdit = () => {
        const fetchData = async () => {
            const result = await GetArtGallery(galleryItem.tour_user, galleryItem.tour_createdAt);
            if (result) router.push(`/tour/update/${result.galleryId}`);
        };
        fetchData();
    };

    const [deleteOpen, setDeleteOpen] = useState(false);
    // Delete Project
    const handleDeleteOpen = () => {
        setDeleteOpen(true);
    };
    const handleDeleteClose = () => {
        setDeleteOpen(false);
    };

    const handleDeleteProject = async () => {
        const result = await GetArtGallery(galleryItem.tour_user, galleryItem.tour_createdAt);
        if (result?.galleryId) {
            await DeleteArtGallery(result.galleryId);
            router.reload();
        } else {
            console.error("Artwork not found");
        }
    };

    return (
        <>
            {/* Project Card */}
            <Card sx={{ maxWidth: 380 }}>
                <CardActionArea>
                    <Link
                        passHref
                        href={`/tour/room/${galleryId}`}
                        className="text-sm text-gray-400"
                    >
                        <CardMedia
                            component="img"
                            sx={{ height: "200px", width: "100%", objectFit: "cover" }}
                            image={galleryItem.tour_room[0]?.room_background}
                        />
                    </Link>
                </CardActionArea>
                <CardActions className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <p className="text-xl font-bold">{galleryItem.tour_name}</p>
                        <Link
                            passHref
                            href={`/profiles/${galleryUserId}`}
                            className="text-sm text-gray-400"
                        >
                            {galleryUserData?.user_name ? `By ${galleryUserData.user_name}` : ""}
                        </Link>
                    </div>
                    {currentUser && currentUser.email === galleryItem.tour_user ? (
                        <Tooltip title="More" placement="right">
                            <div className="flex flex-col items-center ml-10">
                                <IconContext.Provider value={{ color: "gray" }}>
                                    <FiMoreVertical
                                        onClick={handleTooltip}
                                        aria-describedby={id}
                                        className="w-8 h-8 hover:cursor-pointer"
                                    />
                                </IconContext.Provider>
                                <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleTooltipClose}
                                    anchorOrigin={{
                                        vertical: "center",
                                        horizontal: "center",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "left",
                                    }}
                                >
                                    <ul className="py-2">
                                        <li
                                            onClick={handleEdit}
                                            className="w-full h-full hover:bg-gray-200 px-4 text-lg hover:font-bold"
                                        >
                                            Edit
                                        </li>
                                        <li
                                            onClick={handleDeleteOpen}
                                            className="w-full h-full hover:bg-gray-200 px-4 text-lg hover:font-bold"
                                        >
                                            Delete
                                        </li>
                                    </ul>
                                </Popover>
                                <Dialog
                                    open={deleteOpen}
                                    onClose={handleDeleteClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">
                                        Delete Your Art Gallery
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            Are you sure you want to delete this art gallery? This
                                            action cannot be undone.
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleDeleteClose} color="primary">
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleDeleteProject}
                                            variant="contained"
                                            autoFocus
                                        >
                                            Delete
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        </Tooltip>
                    ) : null}
                </CardActions>
            </Card>
        </>
    );
}

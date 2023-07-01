import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Popover,
    Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import GetUser from "@/firebase/users/GetUser";
import Link from "next/link";
import GetTourId from "@/firebase/tours/GetTourId";
import { FiMoreVertical } from "react-icons/fi";
import { IconContext } from "react-icons";
import DeleteTour from "@/firebase/tours/DeleteTour";
import { useRouter } from "next/router";

export default function GalleryCard({ uid, tourRoom, tourName, createdAt }) {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [galleryId, setGalleryId] = useState(null);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await GetUser(uid);
                setUserData(data);
            } catch (error) {
                console.error("Error getting user:", error);
            }

            try {
                const id = await GetTourId(uid, createdAt);
                setGalleryId(id);
            } catch (error) {
                console.error("Error getting gallery id:", error);
            }
        };
        fetchData();
    }, [uid, createdAt]);

    // Tooltip
    const [anchorEl, setAnchorEl] = useState(null);
    const handleTooltip = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleTooltipClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    // Edit Project
    const handleEdit = () => {
        const fetchData = async () => {
            try {
                const tourId = await GetTourId(uid, createdAt);
                router.push(`/tour/update/${tourId}`);
            } catch (error) {
                console.error("Error getting tour id:", error);
            }
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
        const tourId = await GetTourId(uid, createdAt);

        if (tourId) {
            try {
                await DeleteTour(tourId);
                router.reload();
            } catch (error) {
                console.error("Error deleting artwork:", error);
            }
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
                        href={`/tour/room/${galleryId}`}
                        className="text-sm text-gray-400"
                    >
                        <CardMedia
                            component="img"
                            sx={{ height: "200px", width: "100%", objectFit: "cover" }}
                            image={tourRoom[0]?.room_background}
                        />
                    </Link>
                </CardActionArea>
                <CardActions className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <p className="text-xl font-bold">{tourName}</p>
                        <Link
                            href={`/profiles/${userData?.user_id}`}
                            className="text-sm text-gray-400"
                        >
                            {userData?.user_name ? `By ${userData.user_name}` : ""}
                        </Link>
                    </div>
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
                </CardActions>
            </Card>
        </>
    );
}

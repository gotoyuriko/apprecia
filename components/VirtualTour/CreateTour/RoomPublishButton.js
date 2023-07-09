import { panoramaArtworkImages } from "@/data/data";
import AddArtGallery from "@/firebase/tours/AddArtGallery";
import UpdateArtGallery from "@/firebase/tours/UpdateArtGallery";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

export default function RoomPublishButton({ status, uid, setTourData, tourData, slug }) {
    const router = useRouter();
    //Publish
    const [publishMsg, setPublishMsg] = useState("");
    const [publishOpen, setpublishOpen] = useState(false);
    const handlePublishOpen = () => {
        setpublishOpen(true);
    };
    const handlePublishClose = () => {
        setpublishOpen(false);
    };
    const handlePublsihProject = () => {
        const { error } = status ? AddArtGallery(tourData) : UpdateArtGallery(tourData, slug);

        if (error) {
            console.error("Error uploading images or adding document: ", error);
            setPublishMsg("");
        } else {
            setPublishMsg("Your Exhibition published! Redirecting...");
            setpublishOpen(false);
            setTimeout(() => {
                setPublishMsg("");
                router.push(`/profiles/${uid}`);
            }, 500);
        }
    };

    //Cancel Button
    const [cancelOpen, setCancelOpen] = useState(false);
    const handleCancelOpen = () => {
        setCancelOpen(true);
    };
    const handleCancelClose = () => {
        setCancelOpen(false);
    };
    const handleCancelProject = () => {
        router.push(`/profiles/${uid}`);
        setTourData({
            tour_name: "",
            tour_room: [
                {
                    room_id: 1,
                    room_background: "",
                    room_artwork: [...panoramaArtworkImages],
                },
            ],
            user_id: uid,
            user_name: "",
        });
    };

    //Update
    const [udpateMsg, setUpdateMsg] = useState("");
    const handleUpdateProject = () => {
        const { error } = UpdateArtGallery(tourData, slug);

        if (error) {
            console.error("Error uploading images or adding document: ", error);
            setUpdateMsg("");
        } else {
            setUpdateMsg("Your Gallery were updated! Redirecting...");
            setpublishOpen(false);
            setTimeout(() => {
                setUpdateMsg("");
                router.push(`/profiles/${uid}`);
            }, 500);
        }
    };

    return (
        <div className="absolute bottom-5 right-5 z-10">
            <div className="flex flex-row items-center">
                <button
                    className="flex-none bg-red-700 px-3 py-2 text-white rounded shadow focus:shadow-outline hover:bg-red-800 mr-4"
                    onClick={handleCancelOpen}
                >
                    Cancel
                </button>
                <Dialog
                    open={cancelOpen}
                    onClose={handleCancelClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{status === 'new' ? "Cancel Project" : "Cancel Update"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to cancel your changes? Any unsaved progress
                            will be lost.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelClose} color="primary">
                            No
                        </Button>
                        <Button onClick={handleCancelProject} variant="contained" autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
                <button
                    className="flex-none bg-green-600 px-3 py-2 text-white rounded shadow focus:shadow-outline hover:bg-green-700"
                    onClick={handlePublishOpen}
                >
                    {status === 'new' ? 'Publish' : 'Update'}
                </button>
                <Dialog
                    open={publishOpen}
                    onClose={handlePublishClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {status === 'new' ? 'Confirm Art Gallery Publication' : 'Make Changes to Your Room'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {status === 'new' ? 'Once published, your project will be made visible to others?' : "Modify your room's visibility and share your project"}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handlePublishClose} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={status === 'new' ? handlePublsihProject : handleUpdateProject}
                            variant="contained"
                            autoFocus
                        >
                            {status === 'new' ? 'Publish' : 'Update'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div className="text-white">{publishMsg}</div>
            <div className="text-white">{udpateMsg}</div>
        </div>
    );
}

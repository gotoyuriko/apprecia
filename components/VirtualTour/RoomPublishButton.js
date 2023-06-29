import { panoramaArtworkImages } from "@/data/data";
import AddTour from "@/firebase/tours/AddTour";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react"

export default function RoomPublishButton({ uid, setTourData, tourData }) {
    const router = useRouter();
    //Publish
    const [publishMsg, setPublishMsg] = useState('');
    const [publishOpen, setpublishOpen] = useState(false);
    const handlePublishOpen = () => {
        setpublishOpen(true);
    }
    const handlePublishClose = () => {
        setpublishOpen(false);
    }
    const handlePublsihProject = () => {
        const { error } = AddTour(tourData);

        if (error) {
            console.error("Error uploading images or adding document: ", error);
            setPublishMsg("");
        } else {
            setPublishMsg("Your Exhibition published! Redirecting...");
            setpublishOpen(false);
            setTimeout(() => {
                setPublishMsg("");
                router.push(`/profiles/${uid}`);
            }, 3000);
        }
    }

    //Cancel Button
    const [cancelOpen, setCancelOpen] = useState(false);
    const handleCancelOpen = () => {
        setCancelOpen(true);
    }
    const handleCancelClose = () => {
        setCancelOpen(false);
    }
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
    }
    return (
        <div className='absolute bottom-5 right-5 z-10'>
            <div className="flex flex-row items-center">
                <button className="flex-none bg-red-700 px-3 py-2 text-white rounded shadow focus:shadow-outline hover:bg-red-800 mr-4"
                    onClick={handleCancelOpen}>
                    Cancel
                </button>
                <Dialog
                    open={cancelOpen}
                    onClose={handleCancelClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Delete Project</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to cancel your changes? Any unsaved progress will be lost.
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
                <button className="flex-none bg-green-600 px-3 py-2 text-white rounded shadow focus:shadow-outline hover:bg-green-700"
                    onClick={handlePublishOpen}>
                    Publish
                </button>
                <Dialog
                    open={publishOpen}
                    onClose={handlePublishClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Confirm project publication</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Once published, your project will be made visible to others.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handlePublishClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handlePublsihProject} variant="contained" autoFocus>
                            Publish
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div className="text-white">
                {publishMsg}
            </div>
        </div>
    )
}
import { panoramaArtworkImages } from "@/data/data";

export default function AddRoomButton({ tourData, setTourData }) {
    const handleAddRoom = () => {
        const newRoomId = tourData.tour_room.length + 1;
        const newRoom = {
            room_id: newRoomId,
            room_background: "",
            room_artwork: [...panoramaArtworkImages],
        };
        const updatedTourData = {
            ...tourData,
            tour_room: [...tourData.tour_room, newRoom],
        };
        setTourData(updatedTourData);
    };

    return (
        <div className="absolute bottom-5 left-5 z-10 flex flex-row items-center">
            <button
                className="flex-none bg-black px-3 py-2 text-white rounded shadow 
                   focus:shadow-outline hover:bg-gray-800 mr-4"
                onClick={handleAddRoom}
            >
                Add More Room
            </button>
        </div>
    );
}

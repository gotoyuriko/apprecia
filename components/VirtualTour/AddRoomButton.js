import { panoramaArtworkImages } from "@/data/data";

export default function AddRoomButton({ tourData, setTourData, roomNo, setRoomNo, setOpenModalEnv }) {
    const handleAddRoom = () => {
        if (tourData.tour_room.length >= 4) return;
        const newRoomId = tourData.tour_room.length + 1;
        const newRoom = {
            room_id: newRoomId,
            room_background: '',
            room_artwork: [...panoramaArtworkImages],
        };
        const updatedTourData = {
            ...tourData,
            tour_room: [...tourData.tour_room, newRoom],
        };
        setTourData(updatedTourData);
    };

    const handleSwitchRoom = (roomNumber) => {
        setRoomNo(roomNumber);
    };

    return (
        <div className="absolute bottom-5 left-5 z-10 flex flex-row items-center">
            <ul className="flex">
                {tourData.tour_room.map((room, index) => (
                    <li key={index}
                        className={`mx-1 flex h-9 w-9 items-center justify-center rounded-full border ${roomNo === room.room_id
                            ? "bg-gradient-to-tr from-pink-600 to-pink-400 text-white shadow-md shadow-pink-500/20"
                            : "border-blue-gray-100 bg-transparent text-blue-gray-500"
                            } p-0 text-sm transition duration-150 ease-in-out hover:bg-light-300`}
                        onClick={() => handleSwitchRoom(room.room_id)}>
                        {room.room_id}
                    </li>
                ))}
            </ul>
            <button
                className={`flex-none px-3 py-2 text-white rounded shadow mr-4 ${(tourData.tour_room.length >= 4) ? 'bg-gray-300' : 'bg-black hover:bg-gray-800 focus:shadow-outline'}`}
                onClick={handleAddRoom}
                disabled={tourData.tour_room.length >= 4}
            >
                Add More Room
            </button>
        </div>
    );
}

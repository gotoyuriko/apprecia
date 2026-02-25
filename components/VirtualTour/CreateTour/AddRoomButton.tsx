import { panoramaArtworkImages } from "@/data/data";
import type { ArtGallery } from "@/types";
import type { Dispatch, SetStateAction } from "react";

interface AddRoomButtonProps {
    tourData: ArtGallery;
    setTourData: Dispatch<SetStateAction<ArtGallery>>;
    roomNo: number;
    setRoomNo: Dispatch<SetStateAction<number>>;
    setOpenModalEnv: Dispatch<SetStateAction<boolean>>;
}

export default function AddRoomButton({ tourData, setTourData, roomNo, setRoomNo, setOpenModalEnv }: AddRoomButtonProps) {
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
        setRoomNo(newRoomId);
        setOpenModalEnv(true);
    };

    const handleSwitchRoom = (roomNumber: number) => {
        setRoomNo(roomNumber);
    };

    return (
        <div className="absolute bottom-5 left-5 z-10 flex flex-col lg:flex-row items-start lg:items-center">
            <ul className="flex">
                {tourData?.tour_room.map((room, index) => (
                    <li key={index}
                        className={`mx-1 flex h-9 w-9 items-center justify-center rounded-full border ${roomNo === room.room_id
                            ? "bg-gradient-to-tr from-gray-800 to-gray-600 text-white shadow-md"
                            : "border-blue-gray-100 bg-transparent text-blue-gray-500"
                            } p-0 text-sm transition duration-150 ease-in-out hover:bg-light-300`}
                        onClick={() => handleSwitchRoom(room.room_id as number)}>
                        {room.room_id}
                    </li>
                ))}
            </ul>
            <button
                className={`flex-none px-3 py-2 text-white rounded shadow mr-4 mt-2 ${(tourData?.tour_room.length >= 4) ? 'bg-gray-300' : 'bg-black hover:bg-gray-800 focus:shadow-outline'}`}
                onClick={handleAddRoom}
                disabled={tourData?.tour_room.length >= 4}
            >
                Add More Room
            </button>
        </div>
    );
}

export default function SwitchRoom({ tourData, roomNo, setRoomNo }) {

    const handleSwitchRoom = (roomNumber) => {
        setRoomNo(roomNumber);
    };

    return (
        <div className="absolute bottom-5 left-5 z-10 flex flex-row items-center">
            <ul className="flex">
                {tourData?.tour_room.map((room, index) => (
                    <li key={index}
                        className={`mx-1 flex h-9 w-9 items-center justify-center rounded-full border ${roomNo === room.room_id
                            ? "bg-gradient-to-tr from-gray-800 to-gray-600 text-white shadow-md"
                            : "border-blue-gray-100 bg-transparent text-blue-gray-500"
                            } p-0 text-sm transition duration-150 ease-in-out hover:bg-light-300`}
                        onClick={() => handleSwitchRoom(room.room_id)}>
                        {room.room_id}
                    </li>
                ))}
            </ul>
        </div>
    );
}
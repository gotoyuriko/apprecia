export default function EditEnvironment({
    tourData, setTourData,
    roomNo, setRoomNo,
    setOpenModalEnv }) {
    const deleteRoomHandle = (roomNumber) => {
        const updatedTourData = {
            ...tourData,
            tour_room: tourData.tour_room.filter((room) => room.room_id !== roomNumber),
        };
        // Update the room IDs of the remaining rooms
        const updatedTourRooms = updatedTourData.tour_room.map((room, index) => ({
            ...room,
            room_id: index + 1,
        }));
        const newRoomNo = roomNo === roomNumber ? updatedTourRooms[0].room_id : roomNo;
        const updatedTourDataWithNewRoomIds = {
            ...updatedTourData,
            tour_room: updatedTourRooms,
        };
        setTourData(updatedTourDataWithNewRoomIds);
        setRoomNo(newRoomNo);
    };

    return (
        <>
            <div className='absolute top-5 right-5 z-10 flex flex-row items-center'>
                <h1 className="flex-none font-bold text-white text-xl mr-3">{tourData?.tour_name}</h1>
                <button className="flex-none bg-black px-3 py-2 text-white rounded shadow focus:shadow-outline hover:bg-gray-800"
                    onClick={() => setOpenModalEnv(true)}>
                    Edit Environment
                </button>
                <button className={`flex-none px-3 py-2 ml-3 text-white rounded shadow 
                    ${tourData?.tour_room.length !== 1 ? 'bg-red-500 focus:shadow-outline hover:bg-red-600' : 'bg-gray-300 focus:shadow-none'}`}
                    onClick={() => deleteRoomHandle(roomNo)}
                    disabled={tourData?.tour_room.length === 1}>
                    Delete Room
                </button>
            </div>

        </>
    )
}
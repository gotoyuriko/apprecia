export default function RoomPublishButton({ setOpenModalEnv }) {
    return (
        <div className='absolute bottom-5 right-5 z-10 flex flex-row items-center'>
            <button className="flex-none bg-red-700 px-3 py-2 text-white rounded shadow focus:shadow-outline hover:bg-red-800 mr-4"
                onClick={() => setOpenModalEnv(true)}>
                Cancel
            </button>
            <button className="flex-none bg-green-600 px-3 py-2 text-white rounded shadow focus:shadow-outline hover:bg-green-700"
                onClick={() => setOpenModalEnv(true)}>
                Publish
            </button>
        </div>
    )
}
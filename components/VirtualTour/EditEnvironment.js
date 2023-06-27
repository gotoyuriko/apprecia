export default function EditEnvironment({ roomData, setOpenModalEnv }) {
    return (
        <div className='absolute top-5 right-5 z-10 flex flex-row items-center'>
            <h1 className="flex-none font-bold text-white text-xl mr-3">{roomData?.tourName}</h1>
            <button className="flex-none bg-black px-3 py-2 text-white rounded shadow focus:shadow-outline hover:bg-gray-800"
                onClick={() => setOpenModalEnv(true)}>
                Edit Environment
            </button>
        </div>
    )
}
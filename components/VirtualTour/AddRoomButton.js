export default function AddRoomButton({ setOpenModalEnv }) {
    return (
        <div className="absolute bottom-5 left-5 z-10 flex flex-row items-center">
            <nav>
                <ul className="flex mr-3">
                    <li>
                        <a
                            className="mx-1 flex h-9 w-9 items-center justify-center rounded-full bg-black p-0 text-sm text-white shadow-md transition duration-150 ease-in-out"
                            href="#">
                            1
                        </a>
                    </li>
                    <li>
                        <a
                            className="mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-light-300"
                            href="#"

                        >
                            2
                        </a>
                    </li>
                    <li>
                        <a
                            className="mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-light-300"
                            href="#"
                        >
                            3
                        </a>
                    </li>
                    <li>
                        <a
                            className="mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-light-300"
                            href="#"
                        >
                            4
                        </a>
                    </li>
                </ul>
            </nav>
            <button
                className="flex-none bg-black px-3 py-2 text-white rounded shadow 
                                focus:shadow-outline hover:bg-gray-800 mr-4"
                onClick={() => setOpenModalEnv(true)}
            >
                Add More Room
            </button>
        </div>
    );
}

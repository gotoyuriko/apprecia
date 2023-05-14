import RingLoader from "react-spinners/ClipLoader";

export default function Loading() {
    return (
        <div>
            <main className='bg-white h-screen w-screen grid place-items-center z-50'>
                <div className="flex justify-center flex-col space-y-8 p-8 max-w-max">
                    <RingLoader size={80} color="#ccc" />
                    <p className="text-center pt-3 font-bold">Loading...</p>
                </div>
            </main>
        </div>
    )


}
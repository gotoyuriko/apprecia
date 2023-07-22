import { RingLoader } from "react-spinners";

export default function Loader() {
    return (
        <div className='bg-white w-screen h-screen z-20 flex justify-center items-center'>
            <RingLoader
                color="#333"
                loading
                size={100}
                speedMultiplier={1}
            />
        </div>
    )
}
export default function TourTitle({ tourData, roomNo }) {
    return (
        <div className="absolute top-10 right-5 z-10">
            <h1 className="text-2xl font-bold text-white">
                <span>{tourData?.tour_name}</span> - Room <span>{roomNo}</span>
            </h1>
        </div>
    )
}
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function AboutCard({ title, des }) {
    return (
        <Card className="my-4 mx-0 md:mx-10 flex justify-center">
            <div className='bg-white bg-opacity-64 border border-opacity-17 border-white backdrop-filter backdrop-blur-lg border-solid rounded-lg shadow-lg'></div>
            <CardContent className="">
                <h1 className="font-bold text-lg mb-2">{title}</h1>
                <p className="text-justify">{des}</p>
            </CardContent>
        </Card>
    );
}

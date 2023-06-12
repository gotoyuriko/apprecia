import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

export default function AboutCard({ title, des, src, alt }) {
    return (
        <Card sx={{ maxWidth: 345 }} className='my-2 md:my-10 md:mx-10'>
            <CardMedia
                sx={{ height: 140, display: { xs: 'none', md: 'block' } }}
                image={src}
                title={alt}
            />
            <CardContent>
                <h1 className="font-bold text-lg mb-2">{title}</h1>
                <p className="text-justify">{des}</p>
            </CardContent>
        </Card>
    );
}

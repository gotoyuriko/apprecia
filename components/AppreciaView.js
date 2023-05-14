import Spline from '@splinetool/react-spline';
import { useState } from 'react';

export default function AppreciaView() {
    const [isLoaded, setIsLoaded] = useState(false);
    const backgroundImage = '/appreciabg.png';

    return (
        <main className="flex h-96 w-full flex-col items-center justify-center bg-fixed bg-center bg-cover bg-repeat"
            style={{
                background: isLoaded ? 'none' : `url(${backgroundImage})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'none'
            }}
        >
            <Spline onLoad={() => setIsLoaded(true)}
                scene="https://prod.spline.design/UB-SpUKi5AWALdo7/scene.splinecode" />
        </main>
    );
}

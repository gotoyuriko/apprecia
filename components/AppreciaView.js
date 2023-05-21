import { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';

export default function AppreciaView() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const containerStyle = isLoaded ? {} : {
        width: '100%',
        height: '384px',
        position: 'relative',
        zIndex: 0,
        background: 'url(/appreciabg.png) center/cover no-repeat',
    };

    return (
        <div className="h-96" style={containerStyle}>
            {!isLoaded && (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    Loading...
                </div>
            )}
            {isLoaded && <Spline className='h-full' scene="https://prod.spline.design/UB-SpUKi5AWALdo7/scene.splinecode" />}
        </div>
    );
}

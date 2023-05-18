import Spline from '@splinetool/react-spline';
import { useEffect } from 'react';

export default function AppreciaView({ onSceneLoad }) {
    useEffect(() => {
        onSceneLoad();
    }, [onSceneLoad]);

    return (
        <Spline scene="https://prod.spline.design/UB-SpUKi5AWALdo7/scene.splinecode" />
    );
}

import Spline from '@splinetool/react-spline';
import { useState } from 'react';

export default function ThreeApprecia() {
    const [loading, setLoading] = useState(true);
    return (
        <Spline
            onLoad={() => setLoading(false)}
            scene="https://prod.spline.design/UB-SpUKi5AWALdo7/scene.splinecode" />
    );
}

import Spline from "@splinetool/react-spline";
import { useEffect, useState } from "react";

export default function AppreciaView() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className="h-96" style={{ background: "url(/loading.png) center/cover no-repeat" }}>
            {isLoaded && (
                <Spline className="h-full" scene="https://prod.spline.design/UB-SpUKi5AWALdo7/scene.splinecode" />)}
        </div>
    );
}

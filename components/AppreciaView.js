import Spline from '@splinetool/react-spline';
import { useEffect, useRef, useState } from 'react';

export default function AppreciaView({ isLoaded, onSceneLoad }) {
    const canvasRef = useRef(null);
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [canvasHeight, setCanvasHeight] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl');

        // Update canvas dimensions
        const updateCanvasDimensions = () => {
            setCanvasWidth(canvas.clientWidth);
            setCanvasHeight(canvas.clientHeight);
        };

        // Register event listener for resize
        window.addEventListener('resize', updateCanvasDimensions);

        // Initial canvas dimensions
        updateCanvasDimensions();

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('resize', updateCanvasDimensions);
        };
    }, []);

    useEffect(() => {
        if (!isLoaded) return; // Skip WebGL operations until loaded

        const gl = canvasRef.current.getContext('webgl');
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        const width = canvasWidth > 0 ? canvasWidth : 1;
        const height = canvasHeight > 0 ? canvasHeight : 1;

        console.log('Texture dimensions:', width, height);

        // Set the viewport and clear the buffers
        gl.viewport(0, 0, width, height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        onSceneLoad();
    }, [isLoaded, canvasWidth, canvasHeight, onSceneLoad]);

    return (
        <div className="h-full relative">
            <canvas
                className="h-full w-full absolute"
                ref={canvasRef}
            />
            <Spline
                className="h-full w-full absolute"
                scene="https://prod.spline.design/UB-SpUKi5AWALdo7/scene.splinecode"
            />
        </div>
    );
}

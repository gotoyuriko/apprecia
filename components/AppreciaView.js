import Spline from '@splinetool/react-spline';
import { useEffect, useRef } from 'react';

export default function AppreciaView({ isLoaded, onSceneLoad }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const gl = canvasRef.current.getContext('webgl');
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        const width = gl.canvas.width > 0 ? gl.canvas.width : 1;
        const height = gl.canvas.height > 0 ? gl.canvas.height : 1;

        console.log('Texture dimensions:', width, height);

        // Set the viewport and clear the buffers
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        onSceneLoad();
    }, [onSceneLoad]);

    return (
        <div className="h-full relative">
            <canvas className="h-full absolute" ref={canvasRef} />
            <Spline className="h-full absolute" scene="https://prod.spline.design/UB-SpUKi5AWALdo7/scene.splinecode" />
        </div>
    );
}

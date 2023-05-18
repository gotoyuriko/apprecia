import AppreciaView from '@/components/AppreciaView';
import Navbar from '../components/Nav/Navbar';
import { auth } from '@/firebase/config';
import { useEffect, useState } from 'react';


function WebGLRenderer() {
  const canvasRef = useRef(null);
  const glRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');

    if (!gl) {
      console.error('WebGL is not supported.');
      return;
    }

    glRef.current = gl;

    // Additional WebGL setup can be done here

    // Generate and bind the texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const width = 512;  // Texture width
    const height = 512; // Texture height

    if (width <= 0 || height <= 0) {
      console.error('Texture dimensions must be greater than zero.');
      return;
    }

    // Use the validated texture dimensions
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );

    // Additional texture setup can be done here

    return () => {
      // Cleanup WebGL resources if needed
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

export default function Home() {
  const user = auth.currentUser;
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="w-full">
      <Navbar user={user} />
      <div
        {
        ...isLoaded ? style = {
          width: '100%',
          position: 'relative',
          zIndex: 0,
          background: 'url(/appreciabg.png)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'none'
        } : null
        }
        className='h-96'
        onLoad={() => setIsLoaded(true)}

      >
        <AppreciaView />
      </div>
    </div>
  );
}

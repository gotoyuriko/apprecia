import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

export default function AppreciaView() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create floating cubes
    const cubes = [];
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    
    for (let i = 0; i < 5; i++) {
      const material = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color().setHSL(0.7 + i * 0.1, 0.8, 0.6),
        wireframe: true
      });
      const cube = new THREE.Mesh(cubeGeometry, material);
      
      cube.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 10
      );
      
      scene.add(cube);
      cubes.push(cube);
      
      // GSAP animations
      gsap.to(cube.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        duration: 10 + Math.random() * 10,
        repeat: -1,
        ease: "none"
      });
      
      gsap.to(cube.position, {
        y: cube.position.y + 2,
        duration: 3 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });
    }

    // Camera animation
    camera.position.z = 8;
    gsap.to(camera.position, {
      x: 2,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="h-96 relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div ref={mountRef} className="absolute inset-0" />
      <div className="absolute inset-0 flex items-center justify-center text-white z-10">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Apprecia</h1>
          <p className="text-xl opacity-90">Virtual Art Gallery Platform</p>
        </div>
      </div>
    </div>
  );
}

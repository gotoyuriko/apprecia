import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Float, Stars } from '@react-three/drei';

function FloatingCube({ position }) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#8b5cf6" />
      </mesh>
    </Float>
  );
}

export default function AppreciaView() {
  return (
    <div className="h-96 w-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
        
        <Text
          position={[0, 1, 0]}
          fontSize={1.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Apprecia
        </Text>
        
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.5}
          color="#a855f7"
          anchorX="center"
          anchorY="middle"
        >
          Virtual Art Gallery
        </Text>
        
        <FloatingCube position={[-3, 0, 0]} />
        <FloatingCube position={[3, 0, 0]} />
        <FloatingCube position={[0, 2, -2]} />
        
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}

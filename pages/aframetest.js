import 'aframe';
import 'aframe-particle-system-component';
import { Entity, Scene } from 'aframe-react';

export default function AframeTest() {

    return (
        <div className="h-screen">
            <Scene>
                <Entity geometry={{ primitive: 'box' }}
                    material={{ color: 'red' }}
                    position={{ x: 0, y: 0, z: -5 }} />
                {/* <Entity particle-system={{ preset: 'snow' }} /> */}
                <Entity light={{ type: 'point' }} />
                <Entity gltf-model={{ src: 'virtualcity.gltf' }} />
                <Entity text={{ value: 'Hello, WebVR!' }} />
            </Scene>
        </div>
    );
}

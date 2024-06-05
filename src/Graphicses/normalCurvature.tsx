import * as THREE from 'three';
import { createContext, useContext, useState, useRef, Suspense } from 'react';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import _ from 'lodash';
import { HalfedgeDS } from 'three-mesh-halfedge';
import { Canvas, useFrame,useLoader } from '@react-three/fiber'
import { Clouds, Cloud, CameraShake, Environment, OrbitControls, ContactShadows, PerspectiveCamera } from "@react-three/drei"
import { CuboidCollider, BallCollider, Physics, RigidBody } from "@react-three/rapier"
import { random } from "maath"

function createbufferattribute(vecdata: number[][], mesh: THREE.Mesh) {
    const buffer = new Float32Array(vecdata.flat());
    const attribute = new THREE.BufferAttribute(buffer, 3);
    mesh.geometry.setAttribute('color', attribute);
}


function color_map_vec(vecarray: number[][]): Array<[number, number, number]> {
    const flatvec = vecarray.flat().sort((a, b) => a - b);
    const n = flatvec.length;
    const minValue = flatvec[0];
    const maxValue = flatvec[n - 1];

    const range = maxValue - minValue;
    const colors: Array<[number, number, number]> = new Array(vecarray.length).fill([0, 0, 0]);

    for (let i = 0; i < vecarray.length; i++) {
        const color: [number, number, number] = [0, 0, 0];
        for (let j = 0; j < vecarray[i].length; j++) {
            const t = (vecarray[i][j] - minValue) / range;
            color[j] = t * 2;
        }
        colors[i] = color;
    }
    return colors;
}


function ColorfulBunny() {
    const obj = useLoader(OBJLoader, '/bumpy-cube.obj');
    const meshRef = useRef();
    obj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const geometry = mesh.geometry as THREE.BufferGeometry;
            const struct = new HalfedgeDS();
            struct.setFromGeometry(geometry, 1e-10);

            geometry.computeVertexNormals();
            const normals = geometry.getAttribute('normal').array;
            const array0 = _.chunk(normals, 3);
            const colors = color_map_vec(array0);
            createbufferattribute(colors, mesh);

            const material = new THREE.MeshBasicMaterial({ color: 0x1fe0f4, wireframe: true });
            material.vertexColors = true;
            mesh.material = material;
        }
    });

    
    return <primitive object={obj} ref={meshRef} scale={[1, 1, 1]} />;
}

// function Puffycloud({ seed:\\, vec = new THREE.Vector3(), ...props }) {
//     const api = useRef()
//     const light = useRef()
//     const rig = useContext(context)
//     const [flash] = useState(() => new random.FlashGen({ count: 10, minDuration: 40, maxDuration: 200 }))
//     const contact = (payload:any) => payload.other.rigidBodyObject.userData?.cloud && payload.totalForceMagnitude / 1000 > 100 && flash.burst()
//     useFrame((state, delta) => {
//         const impulse = flash.update(state.clock.elapsedTime, delta)
//         light.current!.intensity = impulse * 15000
//         if (impulse === 1) rig?.current?.setIntensity(1)
//         api.current?.applyImpulse(vec.copy(api.current.translation()).negate().multiplyScalar(10))
//     })
//     return (
//         <RigidBody ref={api} userData={{ cloud: true }} onContactForce={contact} linearDamping={4} angularDamping={1} friction={0.1} {...props} colliders={false}>
//             <BallCollider args={[4]} />
//             <Cloud seed={seed} fade={30} speed={0.1} growth={4} segments={40} volume={6} opacity={0.6} bounds={[4, 3, 1]} />
//             <Cloud seed={seed + 1} fade={30} position={[0, 1, 0]} speed={0.5} growth={4} volume={10} opacity={1} bounds={[6, 2, 1]} />
//             <pointLight position={[0, 0, 0.5]} ref={light} color="blue" />
//         </RigidBody>
//     )
// }

const context = createContext();
function Bunny() {
    const shake = useRef()
    return (
        <>
            <Canvas>
                <OrbitControls />
                <ambientLight intensity={1} />
                <pointLight position={[10, 10, 10]} />
                <context.Provider value={shake}>
                    {/* <CameraShake ref={shake} decay decayRate={0.95} maxYaw={0.05} maxPitch={0.01} yawFrequency={4} pitchFrequency={2} rollFrequency={2} intensity={0} /> */}
                    <Clouds limit={400} material={THREE.MeshLambertMaterial}>
                        <Physics gravity={[0, 0, 0]}>
                            {/* <Pointer /> */}
                            <Cloud seed={30} fade={30} speed={0.1} growth={4} segments={40} volume={6} opacity={0.6} bounds={[4, 3, 1]} />
                            {/* <Puffycloud seed={10} position={[50, 0, 0]} />
                            <Puffycloud seed={20} position={[0, 50, 0]} />
                            <Puffycloud seed={30} position={[50, 0, 50]} />
                            <Puffycloud seed={40} position={[0, 0, -50]} />
                            <CuboidCollider position={[0, -15, 0]} args={[400, 10, 400]} /> */}
                        </Physics>
                    </Clouds>
                </context.Provider>
                <Suspense fallback={null}>
                    <ColorfulBunny />
                </Suspense>
            </Canvas>
        </>
    );
}

export default Bunny;
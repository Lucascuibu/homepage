import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import _ from 'lodash';
import { HalfedgeDS } from 'three-mesh-halfedge';

function createbufferattribute(vecdata: number[][], mesh: THREE.Mesh) {
    const buffer = new Float32Array(vecdata.flat());
    console.log(buffer);
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
        console.log(colors[i]);
    }
    return colors;
}


function Bunny() {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount: HTMLDivElement | null = mountRef.current;
        const width = mount!.clientWidth;
        const height = mount!.clientHeight;

        const scene = new THREE.Scene();
        // const bg = new THREE.Color('white');
        // scene.background = new THREE.Color(bg);
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        mount!.appendChild(renderer.domElement);

        const light = new THREE.AmbientLight(0x404040);
        scene.add(light);

        camera.position.z = 2;

        const loader = new OBJLoader();
        loader.load(
            '/bunny.obj',
            (object: THREE.Group) => {
                object.traverse((child) => {
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

                        const material = new THREE.MeshBasicMaterial({ color: 0x1fe0f4, wireframe: false });
                        material.vertexColors = true;
                        mesh.material = material;
                    }
                });
                object.scale.set(0.5, 0.5, 0.5);
                object.rotateX(-Math.PI * 0.5);
                scene.add(object);
            },
            undefined,
            (error: unknown) => {
                console.error(error);
            }
        );

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            const newWidth = mount!.clientWidth;
            const newHeight = mount!.clientHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            mount!.removeChild(renderer.domElement);
            renderer.dispose();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <div ref={mountRef} className="aspect-square border-black border relative" >
                <p className='absolute bottom-2 left-3'>bunny:?</p>
            </div>
        </>
    );
}

export default Bunny;
import TopBar from './Topbar';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

function Pic() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount: HTMLDivElement | null = mountRef.current;
    const width = mount!.clientWidth;
    const height = mount!.clientHeight;

    const scene = new THREE.Scene();
    const bg = new THREE.Color('white');
    scene.background = new THREE.Color(bg);
    const camera = new THREE.PerspectiveCamera(15, width / height, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    mount!.appendChild(renderer.domElement);

    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

    const light = new THREE.AmbientLight(0x404040); 
    scene.add(light);

    camera.position.z = 10;

    const loader = new OBJLoader();
    loader.load(
      '/bunny.obj',
      (object: THREE.Group) => {
        object.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = new THREE.MeshBasicMaterial({ color: 0x1fe0f4, wireframe: true }); // 设置新的材质
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const floor = (() => {
    //   const geo = new THREE.PlaneGeometry(20, 20);
    //   const mat = new THREE.MeshPhongMaterial({ shininess: 10, color: "#aaa" });
    //   const mesh = new THREE.Mesh(geo, mat);
    //   mesh.rotation.x = Math.PI * -0.5;
    //   mesh.receiveShadow = true;
    //   scene.add(mesh);
    //   return mesh;
    // })();

    const animate = () => {
      requestAnimationFrame(animate);
      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;
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

    // Clean up on component unmount
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

function Graphics() {
  const pics = new Array(4).fill(null);
  return (
    <>
      <div className="h-screen w-screen text-xs font-normal pt-10 ">
        <TopBar />

        <div className="h-full w-screen p-1">
          <div className='grid grid-cols-2 2xl:grid-cols-3 gap-0.5 '>
            {pics.map((_, index) => (
              <Pic key={index} />
            ))}
          </div>
          <div className='h-1'>
          </div>

        </div>
      </div>
    </>
  );
}

export default Graphics;
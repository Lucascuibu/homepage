import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function Shader() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, material: THREE.ShaderMaterial, mesh;

        const init = () => {
            // 创建场景
            scene = new THREE.Scene();
            // const bg = new THREE.Color('white');
            // scene.background = new THREE.Color(bg);


            // 创建相机
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 1;

            // 创建渲染器
            renderer = new THREE.WebGLRenderer();
            const container = containerRef.current;
            if (container) {
                renderer.setSize(container.clientWidth, container.clientHeight);
                container.appendChild(renderer.domElement);
            }

            // 创建着色器材质
            const vertexShader = `
                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `;

            const fragmentShader = `
                uniform float time;
                uniform vec2 resolution;

                float sdSphere(vec3 p, vec3 c, float r) {
                    return length(p - c) - r;
                }

                void main() {
                    struct Material {
                        vec3 ambience;
                        vec3 diffuse;
                        vec3 specular;
                        float highlight;
                    };
                    struct Sphere {
                        vec3 center;
                        vec3 color;
                        float radius;
                        Material material;
                    };

                    struct Light {
                        vec3 position;
                        vec3 color;
                    };

                    const int MAX_SPHERES = 2;
                    const int MAX_LIGHTS = 2;

                    vec3 spherePos = vec3(0.0, 0.0, 0.0);
                    float sphereR = 0.5;
                    float camDis = 2.0;
                    vec3 camPos = vec3(0.0, 0.0, 1.0);
                    vec3 camDir = vec3(0.0, 0.0, -1.0);
                    vec3 camRight = normalize(cross(vec3(0.0, 1.0, 0.0), camDir));
                    vec3 camUp = cross(camDir, camRight);

                    vec2 uv = (gl_FragCoord.xy / resolution ) * 2.0 - 1.0;
                    vec3 rayOrigin = camPos;
                    vec3 rayDir = normalize(uv.x * camRight + uv.y * camUp + camDir);

                    float dist;
                    Light lights[MAX_LIGHTS];
                    lights[0] = Light(vec3(cos(time) * camDis, 0.0, sin(time) * camDis) + camDir, vec3(0.5, 0.5, 0.1));
                    lights[1] = Light(vec3(0.0, sin(time + 2.0) * camDis, cos(time + 2.0) * camDis) + camDir, vec3(0.3, 0.2, 0.8));

                    for (int i = 0; i < 100; i++) {
                        dist = sdSphere(rayOrigin, spherePos, sphereR);
                        if (dist < 0.001) break;
                        rayOrigin += dist * rayDir;
                    }

                    vec4 fragColor = vec4(0.0);
                    if (dist < 0.001) {
                        vec3 vNormal = normalize(rayOrigin - spherePos);
                        for (int i = 0; i < 2; i++) {
                            vec3 lightPos = lights[i].position;
                            vec3 lightColor = lights[i].color;
                            vec3 lightDir = normalize(lightPos - rayOrigin);

                            float diff = max(dot(vNormal, lightDir), 0.0);
                            vec3 ambient = 0.3 * lightColor * vec3(1.0, 0.5, 0.5);
                            vec3 diffuse = diff * lightColor * vec3(1.0, 1.0, 1.0);
                            vec3 specular = vec3(1.0, 0.5, 1.0) * lightColor * pow(max(dot(reflect(-lightDir, vNormal), -rayDir), 0.0), 32.0);
                            vec3 color = ambient + diffuse + specular;

                            fragColor += vec4(color, 1.0);
                        }
                    }

                    gl_FragColor = fragColor;
                }
            `;

            material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 1.0 },
                    resolution: { value: new THREE.Vector2(container!.clientWidth, container!.clientHeight) }
                },
                vertexShader,
                fragmentShader
            });

            const geometry = new THREE.PlaneGeometry(2, 2);
            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            // 动画循环
            const animate = () => {
                requestAnimationFrame(animate);
                material.uniforms.time.value += 0.01;
                renderer.render(scene, camera);
            };

            animate();
        };

        init();

        const handleResize = () => {
            const container = containerRef.current;
            if (container) {
                const width = container.clientWidth;
                const height = container.clientHeight;
                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                material.uniforms.resolution.value.set(width, height);
            }
        };

        window.addEventListener('resize', handleResize);

        // 清理函数
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const container = containerRef.current;
            if (container) {
                container.removeChild(renderer.domElement);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <div className="aspect-square border-black border relative" ref={containerRef}>
                <p className='absolute bottom-2 left-3'>Phong lighting:?</p>
            </div>
        </>
    );
}

export default Shader;
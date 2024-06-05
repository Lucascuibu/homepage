import * as THREE from 'three';
import { useEffect, useMemo } from 'react';
import _ from 'lodash';

import { isWebGLSupported, isWebGL2Supported } from 'webgl-detector';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';

import bunny from '../../public/input/bunny.ts';
import * as Core from '../ddg/core';
import MeshIO from '../ddg/meshio';
import { create } from 'zustand';
import { colormap, seismic } from '../ddg/colormap.ts';


type NormalStoreType = {
    useBasicMaterial: boolean,
    normalsType: string,
    setNormalsType: (type: string) => void,
    plotType: string,
    setPlotType: (type: string) => void,
    meshLoaded: boolean,
    setMeshLoaded: (loaded: boolean) => void,
    showNormals: boolean,
    toggleNormals: () => void,
    showWireframe: boolean,
    toggleWireframe: () => void

}

const useNormalStore = create<NormalStoreType>()(set => ({
    useBasicMaterial: false,
    normalsType: 'Equally Weighted',
    setNormalsType: (type) => set(() => ({ normalsType: type })),
    plotType: 'Shaded',
    setPlotType: (type) => set(() => ({ plotType: type })),
    meshLoaded: false,
    setMeshLoaded: (loaded) => set(() => ({ meshLoaded: loaded })),
    showNormals: false,
    toggleNormals: () => set((state) => ({ showNormals: !state.showNormals })),
    showWireframe: false,
    toggleWireframe: () => set((state) => ({ showWireframe: !state.showWireframe }))
}));




function initThreeMesh(mesh: Core.Mesh, geometry: Core.Geometry, materialSettings:any) {
    const ORANGE = new THREE.Vector3(1.0, 0.5, 0.0);

    const threeGeometry = new THREE.BufferGeometry();

    let V = mesh.vertices.length;
    let positions = new Float32Array(V * 3);
    let normals = new Float32Array(V * 3);
    let colors = new Float32Array(V * 3);
    for (let v of mesh.vertices) {
        let i = v.index;

        let position = geometry.positions.get(v)!;
        positions[3 * i + 0] = position.x;
        positions[3 * i + 1] = position.y;
        positions[3 * i + 2] = position.z;

        let normal = geometry.vertexNormalEquallyWeighted(v);
        normals[3 * i + 0] = normal.x;
        normals[3 * i + 1] = normal.y;
        normals[3 * i + 2] = normal.z;

        colors[3 * i + 0] = ORANGE.x;
        colors[3 * i + 1] = ORANGE.y;
        colors[3 * i + 2] = ORANGE.z;
    }

    let F = mesh.faces.length;
    let indices = new Uint32Array(F * 3);
    for (let f of mesh.faces) {
        let i = 0;
        for (let v of f.adjacentVertices()) {
            indices[3 * f.index + i++] = v.index;
        }
    }

    threeGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
    threeGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    threeGeometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    threeGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    // threeGeometry.computeVertexNormals();
    let threeMaterial = new THREE.MeshPhongMaterial(materialSettings) as THREE.Material;
    let wireframe = new THREE.LineSegments();

    wireframe.geometry = new THREE.WireframeGeometry(threeGeometry);
    wireframe.material = new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 0.75
    });

    let threeMesh = new THREE.Mesh(threeGeometry, threeMaterial);
    let normalsHelper = new VertexNormalsHelper(threeMesh, 0.02, 0x0000ff);
    threeGeometry.attributes.normal.needsUpdate = true;


    return { threeMesh, normalsHelper, wireframe };

}


function updatePlot(value: string, mesh: Core.Mesh, geometry: Core.Geometry, useBasicMaterial: boolean) {
    let max = 0;
    let nowuseBasicMaterial = useBasicMaterial;
    const ORANGE = new THREE.Vector3(1.0, 0.5, 0.0);
    let vertexQuantity = new Map<Core.Vertex, number>();
    if (value !== "Shaded") {
        nowuseBasicMaterial = true;
        for (let v of mesh.vertices) {
            if (value === "A") {
                vertexQuantity.set(v, geometry.circumcentricDualArea(v));

            } else if (value === "K") {
                vertexQuantity.set(v, geometry.scalarGaussCurvature(v));

            } else if (value === "H") {
                vertexQuantity.set(v, geometry.scalarMeanCurvature(v));

            } else {
                let area = geometry.barycentricDualArea(v);
                let [k1, k2] = geometry.principalCurvatures(v);
                if (value === "κ min") vertexQuantity.set(v, k1 * area);
                else vertexQuantity.set(v, k2 * area);
            }

            max = Math.max(Math.abs(vertexQuantity.get(v)!), max);
        }

    } else {
        nowuseBasicMaterial = false;
    }

    max = Math.min(Math.PI / 8, max);
    let colors = new Float32Array(mesh.vertices.length * 3);
    for (let v of mesh.vertices) {
        let i = v.index;

        let color = value === "Shaded" ? ORANGE : colormap(vertexQuantity.get(v)!, -max, max, seismic!);
        colors[3 * i + 0] = color.x;
        colors[3 * i + 1] = color.y;
        colors[3 * i + 2] = color.z;
    }
    return { colors, nowuseBasicMaterial };


}

function updateNormals(mesh: Core.Mesh, geometry: Core.Geometry, normalsType: string) {
    let normals = new Float32Array(mesh.vertices.length * 3);
    for (let v of mesh.vertices) {
        let I = v.index;

        let normal;
        if (normalsType === "Equally Weighted") normal = geometry.vertexNormalEquallyWeighted(v);
        else if (normalsType === "Tip Angle Weighted") normal = geometry.vertexNormalAngleWeighted(v);
        else if (normalsType === "Sphere Inscribed") normal = geometry.vertexNormalSphereInscribed(v);
        else if (normalsType === "Area Weighted (AN)") normal = geometry.vertexNormalAreaWeighted(v);
        else if (normalsType === "Mean Curvature (HN)") normal = geometry.vertexNormalMeanCurvature(v);
        else if (normalsType === "Gauss Curvature (KN)") normal = geometry.vertexNormalGaussCurvature(v);

        normals[3 * I + 0] = normal!.x;
        normals[3 * I + 1] = normal!.y;
        normals[3 * I + 2] = normal!.z;
    }
    return normals;
}


function SceneContent() {
    const { normalsType, plotType, showNormals, showWireframe, useBasicMaterial } = useNormalStore();
    console.log( showNormals, showWireframe);
    const { scene } = useThree();
    let polygonSoup = MeshIO.readOBJ(bunny);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    let mesh = new Core.Mesh();
    const materialSettings = useMemo(() => ({
        vertexColors: true,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
        side: THREE.DoubleSide
    }), []);
    mesh.build(polygonSoup);
    let geometry = useMemo(() => new Core.Geometry(mesh, polygonSoup!['v']), [mesh, polygonSoup]);
    const { threeMesh, normalsHelper, wireframe } = useMemo(() => initThreeMesh(mesh, geometry, materialSettings), [geometry, mesh, materialSettings]);
   
    useEffect(() => {
        scene.add(threeMesh);
        return () => {
            scene.remove(threeMesh);
            threeMesh.geometry.dispose();
            threeMesh.material.dispose();
        };
    }, [scene, threeMesh]);
        
    useEffect(() => {
        threeMesh.geometry.setAttribute('normal', new THREE.BufferAttribute(updateNormals(mesh, geometry, normalsType), 3));
        threeMesh.geometry.attributes.normal.needsUpdate = true;
        normalsHelper.update();
    }, [normalsType, threeMesh.geometry, normalsHelper, mesh, geometry]);

    useEffect(() => {
        let { colors, nowuseBasicMaterial } = updatePlot(plotType, mesh, geometry, useBasicMaterial);
        threeMesh.material = nowuseBasicMaterial ? new THREE.MeshBasicMaterial(materialSettings)  : new THREE.MeshPhongMaterial(materialSettings) ;
        threeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        threeMesh.geometry.attributes.color.needsUpdate = true;
    }, [plotType, useBasicMaterial, geometry, materialSettings, threeMesh, mesh]);

    
    useEffect(() => {
        if (showNormals) scene.add(normalsHelper);
        else scene.remove(normalsHelper);
        if (showWireframe) threeMesh.add(wireframe);
        else threeMesh.remove(wireframe);

       
    }, [scene, showNormals, showWireframe,normalsHelper,threeMesh,wireframe]);

    // return () => {
    //     scene.remove(threeMesh);
    //     scene.remove(normalsHelper);
    //     threeMesh.geometry.dispose();
    //     threeMesh.material.dispose();
    //     normalsHelper.dispose();
    // };
    return null
}


function Bunny() {
    const { setNormalsType, setPlotType, toggleNormals, toggleWireframe } = useNormalStore();
    useControls(() => ({
        // 'Load Mesh': button(() => console.log('Loading Mesh...')),
        // 'Export Mesh': button(() => console.log('Exporting Mesh...')),
        Normals: {
            options: ['Equally Weighted', 'Tip Angle Weighted', 'Sphere Inscribed', 'Area Weighted (AN)', 'Mean Curvature (HN)', 'Gauss Curvature (KN)'],
            onChange: setNormalsType
        },
        Plot: {
            options: ['Shaded', 'A', 'H', 'K', 'κ max', 'κ min'],
            onChange: setPlotType
        },
        'Show Normals': {
            value: false,
            onChange: () => toggleNormals()
        },
        'Show Wireframe': {
            value: false,
            onChange: () => toggleWireframe()
        }
    }));

    if (!isWebGLSupported() && !isWebGL2Supported()) {
        return <div>Both WebGL1 and 2 is not supported!</div>;
    }

    return (
        <Canvas>
            <PerspectiveCamera
                makeDefault
                fov={45}
                aspect={window.innerWidth / window.innerHeight}
                near={0.1}
                far={1000}
                position={[0, 0, 2.5]}  // 设置相机位置
            >

                <ambientLight intensity={1} color={0xffffff} />
                <directionalLight color={0xffffff} position={[2, 20, 15]} intensity={3} />
                <OrbitControls />
                <SceneContent />
            </PerspectiveCamera>
        </Canvas>
    );
}

export default Bunny;
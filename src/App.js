import * as THREE from "three";
import { Spin } from "antd";
import React, { useRef, Suspense, useMemo, useState } from "react";
import { Canvas, useThree, useLoader, extend, Dom } from "react-three-fiber";

import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

import { MtlObjBridge } from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js'
import "antd/dist/antd.css";
import data from "./data"
extend({ OrbitControls });

const Controls = (props) => {
  const { gl, camera } = useThree();
  camera.position.y = 2;
  return <orbitControls  args={[camera, gl.domElement]} {...props} />;
};



const MeshBundle = ({ obj, mtl, image }) => {
  const mesh = useRef();
const mtlMapsLoader = new MTLLoader()
const texture = useLoader(TextureLoader, image);
const objMapsLoader = new OBJLoader2()
mtlMapsLoader.load(mtl, (mtlMapsCreator) => {
  const mtlMaps =  MtlObjBridge.addMaterialsFromMtlLoader(mtlMapsCreator)
      objMapsLoader.addMaterials(mtlMaps)
      objMapsLoader.load(obj, (obj1) => {
        obj1.scale.set(0.001, 0.001, 0.001)
        obj1.position.set( ((-401.481 + 2461.194) / 2) * 0.001 , 0.60, -(((2715.686 + (-22.496)) / 2) * 0.001) )
        obj1.rotation.x = - (Math.PI / 2)
})
})
  return (
    <mesh
      ref={mesh}
      materials={mtlMapsLoader.materials}
    >
      <color attach="background" args={["red"]} />
    <pointLight position={[0, 0, 10]} />
      <primitive  object={objMapsLoader.baseObject3d} />
      <meshPhongMaterial attach="material" map={texture} />
    </mesh>
  );
};


const BoundarytyObject = ({bound}) =>{
    const [state, setState] = useState({isHovered: false, isActive: false})

    const box = useMemo(() => {
        const extrudeSettings = { depth: 0.4, bevelEnabled: false, bevelSegments: 3, steps: 2, bevelSize: 1, bevelThickness: 1 }
    
      var boundaryPoints = []
      bound.Polygon.forEach((point) => {
        boundaryPoints.push(new THREE.Vector3((point.X-372567.0127), (point.Y+211011.0627), point.Z))
      })
      var shapeBoundary = new THREE.Shape(boundaryPoints)
      const geometry = new THREE.ExtrudeBufferGeometry(shapeBoundary, extrudeSettings);

    const boundary = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({ 
      color: 0xff0000,
      opacity: 0.5,
      transparent: true,
      side: THREE.DoubleSide
    }) );
    boundary.rotation.x = - (Math.PI / 2)
    boundary.scale.set(0.001, 0.001,1)
    boundary.position.set(0,0.1,0)

    return boundary;
      },[]);
      return(
          <primitive scale={state.isHovered ? [0.001, 0.001,1] : [0.001, 0.001,0.1]} onClick={(e) => setState({...state, isActive: !state.isActive, })} object={box}  onPointerOver={(e) => setState({...state, isHovered: true})}
          onPointerOut={(e) => setState({...state, isHovered: false})} />
      )
} 


const App = () => {
  return(
  <Canvas id="canvas" >
    <Suspense
      fallback={
        <Dom className="bg">
          <Spin
            tip="Loading..."
          />
        </Dom>
      }
    >
      <MeshBundle
        obj="./mesh-bundle-743166/RTM 200914 ABL_simplified_3d_mesh.obj"
        mtl="./mesh-bundle-743166/RTM 200914 ABL_simplified_3d_mesh.mtl"
        image="./mesh-bundle-743166/RTM 200914 ABL_texture.jpg"
      />
      {data.map((bound) =>
    <BoundarytyObject bound={bound}/>
      )}
    </Suspense>
    <ambientLight intensity={0.5} />
      <spotLight position={[-10, 10, -10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
    <Controls
      autoRotate
      enablePan
      enableZoom
      enableDamping
      dampingFactor={0.5}
      rotateSpeed={1}
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={-Math.PI / 2}
    />
    <gridHelper/>
  </Canvas>
)};

export default App;


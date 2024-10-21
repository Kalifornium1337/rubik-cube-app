import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { TrackballControls } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';

function App() {
  const [cubeColors, setCubeColors] = useState(generateInitialColors());

  // Function to generate the initial colors for each cubelet
  function generateInitialColors() {
    return [-1, 0, 1].map(x =>
      [-1, 0, 1].map(y =>
        [-1, 0, 1].map(z => {
          return {
            x,
            y,
            z,
            colors: [
              x === 1 ? '#FF7F00' : x === -1 ? 'red' : 'black',
              x === 1 ? '#FF7F00' : x === -1 ? 'red' : 'black',
              y === 1 ? 'yellow' : y === -1 ? 'white' : 'black',
              y === 1 ? 'yellow' : y === -1 ? 'white' : 'black',
              z === 1 ? 'green' : z === -1 ? 'blue' : 'black',
              z === 1 ? 'green' : z === -1 ? 'blue' : 'black'
            ]
          };
        })
      )
    );
  }

  // Function to clear all colors except for center cube colors
  function clearCubeColors() {
    setCubeColors(prevColors =>
      prevColors.map(layer =>
        layer.map(row =>
          row.map(cube => {
            if (cube.x === 0 && cube.y === 0 && cube.z === 0) {
              // Keep center cubelet colors unchanged
              return cube;
            } else {
              // Set all other cubelets to black
              return {
                ...cube,
                colors: ['black', 'black', 'black', 'black', 'black', 'black']
              };
            }
          })
        )
      )
    );
  }

  // Function to create cubes with correctly colored faces based on their positions
  const createCube = (x, y, z, colors) => {
    const materials = colors.map(color => new THREE.MeshBasicMaterial({ color }));

    return (
      <mesh position={[x * 2, y * 2, z * 2]} key={`${x}-${y}-${z}`}>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        {materials.map((material, index) => (
          <primitive key={index} attach={`material-${index}`} object={material} />
        ))}
      </mesh>
    );
  };

  return (
    <div className="app-container">
      <div className="control-panel" style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)' }}>
        <button onClick={clearCubeColors} className="control-button" style={{ border: '2px solid #5a57ff', margin: '5px' }}>Clear</button>
        <button className="control-button" style={{ border: '2px solid #5a57ff', margin: '5px' }}>Clear</button>
        <button className="control-button" style={{ border: '2px solid #5a57ff', margin: '5px' }}>Colour</button>
      </div>
      <div className="canvas-container" style={{ position: 'relative', height: '100vh' }}>
        <Canvas camera={{ position: [20, 20, 20], fov: 75, near: 0.1, far: 100 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={0.6} />

          {/* Trackball Controls with rotation restricted to avoid panning */}
          <TrackballControls
            rotateSpeed={3.0}
            zoomSpeed={1.5}
            panSpeed={0.0} // Disable panning
            noPan={true} // Prevent panning behavior
            maxDistance={40} // Prevent the camera from zooming in too close
            minDistance={10} // Prevent the camera from zooming out too far
          />

          {/* Generate the 3x3x3 Rubik's cube grid */}
          {cubeColors.flat(2).map(cube => createCube(cube.x, cube.y, cube.z, cube.colors))}
        </Canvas>
      </div>
    </div>
  );
}

export default App;

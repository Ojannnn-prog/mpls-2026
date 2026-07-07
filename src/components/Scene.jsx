import React, { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Planet from './Planet'
import SpaceStation from './SpaceStation'
import Rocket from './Rocket'
import SpeedLines from './SpeedLines'
import FloatingElements from './FloatingElements'

export default function Scene({ isPlaying, currentStop, onStopChange, rocketRef, isReturning }) {
  const { camera } = useThree()
  
  const stops = useMemo(() => [
    { position: [10, 2, 0] },     // Mars (2024)
    { position: [-20, -5, -30] }, // Jupiter (2025)
    { position: [0, 10, -60] }    // Space Station (2026)
  ], [])

  useFrame(() => {
    if ((isPlaying || isReturning) && rocketRef.current && rocketRef.current.position) {
      const rocketPos = rocketRef.current.position
      
      if (currentStop === 0) {
        // While moving, camera follows slightly behind
        // Since rocket rotation changes, a simple offset works but might be jerky if not lerped
        const offset = isReturning ? new THREE.Vector3(0, 3, 12) : new THREE.Vector3(0, 2, 8)
        const targetCamPos = rocketPos.clone().add(offset)
        
        // Fast camera lerp when returning, smooth when normal
        camera.position.lerp(targetCamPos, isReturning ? 0.2 : 0.05)
        camera.lookAt(rocketPos)
      } else {
        // When stopped at a planet, lerp camera towards a good viewing angle
        const targetPos = new THREE.Vector3(...stops[currentStop - 1].position)
        const camTarget = targetPos.clone().add(new THREE.Vector3(0, 1, 10))
        camera.position.lerp(camTarget, 0.05)
        // OrbitControls handles the lookAt and drag interactions
      }
    } else if (!isPlaying && !isReturning) {
       // Reset camera softly to start
       camera.position.lerp(new THREE.Vector3(0, 2, 10), 0.05)
       camera.lookAt(0, 0, 15)
    }
  })

  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[100, 50, 50]} intensity={2} color="#ffffff" />
      <pointLight position={[-50, -20, -50]} intensity={0.5} color="#4f46e5" />
      
      {/* More stars for extra space feel */}
      <Stars radius={200} depth={50} count={10000} factor={5} saturation={0.5} fade speed={1} />

      <FloatingElements />
      <SpeedLines isPlaying={isPlaying} isReturning={isReturning} currentStop={currentStop} />

      {/* Stop 1: Mars (2024) */}
      <Planet position={stops[0].position} color="#b91c1c" args={[2, 64, 64]} />
      
      {/* Stop 2: Jupiter (2025) */}
      <Planet position={stops[1].position} color="#b45309" hasRings={true} args={[3.5, 64, 64]} />
      
      {/* Stop 3: Space Station (2026) */}
      <SpaceStation position={stops[2].position} />

      <Rocket ref={rocketRef} isPlaying={isPlaying} onStopChange={onStopChange} stops={stops} />

      {currentStop > 0 && !isReturning && (
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          target={stops[currentStop - 1].position}
        />
      )}
    </>
  )
}

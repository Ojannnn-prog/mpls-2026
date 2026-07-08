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
    { position: [10, 2, 0] },       // 0: Bumi (2024 Part 1)
    { position: [-15, -2, -15] },   // 1: Mars (2024 Part 2)
    { position: [20, 5, -35] },     // 2: Jupiter (2025 Part 1)
    { position: [-25, -5, -55] },   // 3: Saturnus (2025 Part 2)
    { position: [15, 8, -75] },     // 4: Uranus (2025 Part 3)
    { position: [-10, -3, -95] },   // 5: Neptunus (2025 Part 4)
    { position: [0, 10, -115] }     // 6: Space Station (2026)
  ], [])

  useFrame(() => {
    if ((isPlaying || isReturning) && rocketRef.current && rocketRef.current.position) {
      const rocketPos = rocketRef.current.position
      
      if (currentStop === 0) {
        const offset = isReturning ? new THREE.Vector3(0, 3, 12) : new THREE.Vector3(0, 2, 8)
        const targetCamPos = rocketPos.clone().add(offset)
        
        camera.position.lerp(targetCamPos, isReturning ? 0.2 : 0.05)
        camera.lookAt(rocketPos)
      } else {
        const targetPos = new THREE.Vector3(...stops[currentStop - 1].position)
        const camTarget = targetPos.clone().add(new THREE.Vector3(0, 1, 10))
        camera.position.lerp(camTarget, 0.05)
      }
    } else if (!isPlaying && !isReturning) {
       camera.position.lerp(new THREE.Vector3(0, 2, 10), 0.05)
       camera.lookAt(0, 0, 15)
    }
  })

  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[100, 50, 50]} intensity={2} color="#ffffff" />
      <pointLight position={[-50, -20, -50]} intensity={0.5} color="#4f46e5" />
      
      <Stars radius={200} depth={50} count={10000} factor={5} saturation={0.5} fade speed={1} />

      <FloatingElements />
      <SpeedLines isPlaying={isPlaying} isReturning={isReturning} currentStop={currentStop} />

      {/* Stop 1: Bumi (Biru) */}
      <Planet position={stops[0].position} color="#3b82f6" args={[2, 64, 64]} />
      
      {/* Stop 2: Mars (Merah) */}
      <Planet position={stops[1].position} color="#b91c1c" args={[1.5, 64, 64]} />
      
      {/* Stop 3: Jupiter (Coklat/Oranye) */}
      <Planet position={stops[2].position} color="#b45309" hasRings={true} args={[3.5, 64, 64]} />
      
      {/* Stop 4: Saturnus (Kuning + Cincin) */}
      <Planet position={stops[3].position} color="#fcd34d" hasRings={true} args={[3, 64, 64]} />
      
      {/* Stop 5: Uranus (Cyan) */}
      <Planet position={stops[4].position} color="#67e8f9" args={[2.5, 64, 64]} />
      
      {/* Stop 6: Neptunus (Biru Tua) */}
      <Planet position={stops[5].position} color="#1e3a8a" args={[2.4, 64, 64]} />

      {/* Stop 7: Space Station (2026) */}
      <SpaceStation position={stops[6].position} />

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

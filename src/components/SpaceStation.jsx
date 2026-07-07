import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Torus, Cylinder } from '@react-three/drei'

export default function SpaceStation({ position }) {
  const stationRef = useRef()

  useFrame((state, delta) => {
    if (stationRef.current) {
      stationRef.current.rotation.y += delta * 0.1
      stationRef.current.rotation.z += delta * 0.05
    }
  })

  return (
    <group position={position} ref={stationRef} scale={0.8}>
      {/* Central Hub */}
      <Cylinder args={[0.5, 0.5, 4, 32]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#b0b0b0" metalness={0.8} roughness={0.3} />
      </Cylinder>
      
      {/* Rotating Ring */}
      <Torus args={[2.5, 0.3, 16, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#e0e0e0" metalness={0.9} roughness={0.2} />
      </Torus>
      
      {/* Solar Panels Left */}
      <Box args={[4, 0.1, 1.5]} position={[-1, 2, 0]}>
        <meshStandardMaterial color="#1d4ed8" metalness={0.4} roughness={0.6} />
      </Box>
      <Box args={[4, 0.1, 1.5]} position={[-1, -2, 0]}>
        <meshStandardMaterial color="#1d4ed8" metalness={0.4} roughness={0.6} />
      </Box>

      {/* Solar Panels Right */}
      <Box args={[4, 0.1, 1.5]} position={[1, 2, 0]}>
        <meshStandardMaterial color="#1d4ed8" metalness={0.4} roughness={0.6} />
      </Box>
      <Box args={[4, 0.1, 1.5]} position={[1, -2, 0]}>
        <meshStandardMaterial color="#1d4ed8" metalness={0.4} roughness={0.6} />
      </Box>
    </group>
  )
}

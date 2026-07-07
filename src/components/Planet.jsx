import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'

export default function Planet({ position, color, hasRings = false, args = [1, 64, 64] }) {
  const meshRef = useRef()
  const ringRef = useRef()
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.02
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={args} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Jupiter Rings */}
      {hasRings && (
        <mesh ref={ringRef} rotation={[-Math.PI / 2 + 0.3, 0, 0]}>
          <ringGeometry args={[args[0] + 0.6, args[0] + 1.5, 64]} />
          <meshStandardMaterial color="#b89e7a" transparent opacity={0.6} side={2} />
        </mesh>
      )}
    </group>
  )
}

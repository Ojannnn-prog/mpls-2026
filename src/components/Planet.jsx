import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Planet({ position, color, hasRings = false, args = [1, 64, 64] }) {
  const meshRef = useRef()
  const ringRef = useRef()
  const cloudsRef = useRef()
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.08
      cloudsRef.current.rotation.z += delta * 0.01
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.02
    }
  })

  return (
    <group position={position}>
      {/* Base Planet */}
      <mesh ref={meshRef}>
        <sphereGeometry args={args} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Dynamic Cloud / Grid Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[args[0] + 0.03, 32, 32]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent={true} 
          opacity={0.15} 
          wireframe={true} 
        />
      </mesh>

      {/* Atmospheric Glow */}
      <mesh>
        <sphereGeometry args={[args[0] + 0.15, 32, 32]} />
        <meshBasicMaterial 
          color={color} 
          transparent={true} 
          opacity={0.2} 
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Planet Rings (e.g. Jupiter/Saturn) */}
      {hasRings && (
        <mesh ref={ringRef} rotation={[-Math.PI / 2 + 0.3, 0, 0]}>
          <ringGeometry args={[args[0] + 0.8, args[0] + 2.0, 64]} />
          <meshStandardMaterial color="#fef3c7" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

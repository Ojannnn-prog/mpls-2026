import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Icosahedron, Box, Sphere, Cylinder } from '@react-three/drei'

// A fun placeholder astronaut made of basic shapes
const Astronaut = ({ position }) => {
  const astroRef = useRef()

  useFrame((state, delta) => {
    if (astroRef.current) {
      astroRef.current.rotation.y += delta * 0.2
      astroRef.current.rotation.z += delta * 0.1
      astroRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.005
    }
  })

  return (
    <group ref={astroRef} position={position} scale={0.5}>
      {/* Body */}
      <Box args={[1, 1.2, 0.8]} radius={0.2}>
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </Box>
      {/* Helmet */}
      <Sphere args={[0.6, 32, 32]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.8} />
      </Sphere>
      {/* Visor */}
      <Sphere args={[0.5, 32, 32]} position={[0, 1, 0.2]} scale={[1, 0.6, 0.8]}>
        <meshStandardMaterial color="#1e1b4b" roughness={0.1} metalness={0.9} />
      </Sphere>
      {/* Backpack */}
      <Box args={[0.8, 1, 0.4]} position={[0, 0, -0.5]}>
        <meshStandardMaterial color="#d1d5db" />
      </Box>
      {/* Arms */}
      <Cylinder args={[0.15, 0.15, 0.8]} position={[-0.7, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial color="#ffffff" />
      </Cylinder>
      <Cylinder args={[0.15, 0.15, 0.8]} position={[0.7, 0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <meshStandardMaterial color="#ffffff" />
      </Cylinder>
    </group>
  )
}

// Random asteroids
const Asteroids = () => {
  const asteroidPositions = [
    [5, -2, 8], [-8, 4, -5], [12, 6, -15], [-15, -6, -25], [8, -8, -40], [-5, 8, -55]
  ]

  const groupRef = useRef()

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.rotation.x += delta * (0.1 + i * 0.02)
        child.rotation.y += delta * (0.1 + i * 0.02)
      })
    }
  })

  return (
    <group ref={groupRef}>
      {asteroidPositions.map((pos, i) => (
        <Icosahedron key={i} args={[Math.random() * 0.5 + 0.3, 0]} position={pos}>
          <meshStandardMaterial color="#78716c" roughness={0.9} metalness={0.1} flatShading />
        </Icosahedron>
      ))}
    </group>
  )
}

export default function FloatingElements() {
  return (
    <>
      <Asteroids />
      <Astronaut position={[2, 3, -20]} />
    </>
  )
}

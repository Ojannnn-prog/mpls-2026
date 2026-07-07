import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SpeedLines({ isReturning, isPlaying, currentStop }) {
  const count = 400
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 80,
        z: (Math.random() - 0.5) * 200 - 50,
        speed: Math.random() * 0.5 + 0.2
      })
    }
    return temp
  }, [count])

  useFrame((state, delta) => {
    // Only show lines when moving between stops or returning
    const isMoving = isPlaying && currentStop === 0
    if (!isMoving && !isReturning) {
       // Hide them by moving far away if not moving
       dummy.position.set(0, 0, 1000)
       dummy.updateMatrix()
       for (let i = 0; i < count; i++) {
         meshRef.current.setMatrixAt(i, dummy.matrix)
       }
       meshRef.current.instanceMatrix.needsUpdate = true
       return
    }

    const multiplier = isReturning ? 25 : 3

    particles.forEach((particle, i) => {
      // Move particles towards camera along Z
      particle.z += particle.speed * multiplier * (delta * 60)
      
      if (particle.z > 20) {
        particle.z = -150
        particle.x = (Math.random() - 0.5) * 80
        particle.y = (Math.random() - 0.5) * 80
      }

      dummy.position.set(particle.x, particle.y, particle.z)
      dummy.rotation.x = Math.PI / 2
      dummy.scale.set(1, isReturning ? 8 : 2, 1) // Stretch along Y (which is Z after rotation)
      dummy.updateMatrix()
      
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <cylinderGeometry args={[0.015, 0.015, 2, 4]} />
      <meshBasicMaterial color="#a5b4fc" transparent opacity={isReturning ? 0.9 : 0.4} />
    </instancedMesh>
  )
}

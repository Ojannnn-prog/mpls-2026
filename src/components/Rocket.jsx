import React, { useRef, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

const Rocket = forwardRef(({ isPlaying, onStopChange, stops }, ref) => {
  const groupRef = useRef()
  const progressRef = useRef({ value: 0 })
  const timelineRef = useRef(null)
  
  // Extra state to track reverse lookAt
  const isReversingRef = useRef(false)

  const curve = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0, 15), // start
      new THREE.Vector3(5, 2, 5), // intermediate
      new THREE.Vector3(stops[0].position[0], stops[0].position[1], stops[0].position[2] + 5), // Stop 1 Bumi
      new THREE.Vector3(0, 0, -5), // intermediate
      new THREE.Vector3(stops[1].position[0], stops[1].position[1], stops[1].position[2] + 5), // Stop 2 Mars
      new THREE.Vector3(5, 2, -25), // intermediate
      new THREE.Vector3(stops[2].position[0], stops[2].position[1], stops[2].position[2] + 8), // Stop 3 Jupiter
      new THREE.Vector3(0, -2, -45), // intermediate
      new THREE.Vector3(stops[3].position[0], stops[3].position[1], stops[3].position[2] + 8), // Stop 4 Saturnus
      new THREE.Vector3(-5, 4, -65), // intermediate
      new THREE.Vector3(stops[4].position[0], stops[4].position[1], stops[4].position[2] + 6), // Stop 5 Uranus
      new THREE.Vector3(5, -2, -85), // intermediate
      new THREE.Vector3(stops[5].position[0], stops[5].position[1], stops[5].position[2] + 6), // Stop 6 Neptunus
      new THREE.Vector3(0, 5, -105), // intermediate
      new THREE.Vector3(stops[6].position[0], stops[6].position[1], stops[6].position[2] + 5)  // Stop 7 Space Station
    ]
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5)
  }, [stops])

  useImperativeHandle(ref, () => ({
    resume: () => {
      if (timelineRef.current) {
        timelineRef.current.play()
        onStopChange(0) 
      }
    },
    returnToStart: (onComplete) => {
      if (timelineRef.current) {
        timelineRef.current.kill() // Stop normal timeline
        timelineRef.current = null // Reset so it can be recreated
      }
      onStopChange(0)
      isReversingRef.current = true
      
      // Fast reverse animation
      gsap.to(progressRef.current, {
        value: 0,
        duration: 4, // Whoosh speed
        ease: "power2.in", 
        onComplete: () => {
          isReversingRef.current = false
          if (onComplete) onComplete()
        }
      })
    },
    get position() {
      return groupRef.current?.position
    },
    get rotation() {
      return groupRef.current?.rotation
    }
  }))

  useEffect(() => {
    if (isPlaying && !timelineRef.current) {
      const tl = gsap.timeline()
      timelineRef.current = tl

      // Calculate the progress fractions for the 7 stops
      // The curve has 15 points total (indices 0 to 14)
      // Stop 1 is at index 2 (2/14)
      // Stop 2 is at index 4 (4/14)
      // Stop 3 is at index 6 (6/14)
      // Stop 4 is at index 8 (8/14)
      // Stop 5 is at index 10 (10/14)
      // Stop 6 is at index 12 (12/14)
      // Stop 7 is at index 14 (14/14 = 1.0)
      
      const numPoints = 14
      
      for (let i = 1; i <= 7; i++) {
         const p = (i * 2) / numPoints
         tl.to(progressRef.current, {
           value: p,
           duration: 5,
           ease: "sine.inOut",
           onComplete: () => onStopChange(i)
         })
         
         if (i < 7) {
           tl.addPause()
         }
      }
    }
  }, [isPlaying, onStopChange])

  useFrame(() => {
    if ((isPlaying || isReversingRef.current) && groupRef.current) {
      const p = progressRef.current.value
      
      // Prevent getPointAt(0) lookAt glitch
      if (p <= 0.001) {
        groupRef.current.position.copy(curve.getPointAt(0))
        const tangent = curve.getTangentAt(0.002).normalize()
        groupRef.current.lookAt(curve.getPointAt(0).add(tangent))
        return
      }

      const point = curve.getPointAt(p)
      const tangent = curve.getTangentAt(p).normalize()
      
      groupRef.current.position.copy(point)
      
      // If returning, we want the rocket to either look backward or keep looking forward on the curve
      // For a cool effect, looking backward (where it came from) makes sense
      if (isReversingRef.current) {
         const target = point.clone().sub(tangent) // Look backward
         groupRef.current.lookAt(target)
      } else {
         const target = point.clone().add(tangent)
         groupRef.current.lookAt(target)
      }
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 15]}>
      {/* Rocket Placeholder */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.4, 2, 16]} />
        <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.2, 0.8, 16]} />
        <meshStandardMaterial color="#ef4444" metalness={0.2} roughness={0.5} />
      </mesh>
      <mesh position={[-0.3, 0, -0.8]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.1, 0.5, 0.8]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0.3, 0, -0.8]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.1, 0.5, 0.8]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      
      {/* Engine Flame */}
      {(progressRef.current.value > 0 && progressRef.current.value < 1) && 
       progressRef.current.value !== 2/6 && 
       progressRef.current.value !== 4/6 && (
        <mesh position={[0, 0, -1.2]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.15, isReversingRef.current ? 1.5 : 0.8, 16]} />
          <meshBasicMaterial color={isReversingRef.current ? "#3b82f6" : "#fb923c"} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  )
})

export default Rocket

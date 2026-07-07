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
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 15),     
      new THREE.Vector3(5, 2, 5),      
      new THREE.Vector3(stops[0].position[0], stops[0].position[1], stops[0].position[2] + 4), 
      new THREE.Vector3(-10, -3, -15), 
      new THREE.Vector3(stops[1].position[0], stops[1].position[1], stops[1].position[2] + 8), 
      new THREE.Vector3(5, 5, -45),    
      new THREE.Vector3(stops[2].position[0], stops[2].position[1], stops[2].position[2] + 5)  
    ], false, 'catmullrom', 0.5)
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
        duration: 3, // Whoosh speed
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

      const p1 = 2 / 6
      const p2 = 4 / 6
      const p3 = 6 / 6

      // Smoother animation using sine.inOut
      tl.to(progressRef.current, {
        value: p1,
        duration: 6,
        ease: "sine.inOut",
        onComplete: () => onStopChange(1)
      })
      .addPause()
      .to(progressRef.current, {
        value: p2,
        duration: 6,
        ease: "sine.inOut",
        onComplete: () => onStopChange(2)
      })
      .addPause()
      .to(progressRef.current, {
        value: p3,
        duration: 6,
        ease: "sine.inOut",
        onComplete: () => onStopChange(3)
      })
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

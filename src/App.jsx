import React, { useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import UIOverlay from './components/UIOverlay'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStop, setCurrentStop] = useState(0)
  const [isReturning, setIsReturning] = useState(false)
  const audioRef = useRef(null)
  const rocketRef = useRef(null)

  const handleStart = () => {
    setIsPlaying(true)
    if (audioRef.current) {
      audioRef.current.volume = 0.5
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(e => console.error("Audio play failed:", e))
    }
  }

  const handleNext = () => {
    if (rocketRef.current) {
      rocketRef.current.resume()
    }
  }

  const handleReturn = () => {
    if (rocketRef.current) {
      setIsReturning(true)
      rocketRef.current.returnToStart(() => {
        setIsPlaying(false)
        setCurrentStop(0)
        setIsReturning(false)
        if (audioRef.current) {
          audioRef.current.pause()
        }
      })
    }
  }

  return (
    <div className="w-full h-[100dvh] relative bg-black overflow-hidden font-sans">
      <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
        <Scene 
          isPlaying={isPlaying} 
          currentStop={currentStop} 
          onStopChange={setCurrentStop} 
          rocketRef={rocketRef} 
          isReturning={isReturning}
        />
      </Canvas>

      <UIOverlay 
        isPlaying={isPlaying} 
        currentStop={currentStop} 
        onStart={handleStart} 
        onNext={handleNext}
        onReturn={handleReturn}
        isReturning={isReturning}
      />
      
      <audio ref={audioRef} src="/WhatsApp%20Audio%202026-07-07%20at%2018.15.09.aac" />
    </div>
  )
}

export default App

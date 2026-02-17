import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, Box, Torus, Icosahedron, Octahedron } from '@react-three/drei'
import * as THREE from 'three'

// Floating geometric shapes component
function FloatingShape({ position, rotation, scale, color, speed = 1, distortion = 0 }) {
  const meshRef = useRef()
  const shapeType = useMemo(() => Math.floor(Math.random() * 5), [])
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005 * speed
      meshRef.current.rotation.y += 0.007 * speed
    }
  })

  const ShapeComponent = useMemo(() => {
    switch (shapeType) {
      case 0: return Sphere
      case 1: return Box
      case 2: return Torus
      case 3: return Icosahedron
      case 4: return Octahedron
      default: return Box
    }
  }, [shapeType])

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <ShapeComponent 
        ref={meshRef} 
        position={position} 
        rotation={rotation}
        scale={scale}
      >
        <MeshDistortMaterial 
          color={color} 
          distort={distortion} 
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </ShapeComponent>
    </Float>
  )
}

// Gold accent particles
function GoldParticles() {
  const particlesRef = useRef()
  const count = 100
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return pos
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005
      particlesRef.current.rotation.x += 0.0002
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#FFD700"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Main 3D scene
function Scene() {
  const goldColor = "#D4AF37"
  const darkGold = "#B8860B"
  
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.3} />
      
      {/* Main light */}
      <pointLight position={[10, 10, 10]} intensity={1} color="#FFD700" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#D4AF37" />
      
      {/* Gold accent lights */}
      <spotLight 
        position={[0, 10, 0]} 
        angle={0.3} 
        penumbra={1} 
        intensity={1} 
        color="#FFD700" 
      />
      
      {/* Floating geometric shapes */}
      <FloatingShape 
        position={[-3, 1, -2]} 
        rotation={[0.5, 0.5, 0]} 
        scale={0.8}
        color={goldColor}
        speed={1}
        distortion={0.3}
      />
      <FloatingShape 
        position={[3, -1, -1]} 
        rotation={[0.3, 0.7, 0.2]} 
        scale={0.6}
        color={darkGold}
        speed={1.2}
        distortion={0.4}
      />
      <FloatingShape 
        position={[-2, -2, 1]} 
        rotation={[0.7, 0.3, 0.5]} 
        scale={0.5}
        color={goldColor}
        speed={0.8}
        distortion={0.2}
      />
      <FloatingShape 
        position={[2, 2, 0]} 
        rotation={[0.4, 0.6, 0.3]} 
        scale={0.7}
        color={darkGold}
        speed={1.1}
        distortion={0.35}
      />
      <FloatingShape 
        position={[0, 0, -3]} 
        rotation={[0.6, 0.4, 0.2]} 
        scale={1}
color="#FFD700"
        speed={0.9}
        distortion={0.25}
      />
      
      {/* Gold particles */}
      <GoldParticles />
    </>
  )
}

// Main Hero3D component
function Hero3D() {
  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%',
      zIndex: 0 
    }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}

export default Hero3D

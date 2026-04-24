'use client'

import { useEffect, useRef } from 'react'

export default function ThreeBackground() {
  const canvasRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const animationIdRef = useRef(null)
  const shapesRef = useRef([])
  const particlesMeshRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !canvasRef.current) return

    // Dynamically import Three.js
    import('three').then((THREE) => {
      // Initialize scene
      const scene = new THREE.Scene()
      sceneRef.current = scene

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      camera.position.z = 15
      cameraRef.current = camera

      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance'
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      rendererRef.current = renderer

      // Create particles
      const particlesGeometry = new THREE.BufferGeometry()
      const particlesCount = window.innerWidth > 768 ? 250 : 200
      const posArray = new Float32Array(particlesCount * 3)

      for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 40
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.12,
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      })

      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
      particlesMeshRef.current = particlesMesh
      scene.add(particlesMesh)

      // Create shapes
      const geometries = [
        new THREE.TetrahedronGeometry(0.9),
        new THREE.OctahedronGeometry(0.9),
        new THREE.IcosahedronGeometry(0.9),
      ]

      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light'
      const shapeColor = currentTheme === 'dark' ? 0xfbbf24 : 0x6366f1

      const shapes = []
      for (let i = 0; i < 8; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)]
        const material = new THREE.MeshBasicMaterial({
          color: shapeColor,
          wireframe: true,
          transparent: true,
          opacity: 0.3,
        })
        
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 20
        )
        shapes.push({
          mesh,
          rotationSpeed: {
            x: (Math.random() - 0.5) * 0.008,
            y: (Math.random() - 0.5) * 0.008,
          }
        })
        scene.add(mesh)
      }
      shapesRef.current = shapes

      // Mouse interaction
      let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0

      const handleMouseMove = (e) => {
        targetX = (e.clientX / window.innerWidth) * 2 - 1
        targetY = -(e.clientY / window.innerHeight) * 2 + 1
      }

      document.addEventListener('mousemove', handleMouseMove, { passive: true })

      // Animation loop
      const clock = new THREE.Clock()
      let lastTime = 0
      const frameDelay = 1000 / 45
      let animationPaused = false

      // Scroll optimization
      let scrollTimeout
      let lastScrollTop = 0
      let scrollVelocity = 0

      const handleScroll = () => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop
        scrollVelocity = Math.abs(currentScrollTop - lastScrollTop)
        lastScrollTop = currentScrollTop

        if (scrollVelocity > 50) {
          animationPaused = true
        }

        clearTimeout(scrollTimeout)
        scrollTimeout = setTimeout(() => {
          animationPaused = false
        }, 100)
      }

      window.addEventListener('scroll', handleScroll, { passive: true })

      function animate(currentTime) {
        animationIdRef.current = requestAnimationFrame(animate)

        if (currentTime - lastTime < frameDelay) return
        lastTime = currentTime

        if (animationPaused) return

        const elapsedTime = clock.getElapsedTime()

        mouseX += (targetX - mouseX) * 0.03
        mouseY += (targetY - mouseY) * 0.03

        if (particlesMeshRef.current) {
          particlesMeshRef.current.rotation.y = elapsedTime * 0.04
          particlesMeshRef.current.rotation.x = Math.sin(elapsedTime * 0.06) * 0.15
        }

        shapes.forEach((shape) => {
          shape.mesh.rotation.x += shape.rotationSpeed.x
          shape.mesh.rotation.y += shape.rotationSpeed.y
        })

        camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.03
        camera.position.y += (mouseY * 1.2 - camera.position.y) * 0.03
        camera.lookAt(scene.position)

        renderer.render(scene, camera)
      }

      animate(0)

      // Resize handler
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }

      window.addEventListener('resize', handleResize, { passive: true })

      // Cleanup
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleScroll)
        
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current)
        }
        
        // Dispose Three.js objects
        if (particlesGeometry) particlesGeometry.dispose()
        if (particlesMaterial) particlesMaterial.dispose()
        shapes.forEach(shape => {
          if (shape.mesh.geometry) shape.mesh.geometry.dispose()
          if (shape.mesh.material) shape.mesh.material.dispose()
        })
        if (renderer) renderer.dispose()
      }
    })
  }, [])

  return <canvas ref={canvasRef} id="bg-canvas" style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none',
    opacity: typeof window !== 'undefined' && window.innerWidth > 768 ? 0.9 : 1
  }} />
}

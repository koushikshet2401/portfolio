'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export default function HeroScene3D() {
  const canvasRef = useRef(null)
  const hudTickRef = useRef(null)
  const statusRef = useRef(null)

  // Control state for UI rendering
  const [direction, setDirection] = useState('CW') // 'CW' (Clockwise) or 'CCW' (Counter-Clockwise)
  const [isPaused, setIsPaused] = useState(false)

  // Mutable refs for high-frequency animation loop access
  const directionRef = useRef(1) // 1 = CW (decreasing y), -1 = CCW (increasing y)
  const isPausedRef = useRef(false)
  const isDraggingRef = useRef(false)
  const dragVelocityRef = useRef(0)
  const lastPointerRef = useRef({ x: 0, y: 0 })
  const groupRef = useRef(null)

  // Toggle rotation direction
  const handleToggleDirection = useCallback(() => {
    setDirection((prev) => {
      const next = prev === 'CW' ? 'CCW' : 'CW'
      directionRef.current = next === 'CW' ? 1 : -1
      return next
    })
  }, [])

  // Toggle pause / resume
  const handleTogglePause = useCallback(() => {
    setIsPaused((prev) => {
      const next = !prev
      isPausedRef.current = next
      if (statusRef.current) {
        statusRef.current.textContent = next ? 'STATUS: PAUSED' : 'STATUS: NOMINAL'
      }
      return next
    })
  }, [])

  useEffect(() => {
    // 3D Model is disabled on mobile/tablet viewports (< 1024px)
    if (typeof window === 'undefined' || window.innerWidth < 1024) return

    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    let cleanupFn = null

    import('three').then((THREE) => {
      if (cancelled || !canvasRef.current) return

      const rect = canvas.getBoundingClientRect()
      const width = Math.max(rect.width, 280)
      const height = Math.max(rect.height || 360, 260)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
      camera.position.set(22, 16, 26)
      camera.lookAt(0, 0, 0)

      let renderer
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: 'default',
          failIfMajorPerformanceCaveat: false,
        })
      } catch (e) {
        return
      }

      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))

      const onContextLost = (e) => {
        e.preventDefault()
      }
      canvas.addEventListener('webglcontextlost', onContextLost, false)

      // ============================================================
      // LIGHTING SETUP (Solid Black Model with Red Rim/Front Light)
      // ============================================================
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
      scene.add(ambientLight)

      const keyLight = new THREE.DirectionalLight(0xf0f4f5, 2.2)
      keyLight.position.set(18, 26, 20)
      scene.add(keyLight)

      const fillLight = new THREE.DirectionalLight(0x556666, 0.6)
      fillLight.position.set(-20, 10, 15)
      scene.add(fillLight)

      // Primary crimson rim light shining red along top & edge of K
      const crimsonRim = new THREE.PointLight(0xff002b, 8.0, 50)
      crimsonRim.position.set(-14, 13, -7)
      scene.add(crimsonRim)

      // Front crimson point light casting red light onto black K
      const crimsonFront = new THREE.PointLight(0xff002b, 6.0, 45)
      crimsonFront.position.set(12, 6, 17)
      scene.add(crimsonFront)

      // Lower crimson accent light
      const crimsonBottom = new THREE.PointLight(0xcc001e, 3.5, 35)
      crimsonBottom.position.set(-8, -10, 10)
      scene.add(crimsonBottom)

      // Solid Black Material (Obsidian / Black Titanium)
      // The model itself is pure black; only the red light shines on it
      const mLetterK = new THREE.MeshStandardMaterial({
        color: 0x141615, // Solid black body
        emissive: 0x020202, // Pure black emissive
        roughness: 0.28, // Semi-gloss so red light reflects cleanly
        metalness: 0.62, // Metallic reflections catch the red light
      })
      const wMat = new THREE.MeshBasicMaterial({
        color: 0x444a46,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      })

      const group = new THREE.Group()
      groupRef.current = group

      // ============================================================
      // MATHEMATICAL 3D CAPITAL LETTER "K"
      // ============================================================
      const theta = (43 * Math.PI) / 180
      const tanT = Math.tan(theta)
      const sinT = Math.sin(theta)
      const T = 2.4
      const Wh = T / sinT // 3.519

      const H = 7.0
      const xStemL = -5.8
      const xStemR = -3.4
      const xArmL = 2.4
      const xArmR = xArmL + Wh // ~5.919
      const yJunc = H - tanT * (xArmL - xStemR) // ~1.591
      const xCrook = xArmR - H / tanT // ~ -1.588

      const kShape = new THREE.Shape()
      kShape.moveTo(xStemL, H)
      kShape.lineTo(xStemL, -H)
      kShape.lineTo(xStemR, -H)
      kShape.lineTo(xStemR, -yJunc)
      kShape.lineTo(xArmL, -H)
      kShape.lineTo(xArmR, -H)
      kShape.lineTo(xCrook, 0.0)
      kShape.lineTo(xArmR, H)
      kShape.lineTo(xArmL, H)
      kShape.lineTo(xStemR, yJunc)
      kShape.lineTo(xStemR, H)
      kShape.closePath()

      const extrudeSettings = {
        depth: 2.8,
        bevelEnabled: true,
        bevelThickness: 0.45,
        bevelSize: 0.35,
        bevelSegments: 4,
      }

      const kGeometry = new THREE.ExtrudeGeometry(kShape, extrudeSettings)
      kGeometry.center() // Center geometry at (0, 0, 0)
      kGeometry.computeVertexNormals()

      const kMesh = new THREE.Mesh(kGeometry, mLetterK)
      group.add(kMesh)

      // Wireframe bounding box cage (20 x 20 x 14)
      const cageGeometry = new THREE.BoxGeometry(20, 20, 14)
      const cage = new THREE.Mesh(cageGeometry, wMat)
      group.add(cage)

      scene.add(group)

      // Initial angle: slight perspective tilt
      group.rotation.x = 0.14
      group.rotation.y = -0.38

      // Immediate render frame 0
      renderer.render(scene, camera)

      // Theme Synchronization
      const updateThemeColors = (currentTheme) => {
        try {
          if (currentTheme === 'light') {
            crimsonRim.color.setHex(0x6b8e7b)
            crimsonFront.color.setHex(0x243b35)
            crimsonBottom.color.setHex(0x243b35)
            mLetterK.color.setHex(0x243b35)
            mLetterK.emissive.setHex(0x0a1210)
            mLetterK.roughness = 0.32
            mLetterK.metalness = 0.3
            wMat.color.setHex(0x6b8e7b)
            wMat.opacity = 0.5
            keyLight.color.setHex(0xf1e9d2)
            keyLight.intensity = 2.4
            fillLight.color.setHex(0xb7c9b1)
          } else {
            crimsonRim.color.setHex(0xff002b)
            crimsonFront.color.setHex(0xff002b)
            crimsonBottom.color.setHex(0xcc001e)
            mLetterK.color.setHex(0x141615) // Solid black
            mLetterK.emissive.setHex(0x020202)
            mLetterK.roughness = 0.28
            mLetterK.metalness = 0.62
            wMat.color.setHex(0x444a46)
            wMat.opacity = 0.4
            keyLight.color.setHex(0xf0f4f5)
            keyLight.intensity = 2.2
            fillLight.color.setHex(0x556666)
          }
          renderer.render(scene, camera)
        } catch (err) {
          console.warn('Three.js updateThemeColors warning:', err)
        }
      }

      window.updateThreeColors = updateThemeColors
      const initialTheme = document.documentElement.getAttribute('data-theme') || 'dark'
      updateThemeColors(initialTheme)

      const onThemeChange = (e) => {
        if (e.detail?.theme) updateThemeColors(e.detail.theme)
      }
      window.addEventListener('themechange', onThemeChange)

      // ============================================================
      // POINTER DRAGGING SYSTEM (Desktop)
      // ============================================================
      let hoverX = 0, hoverY = 0
      let targetTiltX = 0, targetTiltY = 0

      const onPointerDown = (e) => {
        if (e.button !== 0 && e.pointerType === 'mouse') return
        isDraggingRef.current = true
        dragVelocityRef.current = 0
        lastPointerRef.current = { x: e.clientX, y: e.clientY }

        try {
          canvas.setPointerCapture(e.pointerId)
        } catch (_) {}

        if (statusRef.current) {
          statusRef.current.textContent = 'STATUS: MANUAL_DRAG'
        }
      }

      const onPointerMove = (e) => {
        if (isDraggingRef.current) {
          const deltaX = e.clientX - lastPointerRef.current.x
          const deltaY = e.clientY - lastPointerRef.current.y
          lastPointerRef.current = { x: e.clientX, y: e.clientY }

          const rotDeltaY = deltaX * 0.008
          group.rotation.y += rotDeltaY
          dragVelocityRef.current = rotDeltaY

          const nextRotX = group.rotation.x + deltaY * 0.006
          group.rotation.x = Math.max(-0.55, Math.min(0.55, nextRotX))
        } else if (e.pointerType === 'mouse') {
          hoverX = (e.clientX / window.innerWidth - 0.5) * 2
          hoverY = (e.clientY / window.innerHeight - 0.5) * 2
        }
      }

      const onPointerUp = (e) => {
        if (!isDraggingRef.current) return
        isDraggingRef.current = false

        try {
          canvas.releasePointerCapture(e.pointerId)
        } catch (_) {}

        if (statusRef.current) {
          statusRef.current.textContent = isPausedRef.current ? 'STATUS: PAUSED' : 'STATUS: NOMINAL'
        }
      }

      canvas.addEventListener('pointerdown', onPointerDown)
      canvas.addEventListener('pointermove', onPointerMove)
      canvas.addEventListener('pointerup', onPointerUp)
      canvas.addEventListener('pointercancel', onPointerUp)

      // ============================================================
      // FRAME-RATE INDEPENDENT ANIMATION LOOP
      // ============================================================
      const clock = new THREE.Clock()
      let tick = 0
      let animationFrameId
      let isRunning = false
      let isVisible = true

      const startLoop = () => {
        if (!isRunning && isVisible && !document.hidden && !cancelled && window.innerWidth >= 1024) {
          isRunning = true
          clock.start()
          animate()
        }
      }

      const stopLoop = () => {
        isRunning = false
        cancelAnimationFrame(animationFrameId)
        clock.stop()
      }

      const animate = () => {
        if (!isRunning || cancelled) return
        animationFrameId = requestAnimationFrame(animate)
        tick++

        const delta = Math.min(clock.getDelta(), 0.1)

        if (isDraggingRef.current) {
          // Manual drag in progress
        } else {
          // Momentum decay
          if (Math.abs(dragVelocityRef.current) > 0.0002) {
            group.rotation.y += dragVelocityRef.current
            dragVelocityRef.current *= 0.92
          }

          // Frame-rate independent auto rotation:
          // Default: Clockwise (directionRef.current = 1)
          if (!isPausedRef.current) {
            const autoSpeed = 0.35 * delta // ~20° per second
            group.rotation.y -= autoSpeed * directionRef.current
          }

          // Hover parallax
          targetTiltX += (hoverX - targetTiltX) * 0.04
          targetTiltY += (hoverY - targetTiltY) * 0.04
          group.rotation.z = -targetTiltX * 0.1
        }

        // Pulse the crimson rim light
        crimsonRim.intensity = 7.5 + Math.sin(Date.now() * 0.002) * 1.5

        // Update HUD telemetry
        if (tick % 10 === 0 && hudTickRef.current) {
          const deg = ((((group.rotation.y * 180) / Math.PI) % 360) + 360) % 360
          const dirLabel = directionRef.current === 1 ? 'CW' : 'CCW'
          hudTickRef.current.textContent = `AXIS_ROT: +${deg.toFixed(2)}° // DIR: ${dirLabel}`
        }

        renderer.render(scene, camera)
      }

      const onVisibilityChange = () => {
        if (document.hidden) stopLoop()
        else startLoop()
      }
      document.addEventListener('visibilitychange', onVisibilityChange)

      let heroObserver
      if (typeof IntersectionObserver !== 'undefined') {
        heroObserver = new IntersectionObserver(
          ([entry]) => {
            isVisible = entry.isIntersecting
            if (isVisible) startLoop()
            else stopLoop()
          },
          { threshold: 0.0 }
        )
        heroObserver.observe(canvas)
      }

      if (statusRef.current) {
        statusRef.current.textContent = 'STATUS: NOMINAL'
      }
      startLoop()

      const onResize = () => {
        if (!canvasRef.current || !renderer) return
        if (window.innerWidth < 1024) {
          stopLoop()
          return
        }
        const r = canvas.getBoundingClientRect()
        const w = Math.max(r.width, 280)
        const h = Math.max(r.height || 360, 260)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
        renderer.render(scene, camera)
        if (isVisible && !document.hidden) startLoop()
      }
      window.addEventListener('resize', onResize, { passive: true })

      cleanupFn = () => {
        stopLoop()
        canvas.removeEventListener('webglcontextlost', onContextLost)
        canvas.removeEventListener('pointerdown', onPointerDown)
        canvas.removeEventListener('pointermove', onPointerMove)
        canvas.removeEventListener('pointerup', onPointerUp)
        canvas.removeEventListener('pointercancel', onPointerUp)
        window.removeEventListener('themechange', onThemeChange)
        window.removeEventListener('resize', onResize)
        document.removeEventListener('visibilitychange', onVisibilityChange)
        if (heroObserver) heroObserver.disconnect()
        delete window.updateThreeColors

        if (renderer) {
          try {
            renderer.dispose()
          } catch (_) {}
        }
        kGeometry.dispose()
        cageGeometry.dispose()
        mLetterK.dispose()
        wMat.dispose()
      }
    }).catch((err) => {
      console.warn('Three.js failed to load:', err)
    })

    return () => {
      cancelled = true
      if (cleanupFn) cleanupFn()
    }
  }, [])

  return (
    <div className="hero-3d-panel">
      <div className="hero-3d-hud">
        <span>SYS_COORD: 14.4426° N, 75.7179° E</span>
        <span className="coord-label">ENGINEERING_RACK_01</span>
      </div>

      <canvas
        id="threejs-canvas"
        ref={canvasRef}
        aria-label="Interactive 3D capital letter K model. Click and drag to rotate."
        role="img"
      ></canvas>

      <div className="hero-3d-footer">
        <div className="hero-3d-telemetry">
          <span id="hud-tick" ref={hudTickRef}>
            AXIS_ROT: +0.00° // DIR: CW
          </span>
          <span ref={statusRef} className="hero-3d-status">
            STATUS: NOMINAL
          </span>
        </div>

        <div className="hero-3d-controls" role="toolbar" aria-label="3D Model Controls">
          <button
            type="button"
            className="hero-3d-btn"
            onClick={handleToggleDirection}
            title={direction === 'CW' ? 'Switch rotation to Counter-Clockwise' : 'Switch rotation to Clockwise'}
            aria-label={`Toggle rotation direction. Currently ${direction === 'CW' ? 'Clockwise' : 'Counter-Clockwise'}`}
          >
            <span className="hero-3d-btn-icon" aria-hidden="true">
              {direction === 'CW' ? '⟳' : '⟲'}
            </span>
            <span>{direction}</span>
          </button>

          <button
            type="button"
            className="hero-3d-btn"
            onClick={handleTogglePause}
            title={isPaused ? 'Resume auto-rotation' : 'Pause auto-rotation'}
            aria-label={isPaused ? 'Resume auto-rotation' : 'Pause auto-rotation'}
          >
            <span className="hero-3d-btn-icon" aria-hidden="true">
              {isPaused ? '▶' : '⏸'}
            </span>
            <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

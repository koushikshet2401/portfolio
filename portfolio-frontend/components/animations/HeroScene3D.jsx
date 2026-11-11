'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function HeroScene3D() {
  const canvasRef = useRef(null)
  const hudTickRef = useRef(null)
  const [hudText, setHudText] = useState('AXIS_ROT: +0.00° // TICK: 0ms')

  useEffect(() => {
    // Skip 3D initialization on mobile/tablet screens (< 1024px) where panel is hidden
    if (typeof window === 'undefined' || window.innerWidth < 1024) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const width = Math.max(rect.width, 300)
    const height = Math.max(rect.height || 400, 300)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(22, 18, 28)
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.shadowMap.enabled = true

    const onContextLost = (e) => {
      e.preventDefault()
    }
    canvas.addEventListener('webglcontextlost', onContextLost, false)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xf0f4f5, 2.8)
    dirLight.position.set(20, 30, 20)
    scene.add(dirLight)

    const crimsonRim = new THREE.PointLight(0xcc001e, 4.5, 40)
    crimsonRim.position.set(-15, 10, -10)
    scene.add(crimsonRim)

    const rimLight2 = new THREE.PointLight(0xcc001e, 3.0, 30)
    rimLight2.position.set(10, -10, 15)
    scene.add(rimLight2)

    // Materials
    const mDark = new THREE.MeshLambertMaterial({ color: 0x1a1a1a, emissive: 0x050505 })
    const mLight = new THREE.MeshLambertMaterial({ color: 0xf0f4f5, emissive: 0x222628 })
    const mCrimson = new THREE.MeshPhongMaterial({ color: 0xcc001e, emissive: 0x440008, shininess: 90 })
    const mCharc = new THREE.MeshLambertMaterial({ color: 0x2a2a2a })
    const wMat = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: true, transparent: true, opacity: 0.2 })

    const group = new THREE.Group()

    // K-stem
    const kStem = new THREE.Mesh(new THREE.BoxGeometry(2.4, 16, 2.4), mDark)
    kStem.position.set(-5, 0, 0)
    group.add(kStem)

    // K-arms
    const a1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 10, 2.2), mCrimson)
    a1.rotation.z = -Math.PI / 4
    a1.position.set(-1.2, 4.2, 0.8)
    group.add(a1)

    const a2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 10, 2.2), mLight)
    a2.rotation.z = Math.PI / 4
    a2.position.set(-1.2, -4.2, -0.6)
    group.add(a2)

    // Plates (S layers)
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(8, 0.6, 6), mCharc)
    p1.position.set(4, 5.5, 0)
    group.add(p1)

    const p2 = new THREE.Mesh(new THREE.BoxGeometry(7, 0.6, 5), mCrimson)
    p2.position.set(2.5, 0, 1.2)
    group.add(p2)

    const p3 = new THREE.Mesh(new THREE.BoxGeometry(8, 0.6, 6), mDark)
    p3.position.set(4, -5.5, 0)
    group.add(p3)

    // Cubes
    const c1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), mCrimson)
    c1.position.set(6.5, 2.5, -2)
    group.add(c1)

    const c2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), mLight)
    c2.position.set(5.5, -2.5, 3)
    group.add(c2)

    const c3 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), mCrimson)
    c3.position.set(-7, 6, 2)
    group.add(c3)

    // Wireframe cage
    const cage = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 14), wMat)
    group.add(cage)

    scene.add(group)

    const updateThemeColors = (currentTheme) => {
      try {
        if (currentTheme === 'light') {
          crimsonRim.color.setHex(0x6b8e7b)
          rimLight2.color.setHex(0x243b35)
          mDark.color.setHex(0x243b35)
          mDark.emissive.setHex(0x0a1210)
          mLight.color.setHex(0xf1e9d2)
          mLight.emissive.setHex(0x4a4435)
          mCrimson.color.setHex(0x243b35)
          mCrimson.emissive.setHex(0x13211e)
          mCharc.color.setHex(0x6b8e7b)
          wMat.color.setHex(0x6b8e7b)
          wMat.opacity = 0.35
          dirLight.color.setHex(0xf1e9d2)
          dirLight.intensity = 2.2
        } else {
          crimsonRim.color.setHex(0xcc001e)
          rimLight2.color.setHex(0xcc001e)
          mDark.color.setHex(0x1a1a1a)
          mDark.emissive.setHex(0x050505)
          mLight.color.setHex(0xf0f4f5)
          mLight.emissive.setHex(0x222628)
          mCrimson.color.setHex(0xcc001e)
          mCrimson.emissive.setHex(0x440008)
          mCharc.color.setHex(0x2a2a2a)
          wMat.color.setHex(0x333333)
          wMat.opacity = 0.2
          dirLight.color.setHex(0xf0f4f5)
          dirLight.intensity = 2.8
        }
      } catch (err) {
        console.warn('Three.js updateThemeColors warning:', err)
      }
    }

    // Register globally for compatibility
    window.updateThreeColors = updateThemeColors
    const initialTheme = document.documentElement.getAttribute('data-theme') || 'dark'
    updateThemeColors(initialTheme)

    const onThemeChange = (e) => {
      if (e.detail?.theme) updateThemeColors(e.detail.theme)
    }
    window.addEventListener('themechange', onThemeChange)

    let mX = 0, mY = 0, tX = 0, tY = 0
    const onMouseMove = (e) => {
      mX = (e.clientX / window.innerWidth - 0.5) * 2
      mY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    let tick = 0
    let animationFrameId
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      tick++
      tX += (mX - tX) * 0.04
      tY += (mY - tY) * 0.04

      group.rotation.y += 0.004
      group.rotation.x = tY * 0.35 + 0.1
      group.rotation.z = -tX * 0.2
      crimsonRim.intensity = 4.0 + Math.sin(Date.now() * 0.002) * 1.0

      if (tick % 30 === 0) {
        const text = `AXIS_ROT: +${(group.rotation.y * 57.3).toFixed(2)}° // TICK: ${tick * 16}ms`
        if (hudTickRef.current) {
          hudTickRef.current.textContent = text
        }
      }

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      if (!canvas) return
      const r = canvas.getBoundingClientRect()
      const w = Math.max(r.width, 300)
      const h = Math.max(r.height || 400, 300)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      canvas.removeEventListener('webglcontextlost', onContextLost)
      window.removeEventListener('themechange', onThemeChange)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animationFrameId)

      // Safe dispose
      if (renderer) {
        try {
          renderer.dispose()
        } catch (e) {}
      }
      kStem.geometry.dispose()
      a1.geometry.dispose()
      a2.geometry.dispose()
      p1.geometry.dispose()
      p2.geometry.dispose()
      p3.geometry.dispose()
      c1.geometry.dispose()
      c2.geometry.dispose()
      c3.geometry.dispose()
      cage.geometry.dispose()

      mDark.dispose()
      mLight.dispose()
      mCrimson.dispose()
      mCharc.dispose()
      wMat.dispose()
    }
  }, [])

  return (
    <div className="hero-3d-panel">
      <div className="hero-3d-hud">
        <span>SYS_COORD: 14.4426° N, 75.7179° E</span>
        <span className="coord-label">ENGINEERING_RACK_01</span>
      </div>
      <canvas id="threejs-canvas" ref={canvasRef}></canvas>
      <div className="hero-3d-footer">
        <span id="hud-tick" ref={hudTickRef}>
          {hudText}
        </span>
        <span style={{ color: 'var(--on-surface)', fontWeight: 600 }}>STATUS: NOMINAL</span>
      </div>
    </div>
  )
}

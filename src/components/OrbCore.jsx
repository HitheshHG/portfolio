import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'

export default function OrbCore({
  color = '#c8f135',
  radius = 1.2,
  baseDistort = 0.22,
  speed = 1,
  morphStrength = 0.12,
}) {
  const mesh = useRef(null)
  const mat = useRef(null)

  useFrame(({ clock }) => {
    if (!mesh.current || !mat.current) return
    const t = clock.elapsedTime

    mesh.current.rotation.y = t * 0.08
    mesh.current.rotation.x = Math.sin(t * 0.2) * 0.1

    mesh.current.scale.set(
      1 + Math.sin(t * 0.9) * morphStrength,
      1 + Math.cos(t * 1.2) * morphStrength,
      1 + Math.sin(t * 1.1 + 2) * morphStrength,
    )

    mat.current.distort = baseDistort + Math.sin(t * 0.7) * morphStrength
    mat.current.speed = speed
    mat.current.emissiveIntensity = 0.3 + Math.sin(t * 1.5) * 0.15
  })

  return (
    <Sphere args={[radius, 128, 256]} ref={mesh}>
      <MeshDistortMaterial
        ref={mat}
        color={color}
        roughness={0.2}
        metalness={0.6}
        emissive={color}
      />
    </Sphere>
  )
}

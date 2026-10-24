import type { Texture, WebGLRenderer } from 'three'
import {
  AdditiveBlending,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  DirectionalLight,
  MathUtils,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Raycaster,
  Scene,
  SpotLight,
  Vector2,
} from 'three'

import type { CoreBit } from './bit'
import { createCoreBit } from './bit'
import { createRenderer, disposeObject, pixelRatioFor, radialTexture } from './common'
import { Spring } from './spring'

interface HeroFrame {
  progress: number
  pointer: { x: number; y: number } | null
  calm: boolean
  boost: boolean
}

const FOV = 30
const CAMERA_Z = 13
const IDLE_RPM = 90
const BOOST_RPM = 1250
const DUST = 420

class HeroScene {
  private readonly renderer: WebGLRenderer
  private readonly environment: Texture
  private readonly scene = new Scene()
  private readonly camera = new PerspectiveCamera(FOV, 1, 0.1, 80)
  private readonly bit: CoreBit = createCoreBit()
  private readonly dust: Points<BufferGeometry, PointsMaterial>
  private readonly velocities = new Float32Array(DUST * 3)
  private readonly positions = new Float32Array(DUST * 3)
  private readonly attribute = new BufferAttribute(this.positions, 3)
  private readonly raycaster = new Raycaster()
  private readonly rpm = new Spring(IDLE_RPM)
  private readonly tiltX = new Spring(0)
  private readonly tiltY = new Spring(0)
  private readonly travel = new Spring(0)
  private readonly stage = { x: 0, y: 0, scale: 1 }
  private angle = 0
  private time = 0

  constructor(canvas: HTMLCanvasElement) {
    const { renderer, environment } = createRenderer(canvas)
    this.renderer = renderer
    this.environment = environment
    this.scene.environment = environment
    this.scene.environmentIntensity = 0.85

    const key = new DirectionalLight('#ffffff', 2.2)
    key.position.set(-5, 6, 7)
    const rim = new SpotLight('#fe0018', 140, 30, 0.6, 0.7)
    rim.position.set(5, -2, -6)
    const under = new SpotLight('#ff3b2f', 60, 20, 0.7, 0.9)
    under.position.set(-2, -7, 3)
    this.scene.add(new AmbientLight('#2a0a0c', 1.2), key, rim, under)

    this.dust = this.createDust()
    this.bit.root.add(this.dust)
    this.bit.root.rotation.set(0.42, 0, 0.5)
    this.scene.add(this.bit.root)
    this.camera.position.set(0, 0, CAMERA_Z)
  }

  get currentRpm(): number {
    return this.rpm.value
  }

  resize(width: number, height: number, dpr: number): void {
    this.renderer.setPixelRatio(pixelRatioFor(width, dpr))
    this.renderer.setSize(width, height, false)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    const visibleHeight = 2 * Math.tan(MathUtils.degToRad(FOV / 2)) * CAMERA_Z
    const visibleWidth = visibleHeight * this.camera.aspect
    const wide = width >= 1024
    this.stage.scale = wide ? Math.min(1.1, visibleHeight / 7.6) : Math.min(0.58, visibleWidth / 7)
    this.stage.x = wide ? visibleWidth * 0.25 : visibleWidth * 0.18
    this.stage.y = wide ? -0.35 : visibleHeight * 0.2
  }

  hits(x: number, y: number): boolean {
    this.raycaster.setFromCamera(new Vector2(x, y), this.camera)
    return this.raycaster.intersectObject(this.bit.hitbox, false).length > 0
  }

  frame(delta: number, input: HeroFrame): void {
    const dt = Math.min(delta, 1 / 30)
    this.time += dt
    const { calm } = input

    const rpm = this.rpm.step(
      input.boost && !calm ? BOOST_RPM : IDLE_RPM,
      dt,
      input.boost ? 2.2 : 1.4,
    )
    this.angle += ((rpm / 60) * Math.PI * 2 * dt) / (calm ? 6 : 3)
    this.bit.spinner.rotation.y = this.angle

    const travel = this.travel.step(input.progress, dt, calm ? 30 : 6)
    const pointer = input.pointer && !calm ? input.pointer : { x: 0, y: 0 }
    const { root, core } = this.bit
    root.scale.setScalar(this.stage.scale * (1 - travel * 0.15))
    root.position.set(
      this.stage.x * (1 - travel * 0.6),
      this.stage.y + (calm ? 0 : Math.sin(this.time * 0.8) * 0.08) - travel * 5,
      0,
    )
    root.rotation.x = MathUtils.lerp(0.42, 0.08, travel) + this.tiltX.step(-pointer.y * 0.22, dt, 3)
    root.rotation.z = MathUtils.lerp(0.5, 0, travel) + this.tiltY.step(pointer.x * 0.16, dt, 3)
    core.position.y = -0.85 - travel * 0.6

    this.animateDust(dt, (rpm - IDLE_RPM) / (BOOST_RPM - IDLE_RPM))
    this.renderer.render(this.scene, this.camera)
  }

  dispose(): void {
    this.scene.traverse(disposeObject)
    this.environment.dispose()
    this.renderer.dispose()
  }

  private createDust(): Points<BufferGeometry, PointsMaterial> {
    for (let index = 0; index < DUST; index += 1) this.respawn(this.positions, index)
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', this.attribute)
    const material = new PointsMaterial({
      size: 0.075,
      map: radialTexture('rgba(255,210,190,1)', 'rgba(255,40,30,0)', 64),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    return new Points(geometry, material)
  }

  private respawn(positions: Float32Array, index: number): void {
    const angle = Math.random() * Math.PI * 2
    const radius = 0.95 + Math.random() * 0.1
    positions[index * 3] = Math.cos(angle) * radius
    positions[index * 3 + 1] = -0.5 + Math.random() * 0.15
    positions[index * 3 + 2] = Math.sin(angle) * radius
    const speed = 0.6 + Math.random() * 1.8
    this.velocities[index * 3] = Math.cos(angle + 1.2) * speed
    this.velocities[index * 3 + 1] = -Math.random() * 0.6
    this.velocities[index * 3 + 2] = Math.sin(angle + 1.2) * speed
  }

  private animateDust(dt: number, energy: number): void {
    const { material } = this.dust
    const { positions, attribute } = this
    material.opacity = MathUtils.damp(material.opacity, energy, 4, dt)
    if (material.opacity < 0.01) return
    for (let index = 0; index < DUST; index += 1) {
      const i = index * 3
      positions[i] = (positions[i] ?? 0) + (this.velocities[i] ?? 0) * dt
      positions[i + 1] = (positions[i + 1] ?? 0) + (this.velocities[i + 1] ?? 0) * dt
      positions[i + 2] = (positions[i + 2] ?? 0) + (this.velocities[i + 2] ?? 0) * dt
      this.velocities[i + 1] = (this.velocities[i + 1] ?? 0) - 2.2 * dt
      const x = positions[i] ?? 0
      const z = positions[i + 2] ?? 0
      if (x * x + z * z > 9 || (positions[i + 1] ?? 0) < -2.4) this.respawn(positions, index)
    }
    attribute.needsUpdate = true
  }
}

export type { HeroFrame }
export { HeroScene }

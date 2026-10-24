import type { Texture, WebGLRenderer } from 'three'
import {
  CanvasTexture,
  Color,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  SRGBColorSpace,
  Scene,
  TextureLoader,
  Vector2,
} from 'three'

import { createRenderer, disposeObject, pixelRatioFor } from './common'
import { Spring } from './spring'

interface HelixFrame {
  progress: number
  pointer: { x: number; y: number } | null
  calm: boolean
}

interface Card {
  mesh: Mesh<PlaneGeometry, MeshBasicMaterial>
  angle: number
  y: number
  hover: Spring
}

const RADIUS = 2.7
const STEP = 0.42
const RISE = 0.3
const CAMERA_Z = 12.5
const DIM = new Color('#6b6b70')
const LIT = new Color('#ffffff')

function roundedMask(): CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context is unavailable')
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.roundRect(4, 4, size - 8, size - 8, 26)
  ctx.fill()
  return new CanvasTexture(canvas)
}

class HelixScene {
  private readonly renderer: WebGLRenderer
  private readonly environment: Texture
  private readonly scene = new Scene()
  private readonly camera = new PerspectiveCamera(34, 1, 0.1, 80)
  private readonly helix = new Group()
  private readonly cards: Card[] = []
  private readonly raycaster = new Raycaster()
  private readonly spin = new Spring(0)
  private readonly tilt = new Spring(0)
  private readonly mask = roundedMask()
  private hovered = -1
  private time = 0

  constructor(canvas: HTMLCanvasElement, sources: string[]) {
    const { renderer, environment } = createRenderer(canvas)
    this.renderer = renderer
    this.environment = environment
    const loader = new TextureLoader()
    const geometry = new PlaneGeometry(1.25, 1.25)

    for (const [index, source] of sources.entries()) {
      const map = loader.load(source)
      map.colorSpace = SRGBColorSpace
      map.anisotropy = 4
      const material = new MeshBasicMaterial({
        map,
        alphaMap: this.mask,
        transparent: true,
        side: 2,
        color: DIM.clone(),
        toneMapped: false,
      })
      const mesh = new Mesh(geometry, material)
      const angle = index * STEP
      const y = (8 - index) * RISE
      this.helix.add(mesh)
      this.cards.push({ mesh, angle, y, hover: new Spring(0) })
    }

    this.helix.rotation.z = -0.12
    this.scene.add(this.helix)
    this.camera.position.set(0, 0, CAMERA_Z)
  }

  resize(width: number, height: number, dpr: number): void {
    this.renderer.setPixelRatio(pixelRatioFor(width, dpr))
    this.renderer.setSize(width, height, false)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    let scale = 1
    if (width < 768) scale = 0.62
    else if (width < 1200) scale = 0.82
    this.helix.scale.setScalar(scale)
    this.helix.position.x = width >= 1024 ? 2.5 : 0
  }

  pick(x: number, y: number): number {
    this.raycaster.setFromCamera(new Vector2(x, y), this.camera)
    const meshes = this.cards.map((card) => card.mesh)
    const [hit] = this.raycaster.intersectObjects(meshes, false)
    this.hovered = hit ? this.cards.findIndex((card) => card.mesh.id === hit.object.id) : -1
    return this.hovered
  }

  frame(delta: number, input: HelixFrame): void {
    const dt = Math.min(delta, 1 / 30)
    this.time += input.calm ? 0 : dt
    const spin = this.spin.step(input.progress * Math.PI * 4 + this.time * 0.08, dt, 4)
    const lift = input.progress * (this.cards.length - 16) * RISE
    const pointer = input.pointer && !input.calm ? input.pointer : { x: 0, y: 0 }
    this.helix.rotation.x = this.tilt.step(-pointer.y * 0.12, dt, 3)

    for (const [index, card] of this.cards.entries()) {
      const angle = card.angle + spin
      const focus = card.hover.step(index === this.hovered ? 1 : 0, dt, 9)
      const radius = RADIUS + focus * 0.6
      card.mesh.position.set(Math.sin(angle) * radius, card.y + lift, Math.cos(angle) * radius)
      card.mesh.rotation.y = angle
      card.mesh.scale.setScalar(1 + focus * 0.28)
      const facing = (Math.cos(angle) + 1) / 2
      card.mesh.material.color.copy(DIM).lerp(LIT, MathUtils.clamp(facing * 0.85 + focus, 0, 1))
      card.mesh.material.opacity = MathUtils.clamp(0.25 + facing, 0, 1)
    }

    this.renderer.render(this.scene, this.camera)
  }

  dispose(): void {
    this.scene.traverse(disposeObject)
    this.mask.dispose()
    this.environment.dispose()
    this.renderer.dispose()
  }
}

export type { HelixFrame }
export { HelixScene }

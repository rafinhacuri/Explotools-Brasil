import type { Material, Texture, WebGLRenderer } from 'three'
import {
  AmbientLight,
  BoxGeometry,
  CatmullRomCurve3,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  LatheGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SpotLight,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
} from 'three'

import { createCrown } from './bit'
import { createRenderer, disposeObject, paint, pixelRatioFor, steel } from './common'
import { Spring } from './spring'

interface Part {
  group: Group
  hitbox: Mesh
  height: number
  glow: MeshPhysicalMaterial[]
  focus: Spring
}

interface AssemblyFrame {
  explode: number
  active: number
  pointer: { x: number; y: number } | null
  calm: boolean
}

const FOV = 28
const CAMERA_Z = 17
const GAP = 0.55
const GLOW = new Color('#fe0018')

function lathe(points: [number, number][], material: Material, segments = 72): Mesh {
  return new Mesh(
    new LatheGeometry(
      points.map(([r, y]) => new Vector2(r, y)),
      segments,
    ),
    material,
  )
}

function hitbox(radius: number, height: number): Mesh {
  const mesh = new Mesh(
    new CylinderGeometry(radius, radius, height, 10),
    new MeshBasicMaterial({ visible: false }),
  )
  return mesh
}

function spearhead(metal: MeshPhysicalMaterial): Group {
  const group = new Group()
  group.add(
    lathe(
      [
        [0, 0.78],
        [0.08, 0.66],
        [0.3, 0.28],
        [0.3, 0.22],
        [0.15, 0.16],
        [0.15, -0.22],
        [0.3, -0.26],
        [0.3, -0.4],
        [0, -0.4],
      ],
      metal,
    ),
  )
  return group
}

function head(
  metal: MeshPhysicalMaterial,
  dark: MeshPhysicalMaterial,
  accent: MeshPhysicalMaterial,
): Group {
  const group = new Group()
  group.add(
    lathe(
      [
        [0, 0.62],
        [0.3, 0.62],
        [0.34, 0.56],
        [0.34, 0.1],
        [0.44, 0.06],
        [0.44, -0.5],
        [0.38, -0.56],
        [0.38, -0.66],
        [0, -0.66],
      ],
      metal,
    ),
  )
  for (const side of [-1, 1]) {
    const latch = new Mesh(new BoxGeometry(0.16, 0.42, 0.18), dark)
    latch.position.set(side * 0.43, 0.32, 0)
    latch.rotation.z = side * -0.18
    group.add(latch)
  }
  const band = new Mesh(new CylinderGeometry(0.447, 0.447, 0.1, 64, 1, true), accent)
  band.position.y = -0.2
  group.add(band)
  return group
}

function spring(material: MeshPhysicalMaterial): Group {
  const points: Vector3[] = []
  const turns = 9
  for (let index = 0; index <= turns * 24; index += 1) {
    const t = index / (turns * 24)
    const angle = t * turns * Math.PI * 2
    points.push(new Vector3(Math.cos(angle) * 0.28, 0.55 - t * 1.1, Math.sin(angle) * 0.28))
  }
  const curve = new CatmullRomCurve3(points)
  const group = new Group()
  group.add(new Mesh(new TubeGeometry(curve, 360, 0.05, 12, false), material))
  return group
}

function springCase(metal: MeshPhysicalMaterial, dark: MeshPhysicalMaterial): Group {
  const group = new Group()
  group.add(
    lathe(
      [
        [0.3, 0.42],
        [0.42, 0.42],
        [0.42, -0.42],
        [0.3, -0.42],
        [0.3, 0.42],
      ],
      metal,
    ),
  )
  for (let index = 0; index < 6; index += 1) {
    const angle = (index / 6) * Math.PI * 2
    const slot = new Mesh(new BoxGeometry(0.05, 0.36, 0.12), dark)
    slot.position.set(Math.cos(angle) * 0.42, 0, Math.sin(angle) * 0.42)
    slot.rotation.y = -angle
    group.add(slot)
  }
  return group
}

function innerTube(metal: MeshPhysicalMaterial): Group {
  const group = new Group()
  group.add(
    lathe(
      [
        [0.34, 1.2],
        [0.4, 1.2],
        [0.4, -1.2],
        [0.34, -1.2],
        [0.34, 1.2],
      ],
      metal,
      96,
    ),
  )
  return group
}

function lifter(brass: MeshPhysicalMaterial): Group {
  const group = new Group()
  group.add(
    lathe(
      [
        [0.3, 0.3],
        [0.4, 0.3],
        [0.44, -0.3],
        [0.32, -0.3],
        [0.3, 0.3],
      ],
      brass,
    ),
  )
  const ring = new Mesh(new TorusGeometry(0.33, 0.035, 12, 48), brass)
  ring.rotation.x = Math.PI / 2
  ring.position.y = -0.42
  group.add(ring)
  return group
}

function metalMaterial(): MeshPhysicalMaterial {
  return steel('#c9ccd1', 0.3)
}

function darkMaterial(): MeshPhysicalMaterial {
  return new MeshPhysicalMaterial({ color: '#1b1b1e', metalness: 0.8, roughness: 0.4 })
}

function crownPart(): Group {
  const group = new Group()
  const { crown } = createCrown()
  crown.scale.setScalar(0.5)
  crown.position.y = 0.32
  group.add(crown)
  const shank = lathe(
    [
      [0.39, 0.6],
      [0.5, 0.6],
      [0.5, 0.32],
      [0.39, 0.32],
      [0.39, 0.6],
    ],
    steel('#c4c7cc', 0.3),
  )
  group.add(shank)
  return group
}

class AssemblyScene {
  private readonly renderer: WebGLRenderer
  private readonly environment: Texture
  private readonly scene = new Scene()
  private readonly camera = new PerspectiveCamera(FOV, 1, 0.1, 80)
  private readonly root = new Group()
  private readonly parts: Part[] = []
  private readonly raycaster = new Raycaster()
  private readonly explode = new Spring(0)
  private readonly yaw = new Spring(0)
  private readonly pitch = new Spring(0)
  private readonly stage = { x: 0, scale: 1 }
  private hovered = -1
  private time = 0

  constructor(canvas: HTMLCanvasElement) {
    const { renderer, environment } = createRenderer(canvas)
    this.renderer = renderer
    this.environment = environment
    this.scene.environment = environment
    this.scene.environmentIntensity = 0.9

    const key = new DirectionalLight('#ffffff', 2)
    key.position.set(-4, 5, 6)
    const rim = new SpotLight('#fe0018', 160, 40, 0.7, 0.8)
    rim.position.set(6, 2, -6)
    this.scene.add(new AmbientLight('#1c0b0d', 1.4), key, rim)

    const brass = new MeshPhysicalMaterial({ color: '#c9a04a', metalness: 1, roughness: 0.3 })
    const builders: [Group, number][] = [
      [spearhead(metalMaterial()), 1.2],
      [head(metalMaterial(), darkMaterial(), paint()), 1.3],
      [spring(paint()), 1.2],
      [springCase(metalMaterial(), darkMaterial()), 0.9],
      [innerTube(metalMaterial()), 2.4],
      [lifter(brass), 0.8],
      [crownPart(), 0.9],
    ]

    for (const [group, height] of builders) {
      const glow: MeshPhysicalMaterial[] = []
      group.traverse((object) => {
        if (
          object instanceof Mesh &&
          object.material instanceof MeshPhysicalMaterial &&
          !glow.includes(object.material)
        ) {
          glow.push(object.material)
        }
      })
      const box = hitbox(0.6, height)
      group.add(box)
      this.root.add(group)
      this.parts.push({ group, hitbox: box, height, glow, focus: new Spring(0) })
    }

    this.root.rotation.z = 0.1
    this.scene.add(this.root)
    this.camera.position.set(0, 0, CAMERA_Z)
  }

  get count(): number {
    return this.parts.length
  }

  resize(width: number, height: number, dpr: number): void {
    this.renderer.setPixelRatio(pixelRatioFor(width, dpr))
    this.renderer.setSize(width, height, false)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    const visibleHeight = 2 * Math.tan(MathUtils.degToRad(FOV / 2)) * CAMERA_Z
    const visibleWidth = visibleHeight * this.camera.aspect
    this.stage.scale = Math.min(1.1, (visibleHeight / 14.5) * Math.min(1, this.camera.aspect * 1.6))
    this.stage.x = width >= 1024 ? -visibleWidth * 0.12 : 0
  }

  pick(x: number, y: number): number {
    this.raycaster.setFromCamera(new Vector2(x, y), this.camera)
    const boxes = this.parts.map((part) => part.hitbox)
    const [hit] = this.raycaster.intersectObjects(boxes, false)
    this.hovered = hit ? this.parts.findIndex((part) => part.hitbox.id === hit.object.id) : -1
    return this.hovered
  }

  anchor(index: number): { x: number; y: number } | null {
    const part = this.parts[index]
    if (!part) return null
    const point = new Vector3()
    part.group.getWorldPosition(point)
    point.project(this.camera)
    return { x: point.x, y: point.y }
  }

  frame(delta: number, input: AssemblyFrame): void {
    const dt = Math.min(delta, 1 / 30)
    this.time += input.calm ? dt * 0.2 : dt

    const explode = this.explode.step(input.explode, dt, input.calm ? 30 : 5)
    const gap = MathUtils.lerp(0.02, GAP, explode)
    const total =
      this.parts.reduce((sum, part) => sum + part.height, 0) + gap * (this.parts.length - 1)
    let cursor = total / 2
    const focusIndex = this.hovered >= 0 ? this.hovered : input.active

    for (const [index, part] of this.parts.entries()) {
      cursor -= part.height / 2
      const focus = part.focus.step(index === focusIndex ? 1 : 0, dt, 7)
      part.group.position.set(focus * 0.25 * explode, cursor, focus * 0.6 * explode)
      part.group.rotation.y = this.time * (0.25 + index * 0.02) + focus * 0.6
      for (const material of part.glow) {
        material.emissive.copy(GLOW)
        material.emissiveIntensity = focus * 0.22
      }
      cursor -= part.height / 2 + gap
    }

    const pointer = input.pointer && !input.calm ? input.pointer : { x: 0, y: 0 }
    this.root.scale.setScalar(this.stage.scale)
    this.root.position.x = this.stage.x
    this.root.rotation.y = this.yaw.step(pointer.x * 0.35, dt, 3)
    this.root.rotation.x = this.pitch.step(-pointer.y * 0.12, dt, 3)
    this.renderer.render(this.scene, this.camera)
  }

  dispose(): void {
    this.scene.traverse(disposeObject)
    this.environment.dispose()
    this.renderer.dispose()
  }
}

export type { AssemblyFrame }
export { AssemblyScene }

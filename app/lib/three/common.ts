import type { BufferGeometry, Material, Object3D } from 'three'
import {
  ACESFilmicToneMapping,
  CanvasTexture,
  Color,
  InstancedMesh,
  Mesh,
  MeshPhysicalMaterial,
  PMREMGenerator,
  Points,
  SRGBColorSpace,
  Texture,
  WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

const RED = new Color('#fe0018')

type Renderable =
  | Mesh<BufferGeometry, Material | Material[]>
  | Points<BufferGeometry, Material | Material[]>
  | InstancedMesh<BufferGeometry, Material | Material[]>

function isRenderable(object: Object3D): object is Renderable {
  return object instanceof Mesh || object instanceof Points || object instanceof InstancedMesh
}

function disposeObject(object: Object3D): void {
  if (!isRenderable(object)) return
  object.geometry.dispose()
  const materials = Array.isArray(object.material) ? object.material : [object.material]
  for (const material of materials) {
    for (const value of Object.values(material)) {
      if (value instanceof Texture) value.dispose()
    }
    material.dispose()
  }
}

function createRenderer(canvas: HTMLCanvasElement): {
  renderer: WebGLRenderer
  environment: Texture
} {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setClearColor(0x00_00_00, 0)
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const pmrem = new PMREMGenerator(renderer)
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()
  return { renderer, environment }
}

function pixelRatioFor(width: number, dpr: number): number {
  return Math.min(dpr, width < 768 ? 1.5 : 1.75)
}

function steel(color = '#b9bcc2', roughness = 0.32): MeshPhysicalMaterial {
  return new MeshPhysicalMaterial({
    color,
    metalness: 1,
    roughness,
    clearcoat: 0.25,
    clearcoatRoughness: 0.35,
  })
}

function paint(color: Color | string = RED): MeshPhysicalMaterial {
  return new MeshPhysicalMaterial({
    color,
    metalness: 0.2,
    roughness: 0.38,
    clearcoat: 0.8,
    clearcoatRoughness: 0.18,
  })
}

function radialTexture(inner: string, outer: string, size = 256): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context is unavailable')
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, inner)
  gradient.addColorStop(1, outer)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}

export { RED, createRenderer, disposeObject, paint, pixelRatioFor, radialTexture, steel }

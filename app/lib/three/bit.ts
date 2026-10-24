import {
  CanvasTexture,
  CylinderGeometry,
  DynamicDrawUsage,
  ExtrudeGeometry,
  Group,
  InstancedMesh,
  LatheGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  Object3D,
  OctahedronGeometry,
  RepeatWrapping,
  SRGBColorSpace,
  Shape,
  Vector2,
} from 'three'

import { paint, steel } from './common'

interface CoreBit {
  root: Group
  spinner: Group
  core: Mesh
  diamonds: InstancedMesh
  hitbox: Mesh
}

const OUTER = 1
const INNER = 0.78
const CROWN = 0.5
const SEGMENTS = 10
const GAP = 0.15

function bodyProfile(): Vector2[] {
  const thread: Vector2[] = []
  for (let y = 2.06; y < 2.78; y += 0.06) {
    thread.push(new Vector2(0.93, y), new Vector2(0.885, y + 0.03))
  }
  return [
    new Vector2(INNER, 0),
    new Vector2(OUTER, 0),
    new Vector2(OUTER, 1.92),
    new Vector2(0.97, 1.98),
    new Vector2(0.93, 2.02),
    ...thread,
    new Vector2(0.9, 2.84),
    new Vector2(INNER + 0.02, 2.86),
    new Vector2(INNER, 2.82),
    new Vector2(INNER, 0),
  ]
}

function bandTexture(): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 150
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context is unavailable')
  ctx.fillStyle = '#fe0018'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#0a0a0b'
  ctx.fillRect(0, 0, canvas.width, 10)
  ctx.fillRect(0, canvas.height - 10, canvas.width, 10)
  ctx.fillStyle = '#ffffff'
  ctx.textBaseline = 'middle'
  const label = 'EXPLOTOOLS'
  const tag = 'NQ · IMPREGNADA'
  for (const offset of [0, canvas.width / 2]) {
    ctx.font = 'italic 800 88px "Saira", "Arial Narrow", sans-serif'
    ctx.fillText(label, offset + 48, canvas.height / 2 + 4)
    ctx.font = '500 34px "JetBrains Mono", monospace'
    ctx.fillText(tag, offset + 640, canvas.height / 2 + 2)
  }
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.wrapS = RepeatWrapping
  texture.anisotropy = 8
  return texture
}

function graniteTexture(): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context is unavailable')
  ctx.fillStyle = '#6d6a66'
  ctx.fillRect(0, 0, 512, 512)
  const tones = ['#2a2826', '#8f8a84', '#b9b2aa', '#4a4542', '#9a6f63', '#d8d2ca']
  for (let i = 0; i < 5200; i += 1) {
    ctx.fillStyle = tones[i % tones.length] ?? '#777'
    const size = 1 + Math.random() * (i % 7 === 0 ? 7 : 3)
    ctx.globalAlpha = 0.35 + Math.random() * 0.6
    ctx.fillRect(Math.random() * 512, Math.random() * 512, size, size * (0.6 + Math.random()))
  }
  ctx.globalAlpha = 1
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.repeat.set(2, 1)
  return texture
}

function segmentShape(start: number, end: number): Shape {
  const shape = new Shape()
  shape.moveTo(Math.cos(start) * INNER, Math.sin(start) * INNER)
  shape.absarc(0, 0, OUTER + 0.025, start, end, false)
  shape.lineTo(Math.cos(end) * INNER, Math.sin(end) * INNER)
  shape.absarc(0, 0, INNER, end, start, true)
  return shape
}

function createCrown(): { crown: Group; diamonds: InstancedMesh } {
  const crown = new Group()
  const matrix = new MeshPhysicalMaterial({
    color: '#2b2c30',
    metalness: 0.75,
    roughness: 0.62,
    clearcoat: 0.1,
  })
  const step = (Math.PI * 2) / SEGMENTS
  for (let index = 0; index < SEGMENTS; index += 1) {
    const geometry = new ExtrudeGeometry(
      segmentShape(index * step + GAP / 2, (index + 1) * step - GAP / 2),
      {
        depth: CROWN,
        bevelEnabled: true,
        bevelThickness: 0.018,
        bevelSize: 0.012,
        bevelSegments: 2,
        curveSegments: 18,
      },
    )
    geometry.rotateX(Math.PI / 2)
    crown.add(new Mesh(geometry, matrix))
  }

  const count = 1600
  const diamonds = new InstancedMesh(
    new OctahedronGeometry(0.0105),
    new MeshPhysicalMaterial({
      color: '#ffffff',
      metalness: 1,
      roughness: 0.02,
      clearcoat: 1,
    }),
    count,
  )
  diamonds.instanceMatrix.setUsage(DynamicDrawUsage)
  const dummy = new Object3D()
  for (let index = 0; index < count; index += 1) {
    const segment = index % SEGMENTS
    const angle = segment * step + GAP / 2 + 0.02 + Math.random() * (step - GAP - 0.04)
    const onFace = index % 3 === 0
    const radius = onFace ? INNER + 0.03 + Math.random() * (OUTER - INNER - 0.04) : OUTER + 0.03
    const y = onFace ? -CROWN - 0.02 : -0.04 - Math.random() * (CROWN - 0.06)
    dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius)
    dummy.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3)
    dummy.scale.setScalar(0.6 + Math.random() * 0.9)
    dummy.updateMatrix()
    diamonds.setMatrixAt(index, dummy.matrix)
  }
  crown.add(diamonds)
  return { crown, diamonds }
}

function createCoreBit(): CoreBit {
  const root = new Group()
  const spinner = new Group()
  root.add(spinner)

  const body = new Mesh(new LatheGeometry(bodyProfile(), 128), steel('#c4c7cc', 0.28))
  spinner.add(body)

  const band = new Mesh(
    new CylinderGeometry(OUTER + 0.006, OUTER + 0.006, 0.46, 128, 1, true),
    new MeshPhysicalMaterial({
      map: bandTexture(),
      metalness: 0.15,
      roughness: 0.35,
      clearcoat: 0.9,
      clearcoatRoughness: 0.15,
    }),
  )
  band.position.y = 0.95
  spinner.add(band)

  const collar = new Mesh(
    new CylinderGeometry(OUTER + 0.012, OUTER + 0.012, 0.06, 96, 1, true),
    paint('#0a0a0b'),
  )
  collar.position.y = 0.06
  spinner.add(collar)

  const bore = new Mesh(
    new CylinderGeometry(INNER - 0.002, INNER - 0.002, 2.8, 64, 1, true),
    new MeshBasicMaterial({ color: '#050505', side: 1 }),
  )
  bore.position.y = 1.4
  spinner.add(bore)

  const { crown, diamonds } = createCrown()
  spinner.add(crown)

  const core = new Mesh(
    new CylinderGeometry(INNER - 0.09, INNER - 0.09, 2.2, 64),
    new MeshPhysicalMaterial({
      map: graniteTexture(),
      roughness: 0.82,
      metalness: 0,
      clearcoat: 0.15,
    }),
  )
  core.position.y = -0.85
  root.add(core)

  const hitbox = new Mesh(
    new CylinderGeometry(1.25, 1.25, 4.4, 12),
    new MeshBasicMaterial({ visible: false }),
  )
  hitbox.position.y = 0.6
  root.add(hitbox)

  return { root, spinner, core, diamonds, hitbox }
}

export type { CoreBit }
export { createCoreBit, createCrown }

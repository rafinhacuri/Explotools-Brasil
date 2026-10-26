import {
  DynamicDrawUsage,
  ExtrudeGeometry,
  Group,
  InstancedMesh,
  Mesh,
  MeshPhysicalMaterial,
  Object3D,
  OctahedronGeometry,
  Shape,
} from 'three'

const OUTER = 1
const INNER = 0.78
const CROWN = 0.5
const SEGMENTS = 10
const GAP = 0.15

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

export { createCrown }

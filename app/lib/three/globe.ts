import type { Texture, WebGLRenderer } from 'three'
import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Group,
  Line,
  LineBasicMaterial,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  QuadraticBezierCurve3,
  RingGeometry,
  Scene,
  SphereGeometry,
  Vector3,
} from 'three'

import type { Country } from '~/data/content'

import { createRenderer, disposeObject, pixelRatioFor } from './common'
import { Spring } from './spring'

interface GlobeFrame {
  focus: number
  drag: number
  calm: boolean
}

interface Marker {
  group: Group
  ring: Mesh<RingGeometry, MeshBasicMaterial>
  country: Country
}

interface Arc {
  line: Line<BufferGeometry, LineBasicMaterial>
  count: number
  delay: number
}

const RADIUS = 2
const DOTS = 14_000
const CAMERA_Z = 9.6
const HOME_LON = -62
const HOME_LAT = -14

// Contorno simplificado da América Latina (lon, lat) para destacar o continente nos pontos.
const LATAM: [number, number][] = [
  [-77.5, 8.5],
  [-72, 12],
  [-63, 10.7],
  [-60, 8.5],
  [-52, 5],
  [-50, 0],
  [-44, -2.5],
  [-35, -5.5],
  [-35, -9],
  [-39, -13.5],
  [-39, -18],
  [-41, -22],
  [-48, -26],
  [-48.5, -28.5],
  [-53, -34],
  [-57.5, -35],
  [-57, -38],
  [-62, -39],
  [-65, -42],
  [-65, -46],
  [-68, -50.5],
  [-69, -52.5],
  [-74, -52],
  [-75, -48],
  [-73.5, -42],
  [-73.5, -37],
  [-71.5, -30],
  [-70.5, -18],
  [-75.5, -15],
  [-81, -6],
  [-80.5, -1],
  [-80, 1],
  [-77.5, 4],
  [-77.5, 8.5],
  [-79.5, 9.5],
  [-83, 8.5],
  [-85.7, 11],
  [-87.5, 13],
  [-91, 14],
  [-94.5, 16],
  [-96.5, 15.7],
  [-105, 19.5],
  [-105.5, 22.5],
  [-109.5, 23],
  [-112, 26],
  [-114.5, 30],
  [-117, 32.5],
  [-111, 31.3],
  [-108, 31.3],
  [-106.5, 31.8],
  [-104.5, 29.5],
  [-101.5, 29.8],
  [-99.5, 27],
  [-97.2, 25.8],
  [-97.5, 22],
  [-96, 19],
  [-94.5, 18.2],
  [-91, 19],
  [-90.5, 21],
  [-87, 21.5],
  [-88, 18.3],
  [-88.2, 16],
  [-84, 15.8],
  [-83.2, 15],
  [-83.5, 11],
  [-82, 9],
  [-79, 9.5],
]

function inside(lon: number, lat: number): boolean {
  let hit = false
  for (let i = 0, j = LATAM.length - 1; i < LATAM.length; j = i, i += 1) {
    const [xi, yi] = LATAM[i] ?? [0, 0]
    const [xj, yj] = LATAM[j] ?? [0, 0]
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit
  }
  return hit
}

function toVector(lat: number, lon: number, radius = RADIUS): Vector3 {
  const phi = MathUtils.degToRad(90 - lat)
  const theta = MathUtils.degToRad(lon + 180)
  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

function yawFor(lon: number): number {
  return -MathUtils.degToRad(lon + 90)
}

function createDots(): Points<BufferGeometry, PointsMaterial> {
  const positions = new Float32Array(DOTS * 3)
  const colors = new Float32Array(DOTS * 3)
  const land = new Color('#ff1f33')
  const sea = new Color('#4d4d55')
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let index = 0; index < DOTS; index += 1) {
    const y = 1 - (index / (DOTS - 1)) * 2
    const radius = Math.sqrt(1 - y * y)
    const theta = golden * index
    const point = new Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius).multiplyScalar(
      RADIUS,
    )
    positions.set([point.x, point.y, point.z], index * 3)
    const lat = MathUtils.radToDeg(Math.asin(y))
    const lon = MathUtils.radToDeg(Math.atan2(point.z, -point.x)) - 180
    const normalized = lon < -180 ? lon + 360 : lon
    const color = inside(normalized, lat) ? land : sea
    colors.set([color.r, color.g, color.b], index * 3)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('color', new BufferAttribute(colors, 3))
  return new Points(
    geometry,
    new PointsMaterial({
      size: 0.05,
      vertexColors: true,
      map: dotTexture(),
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    }),
  )
}

class GlobeScene {
  private readonly renderer: WebGLRenderer
  private readonly environment: Texture
  private readonly scene = new Scene()
  private readonly camera = new PerspectiveCamera(32, 1, 0.1, 50)
  private readonly globe = new Group()
  private readonly markers: Marker[] = []
  private readonly arcs: Arc[] = []
  private readonly yaw = new Spring(0)
  private readonly pitch = new Spring(0)
  private readonly countries: Country[]
  private time = 0

  constructor(canvas: HTMLCanvasElement, countries: Country[]) {
    const { renderer, environment } = createRenderer(canvas)
    this.renderer = renderer
    this.environment = environment
    this.countries = countries

    this.globe.add(
      new Mesh(
        new SphereGeometry(RADIUS * 0.985, 64, 48),
        new MeshBasicMaterial({ color: '#0d0d0e' }),
      ),
    )
    this.globe.add(createDots())
    for (const country of countries) this.markers.push(this.createMarker(country))
    this.createArcs()

    this.scene.add(this.globe)
    this.camera.position.set(0, 0, CAMERA_Z)
    this.yaw.snap(yawFor(HOME_LON))
    this.pitch.snap(MathUtils.degToRad(HOME_LAT))
  }

  resize(width: number, height: number, dpr: number): void {
    this.renderer.setPixelRatio(pixelRatioFor(width, dpr))
    this.renderer.setSize(width, height, false)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }

  frame(delta: number, input: GlobeFrame): void {
    const dt = Math.min(delta, 1 / 30)
    this.time += input.calm ? dt * 0.2 : dt
    const target = input.focus >= 0 ? this.countries[input.focus] : undefined
    const lon = target ? target.lon : HOME_LON + Math.sin(this.time * 0.18) * 18
    const lat = target ? target.lat : HOME_LAT

    this.globe.rotation.y = this.yaw.step(yawFor(lon) + input.drag, dt, 2.4)
    this.globe.rotation.x = this.pitch.step(MathUtils.degToRad(lat) * 0.8, dt, 2.4)

    for (const [index, marker] of this.markers.entries()) {
      const focused = input.focus === index
      const pulse = (this.time * 0.6 + index * 0.17) % 1
      marker.ring.scale.setScalar(1 + pulse * (focused ? 2.6 : 1.6))
      marker.ring.material.opacity = (1 - pulse) * (focused ? 1 : 0.7)
    }

    for (const arc of this.arcs) {
      const t = Math.max(0, (this.time * 0.35 + 10 - arc.delay) % 2.2)
      const head = Math.floor(Math.min(t, 1) * arc.count)
      const tail = Math.floor(Math.max(t - 1, 0) * arc.count)
      arc.line.geometry.setDrawRange(tail, Math.max(head - tail, 0))
    }

    this.renderer.render(this.scene, this.camera)
  }

  dispose(): void {
    this.scene.traverse(disposeObject)
    this.environment.dispose()
    this.renderer.dispose()
  }

  private createMarker(country: Country): Marker {
    const group = new Group()
    const position = toVector(country.lat, country.lon, RADIUS * 1.002)
    group.position.copy(position)
    group.lookAt(position.clone().multiplyScalar(2))
    const color = country.home ? '#ffffff' : '#fe0018'
    const dot = new Mesh(
      new SphereGeometry(country.home ? 0.05 : 0.04, 16, 12),
      new MeshBasicMaterial({ color }),
    )
    const ring = new Mesh(
      new RingGeometry(0.06, 0.075, 40),
      new MeshBasicMaterial({ color, transparent: true, depthWrite: false }),
    )
    group.add(dot, ring)
    this.globe.add(group)
    return { group, ring, country }
  }

  private createArcs(): void {
    const homes = this.countries.filter((country) => country.home)
    for (const [h, home] of homes.entries()) {
      const targets = this.countries.map((country, index) => ({ country, index }))
      for (const { country, index } of targets.filter((target) => !target.country.home)) {
        const start = toVector(home.lat, home.lon)
        const end = toVector(country.lat, country.lon)
        const middle = start.clone().add(end).multiplyScalar(0.5)
        middle.setLength(RADIUS + start.distanceTo(end) * 0.38)
        const points = new QuadraticBezierCurve3(start, middle, end).getPoints(64)
        const line = new Line(
          new BufferGeometry().setFromPoints(points),
          new LineBasicMaterial({
            color: h === 0 ? '#fe0018' : '#f2f0ec',
            transparent: true,
            opacity: 0.85,
          }),
        )
        this.globe.add(line)
        this.arcs.push({ line, count: points.length, delay: index * 0.35 + h * 0.2 })
      }
    }
  }
}

function dotTexture(): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context is unavailable')
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(32, 32, 26, 0, Math.PI * 2)
  ctx.fill()
  return new CanvasTexture(canvas)
}

export type { GlobeFrame }
export { GlobeScene }

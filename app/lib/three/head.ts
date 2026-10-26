import type { Material } from 'three'
import {
  BoxGeometry,
  CircleGeometry,
  CylinderGeometry,
  DoubleSide,
  Group,
  LatheGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  Vector2,
} from 'three'

import { steel } from './common'

interface HeadAssembly {
  root: Group
  spinner: Group
  hitbox: Mesh
  edge: { radius: number; y: number }
}

// Medidas em pixels ao longo do eixo, tiradas das fotos do Cabeçote HO montado
// (0 = ponta do arpão, 1295 = fim da cápsula do tubo interno; caixa do latch com 110 px de diâmetro).
const SCALE = 1 / 180
const MIDDLE = 648
const LENGTH = 1295

function u(px: number): number {
  return px * SCALE
}

function y(px: number): number {
  return (MIDDLE - px) * SCALE
}

// Os perfis são escritos da ponta para a base; o LatheGeometry precisa deles de baixo
// para cima para as faces apontarem para fora.
function lathe(points: [number, number][], material: Material): Mesh {
  const profile = points.map(([radius, axis]) => new Vector2(u(radius), y(axis)))
  return new Mesh(new LatheGeometry(profile.toReversed(), 96), material)
}

function patch(
  radius: number,
  top: number,
  bottom: number,
  angle: number,
  width: number,
  material: Material,
): Mesh {
  const mesh = new Mesh(
    new CylinderGeometry(
      u(radius),
      u(radius),
      u(bottom - top),
      16,
      1,
      true,
      angle - width / 2,
      width,
    ),
    material,
  )
  mesh.position.y = y((top + bottom) / 2)
  return mesh
}

function hole(
  radius: number,
  axis: number,
  angle: number,
  size: number,
  material: Material,
  stretch = 1,
): Mesh {
  const mesh = new Mesh(new CircleGeometry(u(size), 32), material)
  mesh.position.set(Math.sin(angle) * u(radius), y(axis), Math.cos(angle) * u(radius))
  mesh.rotation.y = angle
  mesh.scale.y = stretch
  return mesh
}

function latch(side: number, material: Material): Group {
  const group = new Group()
  const plate = new Mesh(new BoxGeometry(u(8), u(150), u(22)), material)
  plate.position.set(u(52), y(515), 0)
  const nose = new Mesh(new BoxGeometry(u(12), u(36), u(22)), material)
  nose.position.set(u(59), y(458), 0)
  group.add(plate, nose)
  group.rotation.y = side - Math.PI / 2
  return group
}

function createHeadAssembly(): HeadAssembly {
  const root = new Group()
  const spinner = new Group()
  root.add(spinner)

  const machined = steel('#c4c7cc', 0.24)
  const raw = steel('#9fa3aa', 0.46)
  const flat = steel('#8b8f96', 0.3)
  const phosphate = new MeshPhysicalMaterial({ color: '#3a3c40', metalness: 0.7, roughness: 0.55 })
  const valve = new MeshPhysicalMaterial({
    color: '#f2d11b',
    metalness: 0,
    roughness: 0.6,
    clearcoat: 0.2,
  })
  const shadow = new MeshBasicMaterial({ color: '#060606', side: DoubleSide })

  // Ponta do arpão (1) e base do arpão (4), fosfatizadas.
  spinner.add(
    lathe(
      [
        [0, 0],
        [21, 42],
        [9, 46],
        [9, 70],
        [18, 82],
        [18, 176],
        [0, 176],
      ],
      phosphate,
    ),
    lathe(
      [
        [0, 168],
        [46, 168],
        [46, 266],
        [0, 266],
      ],
      phosphate,
    ),
  )
  for (const side of [0, Math.PI]) spinner.add(patch(18.3, 118, 176, side, 0.7, shadow))
  for (const side of [Math.PI / 2, -Math.PI / 2]) spinner.add(hole(18.4, 148, side, 7, shadow))

  // Caixa do tubo de retração (6): aço bruto com rasgos em U no topo, furos dos
  // pinos elásticos (7) e as janelas por onde saem os latches (12).
  spinner.add(
    lathe(
      [
        [47, 262],
        [47, 166],
        [49, 164],
        [55, 164],
        [55, 690],
        [0, 690],
      ],
      raw,
    ),
  )
  for (const side of [0, Math.PI]) {
    spinner.add(
      patch(55.3, 164, 206, side, 0.9, shadow),
      hole(55.3, 232, side, 7, shadow),
      hole(55.3, 640, side, 7, shadow),
    )
  }
  for (const side of [Math.PI / 2, -Math.PI / 2]) {
    spinner.add(patch(55.3, 410, 605, side, 0.47, shadow), latch(side, phosphate))
  }

  // Corpo inferior do latch (18) com o anel de chegada (15): dois colarinhos,
  // três janelas oblíquas de passagem de água e as faces de chave.
  spinner.add(
    lathe(
      [
        [0, 690],
        [58, 690],
        [58, 708],
        [54, 709],
        [54, 712],
        [58, 713],
        [58, 727],
        [53, 732],
        [53, 858],
        [0, 858],
      ],
      machined,
    ),
  )
  for (let index = 0; index < 3; index += 1) {
    spinner.add(hole(55, 790, 0.17 + (index * Math.PI * 2) / 3, 15, shadow, 1.9))
  }
  for (const side of [1.2, 1.2 + Math.PI]) spinner.add(patch(53.2, 818, 858, side, 0.55, flat))

  // Arruela Nord Lock (19) e porca sextavada 1-1/4" (20) no eixo (21).
  spinner.add(
    lathe(
      [
        [0, 858],
        [40, 858],
        [40, 863],
        [0, 863],
      ],
      flat,
    ),
  )
  const nut = new Mesh(new CylinderGeometry(u(42), u(42), u(40), 6), machined)
  nut.position.y = y(883)
  spinner.add(nut)

  // Base do rolamento (25) com as duas válvulas de fluido (22) e as arruelas de
  // ajuste (23), seguida da cápsula do tubo interno (29).
  spinner.add(
    lathe(
      [
        [0, 903],
        [50, 903],
        [50, 947],
        [52, 948],
        [52, 990],
        [54, 992],
        [54, 1013],
        [52, 1015],
        [54, 1017],
        [54, 1078],
        [52, 1080],
        [54, 1082],
        [54, 1100],
        [53, 1101],
        [53, 1288],
        [49, LENGTH],
        [0, LENGTH],
      ],
      machined,
    ),
  )
  for (const [top, bottom] of [
    [948, 961],
    [969, 982],
  ] as const) {
    spinner.add(
      lathe(
        [
          [0, top],
          [56, top],
          [57, top + 2],
          [57, bottom - 2],
          [56, bottom],
          [0, bottom],
        ],
        valve,
      ),
    )
  }
  for (const side of [0.4, 0.4 + Math.PI]) spinner.add(patch(50.2, 903, 947, side, 0.7, flat))
  spinner.add(hole(53.3, 1262, 0, 8, shadow), hole(53.3, 1270, 2.5, 6, shadow))

  const hitbox = new Mesh(
    new CylinderGeometry(u(85), u(85), u(LENGTH), 12),
    new MeshBasicMaterial({ visible: false }),
  )
  hitbox.position.y = y(LENGTH / 2)
  root.add(hitbox)

  return { root, spinner, hitbox, edge: { radius: u(53), y: y(LENGTH) } }
}

export type { HeadAssembly }
export { createHeadAssembly }

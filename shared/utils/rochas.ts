/* ===========================================================================
   BASE DE LITOLOGIAS
   Campos derivados da mineralogia típica (estimados — ajustáveis no campo):
     mohs : dureza Mohs (âncora; fabricantes indexam seleção em Mohs)
     eqc  : teor de quartzo equivalente aproximado (%), via dureza Rosiwal
     cai  : índice de abrasividade Cerchar representativo da litologia
     abra : abrasividade default (low/medium/high) derivada de EQC+CAI
     ucs  : faixa típica de resistência à compressão (MPa) — referência
   Fontes: classes Cerchar por tipo de rocha; teor de quartzo / Rosiwal por
   mineralogia padrão; faixas de UCS de literatura geotécnica.
   =========================================================================== */

export type Abra = 'low' | 'medium' | 'high'

export interface Rock {
  n: string
  mohs: number
  eqc: number
  cai: number
  abra: Abra
  ucs: [number, number]
}

const ABRA_DEFAULTS: Record<Abra, { eqc: number, cai: number }> = {
  low: { eqc: 5, cai: 1.0 },
  medium: { eqc: 28, cai: 2.5 },
  high: { eqc: 60, cai: 4.2 },
}

function ucsFor(mohs: number): [number, number] {
  if(mohs < 3) return [10, 60]
  if(mohs < 4) return [20, 120]
  if(mohs < 5) return [20, 150]
  if(mohs < 6) return [40, 200]
  if(mohs < 6.8) return [100, 300]
  return [150, 350]
}

function mk(n: string, mohs: number, abra: Abra, o: { eqc?: number, cai?: number, ucs?: [number, number] } = {}): Rock {
  const d = ABRA_DEFAULTS[abra]
  return { n, mohs, abra, eqc: o.eqc ?? d.eqc, cai: o.cai ?? d.cai, ucs: o.ucs ?? ucsFor(mohs) }
}

export const ROCKS: Rock[] = [
  // --- Sedimentares carbonáticas / evaporíticas ---
  mk('Calcário', 3, 'low', { eqc: 2, cai: 1.2, ucs: [30, 200] }),
  mk('Calcário dolomítico', 3.8, 'low', { eqc: 4, cai: 1.4, ucs: [40, 250] }),
  mk('Calcário micrítico', 3, 'low', { eqc: 2, cai: 1.0, ucs: [30, 180] }),
  mk('Calcário oolítico', 3, 'low', { eqc: 2, cai: 1.0, ucs: [20, 150] }),
  mk('Travertino', 3, 'low', { eqc: 2, cai: 1.0, ucs: [20, 120] }),
  mk('Calcilutito', 3, 'low', { eqc: 3, cai: 0.9 }),
  mk('Calcarenito', 3.2, 'low', { eqc: 5, cai: 1.1 }),
  mk('Calcirrudito', 3.2, 'low', { eqc: 5, cai: 1.1 }),
  mk('Dolomita', 3.8, 'low', { eqc: 4, cai: 1.0, ucs: [40, 250] }),
  mk('Marga', 3, 'low', { eqc: 5, cai: 0.8, ucs: [5, 50] }),
  mk('Gesso', 2, 'low', { eqc: 0, cai: 0.3, ucs: [10, 40] }),
  mk('Anidrita', 3, 'low', { eqc: 0, cai: 0.4, ucs: [20, 90] }),
  mk('Halita (sal-gema)', 2.5, 'low', { eqc: 0, cai: 0.3, ucs: [10, 40] }),
  mk('Evaporito (misto)', 2.5, 'low', { eqc: 0, cai: 0.3, ucs: [10, 50] }),
  mk('Fosforito', 5, 'low', { eqc: 10, cai: 1.4 }),
  mk('Diatomito', 3.5, 'low', { eqc: 8, cai: 0.8 }),
  mk('Carvão betuminoso', 2.5, 'low', { eqc: 2, cai: 0.5, ucs: [5, 50] }),
  mk('Antracito', 3, 'low', { eqc: 2, cai: 0.6, ucs: [10, 60] }),
  // --- Sedimentares clásticas ---
  mk('Arenito', 6.5, 'high', { eqc: 70, cai: 3.0, ucs: [20, 170] }),
  mk('Arenito quartzoso', 6.8, 'high', { eqc: 85, cai: 3.5, ucs: [40, 180] }),
  mk('Arenito feldspático (arcoseano)', 6.2, 'high', { eqc: 55, cai: 2.8, ucs: [40, 180] }),
  mk('Arenito lítico', 6, 'high', { eqc: 50, cai: 2.6 }),
  mk('Arenito ferruginoso', 6.8, 'high', { eqc: 65, cai: 3.5, ucs: [40, 180] }),
  mk('Arenito glauconítico', 6.2, 'high', { eqc: 55, cai: 2.6 }),
  mk('Arenito silicificado', 7, 'high', { eqc: 90, cai: 4.5, ucs: [120, 300] }),
  mk('Arenito argiloso', 5.5, 'medium', { eqc: 40, cai: 2.2 }),
  mk('Arenito conglomerático', 6.5, 'high', { eqc: 60, cai: 3.0 }),
  mk('Siltito', 3.5, 'low', { eqc: 30, cai: 0.8, ucs: [5, 100] }),
  mk('Folhelho', 3, 'low', { eqc: 20, cai: 0.7, ucs: [5, 100] }),
  mk('Folhelho betuminoso', 3, 'low', { eqc: 18, cai: 0.7, ucs: [5, 100] }),
  mk('Lutito', 3, 'low', { eqc: 18, cai: 0.7 }),
  mk('Argilito', 2.8, 'low', { eqc: 12, cai: 0.6, ucs: [5, 80] }),
  mk('Conglomerado (matriz argilosa)', 5.5, 'medium', { eqc: 45, cai: 2.2 }),
  mk('Conglomerado (matriz sílica)', 6.8, 'high', { eqc: 60, cai: 3.2 }),
  mk('Brecha sedimentar', 6, 'high', { eqc: 50, cai: 2.8 }),
  mk('Varvito (ritmito)', 3.3, 'low', { eqc: 25, cai: 0.8 }),
  mk('Laterita', 5.5, 'high', { eqc: 30, cai: 2.6, ucs: [10, 100] }),
  mk('Canga (latossolo endurecido)', 5.8, 'high', { eqc: 40, cai: 2.8, ucs: [20, 120] }),
  mk('Ferricrete', 6, 'high', { eqc: 40, cai: 3.0 }),
  // --- Formações ferríferas e silicosas ---
  mk('BIF (Formação Ferrífera Bandada)', 6.8, 'high', { eqc: 60, cai: 4.5, ucs: [100, 300] }),
  mk('Itabirito', 6.8, 'high', { eqc: 60, cai: 4.5, ucs: [100, 300] }),
  mk('Hematitito compacto', 6.5, 'high', { eqc: 30, cai: 3.0, ucs: [100, 300] }),
  mk('Jaspelito', 6.8, 'high', { eqc: 90, cai: 4.8, ucs: [150, 300] }),
  mk('Chert', 7, 'high', { eqc: 95, cai: 5.0, ucs: [150, 350] }),
  mk('Sílex', 7, 'high', { eqc: 95, cai: 5.0, ucs: [150, 350] }),
  mk('Calcedônia', 6.8, 'high', { eqc: 95, cai: 4.8, ucs: [120, 300] }),
  mk('Opala (comum)', 5.5, 'medium', { eqc: 60, cai: 2.5 }),
  mk('Silexito', 7, 'high', { eqc: 95, cai: 5.0, ucs: [150, 350] }),
  mk('Tufito carbonático', 3, 'low', { eqc: 5, cai: 0.8 }),
  mk('Tufo calcário', 3, 'low', { eqc: 3, cai: 0.8 }),
  mk('Caliche', 3, 'low', { eqc: 5, cai: 1.0 }),
  // --- Ígneas vulcânicas ---
  mk('Basalto', 6, 'medium', { eqc: 25, cai: 2.5, ucs: [100, 350] }),
  mk('Basalto vesicular', 6, 'medium', { eqc: 22, cai: 2.3, ucs: [80, 300] }),
  mk('Basalto amigdaloidal', 6, 'medium', { eqc: 22, cai: 2.3, ucs: [80, 300] }),
  mk('Basalto porfirítico', 6.2, 'medium', { eqc: 25, cai: 2.6, ucs: [100, 350] }),
  mk('Basalto alterado', 5.5, 'medium', { eqc: 20, cai: 2.0 }),
  mk('Diabásio', 6.5, 'medium', { eqc: 28, cai: 2.8, ucs: [150, 300] }),
  mk('Andesito', 6.5, 'medium', { eqc: 35, cai: 2.5, ucs: [100, 300] }),
  mk('Andesito porfirítico', 6.6, 'medium', { eqc: 35, cai: 2.6, ucs: [100, 300] }),
  mk('Andesito vesicular', 6.2, 'medium', { eqc: 32, cai: 2.4 }),
  mk('Riolito', 6, 'high', { eqc: 55, cai: 3.5, ucs: [100, 300] }),
  mk('Riolito porfirítico', 6.2, 'high', { eqc: 55, cai: 3.6, ucs: [100, 300] }),
  mk('Dacito', 6.5, 'high', { eqc: 50, cai: 3.3, ucs: [100, 300] }),
  mk('Traquito', 6, 'medium', { eqc: 30, cai: 2.5, ucs: [100, 250] }),
  mk('Fonolito', 5.8, 'medium', { eqc: 20, cai: 2.2 }),
  mk('Tephri-fonolito', 5.8, 'medium', { eqc: 20, cai: 2.2 }),
  mk('Traquiandesito', 6.2, 'medium', { eqc: 30, cai: 2.5 }),
  mk('Ignimbrito soldado', 6, 'high', { eqc: 50, cai: 3.2 }),
  mk('Ignimbrito não soldado', 5.5, 'medium', { eqc: 40, cai: 2.4 }),
  mk('Tufo vulcânico', 5.5, 'medium', { eqc: 35, cai: 2.2 }),
  mk('Brecha vulcânica', 6, 'medium', { eqc: 35, cai: 2.5 }),
  mk('Tefra consolidada', 5.5, 'medium', { eqc: 30, cai: 2.0 }),
  mk('Obsidiana', 5.5, 'medium', { eqc: 30, cai: 1.8, ucs: [50, 150] }),
  mk('Pumita (pumice)', 5.5, 'medium', { eqc: 30, cai: 1.6 }),
  mk('Escória basáltica', 5.8, 'medium', { eqc: 22, cai: 2.2 }),
  mk('Komatito', 6, 'medium', { eqc: 25, cai: 2.4 }),
  mk('Kimberlito', 6, 'low', { eqc: 10, cai: 1.0, ucs: [10, 100] }),
  mk('Carbonatito', 3.5, 'low', { eqc: 5, cai: 0.9 }),
  // --- Ígneas plutônicas ---
  mk('Gabro', 6.5, 'medium', { eqc: 28, cai: 2.5, ucs: [150, 300] }),
  mk('Norito', 6.5, 'medium', { eqc: 28, cai: 2.5, ucs: [150, 300] }),
  mk('Anortosito', 6, 'medium', { eqc: 18, cai: 2.0, ucs: [150, 300] }),
  mk('Peridotito', 6.5, 'medium', { eqc: 35, cai: 2.8, ucs: [150, 300] }),
  mk('Dunito', 6.5, 'medium', { eqc: 35, cai: 2.8, ucs: [150, 300] }),
  mk('Harzburgito', 6.5, 'medium', { eqc: 33, cai: 2.7 }),
  mk('Lherzolito', 6.5, 'medium', { eqc: 33, cai: 2.7 }),
  mk('Sienito', 5.8, 'medium', { eqc: 30, cai: 2.8, ucs: [150, 300] }),
  mk('Sienito nefelínico', 5.8, 'medium', { eqc: 20, cai: 2.4 }),
  mk('Foiaíto', 5.8, 'medium', { eqc: 18, cai: 2.2 }),
  mk('Monzonito', 6, 'medium', { eqc: 35, cai: 2.8 }),
  mk('Monzodiorito', 6.2, 'medium', { eqc: 35, cai: 2.8 }),
  mk('Diorito', 6.5, 'medium', { eqc: 25, cai: 2.5, ucs: [150, 300] }),
  mk('Quartzo-diorito', 6.5, 'high', { eqc: 40, cai: 3.5, ucs: [150, 300] }),
  mk('Granodiorito', 6.5, 'high', { eqc: 45, cai: 4.2, ucs: [150, 300] }),
  mk('Granito', 6.5, 'high', { eqc: 55, cai: 4.5, ucs: [100, 300] }),
  mk('Monzogranito', 6.5, 'high', { eqc: 50, cai: 4.3, ucs: [150, 300] }),
  mk('Sienogranito', 6.5, 'high', { eqc: 50, cai: 4.0, ucs: [150, 300] }),
  mk('Tonalito', 6.5, 'high', { eqc: 45, cai: 4.0, ucs: [150, 300] }),
  mk('Pegmatito', 6.5, 'high', { eqc: 50, cai: 4.0, ucs: [100, 250] }),
  mk('Aplito', 6.5, 'high', { eqc: 50, cai: 4.0 }),
  mk('Charnockito', 6.5, 'high', { eqc: 45, cai: 4.0 }),
  // --- Metamórficas ---
  mk('Quartzito', 7, 'high', { eqc: 95, cai: 5.0, ucs: [150, 350] }),
  mk('Quartzito micáceo', 6.8, 'high', { eqc: 80, cai: 4.5, ucs: [120, 300] }),
  mk('Quartzito ferruginoso', 6.9, 'high', { eqc: 80, cai: 4.6, ucs: [120, 300] }),
  mk('Gnaisse', 6.5, 'high', { eqc: 55, cai: 4.5, ucs: [150, 300] }),
  mk('Gnaisse bandado', 6.6, 'high', { eqc: 55, cai: 4.5, ucs: [150, 300] }),
  mk('Gnaisse granítico', 6.5, 'high', { eqc: 55, cai: 4.5, ucs: [150, 300] }),
  mk('Gnaisse charnockítico', 6.6, 'high', { eqc: 50, cai: 4.3 }),
  mk('Migmatito', 6.5, 'high', { eqc: 50, cai: 4.0, ucs: [150, 300] }),
  mk('Milonito', 6.2, 'medium', { eqc: 40, cai: 3.0 }),
  mk('Cataclasito', 6, 'medium', { eqc: 40, cai: 2.8 }),
  mk('Tectonito', 6.5, 'medium', { eqc: 40, cai: 3.0 }),
  mk('Xisto (biotita)', 4.8, 'medium', { eqc: 35, cai: 2.0, ucs: [20, 120] }),
  mk('Xisto (clorita)', 4.2, 'medium', { eqc: 25, cai: 1.6 }),
  mk('Xisto (muscovita)', 4.5, 'medium', { eqc: 35, cai: 1.8 }),
  mk('Xisto grafitoso', 4, 'low', { eqc: 15, cai: 0.9 }),
  mk('Filito', 3.5, 'low', { eqc: 15, cai: 1.0, ucs: [20, 100] }),
  mk('Ardósia', 4, 'low', { eqc: 18, cai: 0.8, ucs: [40, 180] }),
  mk('Mármore', 3.5, 'low', { eqc: 3, cai: 0.8, ucs: [40, 200] }),
  mk('Mármore dolomítico', 3.8, 'low', { eqc: 3, cai: 0.9, ucs: [40, 200] }),
  mk('Serpentinitos', 3.5, 'low', { eqc: 10, cai: 0.7, ucs: [20, 120] }),
  mk('Talco-xisto', 2, 'low', { eqc: 5, cai: 0.4, ucs: [10, 60] }),
  mk('Cloritito', 3, 'low', { eqc: 8, cai: 0.7 }),
  mk('Anfibolito', 5.8, 'medium', { eqc: 30, cai: 2.5, ucs: [150, 280] }),
  mk('Eclogito', 7.5, 'medium', { eqc: 20, cai: 3.0, ucs: [200, 350] }),
  mk('Hornfels', 6, 'medium', { eqc: 35, cai: 2.8 }),
  mk('Skarn (calcossilicatado)', 6.5, 'medium', { eqc: 30, cai: 2.8 }),
  mk('Metabasito', 6.2, 'medium', { eqc: 28, cai: 2.5 }),
  mk('Metagabro', 6.3, 'medium', { eqc: 28, cai: 2.5 }),
  mk('Metagranito', 6.5, 'high', { eqc: 50, cai: 4.2 }),
  mk('Meta-arenito', 6.8, 'high', { eqc: 75, cai: 4.0 }),
  mk('Meta-argilito', 3.2, 'low', { eqc: 15, cai: 0.8 }),
  mk('Meta-limestone', 3.5, 'low', { eqc: 3, cai: 0.8 }),
  mk('Quartzito cataclástico', 7, 'high', { eqc: 90, cai: 4.8 }),
  mk('Quartzo milonítico', 7, 'high', { eqc: 90, cai: 4.8 }),
  mk('Xisto anfibolítico', 5.8, 'medium', { eqc: 30, cai: 2.4 }),
  mk('Gnaisse milonítico', 6.4, 'high', { eqc: 50, cai: 4.0 }),
  mk('Mármores impuros (silicosos)', 4, 'medium', { eqc: 25, cai: 1.8 }),
  // --- Veios / hidrotermais / alteração ---
  mk('Veio de quartzo', 7, 'high', { eqc: 100, cai: 5.5, ucs: [100, 300] }),
  mk('Brecha hidrotermal', 6.5, 'high', { eqc: 60, cai: 3.5 }),
  mk('Silcrete', 7, 'high', { eqc: 90, cai: 4.8 }),
  mk('Ferruginização (boxwork)', 6.5, 'high', { eqc: 40, cai: 3.2 }),
  mk('Argilização intensa', 2.8, 'low', { eqc: 10, cai: 0.6 }),
  mk('Caulinita (rocha caulinizada)', 2.5, 'low', { eqc: 8, cai: 0.5 }),
  mk('Lateritização níquel', 5.5, 'medium', { eqc: 25, cai: 2.2 }),
  mk('Gossan', 5.5, 'medium', { eqc: 30, cai: 2.4 }),
  mk('Greisen', 6.5, 'high', { eqc: 60, cai: 4.0 }),
  mk('Zonas talcose', 2, 'low', { eqc: 5, cai: 0.4 }),
  mk('Saprolito granítico', 3.5, 'low', { eqc: 30, cai: 1.2 }),
  mk('Saprolito basáltico', 3.5, 'low', { eqc: 15, cai: 1.0 }),
  mk('Saprolito gnáissico', 3.8, 'low', { eqc: 30, cai: 1.2 }),
]

/** Rótulos para o menu de busca, mantendo o formato "Nome - Mohs X". */
export const rochas: string[] = ROCKS.map(r => `${r.n} - Mohs ${r.mohs}`)

/** Localiza a rocha pelo rótulo ("Nome - Mohs X") ou pelo nome puro. */
export function findRock(label?: string | null): Rock | undefined {
  if(!label) return undefined
  const name = label.split(' - Mohs')[0]?.trim() ?? ''
  return ROCKS.find(r => r.n === name) ?? ROCKS.find(r => label.startsWith(r.n))
}

/** Classe textual de abrasividade a partir do CAI (Cerchar). */
export function caiClass(c: number): string {
  if(c < 0.5) return 'quase não abrasiva'
  if(c < 1) return 'pouco abrasiva'
  if(c < 2) return 'abrasiva'
  if(c < 4) return 'muito abrasiva'
  return 'extremamente abrasiva'
}

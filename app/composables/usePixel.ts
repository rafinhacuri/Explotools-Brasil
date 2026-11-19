type PixelEvent = 'Lead' | 'Contact' | 'ViewContent'

interface Pixel {
  track: (event: PixelEvent) => void
}

// Só o nome da ferramenta segue no evento: nenhum dado do visitante vai para a Meta.
const CONTENT = 'Seleção de Coroa'

function usePixel(): Pixel {
  const { proxy } = useScriptMetaPixel()

  function track(event: PixelEvent): void {
    proxy.fbq('track', event, { content_name: CONTENT })
  }

  return { track }
}

export { usePixel }

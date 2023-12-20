import type { Component } from 'atomico'
import { c, html, useEffect, useHost, useState } from 'atomico'
import { getStd, page } from './global.ts'
import { renderPage } from './render.ts'
import { setup } from './setup.ts'

export const Root: Component = () => {
  const host = useHost()
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    setup(host.current).then(() => {
      getStd().mount()
      setLoaded(true)
    })
    return () => {
      getStd().unmount()
    }
  }, [])

  return html`<host>
      ${loaded
          ? html`<div contenteditable="true">
              ${renderPage(page)}
            </div>`
          : html`<span>Loading...</span>`
    }
  </host>`
}

const RootElement = c(Root)
customElements.define('atom-block-editor-root', RootElement)

declare global {
  // eslint-disable-next-line ts/no-namespace
  namespace BlockSuite {
    interface ComponentType {
      atomico: string
    }
  }
}

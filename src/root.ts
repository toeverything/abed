import type { Component } from 'atomico'
import { c, html, useEffect, useHost, useState } from 'atomico'
import { getStd, page } from './global'
import { renderPage } from './render'
import { setup } from './setup'
import { bindSelection } from './selection'

export const Root: Component = () => {
  const host = useHost()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const $host = host.current
    setup($host).then(() => {
      getStd().mount()
      setLoaded(true)
    })
    const unbind = bindSelection()
    return () => {
      unbind()
      getStd().unmount()
    }
  }, [])

  return html`<host contenteditable="true">
    ${loaded
      ? renderPage(page)
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

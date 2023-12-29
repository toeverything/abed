import type { Component } from 'atomico'
import { c, html, useEffect, useHost, useState } from 'atomico'
import invariant from 'tiny-invariant'
import type { BlockStdScope } from '@blocksuite/block-std'
import { getStd } from './global'
import { renderPage } from './render'
import { setup } from './setup'
import { bindSelection } from './core/selection'

export interface RootProps {
  editorId: string
  std: BlockStdScope
  config: {
    onLoad: (std: BlockStdScope) => void
  }
}

export const Root: Component<RootProps> = ({ editorId, config }) => {
  invariant(editorId)
  const host = useHost()
  const [loaded, setLoaded] = useState(false)
  const [std, setStd] = useState<null | BlockStdScope>(null)

  useEffect(() => {
    const $host = host.current
    setup(editorId, $host).then(() => {
      const std = getStd(editorId)
      config?.onLoad?.(std)
      std.mount()
      setStd(std)
      setLoaded(true)
      std.event.bindHotkey({
        'Mod-z': (context) => {
          context.get('defaultState').event.preventDefault()
          std.page.undo()
        },
        'Mod-Z': (context) => {
          context.get('defaultState').event.preventDefault()
          std.page.redo()
        },
      })
    })
    const unbind = bindSelection(editorId)
    return () => {
      unbind()
      getStd(editorId).unmount()
    }
  }, [editorId, config])

  return html`<host data-editor-id=${editorId} std=${std} contenteditable="true">
    ${loaded
      ? renderPage(editorId)
      : html`<span>Loading...</span>`
    }
  </host>`
}

Root.props = {
  editorId: {
    type: String,
    value: () => crypto.randomUUID(),
  },
  std: Object,
  config: Object,
}

const RootElement = c(Root)
customElements.define('ab-editor', RootElement)

declare global {
  // eslint-disable-next-line ts/no-namespace
  namespace BlockSuite {
    interface ComponentType {
      atomico: string
    }
  }
}

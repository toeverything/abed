import type { Component } from 'atomico'
import { c, html } from 'atomico'

import * as g from './global'

import './root'

Object.assign(window, g)

const Editor: Component = () => {
  return html`<host>
    <atom-block-editor-root></atom-block-editor-root>
  </host>`
}

const EditorElement = c(Editor)
customElements.define('atom-block-editor', EditorElement)

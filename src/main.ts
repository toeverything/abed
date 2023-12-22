import type { Component } from 'atomico'
import { c, css, html } from 'atomico'
import type { BlockStdScope } from '@blocksuite/block-std'
import { internalPrimitives } from '@blocksuite/store'
import { useCssLightDom } from '@atomico/hooks/use-css-light-dom'

import './root'

function initEditorA(std: BlockStdScope) {
  const page = std.page
  const docId = page.addBlock('ab:doc')
  const noteId = page.addBlock('ab:note', {}, docId)
  page.addBlock('ab:paragraph', {
    text: internalPrimitives.Text('Good morning'),
  }, noteId)
  page.addBlock('ab:paragraph', {
    text: internalPrimitives.Text('Show me the place where he inserted the blade'),
  }, noteId)
  page.addBlock('ab:paragraph', {
    text: internalPrimitives.Text('Or praise the Lord, burn my house'),
  }, noteId)
  page.addBlock('ab:paragraph', {
    text: internalPrimitives.Text('I get lost, I freak out'),
  }, noteId)
}

function initEditorB(std: BlockStdScope) {
  const page = std.page
  const docId = page.addBlock('ab:doc')
  const noteId = page.addBlock('ab:note', {}, docId)
  page.addBlock('ab:paragraph', {
    text: internalPrimitives.Text('Hello Abed!'),
  }, noteId)
}

const style = css`
  ab-editor {
    display: block;
    margin-bottom: 16px;
  }
`

const Editor: Component = () => {
  useCssLightDom(style)

  return html`<host>
    <ab-editor config=${{ onLoad: initEditorA }}></ab-editor>
    <ab-editor config=${{ onLoad: initEditorB }}></ab-editor>
  </host>`
}

const EditorElement = c(Editor)
customElements.define('ab-ed', EditorElement)

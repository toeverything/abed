import type { BlockSpec } from '@blocksuite/block-std'
import type { SchemaToModel } from '@blocksuite/store'
import { defineBlockSchema } from '@blocksuite/store'
import type { Component } from 'atomico'
import { c, html } from 'atomico'

export const DocBlockSchema = defineBlockSchema({
  flavour: 'ab:doc',
  metadata: {
    role: 'root',
    version: 0,
  },
})

export type DocBlockModel = SchemaToModel<typeof DocBlockSchema>

export const DocBlockComponent: Component<{ content: string[], model: DocBlockModel }> = ({ content }) => {
  return html`<host>
    ${content}
  </host>`
}
DocBlockComponent.props = {
  content: Array,
  model: Object,
}

export const DocBlockElement = c(DocBlockComponent)
customElements.define('ab-doc', DocBlockElement)

export const DocBlockSpec: BlockSpec = {
  schema: DocBlockSchema,
  view: {
    component: 'ab-doc',
  },
}

import type { SchemaToModel } from '@blocksuite/store'
import { defineBlockSchema } from '@blocksuite/store'
import type { Component } from 'atomico'
import { c, html } from 'atomico'
import type { BlockSpec } from '@blocksuite/block-std'

export const NoteBlockSchema = defineBlockSchema({
  flavour: 'ab:note',
  metadata: {
    role: 'hub',
    version: 0,
  },
})

export type NoteBlockModel = SchemaToModel<typeof NoteBlockSchema>

export const NoteBlockComponent: Component<{ content: string[], model: NoteBlockModel }> = ({ content }) => {
  return html`<host>${content}</host>`
}
NoteBlockComponent.props = {
  content: Array,
  model: Object,
}

export const NoteBlockElement = c(NoteBlockComponent)
customElements.define('ab-note', NoteBlockElement)

export const NoteBlockSpec: BlockSpec = {
  schema: NoteBlockSchema,
  view: {
    component: 'ab-note',
  },
}

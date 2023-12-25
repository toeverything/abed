import type { BlockSpec } from '@blocksuite/block-std'
import type { SchemaToModel } from '@blocksuite/store'
import { defineBlockSchema } from '@blocksuite/store'
import type { Component } from 'atomico'
import { c, html } from 'atomico'
import invariant from 'tiny-invariant'
import { usePath } from '../../hooks'
import type { BlockProps } from '../../types'
import { useModelUpdate } from '../../hooks/use-model-update'
import { renderChildren } from '../../render'

export const NoteBlockSchema = defineBlockSchema({
  flavour: 'ab:note',
  metadata: {
    role: 'hub',
    version: 0,
  },
})

export type NoteBlockModel = SchemaToModel<typeof NoteBlockSchema>

export const NoteBlockComponent: Component<BlockProps<NoteBlockModel>> = ({ editorId, model }) => {
  invariant(editorId)
  const path = usePath(editorId)

  invariant(model)
  useModelUpdate(model)

  return html`<host data-ab-block=${model.id} path=${path}>${renderChildren(editorId, model)}</host>`
}
NoteBlockComponent.props = {
  editorId: String,
  path: Array,
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

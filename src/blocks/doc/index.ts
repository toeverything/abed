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

export const DocBlockSchema = defineBlockSchema({
  flavour: 'ab:doc',
  metadata: {
    role: 'root',
    version: 0,
  },
})

export type DocBlockModel = SchemaToModel<typeof DocBlockSchema>

export const DocBlockComponent: Component<BlockProps<DocBlockModel>> = ({ editorId, model }) => {
  invariant(editorId)
  const path = usePath(editorId)

  invariant(model)
  useModelUpdate(model)

  return html`<host data-ab-block=${model.id} path=${path}>
    ${renderChildren(editorId, model)}
  </host>`
}
DocBlockComponent.props = {
  editorId: String,
  path: Array,
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

import type { SchemaToModel } from '@blocksuite/store'
import { defineBlockSchema } from '@blocksuite/store'
import type { Component } from 'atomico'
import { c, html, useEffect, useRef } from 'atomico'
import type { BlockSpec } from '@blocksuite/block-std'
import { InlineEditor } from '@blocksuite/inline'
import invariant from 'tiny-invariant'
import { usePath } from '../../hooks'
import type { BlockProps } from '../../types'
import { useRoot } from '../../hooks/use-root'
import { useModelUpdate } from '../../hooks/use-model-update'
import { renderChildren } from '../../render'

export const ParagraphBlockSchema = defineBlockSchema({
  flavour: 'ab:paragraph',
  props: (internalPrimitives) => {
    return {
      text: internalPrimitives.Text(),
    }
  },
  metadata: {
    role: 'content',
    version: 0,
  },
})

export type ParagraphBlockModel = SchemaToModel<typeof ParagraphBlockSchema>

export const ParagraphBlockComponent: Component<BlockProps<ParagraphBlockModel>> = ({
  editorId,
  model,
}) => {
  invariant(editorId)
  const path = usePath(editorId)
  const root = useRoot()
  const ref = useRef<HTMLDivElement>()
  useEffect(() => {
    if (!root)
      return

    invariant(model, 'Model is not found')
    invariant(ref.current)
    const editor = new InlineEditor(model.text.yText)
    editor.mount(ref.current, root)
    return () => {
      editor.unmount()
    }
  }, [root])

  invariant(model)
  useModelUpdate(model)

  return html`<host data-ab-block=${model.id} path=${path}>
    <div ref=${ref}></div>
    ${renderChildren(editorId, model)}
  </host>`
}
ParagraphBlockComponent.props = {
  editorId: String,
  path: Array,
  model: Object,
}

export const ParagraphBlockElement = c(ParagraphBlockComponent)
customElements.define('ab-paragraph', ParagraphBlockElement)

export const ParagraphBlockSpec: BlockSpec = {
  schema: ParagraphBlockSchema,
  view: {
    component: 'ab-paragraph',
  },
}

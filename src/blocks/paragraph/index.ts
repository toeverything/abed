import type { SchemaToModel } from '@blocksuite/store'
import { defineBlockSchema } from '@blocksuite/store'
import type { Component } from 'atomico'
import { c, html, useEffect, useRef } from 'atomico'
import type { BlockSpec } from '@blocksuite/block-std'
import { InlineEditor } from '@blocksuite/inline'
import invariant from 'tiny-invariant'
import { usePath } from '../../hooks'
import type { BlockProps } from '../../types'

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
  content,
  model,
}) => {
  const path = usePath()
  const ref = useRef<HTMLDivElement>()
  useEffect(() => {
    invariant(model, 'Model is not found')
    invariant(ref.current)
    const editor = new InlineEditor(model.text.yText)
    editor.mount(ref.current)
    return () => {
      editor.unmount()
    }
  }, [])
  invariant(model)

  return html`<host data-ab-block=${model.id} path=${path}>
    <div ref=${ref}></div>
    ${content}
  </host>`
}
ParagraphBlockComponent.props = {
  content: Array,
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

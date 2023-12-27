import type { DeltaOperation } from '@blocksuite/store'
import type { UIEventStateContext } from '@blocksuite/block-std'
import { getStd } from '../../global'
import type { BlockElement } from '../../types'
import { getSelectedBlockElementsByRange } from './get-selected-blocks'

let joinDeltas: DeltaOperation[] | null = null
export function start(editorId: string) {
  return () => {
    const std = getStd(editorId)
    const textSelection = std.selection.find('text')
    if (!textSelection)
      return

    const { to } = textSelection
    if (!to)
      return

    const selection = window.getSelection()
    const range = selection?.getRangeAt(0)
    if (!range)
      return

    const blocks = getSelectedBlockElementsByRange(editorId, range, {
      mode: 'highest',
    })

    const start = blocks.at(0)
    const end = blocks.at(-1)
    if (!start || !end)
      return

    const startText = start.model.text
    const endText = end.model.text
    if (!startText || !endText)
      return

    requestAnimationFrame(() => {
      endText.delete(0, to.length)
      joinDeltas = endText.toDelta()

      std.page.transact(() => {
        blocks
          .slice(1)
          .forEach((block) => {
            std.page.deleteBlock(block.model)
          })
      })
    })
  }
}

export function end() {
  return (ctx: UIEventStateContext) => {
    const event = ctx.get('defaultState').event as CompositionEvent
    event.preventDefault()

    const selection = window.getSelection()
    const range = selection?.getRangeAt(0)
    if (!range || !range.collapsed)
      return

    if (!joinDeltas)
      return

    const block = range.startContainer.parentElement?.closest<BlockElement>('[data-ab-block]')
    if (!block)
      return

    const text = block.model.text
    if (!text)
      return

    joinDeltas.unshift({
      retain: text.length,
    })
    text.applyDelta(joinDeltas)

    joinDeltas = null
  }
}

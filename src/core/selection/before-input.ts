import type { UIEventStateContext } from '@blocksuite/block-std'
import { getStd } from '../../global'
import { getSelectedBlockElementsByRange } from './get-selected-blocks'

export function beforeInput(editorId: string) {
  return (ctx: UIEventStateContext) => {
    const std = getStd(editorId)

    const event = ctx.get('defaultState').event as InputEvent
    event.preventDefault()

    if (event.isComposing)
      return

    const textSelection = std.selection.find('text')
    if (!textSelection)
      return

    const { from, to } = textSelection
    if (!to)
      return

    const selection = window.getSelection()
    const range = selection?.getRangeAt(0)
    if (!range)
      return

    const blocks = getSelectedBlockElementsByRange(editorId, range)

    const start = blocks.at(0)
    const end = blocks.at(-1)
    if (!start || !end)
      return

    const startText = start.model.text
    const endText = end.model.text
    if (!startText || !endText)
      return

    std.page.transact(() => {
      const endIsSelectedAll = to.length === endText.length

      startText.delete(from.index, from.length)
      startText.insert(event.data ?? '', from.index)
      if (!endIsSelectedAll) {
        endText.delete(0, to.length)
        startText.join(endText)
      }

      blocks
        .slice(1)
        .reverse()
        .forEach((block) => {
          const parent = std.page.getParent(block.model)

          std.page.deleteBlock(block.model, parent
            ? {
                bringChildrenTo: parent,
              }
            : undefined)
        })

      requestAnimationFrame(() => {
        const newSelection = std.selection.create('text', {
          from: {
            path: from.path,
            index: from.index + (event.data?.length ?? 0),
            length: 0,
          },
          to: null,
        })
        std.selection.setGroup('note', [newSelection])
      })
    })
  }
}

import type { InlineRootElement } from '@blocksuite/inline/inline-editor'
import { INLINE_ROOT_ATTR } from '@blocksuite/inline/consts'
import type { BlockStdScope } from '@blocksuite/block-std'
import { rangeToTextSelection } from './range-to-text-selection'

export function onModelSelectionChange(std: BlockStdScope) {
  return () => {
    const selection = document.getSelection()
    if (!selection)
      return

    const textSelectionFromNative = rangeToTextSelection(std, selection)

    const textSelection = std.selection.find('text')
    if (!textSelection) {
      if (textSelectionFromNative)
        selection.removeAllRanges()
      return
    }
    if (textSelectionFromNative?.equals(textSelection))
      return

    const fromBlock = std.view.viewFromPath('block', textSelection.from.path)
    const toBlock = textSelection.to
      ? std.view.viewFromPath('block', textSelection.to.path)
      : null

    if (!fromBlock)
      return

    const fromInlineRoot = fromBlock.querySelector<InlineRootElement>(`[${INLINE_ROOT_ATTR}]`)
    if (!fromInlineRoot)
      return

    if (toBlock && textSelection.to) {
      const toInlineRoot = toBlock.querySelector<InlineRootElement>(`[${INLINE_ROOT_ATTR}]`)
      if (!toInlineRoot)
        return

      const anchorRange = fromInlineRoot.inlineEditor.toDomRange({
        index: textSelection.from.index,
        length: 0,
      })
      const focusRange = toInlineRoot.inlineEditor.toDomRange({
        index: textSelection.to.index + textSelection.to.length,
        length: 0,
      })

      if (!anchorRange || !focusRange)
        return

      const range = document.createRange()
      range.setStart(anchorRange.startContainer, anchorRange.startOffset)
      range.setEnd(focusRange.endContainer, focusRange.endOffset)

      selection.removeAllRanges()
      selection.addRange(range)
      return
    }

    const inlineRange = fromInlineRoot.inlineEditor.toDomRange({
      index: textSelection.from.index,
      length: textSelection.from.length,
    })
    if (!inlineRange)
      return

    const range = document.createRange()
    range.setStart(inlineRange.startContainer, inlineRange.startOffset)
    range.setEnd(inlineRange.endContainer, inlineRange.endOffset)

    selection.removeAllRanges()
    selection.addRange(range)
  }
}

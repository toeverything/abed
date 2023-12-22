import type { InlineRootElement } from '@blocksuite/inline/inline-editor'
import { INLINE_ROOT_ATTR } from '@blocksuite/inline/consts'
import type { BlockStdScope, TextSelection } from '@blocksuite/block-std'
import { getStd } from './global'
import type { BlockElement } from './types'

function rangeToTextSelection(std: BlockStdScope, selection: Selection): TextSelection | null {
  const rangeCount = selection.rangeCount
  if (rangeCount === 0)
    return null
  const range = selection.getRangeAt(0)

  if (!std.host.contains(range.commonAncestorContainer))
    return null

  const isRangeReversed
          = !!selection.anchorNode
          && !!selection.focusNode
          && (selection.anchorNode === selection.focusNode
            ? selection.anchorOffset > selection.focusOffset
            : selection.anchorNode.compareDocumentPosition(
              selection.focusNode,
            ) === Node.DOCUMENT_POSITION_PRECEDING)

  const clonedFragment = range.cloneContents()
  const selectedBlocksId = Array.from(clonedFragment.querySelectorAll('[data-ab-block]')).map((el) => {
    return el.getAttribute('data-ab-block')
  })
  if (selectedBlocksId.length === 0) {
    const block = range.commonAncestorContainer.parentElement?.closest<BlockElement>('[data-ab-block]')
    if (!block)
      return null
    selectedBlocksId.push(block.getAttribute('data-ab-block'))
  }

  const firstBlock = std.host.querySelector<BlockElement>(`[data-ab-block="${selectedBlocksId[0]}"]`)
  const lastBlock = std.host.querySelector<BlockElement>(`[data-ab-block="${selectedBlocksId[selectedBlocksId.length - 1]}"]`)
  if (!firstBlock || !lastBlock)
    return null

  const firstInlineRoot = firstBlock.querySelector<InlineRootElement>(`[${INLINE_ROOT_ATTR}]`)
  const lastInlineRoot = lastBlock.querySelector<InlineRootElement>(`[${INLINE_ROOT_ATTR}]`)

  if (!firstInlineRoot || !lastInlineRoot)
    return null

  const firstInlineRange = firstInlineRoot.inlineEditor.toInlineRange(range)
  const lastInlineRange = lastInlineRoot.inlineEditor.toInlineRange(range)

  if (!firstInlineRange)
    return null

  return std.selection.getInstance('text', {
    from: {
      path: firstBlock.path,
      index: firstInlineRange.index,
      length: firstInlineRange.length,
    },
    to: lastInlineRange
      ? {
          path: lastBlock.path,
          index: lastInlineRange.index,
          length: lastInlineRange.length,
        }
      : null,
    isReverse: isRangeReversed,
  })
}

export function bindSelection(editorId: string) {
  const std = getStd(editorId)

  const onSelectionChange = () => {
    const selection = document.getSelection()
    if (!selection) {
      std.selection.clear()
      return
    }

    const textSelection = rangeToTextSelection(std, selection)
    if (!textSelection) {
      std.selection.clear()
      return
    }

    std.selection.set([textSelection])
  }
  const unbindSelectionChange = std.event.add('selectionChange', onSelectionChange)

  const onStdSelectionChange = () => {
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
  const stdSelectionChangeDispose = std.selection.slots.changed.on(onStdSelectionChange)

  return () => {
    unbindSelectionChange()
    stdSelectionChangeDispose.dispose()
  }
}

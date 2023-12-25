import type { InlineRootElement } from '@blocksuite/inline/inline-editor'
import { INLINE_ROOT_ATTR } from '@blocksuite/inline/consts'
import type { BlockStdScope, TextSelection } from '@blocksuite/block-std'
import type { BlockElement } from '../../types'

export function rangeToTextSelection(std: BlockStdScope, selection: Selection): TextSelection | null {
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

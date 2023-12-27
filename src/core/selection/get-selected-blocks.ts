import invariant from 'tiny-invariant'
import type { BlockElement } from '../../types'
import { getStd } from '../../global'

export function getSelectedBlockElementsByRange(
  editorId: string,
  range: Range,
  options: {
    match?: (el: BlockElement) => boolean
    mode?: 'all' | 'flat' | 'highest'
  } = {},
): BlockElement[] {
  const { match = () => true } = options
  const std = getStd(editorId)
  const selector = '[data-ab-block]'

  let result = Array
    .from<BlockElement>(std.host.querySelectorAll(selector))
    .filter(el => range.intersectsNode(el) && match(el))

  if (result.length === 0)
    return []

  const rangeStartElement
    = range.startContainer instanceof Element
      ? range.startContainer
      : range.startContainer.parentElement
  const firstElement = rangeStartElement?.closest(selector)
  invariant(firstElement)

  result = result.filter(el =>
    firstElement.compareDocumentPosition(el)
    & Node.DOCUMENT_POSITION_FOLLOWING || el === firstElement)

  return result
}

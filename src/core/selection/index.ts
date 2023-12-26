import invariant from 'tiny-invariant'
import type { DeltaOperation } from '@blocksuite/store'
import { getStd } from '../../global'
import type { BlockElement } from '../../types'
import { onModelSelectionChange } from './selection-model-change'
import { onSelectionChange } from './selection-change'

function getSelectedBlockElementsByRange(
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

export function bindSelection(editorId: string) {
  const std = getStd(editorId)

  const unbindSelectionChange = std.event.add('selectionChange', onSelectionChange(std))

  const modelSelectionChangeDispose = std.selection.slots.changed.on(onModelSelectionChange(std))
  const unbindBeforeInput = std.event.add('beforeInput', (ctx) => {
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
        const newSelection = std.selection.getInstance('text', {
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
  })

  let joinDeltas: DeltaOperation[] | null = null
  const unbindCompositionStart = std.event.add('compositionStart', () => {
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
  })
  const unbindCompositionEnd = std.event.add('compositionEnd', (ctx) => {
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
  })

  return () => {
    unbindSelectionChange()
    unbindBeforeInput()
    unbindCompositionStart()
    unbindCompositionEnd()
    modelSelectionChangeDispose.dispose()
  }
}

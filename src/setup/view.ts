import invariant from 'tiny-invariant'
import { getStd } from '../global'
import type { BlockElement, WidgetElement } from '../types'

function fromDOM<T extends Element & { path: string[] }>(
  node: Node,
  target: string,
  notInside: string,
  type: BlockSuite.ViewType,
) {
  const selector = `[${target}]`
  const notInSelector = `[${notInside}]`
  const element
    = node && node instanceof HTMLElement ? node : node.parentElement
  if (!element)
    return null

  const view = element.closest<T>(selector)
  if (!view)
    return null

  const not = element.closest(notInSelector)
  if (view.contains(not))
    return null

  const id = view.getAttribute(target)
  invariant(id, 'View id is not found')

  return {
    id,
    path: view.path,
    view,
    type,
  }
}

function getChildren(
  node: Element,
  blockSelector: string,
  widgetSelector: string,
  type: BlockSuite.ViewType,
) {
  const selector = `[${blockSelector}],[${widgetSelector}]`
  return Array.from(
    node.querySelectorAll(selector),
  ).filter(
    x =>
      x.parentElement?.closest(
        type === 'block' ? `[${blockSelector}]` : `[${widgetSelector}]`,
      ) === node,
  )
}

export function registerView(editorId: string) {
  const blockSelector = 'data-ab-block'
  const widgetSelector = 'data-ab-widget'
  const std = getStd(editorId)

  std.view.register<'block'>({
    type: 'block',
    fromDOM: node =>
      fromDOM<BlockElement>(
        node,
        blockSelector,
        widgetSelector,
        'block',
      ),
    toDOM: ({ view }) => view,
    getChildren: node =>
      getChildren(node, blockSelector, widgetSelector, 'block'),
  })

  std.view.register<'widget'>({
    type: 'widget',
    fromDOM: node =>
      fromDOM<WidgetElement>(
        node,
        widgetSelector,
        blockSelector,
        'widget',
      ),
    toDOM: ({ view }) => view,
    getChildren: node =>
      getChildren(node, widgetSelector, blockSelector, 'widget'),
  })
}

declare global {
  // eslint-disable-next-line ts/no-namespace
  namespace BlockSuite {
    interface NodeViewType {
      block: BlockElement
      widget: WidgetElement
    }
  }
}

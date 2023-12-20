import type { BaseBlockModel, Page } from '@blocksuite/store'
import invariant from 'tiny-invariant'
import { html } from 'atomico'
import { getStd } from './global.ts'

export function renderPage(page: Page) {
  const { root } = page
  invariant(root, 'Root is not found')
  return renderModel(root)
}

function renderModel(model: BaseBlockModel): string {
  const std = getStd()
  const view = std.spec.getView(model.flavour)
  invariant(view, `View for ${model.flavour} is not found`)
  const tag = view.component
  const content = model.children.map(child => renderModel(child))
  return html`<${tag} content=${content} model=${model}></${tag}>`
}

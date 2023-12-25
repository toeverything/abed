import type { BaseBlockModel } from '@blocksuite/store'
import invariant from 'tiny-invariant'
import { html } from 'atomico'
import { getStd } from './global'

export function renderPage(editorId: string) {
  const page = getStd(editorId).page
  const { root } = page
  if (!root)
    return null

  return renderModel(editorId, root)
}

export function renderChildren(editorId: string, model: BaseBlockModel) {
  return model.children.map(child => renderModel(editorId, child))
}

function renderModel(editorId: string, model: BaseBlockModel): string {
  const std = getStd(editorId)
  const view = std.spec.getView(model.flavour)
  invariant(view, `View for ${model.flavour} is not found`)
  const tag = view.component
  return html`<${tag} key=${model.id} editorId=${editorId} model=${model}></${tag}>`
}

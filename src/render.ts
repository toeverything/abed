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

function renderModel(editorId: string, model: BaseBlockModel): string {
  const std = getStd(editorId)
  const view = std.spec.getView(model.flavour)
  invariant(view, `View for ${model.flavour} is not found`)
  const tag = view.component
  const content = model.children.map(child => renderModel(editorId, child))
  return html`<${tag} editorId=${editorId} content=${content} model=${model}></${tag}>`
}

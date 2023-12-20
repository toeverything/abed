import { internalPrimitives } from '@blocksuite/store'
import { BlockStdScope } from '@blocksuite/block-std'
import { page, setStd, workspace } from './global.ts'
import { specs } from './blocks'

export function setup(host: HTMLElement) {
  const std = new BlockStdScope({
    host,
    workspace,
    page,
  })
  std.spec.applySpecs(specs)
  setStd(std)
  return page.load().then(() => {
    const docId = page.addBlock('ab:doc')
    const noteId = page.addBlock('ab:note', {}, docId)
    page.addBlock('ab:paragraph', {
      text: internalPrimitives.Text('Hello, Atom Block Editor!'),
    }, noteId)
  })
}

import { internalPrimitives } from '@blocksuite/store'
import { BlockStdScope } from '@blocksuite/block-std'
import { page, setStd, workspace } from './global.ts'
import { specs } from './blocks'

export async function setup(host: HTMLElement) {
  const std = new BlockStdScope({
    host,
    workspace,
    page,
  })
  std.spec.applySpecs(specs)
  setStd(std)

  await page.load()

  const docId = page.addBlock('ab:doc')
  const noteId = page.addBlock('ab:note', {}, docId)
  page.addBlock('ab:paragraph', {
    text: internalPrimitives.Text('Good morning'),
  }, noteId)
  page.addBlock('ab:paragraph', {
    text: internalPrimitives.Text('Show me the place where he inserted the blade'),
  }, noteId)
  page.addBlock('ab:paragraph', {
    text: internalPrimitives.Text('Or praise the Lord, burn my house'),
  }, noteId)
  page.addBlock('ab:paragraph', {
    text: internalPrimitives.Text('I get lost, I freak out'),
  }, noteId)
}

import { Generator, Schema, Workspace, createMemoryStorage } from '@blocksuite/store'
import { createBroadcastChannelProvider } from '@blocksuite/store/providers/broadcast-channel'
import { BlockStdScope } from '@blocksuite/block-std'
import { getStd, setStd } from '../global'
import { schemas, specs } from '../blocks'
import { registerView } from './view'

function setupStd(editorId: string, host: HTMLElement) {
  const schema = new Schema()
  schema.register(schemas)
  const workspace = new Workspace({
    id: editorId,
    schema,
    providerCreators: [createBroadcastChannelProvider],
    idGenerator: Generator.NanoID,
    blobStorages: [createMemoryStorage],
  })
  const page = workspace.createPage({ id: 'home' })
  const std = new BlockStdScope({
    host,
    workspace,
    page,
  })
  std.spec.applySpecs(specs)
  setStd(editorId, std)
}

export async function setup(editorId: string, host: HTMLElement) {
  setupStd(editorId, host)

  registerView(editorId)

  const std = getStd(editorId)
  const page = std.page
  await page.load()
}

import { Generator, Schema, Workspace, createMemoryStorage } from '@blocksuite/store'
import { createBroadcastChannelProvider } from '@blocksuite/store/providers/broadcast-channel'
import type { BlockStdScope } from '@blocksuite/block-std'
import invariant from 'tiny-invariant'
import { schemas } from './blocks'

export const id = crypto.randomUUID()
export const schema = new Schema()
schema.register(schemas)

export const workspace = new Workspace({
  id,
  schema,
  providerCreators: [createBroadcastChannelProvider],
  idGenerator: Generator.NanoID,
  blobStorages: [createMemoryStorage],
})
export const page = workspace.createPage({ id: 'home' })

let _std: BlockStdScope | null = null

export function setStd(std: BlockStdScope) {
  _std = std
}

export function getStd() {
  invariant(_std, 'Std is not ready')
  return _std
}

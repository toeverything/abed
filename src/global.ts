import type { BlockStdScope } from '@blocksuite/block-std'
import { Schema } from '@blocksuite/store'
import invariant from 'tiny-invariant'
import { schemas } from './blocks'

export const id = crypto.randomUUID()
export const schema = new Schema()
schema.register(schemas)

const _stdMap: Map<string, BlockStdScope> = new Map()

export function setStd(editorId: string, std: BlockStdScope) {
  _stdMap.set(editorId, std)
}

export function getStd(editorId: string) {
  const _std = _stdMap.get(editorId)
  invariant(_std, 'Std is not ready')
  return _std
}

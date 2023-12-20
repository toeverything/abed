import type { BlockSpec } from '@blocksuite/block-std'
import { DocBlockSpec } from './doc'
import { NoteBlockSpec } from './note'
import { ParagraphBlockSpec } from './paragraph'

export const specs: BlockSpec[] = [
  DocBlockSpec,
  NoteBlockSpec,
  ParagraphBlockSpec,
]

export const schemas = specs.map(spec => spec.schema)

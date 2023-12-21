import type { BaseBlockModel } from '@blocksuite/store'
import type { AtomicoThis } from 'atomico/types/dom'

export type BlockProps<Model extends BaseBlockModel = BaseBlockModel, Rest extends object = object> = Rest & {
  content: string[]
  model: Model
  path: string[]
}

export type WidgetProps<Rest extends object = object> = Rest & {
  path: string[]
}

export type BlockElement = AtomicoThis<BlockProps, HTMLElement & BlockProps>
export type WidgetElement = AtomicoThis<WidgetProps, HTMLElement & WidgetProps>

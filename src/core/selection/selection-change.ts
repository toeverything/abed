import type { BlockStdScope } from '@blocksuite/block-std'
import { rangeToTextSelection } from './range-to-text-selection'

export function onSelectionChange(std: BlockStdScope) {
  return () => {
    const selection = document.getSelection()
    if (!selection) {
      std.selection.clear()
      return
    }

    const textSelection = rangeToTextSelection(std, selection)
    if (!textSelection) {
      std.selection.clear()
      return
    }

    std.selection.set([textSelection])
  }
}

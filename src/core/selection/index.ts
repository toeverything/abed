import { getStd } from '../../global'
import { onModelSelectionChange } from './selection-model-change'
import { onSelectionChange } from './selection-change'
import { beforeInput } from './before-input'
import { end, start } from './composition'

export function bindSelection(editorId: string) {
  const std = getStd(editorId)

  const unbindSelectionChange = std.event.add('selectionChange', onSelectionChange(std))

  const modelSelectionChangeDispose = std.selection.slots.changed.on(onModelSelectionChange(std))
  const unbindBeforeInput = std.event.add('beforeInput', beforeInput(editorId))

  const unbindCompositionStart = std.event.add('compositionStart', start(editorId))
  const unbindCompositionEnd = std.event.add('compositionEnd', end())

  return () => {
    unbindSelectionChange()
    unbindBeforeInput()
    unbindCompositionStart()
    unbindCompositionEnd()
    modelSelectionChangeDispose.dispose()
  }
}

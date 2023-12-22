import { getStd } from './global'

export function bindSelection(editorId: string) {
  const std = getStd(editorId)
  const onSelectionChange = () => {
    const selection = document.getSelection()
    if (!selection) {
      std.selection.clear()
      return
    }
    const rangeCount = selection.rangeCount
    if (rangeCount === 0) {
      std.selection.clear()
      return
    }
    const range = selection.getRangeAt(0)
    if (!std.host.contains(range.commonAncestorContainer))
      return

    // TODO: handle ranges
    return true
  }
  const unbind = std.event.add('selectionChange', onSelectionChange)

  return () => {
    unbind()
  }
}

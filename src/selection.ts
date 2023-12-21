import { getStd } from './global'

export function bindSelection() {
  const std = getStd()
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

import { useEffect, useHost, useState } from 'atomico'
import { getStd } from '../global'

export function usePath(editorId: string) {
  const host = useHost()
  const [path, setPath] = useState<string[]>([])
  useEffect(() => {
    const std = getStd(editorId)
    const path = std.view.calculatePath(host.current)

    setPath(path)
  }, [])
  return path
}

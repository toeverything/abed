import { useEffect, useHost, useState } from 'atomico'
import { getStd } from '../global'

export function usePath() {
  const host = useHost()
  const [path, setPath] = useState<string[]>([])
  useEffect(() => {
    const std = getStd()
    const path = std.view.calculatePath(host.current)

    setPath(path)
  }, [])
  return path
}

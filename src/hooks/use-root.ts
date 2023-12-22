import { useEffect, useHost, useState } from 'atomico'
import invariant from 'tiny-invariant'

export function useRoot() {
  const host = useHost()
  const [root, setRoot] = useState<HTMLElement | null>(null)
  useEffect(() => {
    const root = host.current.closest<HTMLElement>('ab-editor')
    invariant(root, 'Root is not found')
    setRoot(root)
  }, [])
  return root
}

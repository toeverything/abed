import type { BaseBlockModel } from '@blocksuite/store/src/index'
import { useEffect, useUpdate } from 'atomico'

export function useModelUpdate(model: BaseBlockModel) {
  const update = useUpdate()
  useEffect(() => {
    const disposeChildrenUpdated = model.childrenUpdated.on(update)
    const disposePropsUpdated = model.propsUpdated.on(update)
    return () => {
      disposeChildrenUpdated.dispose()
      disposePropsUpdated.dispose()
    }
  }, [model])
}

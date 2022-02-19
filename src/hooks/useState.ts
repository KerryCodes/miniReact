import { Fiber, rootFiberNode } from "../fiber"
import { performSyncWorkOnRoot, performConcurrentWorkOnRoot } from "../renderer"


function useState<T>(initialState: T) {
  const rootFiber = {...rootFiberNode.current}
  rootFiberNode.current.alternate= rootFiber
  performConcurrentWorkOnRoot(rootFiber)
  // performSyncWorkOnRoot(rootFiber)
}


export { useState }
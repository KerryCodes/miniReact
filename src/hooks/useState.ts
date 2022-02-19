import { Fiber, rootFiberNode } from "../fiber"
import { performSyncWorkOnRoot, performConcurrentWorkOnRoot } from "../renderer"


function useState() {
  const current = rootFiberNode.current
  const rootFiber = {...current}
  //@ts-ignore
  rootFiberNode.current.alternate= rootFiber
  performConcurrentWorkOnRoot(rootFiber)
  // performSyncWorkOnRoot(rootFiber)
}


export { useState }
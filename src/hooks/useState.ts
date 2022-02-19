import { Fiber, rootFiberNode } from "../fiber"
import { startWorkSync, startWorkConcurrent } from "../renderer"


function useState() {
  const current = rootFiberNode.current
  const rootFiber = {...current}
  //@ts-ignore
  rootFiberNode.current.alternate= rootFiber
  startWorkConcurrent(rootFiber)
  // startWorkSync(rootFiber)
}


export { useState }
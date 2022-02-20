import { Fiber, rootFiberNode } from "../fiber"
import { currentComponent } from "../reconciler"
import { performSyncWorkOnRoot, performConcurrentWorkOnRoot } from "../renderer"


let currentIndex= -1


function getHookState(index: number, type: 'useState' | 'useMemo' | 'useEffect') {
  currentComponent
}


function recoverIndex() {
  currentIndex= -1
}


function useState<T>(initialState: T) {
  currentIndex++
  if (rootFiberNode.current === null) {
    currentComponent.hooks.push('useState')
    currentComponent.memoizedState.push(initialState)
    currentComponent.dependencies.push([])
  }
  const setState = (index: number, currentComponent:any, newState: T) => {
    currentComponent.memoizedState[index] = newState
    currentComponent.effectTag = 'UPDATE'
    rootFiberNode.rootFiberWorkInProgress = {
      ...rootFiberNode.current,
      alternate: rootFiberNode.current,
    }
    rootFiberNode.current.alternate= rootFiberNode.rootFiberWorkInProgress
    performConcurrentWorkOnRoot()
    // performSyncWorkOnRoot()
  }
  //@ts-ignore
  return [currentComponent.memoizedState[currentIndex], setState.bind(this, currentIndex, currentComponent)]
}


export { useState, recoverIndex }
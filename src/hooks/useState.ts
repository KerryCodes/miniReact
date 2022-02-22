import { dispatchAction, HooksDispatcherOnMount, HooksDispatcherOnUpdate, mountWorkInProgressHook } from ".";
import { currentlyRenderingFiber } from "../reconciler";
import { updateReducer } from "./useReducer";


export function useState(initialState: Function | any) {
  if (currentlyRenderingFiber.alternate === null) {
    return HooksDispatcherOnMount.useState(initialState)
  } else {
    return HooksDispatcherOnUpdate.useState(initialState)
  }
}


export function mountState (initialState: Function | any) {
  if (typeof initialState === 'function') {
    initialState = initialState()
  }
  // 获取当前的Hook节点，同时将当前Hook添加到Hook链表中
  const hook = mountWorkInProgressHook()

  hook.memoizedState = hook.baseState = initialState
  hook.queue = {
    last: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState,
  }
  hook.queue.dispatch = dispatchAction.bind(null, currentlyRenderingFiber, hook.queue)
  
  return [hook.memoizedState, hook.queue.dispatch]
}


export function updateState(initialState: Function | any) {
  return updateReducer(basicStateReducer, initialState)
}


function basicStateReducer(oldState: any, action: Function | any){
  return typeof action === 'function' ? action(oldState) : action
} 
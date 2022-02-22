import { dispatchAction, mountWorkInProgressHook, updateWorkInProgressHook } from "."
import { currentlyRenderingFiber } from "../reconciler";


export function mountReducer(
  reducer: (oldState: any, action: Function | any) => any,
  initialArg: any,
  init?: any
) {
  // 获取当前的Hook节点，同时将当前Hook添加到Hook链表中
  const hook = mountWorkInProgressHook()
  let initialState = init === undefined ? initialArg : init(initialArg)

  hook.memoizedState = hook.baseState = initialState
  hook.queue = {
    last: null,
    dispatch: null,
    lastRenderedReducer: reducer,
    lastRenderedState: initialState,
  }
  hook.queue.dispatch= dispatchAction.bind(null, currentlyRenderingFiber, hook.queue)

  return [hook.memoizedState, hook.queue.dispatch];
}


export function updateReducer(
  reducer: (oldState: any, action: Function | any) => any,
  initialArg: any,
  init?: any
) {
  const hook = updateWorkInProgressHook()
  const queue = hook.queue
  // 拿到更新列表的表头
  const { last, dispatch } = queue
  // 获取最早的那个update对象
  const first = last !== null ? last.next : null

  if (first !== null) {
    let newState
    let update = first
    do {
      // 执行每一次更新，去更新状态
      const action = update.action
      newState = reducer(newState, action)
      update = update.next;
    } while (update !== null && update !== first)
    hook.memoizedState = newState;
  }

  // 返回最新的状态和修改状态的方法
  return [hook.memoizedState, dispatch];
}
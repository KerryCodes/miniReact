export function scheduleDeferredCallback() {
  // requestIdleCallback(callback0, { timeout: 10000 })
  requestAnimationFrame(callback1)
}

window.addEventListener('message', e => {
  if (e.source === window && e.data.from === 'me') {
    const { timestamp }= e.data
    console.log('e:', timestamp, performance.now()-timestamp);
    
  }
  
})

function callback0(deadline: IdleDeadline) {
  console.log('requestIdleCallback/deadline:', deadline.didTimeout, 'requestIdleCallback/timeRemaining:', deadline.timeRemaining());
  
}

function callback1(timestamp: DOMHighResTimeStamp) {
  console.log('requestAnimationFrame/timestamp:', timestamp);
  const arr= []
  for (let i = 0; i < 10000000; i++){
    arr.push(i)
  }
  window.postMessage({ from: 'me', timestamp })
  // requestAnimationFrame(callback1)
}
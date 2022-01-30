import { TFiber, TReactElement } from "../interface";


export class Fiber implements TFiber{
  type: TReactElement.Type
  props: TReactElement.Props
  dom: Element= null
  parent: TFiber
  sibling: TFiber
  constructor(element: TReactElement.Jsx, parent: TFiber, preSibling?: TFiber) {
    this.type = element.type
    this.props = element.props
    this.parent = parent
    if(preSibling){
      preSibling.sibling= this
    }
  }
}
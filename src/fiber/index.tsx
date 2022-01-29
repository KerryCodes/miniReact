import { TFiber, TReactElement } from "../interface";


export class Fiber implements TFiber{
  type: TReactElement.Type
  props: TReactElement.Props
  parent: TFiber
  dom: Element= null
  constructor(element: TReactElement.Jsx, parent: TFiber) {
    this.type = element.type
    this.props = element.props
    this.parent = parent
  }
}
import { TReactElement } from "../interface";


export function render(reactElement: TReactElement.Jsx, rootNode: Element | Text | DocumentFragment){
  const { type, props }= reactElement
  const { children, ...attributes }= props
  let dom: Element | Text | DocumentFragment

  switch(type){
    case 'TEXT_ELEMENT':
      dom= document.createTextNode('')
      break;
    case 'Fragment':
      dom= document.createDocumentFragment()
      break;
    default:
      dom= document.createElement(type as string)
  }

  Reflect.ownKeys(attributes).forEach(key => {
    //@ts-ignore
    dom[key]= attributes[key]
  })
  props.children.map(item => render(item, dom))
  rootNode.appendChild(dom)
}
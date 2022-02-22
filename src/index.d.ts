declare namespace JSX {  
  interface IntrinsicElements {
    [key: string]: any
  }
  type Type = string | Function
  type Props = {
    [key: string]: any
  }
  type Children = {
    type: Type,
    props: Props,
  }[]
  
}


declare namespace ReactElement {
  export type Type = "TEXT_ELEMENT" | string | FC
  export type FC = Function
  export interface Jsx{
    type: Type,
    props: Props,
  }
  export interface Props{
    [attribute: string]: any,
    children?: Jsx[],
  }
}


declare namespace React{
  export interface Props{
    [attribute: string]: any,
    children?: ReactElement.Jsx[],
  }
}
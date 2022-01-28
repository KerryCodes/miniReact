export namespace TReactElement {
  export type Type = "TEXT_ELEMENT" | string | FC
  export type FC = Function
  
  export interface Jsx{
    type: Type,
    props: Props,
  }
  
  export interface Props{
    [key: string]: any,
    children: Jsx[],
  }
}


export namespace TReact{
  export interface Props{
    [key: string]: any,
    child?: {
      type: 'Fragment',
      props: {
        children: TReactElement.Jsx[],
      },
    },
  }
}
export type TReactElementType= "TEXT_ELEMENT" | string | React.FC

export interface TTReactElementProps{
  [key: string]: any,
  children: TReactElement[] | [],
}

export interface TReactElement{
  type: TReactElementType,
  props: TTReactElementProps,
}



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
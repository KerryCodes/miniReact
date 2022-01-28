declare module JSX {  
  interface IntrinsicElements {
    [key: string]: any
  }
}


declare namespace React {
  type FC= Function
}


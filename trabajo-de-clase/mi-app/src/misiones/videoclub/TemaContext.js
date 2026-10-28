import { createContext } from "react";

// Canal del tema: cualquier componente de dentro lo lee con useContext, sin pasarlo por props
export const TemaContext = createContext({ tema: "claro", alternarTema: () => {} });

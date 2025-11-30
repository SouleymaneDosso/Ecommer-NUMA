import { createContext, useState } from "react";


export const ThemeContext = createContext();

export const ToggleTheme = ({children})=>{
    const [theme, setTheme]= useState("dark")
    const themeToglle = ()=>{
        setTheme((prev)=>(prev ==="dark" ? "light":"dark"))
    }
    return(
       <ThemeContext.Provider value={{theme,themeToglle }} >
        {children}
       </ThemeContext.Provider> 
    )

}


export const ContextLangue = createContext();

export const LangueTheme = ({children})=>{
    const [langue, setLangue] = useState("fr")
    const toggleLangue = ()=>{
        setLangue((prev)=>(prev === "en" ? "fr" : "en"))
    }
    return(
    <ContextLangue.Provider value={{langue, toggleLangue }} >
        {children}
    </ContextLangue.Provider>
    )
}
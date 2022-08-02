import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  isInputError?: boolean;
}

import styles from "./styles.module.scss";

export function Input({ isInputError, ...props }: InputProps) {
  return(
    <input 
      {...props} 
      className={
        `${styles.input} ${isInputError && styles.inputError}`
      } 
    />
  );
}
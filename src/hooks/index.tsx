import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { SignInFormModalContext } from "../contexts/SignInFormContext";
import { SignUpFormModalContext } from "../contexts/SignUpFormContext";

export function useAuth() {
    return useContext(AuthContext);
}

export function useSignInFormModal() {
    return useContext(SignInFormModalContext);
}

export function useSignUpFormModal() {
    return useContext(SignUpFormModalContext);
}
import { createContext, ReactNode, useState } from "react";
import { useSignUpFormModal } from "../hooks";

interface SignInFormModalProviderProps {
    children: ReactNode
}

interface SignInFormModalContextData {
    isSignInFormModalOpen: boolean;
    onCloseSignInFormModal: () => void;
    openSignInFormModal: () => void;
}

export const SignInFormModalContext = createContext<SignInFormModalContextData>({} as SignInFormModalContextData);

export const SignInFormModalContextProvider = ({ children }: SignInFormModalProviderProps) => {
    const [isSignInFormModalOpen, setIsSignInFormModalOpen] = useState(false);
    const { onCloseSignUpFormModal } = useSignUpFormModal();

    function onCloseSignInFormModal() {
        setIsSignInFormModalOpen(false);
    }

    function openSignInFormModal() {
        setIsSignInFormModalOpen(true);
    }

    return (
        <SignInFormModalContext.Provider value={{
            isSignInFormModalOpen,
            onCloseSignInFormModal,
            openSignInFormModal,
        }}>
            {children}
        </SignInFormModalContext.Provider>
    );
}
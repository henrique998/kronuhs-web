import { createContext, ReactNode, useState } from "react";

interface SignUpFormModalProviderProps {
    children: ReactNode
}

interface SignUpFormModalContextData {
    isSignUpFormModalOpen: boolean;
    onCloseSignUpFormModal: () => void;
    openSignUpFormModal: () => void;
}

export const SignUpFormModalContext = createContext<SignUpFormModalContextData>(
    {} as SignUpFormModalContextData
);

export const SignUpFormModalContextProvider = ({ children }: SignUpFormModalProviderProps) => {
    const [isSignUpFormModalOpen, setIsSignUpFormModalOpen] = useState(false);

    function onCloseSignUpFormModal() {
        setIsSignUpFormModalOpen(false);
    }

    function openSignUpFormModal() {
        setIsSignUpFormModalOpen(true);
    }

    return (
        <SignUpFormModalContext.Provider value={{
            isSignUpFormModalOpen,
            onCloseSignUpFormModal,
            openSignUpFormModal
        }}>
            {children}
        </SignUpFormModalContext.Provider>
    );
}
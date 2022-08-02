import { ReactNode } from "react";
import { AuthContextProvider } from "./AuthContext";
import { SignInFormModalContextProvider } from "./SignInFormContext";
import { SignUpFormModalContextProvider } from "./SignUpFormContext";

interface ProvidersProps {
    children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
    return (
        <AuthContextProvider>
            <SignInFormModalContextProvider>
                <SignUpFormModalContextProvider>
                    {children}
                </SignUpFormModalContextProvider>
            </SignInFormModalContextProvider>
        </AuthContextProvider>
    );
}
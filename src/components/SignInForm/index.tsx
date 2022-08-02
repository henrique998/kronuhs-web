import { XCircle } from 'phosphor-react';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import Modal from 'react-modal'
import { useAuth, useSignInFormModal, useSignUpFormModal } from '../../hooks';
import { Button } from '../Button';
import { Input } from "../Input";
import styles from "./styles.module.scss";

export function SignInForm() {
    const { isSignInFormModalOpen, onCloseSignInFormModal } = useSignInFormModal();
    const { openSignUpFormModal } = useSignUpFormModal();
    const { signIn, githubAuth } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isEmailEmpty, setIsEmailEmpty] = useState(false);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);

    function showSignUpFormModal() {
        onCloseSignInFormModal();
        openSignUpFormModal();
    };

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (email === '') {
            setIsEmailEmpty(true);
            
            toast.error("O campo email é obrigatório", {
                position: 'top-left'
            });
        } else if (password === '') {
            setIsPasswordEmpty(true);

            toast.error("O campo password é obrigatório", {
                position: 'top-left'
            });
        } else {
            await signIn({
                email,
                password
            });
    
            setEmail("");
            setPassword("");
            onCloseSignInFormModal();
        }
    };

    return (
        <Modal
            isOpen={isSignInFormModalOpen}
            onRequestClose={onCloseSignInFormModal}
            ariaHideApp={false}
            overlayClassName={styles.modalOverlay}
            className={styles.modalContent}
        >
            <button
                className={styles.closeButton}
                onClick={onCloseSignInFormModal}
            >
                <XCircle />
            </button>

            <h1>Faça <span>login</span> em sua conta!</h1>

            <form onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label htmlFor="name">E-mail</label>
                    <Input
                        type="email"
                        placeholder="Seu email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onFocus={() => setIsEmailEmpty(false)}
                        isInputError={isEmailEmpty}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="name">Senha</label>
                    <Input
                        type="password"
                        placeholder="Sua senha"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onFocus={() => setIsPasswordEmpty(false)}
                        isInputError={isPasswordEmpty}
                    />
                </div>

                <Button type="submit" bgColor="green" title="Entrar" />
            </form>

            <div className={styles.or}>OU</div>

            <div className={styles.verifyContainer}>
                Não possui uma conta?
                <button
                    onClick={showSignUpFormModal}
                    className={styles.sign}
                >
                    Criar conta
                </button>
            </div>
        </Modal>
    );
}
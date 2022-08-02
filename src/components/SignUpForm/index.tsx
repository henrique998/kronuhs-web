import { XCircle } from 'phosphor-react';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import Modal from 'react-modal'

import { useAuth, useSignInFormModal, useSignUpFormModal } from '../../hooks';
import { validateEmail, validatePassword } from '../../utils/validateInputs';
import { Button } from '../Button';
import { Input } from "../Input";
import styles from "./styles.module.scss";

export function SignUpForm() {
    const { isSignUpFormModalOpen, onCloseSignUpFormModal, } = useSignUpFormModal();
    const { openSignInFormModal } = useSignInFormModal();

    const { createAccount, githubAuth } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isNameErr, setIsNameErr] = useState(false);
    const [isEmailErr, setIsEmailErr] = useState(false);
    const [isPasswordErr, setIsPasswordErr] = useState(false);

    function showSignInFormModal() {
        onCloseSignUpFormModal();
        openSignInFormModal();
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (name === '') {
            setIsNameErr(true)

            toast.error("O campo nome é obrigatório", {
                position: 'top-left'
            });
        } else if (!validateEmail.test(email)) {
            setIsEmailErr(true)

            toast.error("Por favor, insira um email válido", {
                position: 'top-left'
            });
        } else if(!validatePassword.test(password)) {
            setIsPasswordErr(true)

            toast.error("Por favor, insira uma senha mais segura", {
                position: 'top-left'
            });
        } else {
            await createAccount({
                name,
                email,
                password
            });

            setIsEmailErr(false);
            setIsPasswordErr(false);
            
            setName("");
            setEmail("");
            setPassword("");
    
            showSignInFormModal();
        }
    }

    return (
        <Modal 
            isOpen={isSignUpFormModalOpen}
            onRequestClose={onCloseSignUpFormModal}
            ariaHideApp={false}
            overlayClassName={styles.modalOverlay}
            className={styles.modalContent}
        >
            <button 
                className={styles.closeButton}
                onClick={onCloseSignUpFormModal}
            >
                <XCircle />
            </button>

            <h1>Inscreva-se <span>Agora!</span></h1>

            <form onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label htmlFor="name">Nome</label>
                    <Input 
                        type="text" 
                        placeholder="Seu nome" 
                        value={name}
                        isInputError={isNameErr}
                        onFocus={() => setIsNameErr(false)}
                        onChange={e => setName(e.target.value)}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="name">E-mail</label>
                    <Input 
                        type="text" 
                        placeholder="Seu email"
                        value={email}
                        isInputError={isEmailErr}
                        onFocus={() => setIsEmailErr(false)}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="name">Senha</label>
                    <Input 
                        type="password" 
                        placeholder="Sua senha"
                        value={password}
                        isInputError={isPasswordErr}
                        onFocus={() => setIsPasswordErr(false)}
                        onChange={e => setPassword(e.target.value)}
                    />          
                </div>

                <Button type="submit" bgColor="green" title="Inscrever-se" />
            </form>

            <div className={styles.or}>OU</div>

            <div className={styles.verifyContainer}>
                Já possui uma conta? 
                <button 
                    onClick={showSignInFormModal}
                    className={styles.sign}
                >Faça login</button>
            </div>
        </Modal>
    );
}
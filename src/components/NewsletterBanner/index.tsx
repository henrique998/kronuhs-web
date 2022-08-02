import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../services/api";
import { validateEmail } from "../../utils/validateInputs";
import styles from "./styles.module.scss";

export function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [isEmailErr, setIsEmailErr] = useState(false);

  async function handleSubscribe(e: FormEvent) {
    e.preventDefault();

    if (email === '') {
      setIsEmailErr(true);

      toast.error("O campo email é obrigatório", {
        position: 'top-left'
      });
    } else if (!validateEmail.test(email)) {
      setIsEmailErr(true);

      toast.error("Por favor, insira um email válido", {
        position: 'top-left'
      });
    } else {
      setIsEmailErr(false);

      try {
        const response = await api.post("/blog/newsletter", {
          email
        })
        
        setEmail('');
  
        toast.success(response.data.message, {
          position: 'top-left'
        });
      } catch (err) {
        toast.error(err.response.data.message, {
          position: 'top-left'
        });
      }
    }
  };
  
  return (
    <div className={styles.container}>
      <h3>Quer receber tutoriais semanalmente?</h3>

      <h2>Inscreva-se na nossa newsletter</h2>

      <form onSubmit={handleSubscribe}>
        <input 
          type="text"
          placeholder="Seu e-mail..."
          value={email}
          onChange={e => setEmail(e.target.value)}
          onFocus={() => setIsEmailErr(false)}
          className={isEmailErr ? styles.inputError : ''}
        />

        <button type="submit">
          Inscrever-se
        </button>
      </form>
    </div>
  );
}
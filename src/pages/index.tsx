/* eslint-disable @next/next/no-img-element */
import { parseISO } from "date-fns";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { MostSeenPostsSlider } from "../components/MostSeenPosts";
import { NewsletterBanner } from "../components/NewsletterBanner";
import { PostCard } from "../components/PostCard";
import { api } from "../services/api";
import styles from "../styles/Home.module.scss";
import { formAtDate } from "../utils/formatDate";
import { validateEmail } from "../utils/validateInputs";

type Post = {
  id: string;
  title: string;
  content: string;
  bannerUrl: string;
  slug: string;
  author: {
    firstName: string;
    avatarUrl: string;
  };
  category: {
    name: string;
  };
  _count: {
    views: number;
    likes: number;
  };
  createdAt: string;
  isDraft: boolean;
}

interface PostsResponse {
  postsResponse: Post[];
}

interface HomeProps {
  lastPosts: Post[];
  mostSeenPosts: Post[];
}

export default function Home({ lastPosts, mostSeenPosts }: HomeProps) {  

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
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>
            Domine uma <span>stack</span> podersa 
            através de tutoriais <span>profissionais</span> e gratuitos<span>.</span>
          </h1>

          <p>
            Conteúdo semanal sobre o universo javascript com 
            foco na prática.  Quer ser avisado quando um novo
            tutorial for publicado? Então inscreva-se na nossa 
            newsletter.
          </p>

          <form onSubmit={handleSubscribe}>
            <div className={styles.inputGroup}>
              <Input 
                type="text" 
                placeholder="Seu e-mail.."
                value={email}
                onChange={e => setEmail(e.target.value)}
                isInputError={isEmailErr}
                onFocus={() => setIsEmailErr(false)}
              />
            </div>
            <Button title="Inscrever-se" bgColor="green" />
          </form>
        </div>

        <Image 
          width={497} 
          height={427} 
          src="/heroImage.svg" 
          alt="imagem de um jovem usando um computador" 
        />
      </section>

      {mostSeenPosts?.length >= 1 && (
        <section className={styles.mostSeen}>
          <h2>Mais <span>Vistos</span></h2>

          <div className={styles.wrapper}>
            <MostSeenPostsSlider posts={mostSeenPosts} />
          </div>
        </section>
      )}

      <section className={styles.last}>
        <h2>Últimos <span>Tutoriais</span></h2>

        <div className={styles.wrapper}>
          {lastPosts.map(post => (
            <PostCard 
              key={post.id} 
              title={post.title}
              content={post.content}
              category={post.category.name}
              bannerUrl={post.bannerUrl}
              slug={post.slug}
              author={post.author}
              createdAt={post.createdAt}
            />
          ))}
        </div>
      </section>

      <section className={styles.newsletter}>
        <NewsletterBanner />
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {

  const response = await api.get<PostsResponse>('/posts');  
  
  const lastPosts = response.data.postsResponse
    .filter(post => post.isDraft === false)
    .slice(0, 6)
    .map(post => {
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        bannerUrl: post.bannerUrl,
        slug: post.slug,
        author: {
          firstName: post.author.firstName,
          avatarUrl: post.author.avatarUrl
        },
        category: {
          name: post.category.name
        },
        createdAt: formAtDate(parseISO(post.createdAt))
      }
    });  
  
  const mostSeenPosts = response.data.postsResponse
    .filter(post => post._count.views >= 1)
    .slice(0, 10)
    .map(post => {
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        bannerUrl: post.bannerUrl,
        slug: post.slug,
        author: {
          firstName: post.author.firstName,
          avatarUrl: post.author.avatarUrl
        },
        _count: {
          likes: post._count.likes,
          views: post._count.views
        },
        category: {
          name: post.category.name
        },
        createdAt: formAtDate(parseISO(post.createdAt))
      }
    });

  return {
    props: {
      lastPosts,
      mostSeenPosts
    }
  }
}
import { parseISO } from "date-fns";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { NewsletterBanner } from "../components/NewsletterBanner";
import { Pagination } from "../components/Pagination";
import { PostCard } from "../components/PostCard";
import { api } from "../services/api";
import styles from "../styles/Posts.module.scss";
import { formAtDate } from "../utils/formatDate";

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
}

interface PostProps {
  posts: Post[];
  totalPosts: string;
}

export default function Posts({ posts, totalPosts }: PostProps) {
  const [pages, setPages] = useState<number[]>([]);

  const totalPages = Math.ceil(Number(totalPosts) / 6);

  useEffect(() => {
    const arrayPages = [];

    for (let i = 1; i <= totalPages; i++) {
      arrayPages.push(i);

      setPages(arrayPages);
    }
  }, [totalPages]);

  return (
    <main className={styles.container}>
      <header className={styles.heading}>
        <h1>
          <span>Confira</span> os últimos posts sobre o mundo <span>Front-end</span>
        </h1>

        <p>Acompanhe tutoriais sobre o unviverso front-end.</p>
      </header>

      <section className={styles.postsContainer}>
        {posts?.map(post => (
          <PostCard 
            key={post.id} 
            title={post.title}
            content={post.content}
            slug={post.slug}
            bannerUrl={post.bannerUrl}
            author={post.author}
            category={post.category.name}
            createdAt={post.createdAt}
          />
        ))}
      </section>

      {posts?.length >= 1 && (
        <Pagination path="/frontend" pages={pages} />
      )}

      <section className={styles.newsletter}>
        <NewsletterBanner />
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { page } = query;

  const response = await api.get<Post[]>(`/posts/post-by-category/frontend?page=${page}`);

  const totalPosts = response.headers['x-total-count'];

  const posts = response.data
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
  
  return {
    props: {
      posts,
      totalPosts
    }
  }
}
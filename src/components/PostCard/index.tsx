/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

const Markdown = dynamic(() => import('markdown-to-jsx'), {
  ssr: false
})

import { Badge } from "../Badge";

import styles from "./styles.module.scss";

interface PostCardProps {
  title: string;
  content: string;
  slug: string;
  bannerUrl: string;
  author: {
    firstName: string;
    avatarUrl: string;
  };
  category: string;
  createdAt: string;
}

export function PostCard({ title, content, author, category, slug, bannerUrl, createdAt }: PostCardProps) { 
  return (
    <div className={styles.container}>
      <Link href={`/post/${slug}`}>
        <a>
          <img 
            src={bannerUrl}
            alt="macbook" 
            className={styles.banner}
          />

          <div className={styles.contentWrapper}>
            <h3 title={title}>{title}</h3>

            <Badge name={category} />

            <Markdown
              className={styles.content}
            >
              {content}
            </Markdown>
          </div>

          <div className={styles.info}>
            <div className={styles.authorInfo}>
              <Image 
                loader={() => author.avatarUrl} 
                src={author.avatarUrl} 
                width={33} 
                height={33} 
                alt={author.firstName} 
                unoptimized
              />
              <span>{author.firstName}</span>
            </div>

            <span className={styles.publishedDate}>{createdAt}</span>
          </div>
        </a>
      </Link>
    </div>
  );
}
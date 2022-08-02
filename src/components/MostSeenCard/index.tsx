/* eslint-disable @next/next/no-img-element */
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, HandsClapping } from "phosphor-react";

const Markdown = dynamic(() => import('markdown-to-jsx'), {
  ssr: false
})

interface MostSeenCard {
  title: string;
  content: string;
  bannerUrl: string;
  slug: string;
  likes: number;
  views: number;
  publishedAt: string;
  author: {
    firstName: string;
    avatarUrl: string;
  };
}

import styles from "./styles.module.scss";

export function MostSeenCard({ title, content, bannerUrl, slug, likes, views, author, publishedAt }: MostSeenCard) {

  const numberOfWords = content?.split(' ').length;

  const readTimeCalcResult = Math.ceil(numberOfWords/ 200);

  const readTimeInMinutes = readTimeCalcResult;

  return (
    <Link href={`/post/${slug}`}>
      <a className={styles.container}>
        <article className={styles.wrapper}>
          <img src={bannerUrl} alt="banner" className={styles.banner} />

          <div className={styles.postData}>
            <h2 title={title}>{title}</h2>

            <div className={styles.infos}>
              <div className={styles.info}>
                {likes} <HandsClapping />
              </div>

              <div className={styles.info}>
                {views} <Eye />
              </div>

              <div className={styles.info}>
                {readTimeInMinutes} min <Clock />
              </div>
            </div>

            <Markdown
              className={styles.shortContent}
            >
              {content}
            </Markdown>

            <footer>
              <div className={styles.authorContainer}>
                <Image 
                  src={author.avatarUrl} 
                  loader={() => author.avatarUrl} 
                  width={33} 
                  height={33} 
                  alt="author" 
                />

                <span>{author.firstName}</span>
              </div>

              <time>{publishedAt}</time>
            </footer>
          </div>
        </article>
      </a>
    </Link>
  );
}
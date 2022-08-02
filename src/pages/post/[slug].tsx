 /* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import Link from "next/link";
import { GithubLogo, HandsClapping, LinkedinLogo } from "phosphor-react";
import { parseISO } from "date-fns";

import { NewsletterBanner } from "../../components/NewsletterBanner";
import { Button } from "../../components/Button";
import { Comment } from "../../components/Comment";

import { api } from "../../services/api";
import { formAtDate } from "../../utils/formatDate";

import styles from "../../styles/Post.module.scss";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useAuth, useSignInFormModal } from "../../hooks";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Markdown from "markdown-to-jsx";
import axios from "axios";

type Like = {
    userId: string;
    postId: string;
}

type View = {
    ipAdress: string;
    userId?: string;
    postId: string;
}

type CommentData = {
    id: string;
    content: string;
    author: {
        name: string;
        avatarUrl: string;
    };
    createdAt: string;
}

type Post = {
    id: string;
    title: string;
    subtitle: string;
    content: string;
    bannerUrl: string;
    author: {
      firstName: string;
      avatarUrl: string;
    };
    likes: Like[];
    views: View[];
    comments: CommentData[];
    createdAt: string;
}

interface PostProps {
    post: Post;
}

type IPResponse = {
    IPv4: string;
}

export default function Post({ post }: PostProps) {
    const { user, isUserLoggedIn } = useAuth();
    const { openSignInFormModal } = useSignInFormModal();
    const router = useRouter();

    const [userLiked, setUserLiked] = useState(false);
    const [isContentEmpty, setIsContentEmpty] = useState(false);
    const [commentContent, setCommentContent] = useState('');

    const [ipAdress, setIpAdress] = useState('');
    
    const isUserAlreadyLiked = post.likes?.some(like => like.userId === user?.id);

    useEffect(() => {
        if (isUserAlreadyLiked) {
            setUserLiked(true);
        } else {
            setUserLiked(false);
        }
    }, [isUserAlreadyLiked, post.likes, user?.id]);

    async function getIpClient() {
        try {
            const response = await axios.get<IPResponse>('https://geolocation-db.com/json/d802faa0-10bd-11ec-b2fe-47a0872c6708')
            
            setIpAdress(response.data.IPv4);
        } catch (error) {
          console.error(error);
        }
    }

    useEffect(() => {
        getIpClient();
    }, []);

    const isUserHasSeen = post.views?.some(view => view.ipAdress === ipAdress || view.userId === user.id)

    useEffect(() => {
        async function createView() {
            if (!isUserHasSeen) {
                if (ipAdress) {
                    if (user) {
                        await api.post(`/blog/views/${post.id}`, {
                            userId: user.id,
                            ipAdress
                        })
                    } else {
                        await api.post(`/blog/views/${post.id}`, {
                            ipAdress
                        })
                    }
                }
            }
        }

        createView();
    }, [ipAdress, isUserHasSeen, post.id, user, user?.id]);

    const numberOfWords = post.content?.split(' ').length;

    const readTimeCalcResult = Math.ceil(numberOfWords/ 200);

    const readTimeInMinutes = readTimeCalcResult;

    const handleLike = useCallback(async () => {
        if (!isUserLoggedIn) {
            openSignInFormModal();
        } else if (!userLiked) {
            setUserLiked(true);

            await api.post(`/blog/likes/${post.id}`);

            router.reload();
        } else {
            setUserLiked(false);

            await api.delete(`/blog/likes/${post.id}`);

            router.reload();
        }
    }, [isUserLoggedIn, openSignInFormModal, post.id, router, userLiked]);

    async function handleCreateComment(e: FormEvent) {
        e.preventDefault();
        
        if (commentContent === '') {
            setIsContentEmpty(true);
            
            toast.error("O campo comentário é obrigatório", {
                position: 'top-left'
            });
        } else {
            await api.post(`/blog/comments/${post.id}`, {
                content: commentContent,
                userId: user.id,
                postId: post.id
            });
        }

        setCommentContent('');
        router.reload();
    }

    return (
        <main>
            <img 
                src={post.bannerUrl}
                alt="banner"
                className={styles.banner}
            />
            
            <div className={styles.heading}>
                <h1 className={styles.title}>{post.title}</h1>

                <h3 className={styles.subtitle}>{post.subtitle}</h3>
            </div>

            <div className={styles.infos}>
                <span className={styles.readTime}>{readTimeInMinutes} min</span>
                <time>{post.createdAt}</time>
            </div>

            <div className={styles.contentWrapper}>
                <aside>
                    <button 
                        type="button" 
                        onClick={handleLike} 
                    >
                        <HandsClapping 
                            className={`${styles.clap} ${userLiked ? styles.clapActive : ''}`}
                            weight={userLiked ? 'fill': 'regular'}
                        />
                    </button>

                    <span>{post.likes?.length}</span>
                </aside>

                <article>
                    <Markdown className={styles.content}>
                        {post.content}
                    </Markdown>
                </article>
            </div>

            <div className={styles.newsletter}>
                <NewsletterBanner />
            </div>

            <div className={styles.author}>
                <h2>Autor deste post</h2>

                <img 
                    src={post.author?.avatarUrl}
                    alt="author" 
                    className={styles.authorImage} 
                />

                <span>{post.author?.firstName}</span>

                <div className={styles.social}>
                    <Link href="http://www.linkedin.com">
                        <a>
                            <LinkedinLogo weight="fill" className={styles.linkedinLogo} />
                        </a>
                    </Link>

                    <Link href="http://www.github.com">
                        <a>
                            <GithubLogo weight="fill" className={styles.githubLogo} />
                        </a>
                    </Link>
                </div>
            </div>

            <div className={styles.commentsContainer}>
                <h2>Comentários</h2>

                <span>O que achou do post?</span>

                <form onSubmit={handleCreateComment}>
                    <textarea 
                        placeholder="Deixe um comentário..."
                        onChange={e => setCommentContent(e.target.value)}
                        value={commentContent}
                        className={isContentEmpty ? styles.commentContentEmpty : ''}
                        onFocus={() => setIsContentEmpty(false)}
                        disabled={!isUserLoggedIn}
                    />

                    <Button 
                        title="Comentar" 
                        bgColor="green" 
                        type="submit"
                        disabled={!isUserLoggedIn}
                    />
                </form>

                <ul>
                    {post.comments?.map(comment => (
                        <Comment 
                            key={comment.id}
                            author={comment.author}
                            content={comment.content}
                            createdAt={comment.createdAt}
                        />
                    ))}
                </ul>
            </div>
        </main>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { slug } = params;

    const response = await api.get<Post>(`/posts/post-by-slug/${slug}`);
    
    const post = {
        id: response.data.id,
        title: response.data.title,
        subtitle: response.data.subtitle,
        content: response.data.content,
        bannerUrl: response.data.bannerUrl,
        author: {
            firstName: response.data.author.firstName,
            avatarUrl: response.data.author.avatarUrl
        },
        comments: response.data.comments.map(comment => {
            return {
                content: comment.content,
                author: {
                    name: comment.author.name,
                    avatarUrl: comment.author.avatarUrl,
                },
                createdAt: comment.createdAt
            }
        }),
        likes: response.data.likes.map(like => {
            return {
                userId: like.userId,
                postId: like.postId
            }
        }),
        createdAt: formAtDate(parseISO(response.data.createdAt))
    }

    return {
        props: {
            post
        }
    }
}
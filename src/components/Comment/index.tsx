/* eslint-disable @next/next/no-img-element */
import { formatDistanceToNow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import styles from "./styles.module.scss";

interface CommentProps {
    key: string;
    author: {
        name: string;
        avatarUrl: string;
    },
    content: string;
    createdAt: string;
}

export function Comment({ key, author, content, createdAt }: CommentProps) {
    const formattedCommentDate = formatDistanceToNow(parseISO(createdAt), {
        locale: ptBR,
        addSuffix: true
    })

    return (
        <li className={styles.wrapper}>
            <img src={author?.avatarUrl} alt="comment" />

            <div className={styles.commentData}>
                <div className={styles.commentInfo}>
                    <strong>{author.name}</strong>

                    <span>{formattedCommentDate}</span>
                </div>

                <p>{content}</p>
            </div>
        </li>
    );
}
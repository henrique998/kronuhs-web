import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./styles.module.scss"

interface PaginationItemProps {
    page: number;
    path: string;
}

export function PaginationItem({ page, path }: PaginationItemProps) {
    const router = useRouter();

    const isSelected = router.query.page === page.toString();

    return (
        <Link 
            href={{ pathname: path, query: { page } }} 
        >
            <a
                className={`${styles.item} ${isSelected && styles.pageActive}`}
            >{page}</a>
        </Link>
    );
}
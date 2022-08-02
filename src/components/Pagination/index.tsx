import Link from "next/link";
import { useRouter } from "next/router";
import { PaginationItem } from "./PaginationItem";
import styles from "./styles.module.scss"

interface PaginationProps {
    pages: number[];
    path: string;
}

export function Pagination({ pages, path }: PaginationProps) {
    const router = useRouter();

    const currentPage = Number(router.query.page);

    const previousPage = currentPage - 1;

    const nextPage = currentPage + 1;

    return (
        <div className={styles.container}>
            {currentPage > 1 && (
                <Link href={`${path}?page=${previousPage}`}>
                    <a className={styles.navLink}>Anterior</a>
                </Link>
            )}

            {currentPage > 1 && (
                <PaginationItem page={previousPage} path={path} />
            )}

            <PaginationItem page={currentPage} path={path} />

            {currentPage < pages.length && (
                <PaginationItem page={nextPage} path={path} />
            )}

            {currentPage < pages.length && (
                <Link href={`${path}?page=${nextPage}`}>
                    <a className={styles.navLink}>Próxima</a>
                </Link>
            )}
        </div>
    );
}
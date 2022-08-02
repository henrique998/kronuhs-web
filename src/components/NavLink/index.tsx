import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";

interface NavLinkProps extends LinkProps{
  path: string;
  title: string;
}

import styles from "./styles.module.scss";

export function NavLink({ path, title, ...rest }: NavLinkProps) {
  const router = useRouter();

  const { pathname } = router;

  const isActive = pathname === path;

  return (
    <Link {...rest}>
      <a 
        className={`${styles.link} ${isActive && styles.linkActive}`}
        >
          {title}
      </a>
    </Link>
  );
}
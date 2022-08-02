import Image from "next/image";
import Link from "next/link";
import { UserCircle } from "phosphor-react";
import { useState } from "react";
import { useAuth, useSignInFormModal, useSignUpFormModal } from "../../hooks";
import { Button } from "../Button";
import { NavLink } from "../NavLink";
import { ProfileBox } from "../ProfileBox";
import { SignInForm } from "../SignInForm";
import { SignUpForm } from "../SignUpForm";

import styles from "./styles.module.scss";

export function Header() {
  const [isProfileBoxOpen, setIsProfileBoxOpen] = useState(false);

  const { user, isUserLoggedIn } = useAuth();

  const { openSignInFormModal } = useSignInFormModal();

  const { openSignUpFormModal } = useSignUpFormModal();
  
  function handleToggleProfileBox() {
    setIsProfileBoxOpen(!isProfileBoxOpen);
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/">
          <a>
            <Image 
              src="/logo.svg" 
              alt="logomarca da kronuhs" 
              width={95} 
              height={33} 
            />
          </a>
        </Link>

        <nav>
          <ul>
            <li>
              <NavLink path="/" title="Home" href="/" />
            </li>

            <li>
              <NavLink 
                path="/posts" 
                title="Posts" 
                href={{ pathname: "/posts", query: { page: '1' } }} 
              />
            </li>

            <li>
              <NavLink 
                path="/frontend" 
                title="Front-end" 
                href={{ pathname: "/frontend", query: { page: '1' } }} 
              />
            </li>

            <li>
              <NavLink 
                path="/backend" 
                title="Back-end" 
                href={{ pathname: "/backend", query: { page: '1' } }} 
              />
            </li>
          </ul>
        </nav>

        {isUserLoggedIn ? (
          <div className={styles.profileContainer}>
            {user?.avatarUrl ? (
              <div className={styles.profileAvatarWrapper}>
                <Image 
                  src={user.avatarUrl}
                  loader={() => user.avatarUrl}
                  unoptimized
                  width={32} 
                  height={32} 
                  objectFit="cover" 
                  alt="user"
                  className={styles.profileAvatar}
                  onClick={handleToggleProfileBox}
                />

                {isProfileBoxOpen && (
                  <ProfileBox />
                )}
              </div>
            ) : (
              <div className={styles.profileAvatarWrapper}>
                <UserCircle 
                  onClick={handleToggleProfileBox}
                />

                {isProfileBoxOpen && (
                  <ProfileBox />
                )}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.buttons}>
            <Button 
              type="button" 
              title="Entrar" 
              bgColor="green" 
              onClick={openSignInFormModal}
            />

            <Button 
              type="button" 
              title="Inscrever-se" 
              bgColor="black"
              onClick={openSignUpFormModal}
            />
          </div>
        )}
      </div>

      <SignInForm />

      <SignUpForm />
    </header>
  );
}
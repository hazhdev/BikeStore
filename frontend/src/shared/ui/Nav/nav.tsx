import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { iconMenuItems, navMenuItems } from "./NavDate";
import { Burger } from "./burger";
import styles from "./nav.module.scss";
import logo from "@/shared/assets/images/NavImg/logo.svg";
import Search from "@/shared/assets/images/NavImg/search.svg";
import { Input } from "../Input/input";
import { Button } from "../Button/button";

export function Nav() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigateRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navigateRef.current &&
        !navigateRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.navWrapper}>
      <nav className={styles.nav}>
        <Link to="/home">
          <img src={logo} alt="Логотип" />
        </Link>

        <ul className={styles.menu}>
          {navMenuItems.map((menu) => (
            <li key={menu.id}>
              <Link className={styles.menuItemLink} to={menu.href}>
                {menu.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.navigate} ref={navigateRef}>
          <ul className={styles.iconMenu}>
            <li>
              <Button
                type="button"
                onClick={() => setIsSearchOpen((prev) => !prev)}
              >
                <img src={Search} alt="" />
              </Button>
            </li>

            {iconMenuItems.map((menu) => (
              <li className={styles.iconMenuItem} key={menu.id}>
                <Link to={menu.href}>
                  <img src={menu.icon} alt={menu.label} />
                </Link>
              </li>
            ))}
          </ul>

          {isSearchOpen && (
            <div className={styles.searchOverlay}>
              <Input
                type="text"
                placeholder="Поиск"
                className={styles.searchInput}
              />

              <img className={styles.searchIcon} src={Search} alt="" />
            </div>
          )}
        </div>

        <Burger />
      </nav>
    </div>
  );
}

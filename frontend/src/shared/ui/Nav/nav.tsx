import { Link } from "react-router-dom";
import { iconMenuItems, navMenuItems } from "./NavDate";
import { Burger } from "./burger";
import styles from "./nav.module.scss";
import logo from "@/shared/assets/images/NavImg/logo.svg";

export function Nav() {
  return (
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

      <ul className={styles.iconMenu}>
        {iconMenuItems.map((menu) => (
          <li className={styles.iconMenuItem} key={menu.id}>
            <Link to={menu.href}>
              <img src={menu.icon} alt={menu.label} />
            </Link>
          </li>
        ))}
      </ul>

      <Burger />
    </nav>
  );
}

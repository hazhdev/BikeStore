import { Nav } from "@/shared/ui/Nav/nav";
import styles from "./header.module.scss";

export function Header() {
  return (
    <header className={styles.header}>
      <Nav />
    </header>
  );
}

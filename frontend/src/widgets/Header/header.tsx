import { Nav } from "@/shared/ui/Nav/nav";
import styles from "./header.module.scss";
import { Button } from "@/shared/ui/Button/button";

export function Header() {
  return (
    <header className={styles.header}>
      <Nav />

      <div className={styles.content}>
        <h1 className={styles.title}>
          <span>ЭЛЕКТРО</span>
          <span>ВЕЛОСИПЕДЫ</span>
        </h1>

        <p className={styles.description}>
          Cento10 Hybrid — это гоночный велосипед с помогающим педалированию
          электроприводом, который устанавливает новый, очень высокий стандарт
          для данной категории
        </p>

        <Button className={styles.button} type="button">
          Подробнее
        </Button>
      </div>
    </header>
  );
}

import { Link } from "react-router-dom";
import styles from "@/widgets/Hero/hero.module.scss";

const heroCards = [
  {
    id: 1,
    title: "Экстремальное вождение на горном велосипеде",
    href: "/catalog/mountain",
  },
  {
    id: 2,
    title: "Велосипеды для профессионалов",
    href: "/catalog/professional",
  },
  {
    id: 3,
    title: "Долгая поездка на шоссейном велосипеде",
    href: "/catalog/road",
  },
];

export function HeroCards() {
  return (
    <section className={styles.heroCards}>
      <div className={styles.container}>
        {heroCards.map((card) => (
          <article className={styles.card} key={card.id}>
            <h3 className={styles.title}>{card.title}</h3>

            <Link className={styles.link} to={card.href}>
              Подробнее
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

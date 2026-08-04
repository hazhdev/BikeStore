import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import burgerIcon from "@/shared/assets/images/NavImg/burger.svg";
import CloseBurgerIcon from "@/shared/assets/images/NavImg/CloseBurger.svg";
import logo from "@/shared/assets/images/NavImg/logoBlack.svg";
import { BtnClose } from "../Button/BtnClose";

import styles from "./burger.module.scss";
import { burgerMenuItems, footerLinks } from "./NavDate";

export function Burger() {
  const [isOpen, setIsOpen] = useState(false);
  const [openedItemId, setOpenedItemId] = useState<string | null>("equipment");

  useEffect(() => {
    if (!isOpen) return;

    // прячем полосу прокрутки и тут же компенсируем её ширину отступом,
    // иначе страница дёрнется вправо на эти же пиксели
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  const handleToggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
  };

  const handleToggleAccordion = (id: string) => {
    setOpenedItemId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <button
        className={styles.burgerButton}
        type="button"
        onClick={handleToggleMenu}
      >
        <img src={burgerIcon} alt="" />
      </button>

      {isOpen && (
        <>
          <div className={styles.overlay} onClick={handleCloseMenu} />

          <aside className={styles.burgerMenu}>
            <BtnClose
              className={styles.closeButton}
              onClose={handleCloseMenu}
              ariaLabel="Закрыть меню"
            >
              <img src={CloseBurgerIcon} alt="" />
            </BtnClose>

            <div className={styles.mobileContent}>
              <img className={styles.logo} src={logo} alt="Логотип" />

              <div className={styles.tradeBlock}>TRADE IN</div>

              <ul className={styles.accordionList}>
                {burgerMenuItems.map((item) => {
                  const isItemOpen = openedItemId === item.id;

                  return (
                    <li className={styles.accordionItem} key={item.id}>
                      <button
                        className={`${styles.accordionButton} ${
                          isItemOpen ? styles.accordionButtonActive : ""
                        }`}
                        type="button"
                        onClick={() => handleToggleAccordion(item.id)}
                      >
                        <span>{item.label}</span>
                        <span>{isItemOpen ? "⌃" : "⌄"}</span>
                      </button>

                      {isItemOpen && (
                        <ul className={styles.subMenu}>
                          {item.links.map((link) => (
                            <li key={link.id}>
                              <Link to={link.href} onClick={handleCloseMenu}>
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>

              <ul className={styles.mobileFooterLinks}>
                {footerLinks.map((link) => (
                  <li key={link.id}>
                    <Link to={link.href} onClick={handleCloseMenu}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.tabletContent}>
              <h2 className={styles.title}>ДОП. ИНФОРМАЦИЯ</h2>

              <ul className={styles.infoLinks}>
                {footerLinks.map((link) => (
                  <li key={link.id}>
                    <Link to={link.href} onClick={handleCloseMenu}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

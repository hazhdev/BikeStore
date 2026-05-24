import cartIcon from "@/shared/assets/images/NavImg/carzina.svg";
import favoritesIcon from "@/shared/assets/images/NavImg/favorites.svg";
import searchIcon from "@/shared/assets/images/NavImg/search.svg";
import userIcon from "@/shared/assets/images/NavImg/user1.svg";
import type { NavMenuItem, IconMenuItem, typefooterLinks } from "./navTypes";

export const navMenuItems: NavMenuItem[] = [
  {
    id: "trade-in",
    label: "TRADE IN",
    href: "/catalog?type=trade-in",
  },
  {
    id: "bicycles",
    label: "ВЕЛОСИПЕДЫ",
    href: "/catalog?category=bicycles",
  },
  {
    id: "parts",
    label: "ЗАПЧАСТИ",
    href: "/catalog?category=parts",
  },
  {
    id: "equipment",
    label: "ЭКИПИРОВКА",
    href: "/catalog?category=equipment",
  },
  {
    id: "accessories",
    label: "АКСЕССУАРЫ",
    href: "/catalog?category=accessories",
  },
  {
    id: "trainers",
    label: "ВЕЛОСТАНКИ",
    href: "/catalog?category=trainers",
  },
];

export const iconMenuItems: IconMenuItem[] = [
  {
    id: "search",
    href: "/search",
    label: "Поиск",
    icon: searchIcon,
  },
  {
    id: "profile",
    href: "/profile",
    label: "Профиль",
    icon: userIcon,
  },
  {
    id: "favorites",
    href: "/favorites",
    label: "Избранное",
    icon: favoritesIcon,
  },
  {
    id: "cart",
    href: "/cart",
    label: "Корзина",
    icon: cartIcon,
  },
];

export const footerLinks: typefooterLinks[] = [
  {
    id: "about",
    label: "О нас",
    href: "/about",
  },
  {
    id: "workshop",
    label: "Веломастерская",
    href: "/workshop",
  },
  {
    id: "storage",
    label: "Хранение",
    href: "/storage",
  },
  {
    id: "warranty",
    label: "Гарантии",
    href: "/warranty",
  },
  {
    id: "agreement",
    label: "Пользовательское соглашение",
    href: "/agreement",
  },
  {
    id: "delivery",
    label: "Доставка и оплата",
    href: "/delivery",
  },
  {
    id: "blog",
    label: "Блог",
    href: "/blog",
  },
  {
    id: "contacts",
    label: "Контакты",
    href: "/contacts",
  },
];

export const burgerMenuItems = [
  {
    id: "bikes",
    label: "Велосипеды",
    links: [
      { id: "mountain", label: "Горные велосипеды", href: "/catalog/mountain" },
      { id: "road", label: "Шоссейные велосипеды", href: "/catalog/road" },
      { id: "kids", label: "Детские велосипеды", href: "/catalog/kids" },
    ],
  },
  {
    id: "parts",
    label: "Запчасти",
    links: [
      { id: "wheels", label: "Колёса", href: "/catalog/wheels" },
      { id: "chains", label: "Цепи", href: "/catalog/chains" },
      { id: "brakes", label: "Тормоза", href: "/catalog/brakes" },
    ],
  },
  {
    id: "equipment",
    label: "Экипировка",
    links: [
      { id: "jackets", label: "Велокуртки", href: "/catalog/jackets" },
      { id: "shorts", label: "Велотрусы", href: "/catalog/shorts" },
      { id: "thermal", label: "Термобелье", href: "/catalog/thermal" },
      { id: "shoes", label: "Велообувь", href: "/catalog/shoes" },
      { id: "helmets", label: "Велошлемы", href: "/catalog/helmets" },
      { id: "gloves", label: "Велоперчатки", href: "/catalog/gloves" },
      { id: "glasses", label: "Очки", href: "/catalog/glasses" },
      { id: "accessories", label: "Аксессуары", href: "/catalog/accessories" },
    ],
  },
  {
    id: "accessories",
    label: "Аксессуары",
    links: [
      { id: "bags", label: "Сумки", href: "/catalog/bags" },
      { id: "lights", label: "Фонари", href: "/catalog/lights" },
    ],
  },
  {
    id: "stands",
    label: "Велостанки",
    links: [{ id: "trainers", label: "Трейнеры", href: "/catalog/trainers" }],
  },
];

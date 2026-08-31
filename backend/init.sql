-- ============================================================
--  Пользователи
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'user',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ============================================================
--  Категории каталога
--  parent_id ссылается на эту же таблицу — так делается вложенность:
--  «Горные велосипеды» указывает на «Велосипеды»
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id         SERIAL PRIMARY KEY,
  slug       VARCHAR(100) NOT NULL UNIQUE,
  name       VARCHAR(150) NOT NULL,
  -- SET NULL, а не CASCADE: удалили родителя — дети становятся
  -- корневыми, а не исчезают вместе с товарами
  parent_id  INTEGER REFERENCES categories (id) ON DELETE SET NULL,
  sort_order INTEGER      NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories (parent_id);

-- ============================================================
--  Бренды (они же партнёры в подвале сайта)
-- ============================================================
CREATE TABLE IF NOT EXISTS brands (
  id         SERIAL PRIMARY KEY,
  slug       VARCHAR(100) NOT NULL UNIQUE,
  name       VARCHAR(150) NOT NULL,
  logo_path  VARCHAR(500),
  country    VARCHAR(100),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ============================================================
--  Справочник цветов
--  slug идёт в адресную строку (?color=black),
--  name показывается человеку, hex рисует кружок в фильтре
-- ============================================================
CREATE TABLE IF NOT EXISTS colors (
  id   SERIAL PRIMARY KEY,
  slug VARCHAR(50)  NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  hex  VARCHAR(7)
);

-- ============================================================
--  Справочник материалов рамы
-- ============================================================
CREATE TABLE IF NOT EXISTS frame_materials (
  id   SERIAL PRIMARY KEY,
  slug VARCHAR(50)  NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL
);

-- ============================================================
--  Товары
--  Правило раскладки полей:
--    фильтруем/сортируем по нему  → отдельная колонка
--    только показываем на карточке → в specs
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id             SERIAL PRIMARY KEY,
  slug           VARCHAR(255)   NOT NULL UNIQUE,
  name           VARCHAR(255)   NOT NULL,
  description    TEXT,

  -- NUMERIC, а не FLOAT: дробные типы округляют, а это деньги
  price          NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  old_price      NUMERIC(12, 2) CHECK (old_price >= 0),

  category_id    INTEGER REFERENCES categories (id) ON DELETE SET NULL,
  brand_id       INTEGER REFERENCES brands (id) ON DELETE SET NULL,

  -- поля под фильтры каталога из макета
  country           VARCHAR(100),
  -- код страны по ISO 3166-1 (fr, us, it): по нему фронт находит флаг.
  -- Название хранится отдельно — его показывают в характеристиках
  country_code      VARCHAR(2),
  frame_material_id INTEGER REFERENCES frame_materials (id) ON DELETE SET NULL,

  rating         NUMERIC(2, 1) NOT NULL DEFAULT 0
                   CHECK (rating >= 0 AND rating <= 5),
  rating_count   INTEGER       NOT NULL DEFAULT 0,

  -- остальные характеристики: вилка, втулки, руль, манетки, цепь...
  -- их около двадцати, и они только выводятся таблицей на карточке
  specs          JSONB         NOT NULL DEFAULT '{}'::jsonb,

  -- товар опубликован. НЕ наличие — наличие живёт в вариантах
  is_active      BOOLEAN       NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand    ON products (brand_id);
CREATE INDEX IF NOT EXISTS idx_products_price    ON products (price);
-- GIN — индекс для поиска внутри JSONB
CREATE INDEX IF NOT EXISTS idx_products_specs    ON products USING gin (specs);

-- ============================================================
--  Варианты товара: размер + цвет
--  Один велосипед в размере M может быть в наличии, а в L — нет.
--  Поэтому наличие хранится здесь, а не на товаре.
-- ============================================================
CREATE TABLE IF NOT EXISTS product_variants (
  id         SERIAL PRIMARY KEY,
  product_id INTEGER        NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  sku        VARCHAR(64) UNIQUE,
  -- размер оставлен строкой: S/M/L/XL уже латиница, справочник не нужен
  size       VARCHAR(20),
  color_id   INTEGER REFERENCES colors (id) ON DELETE SET NULL,
  stock      INTEGER        NOT NULL DEFAULT 0 CHECK (stock >= 0),
  -- надбавка к цене товара: XL может стоить дороже
  price_diff NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ    NOT NULL DEFAULT now(),

  -- одна строка на сочетание размер+цвет.
  -- NULLS NOT DISTINCT нужен для товаров без размера (аксессуары):
  -- без него база считала бы два NULL разными и пропустила дубли
  UNIQUE NULLS NOT DISTINCT (product_id, size, color_id)
);

CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants (product_id);

-- ============================================================
--  Картинки товара. В базе только путь, файл лежит в uploads/
-- ============================================================
CREATE TABLE IF NOT EXISTS product_images (
  id         SERIAL PRIMARY KEY,
  product_id INTEGER      NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  path       VARCHAR(500) NOT NULL,
  alt        VARCHAR(255),
  sort_order INTEGER      NOT NULL DEFAULT 0,
  is_main    BOOLEAN      NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product
  ON product_images (product_id);

-- главная картинка у товара может быть только одна
CREATE UNIQUE INDEX IF NOT EXISTS uq_product_images_main
  ON product_images (product_id)
  WHERE is_main;

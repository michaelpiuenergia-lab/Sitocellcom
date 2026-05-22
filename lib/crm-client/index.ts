import * as real from "./products";
import * as mock from "./products-mock";

const USE_MOCK = !process.env.CRM_API_URL || process.env.NODE_ENV === "test";

export const getProducts = USE_MOCK ? mock.getProducts : real.getProducts;
export const getProductBySlug = USE_MOCK
  ? mock.getProductBySlug
  : real.getProductBySlug;
export const getHealth = USE_MOCK ? mock.getHealth : real.getHealth;

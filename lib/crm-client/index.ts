import * as realProducts from "./products";
import * as mockProducts from "./products-mock";
import * as realB2bAuth from "./auth";
import * as mockB2bAuth from "./auth-mock";
import * as realB2bProducts from "./b2b-products";
import * as mockB2bProducts from "./mocks/b2b-products";
import * as realRequests from "./requests";
import * as mockRequests from "./mocks/requests";

/**
 * Flag mock granulari.
 *
 * Default = REAL se CRM_API_URL è settato (CRM espone già tutti gli endpoint
 * v1: public/products, b2b/*, requests). Per forzare mock anche con CRM
 * configurato (es. sviluppo offline):
 *   USE_MOCK_PUBLIC=true | B2B_USE_MOCK=true | REQUESTS_USE_MOCK=true
 *
 * NODE_ENV=test → mock ovunque (suite Vitest indipendente dal CRM).
 */

const HAS_CRM = Boolean(process.env.CRM_API_URL);
const IS_TEST = process.env.NODE_ENV === "test";

const USE_MOCK_PUBLIC =
  IS_TEST || !HAS_CRM || process.env.USE_MOCK_PUBLIC === "true";

const USE_MOCK_B2B =
  IS_TEST || !HAS_CRM || process.env.B2B_USE_MOCK === "true";

const USE_MOCK_REQUESTS =
  IS_TEST || !HAS_CRM || process.env.REQUESTS_USE_MOCK === "true";

// Public products
export const getProducts = USE_MOCK_PUBLIC
  ? mockProducts.getProducts
  : realProducts.getProducts;
export const getProductBySlug = USE_MOCK_PUBLIC
  ? mockProducts.getProductBySlug
  : realProducts.getProductBySlug;
export const getHealth = USE_MOCK_PUBLIC
  ? mockProducts.getHealth
  : realProducts.getHealth;

// B2B auth
export const b2bLogin = USE_MOCK_B2B ? mockB2bAuth.b2bLogin : realB2bAuth.b2bLogin;
export const b2bLogout = USE_MOCK_B2B ? mockB2bAuth.b2bLogout : realB2bAuth.b2bLogout;
export const b2bMe = USE_MOCK_B2B ? mockB2bAuth.b2bMe : realB2bAuth.b2bMe;

// B2B products
export const getB2bProducts = USE_MOCK_B2B
  ? mockB2bProducts.getB2bProducts
  : realB2bProducts.getB2bProducts;
export const getB2bProductBySlug = USE_MOCK_B2B
  ? mockB2bProducts.getB2bProductBySlug
  : realB2bProducts.getB2bProductBySlug;

// Site requests intake
export const postSiteRequest = USE_MOCK_REQUESTS
  ? mockRequests.postSiteRequest
  : realRequests.postSiteRequest;

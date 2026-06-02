import * as realProducts from "./products";
import * as mockProducts from "./products-mock";
import * as realB2bAuth from "./auth";
import * as mockB2bAuth from "./auth-mock";
import * as realB2bProducts from "./b2b-products";
import * as mockB2bProducts from "./mocks/b2b-products";
import * as realRequests from "./requests";
import * as mockRequests from "./mocks/requests";
import * as realUsedDevices from "./used-devices";
import * as mockUsedDevices from "./mocks/used-devices";
import * as realCustomerAuth from "./customer-auth";
import * as mockCustomerAuth from "./customer-auth-mock";
import * as realRepairs from "./repairs";
import * as mockRepairs from "./repairs-mock";
import * as realB2bPortal from "./b2b-portal";
import * as mockB2bPortal from "./b2b-portal-mock";
import * as realCourses from "./courses";
import * as mockCourses from "./courses-mock";

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
export const b2bRegister = USE_MOCK_B2B ? mockB2bAuth.b2bRegister : realB2bAuth.b2bRegister;
export const b2bLogout = USE_MOCK_B2B ? mockB2bAuth.b2bLogout : realB2bAuth.b2bLogout;
export const b2bMe = USE_MOCK_B2B ? mockB2bAuth.b2bMe : realB2bAuth.b2bMe;
export const b2bRequestPasswordReset = USE_MOCK_B2B
  ? mockB2bAuth.b2bRequestPasswordReset
  : realB2bAuth.b2bRequestPasswordReset;
export const b2bResetPassword = USE_MOCK_B2B
  ? mockB2bAuth.b2bResetPassword
  : realB2bAuth.b2bResetPassword;
export const b2bUpdateCustomer = USE_MOCK_B2B
  ? mockB2bAuth.b2bUpdateCustomer
  : realB2bAuth.b2bUpdateCustomer;
export const b2bRegenerateListino = USE_MOCK_B2B
  ? mockB2bAuth.b2bRegenerateListino
  : realB2bAuth.b2bRegenerateListino;

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

// Usato in vendita (catalogo pubblico)
export const getUsedDevices = USE_MOCK_PUBLIC
  ? mockUsedDevices.getUsedDevices
  : realUsedDevices.getUsedDevices;

// Auth cliente finale (B2C) — area clienti
export const customerLogin = USE_MOCK_B2B
  ? mockCustomerAuth.customerLogin
  : realCustomerAuth.customerLogin;
export const customerSetPassword = USE_MOCK_B2B
  ? mockCustomerAuth.customerSetPassword
  : realCustomerAuth.customerSetPassword;
export const customerLogout = USE_MOCK_B2B
  ? mockCustomerAuth.customerLogout
  : realCustomerAuth.customerLogout;
export const customerMe = USE_MOCK_B2B
  ? mockCustomerAuth.customerMe
  : realCustomerAuth.customerMe;
export const customerRepairs = USE_MOCK_B2B
  ? mockCustomerAuth.customerRepairs
  : realCustomerAuth.customerRepairs;

// Tracking riparazioni pubblico (lookup + risposta preventivo)
export const lookupRepair = USE_MOCK_PUBLIC
  ? mockRepairs.lookupRepair
  : realRepairs.lookupRepair;
export const respondToQuote = USE_MOCK_PUBLIC
  ? mockRepairs.respondToQuote
  : realRepairs.respondToQuote;

// Portale B2B (ordini, preventivi, fatture, NC, pagamenti, spedizioni, docs)
export const listB2bOrders = USE_MOCK_B2B ? mockB2bPortal.listB2bOrders : realB2bPortal.listB2bOrders;
export const getB2bOrder = USE_MOCK_B2B ? mockB2bPortal.getB2bOrder : realB2bPortal.getB2bOrder;
export const listB2bQuotes = USE_MOCK_B2B ? mockB2bPortal.listB2bQuotes : realB2bPortal.listB2bQuotes;
export const getB2bQuote = USE_MOCK_B2B ? mockB2bPortal.getB2bQuote : realB2bPortal.getB2bQuote;
export const acceptB2bQuote = USE_MOCK_B2B ? mockB2bPortal.acceptB2bQuote : realB2bPortal.acceptB2bQuote;
export const listB2bInvoices = USE_MOCK_B2B ? mockB2bPortal.listB2bInvoices : realB2bPortal.listB2bInvoices;
export const getB2bInvoice = USE_MOCK_B2B ? mockB2bPortal.getB2bInvoice : realB2bPortal.getB2bInvoice;
export const listB2bCreditNotes = USE_MOCK_B2B ? mockB2bPortal.listB2bCreditNotes : realB2bPortal.listB2bCreditNotes;
export const getB2bCreditNote = USE_MOCK_B2B ? mockB2bPortal.getB2bCreditNote : realB2bPortal.getB2bCreditNote;
export const listB2bPayments = USE_MOCK_B2B ? mockB2bPortal.listB2bPayments : realB2bPortal.listB2bPayments;
export const listB2bShipments = USE_MOCK_B2B ? mockB2bPortal.listB2bShipments : realB2bPortal.listB2bShipments;
export const getB2bShipment = USE_MOCK_B2B ? mockB2bPortal.getB2bShipment : realB2bPortal.getB2bShipment;
export const listB2bDocuments = USE_MOCK_B2B ? mockB2bPortal.listB2bDocuments : realB2bPortal.listB2bDocuments;
export { b2bDownloadCrmPath } from "./b2b-portal";

// Corsi Cellcom Academy
export const getCourses = USE_MOCK_PUBLIC ? mockCourses.getCourses : realCourses.getCourses;
export const getCustomerCourses = USE_MOCK_B2B
  ? mockCourses.getCustomerCourses
  : realCourses.getCustomerCourses;
export const getCustomerCourseVideos = USE_MOCK_B2B
  ? mockCourses.getCustomerCourseVideos
  : realCourses.getCustomerCourseVideos;

import type { Lang } from "./lang";

/**
 * Dizionario delle stringhe HUB. Aggiungi solo chiavi davvero usate in UI.
 * Per i contenuti marketing lunghi (hero descriptions, pillar cards, ecc.)
 * meglio file dedicati per pagina invece di una mega-mappa.
 *
 * Convenzione nomi: `area.contesto.elemento` (es. `chat.input.placeholder`).
 */

export type Dict = {
  // ─── Chatbot UI ─────────────────────────────────────────────────────
  "chat.header.title": string;
  "chat.header.statusOnline": string;
  "chat.header.statusStreaming": string;
  "chat.header.closeAria": string;
  "chat.fab.openAria": string;
  "chat.fab.closeAria": string;
  "chat.welcome": string;
  "chat.input.placeholder": string;
  "chat.input.placeholderStreaming": string;
  "chat.input.sendAria": string;
  "chat.input.stopAria": string;
  "chat.input.charsLeft": (n: number) => string;
  "chat.bubble.streamingPolite": string;
  "chat.bubble.errorBadge": string;
  "chat.bubble.abortedBadge": string;
  "chat.bubble.truncatedBadge": string;
  "chat.error.networkFallback": string;
  "chat.error.tooManyRequests": string;
  "chat.quickReply.buyPhone": string;
  "chat.quickReply.repairScreen": string;
  "chat.quickReply.sellUsed": string;
  "chat.quickReply.reseller": string;
  "chat.quickReply.userBuyPhone": string;
  "chat.quickReply.userRepairScreen": string;
  "chat.quickReply.userSellUsed": string;
  "chat.quickReply.userReseller": string;
  "chat.toolLabel.searchProducts": string;
  "chat.toolLabel.getProductBySlug": string;
  "chat.toolLabel.searchUsedDevices": string;
  "chat.toolLabel.lookupRepair": string;
  "chat.toolLabel.listStores": string;
  "chat.toolLabel.openRequestForm": string;
  "chat.toolLabel.getHealth": string;
  "chat.regionAria": string;
  "chat.openAnnounce": string;

  // ─── Language switcher ──────────────────────────────────────────────
  "lang.label": string;
  "lang.it": string;
  "lang.en": string;
  "lang.switchAria": string;

  // ─── Navbar ─────────────────────────────────────────────────────────
  "nav.products": string;
  "nav.used": string;
  "nav.repairs": string;
  "nav.resell": string;
  "nav.courses": string;
  "nav.stores": string;
  "nav.about": string;
  "nav.login": string;
  "nav.b2b": string;
  "nav.repairCta": string;
  "nav.customerArea": string;
  "nav.openMenu": string;
  "nav.closeMenu": string;

  // ─── Footer ─────────────────────────────────────────────────────────
  "footer.copyrightGroup": string;
  "footer.legal.privacy": string;
  "footer.legal.cookie": string;
  "footer.legal.terms": string;

  // ─── Hero (homepage) ────────────────────────────────────────────────
  "hero.pillar.buy": string;
  "hero.pillar.repair": string;
  "hero.pillar.resell": string;
  "hero.pillar.learn": string;
  "hero.pillar.b2b": string;

  // ─── Trust strip (sotto Hero/Marquee) ───────────────────────────────
  "trust.shipping.value": string;
  "trust.shipping.desc": string;
  "trust.warranty.value": string;
  "trust.warranty.desc": string;
  "trust.technician.value": string;
  "trust.technician.desc": string;
  "trust.b2b.value": string;
  "trust.b2b.desc": string;
  "hero.catalogCta.eyebrow": string;
  "hero.catalogCta.title": string;
  "hero.catalogCta.explore": string;
  "hero.pricesReservedHint": string;
  "hero.newDevicesEyebrow": string;
  "hero.priceOnRequest": string;
  "hero.claim.preItalic": string;
  "hero.claim.italicA": string;
  "hero.claim.between": string;
  "hero.claim.italicB": string;
  "hero.intro.lead": string;
  "hero.intro.boldA": string;
  "hero.intro.bodyA": string;
  "hero.intro.boldB": string;
  "hero.intro.bodyB": string;
  "hero.intro.boldC": string;
  "hero.intro.bodyC": string;

  // ─── Home / Marketing panels ────────────────────────────────────────
  "home.numbers.eyebrow": string;
  "home.numbers.titleA": string;
  "home.numbers.titleB": string;
  "home.numbers.intro": string;
  "home.numbers.stat.brands": string;
  "home.numbers.stat.parts": string;
  "home.numbers.stat.phones": string;
  "home.numbers.stat.accessories": string;
  "home.numbers.cta.catalog": string;
  "home.numbers.cta.about": string;
  "home.b2b.eyebrow": string;
  "home.b2b.titleA": string;
  "home.b2b.titleB": string;
  "home.b2b.intro": string;
  "home.b2b.feature1.title": string;
  "home.b2b.feature1.body": string;
  "home.b2b.feature2.title": string;
  "home.b2b.feature2.body": string;
  "home.b2b.feature3.title": string;
  "home.b2b.feature3.body": string;
  "home.b2b.cta.login": string;
  "home.b2b.cta.contact": string;

  // ─── ProductGrid (catalog) ──────────────────────────────────────────
  "pg.filter.all": string;
  "pg.cat.smartphone": string;
  "pg.cat.part": string;
  "pg.stock.outOfStock": string;
  "pg.stock.checkAvailable": string;
  "pg.stock.lastN": (n: number) => string;
  "pg.stock.available": string;
  "pg.price.onRequest": string;
  "pg.price.hiddenTooltip": string;
  "pg.price.reserved": string;
  "pg.cta.loginForPrice": string;
  "pg.cta.notifyWhenBack": string;
  "pg.cta.buyOn": (channel: string) => string;
  "pg.empty": string;

  // ─── Breadcrumb ─────────────────────────────────────────────────────
  "bc.home": string;
  "bc.products": string;
  "bc.phones": string;
  "bc.parts": string;
  "bc.accessories": string;
  "bc.used": string;
  "bc.repairs": string;
  "bc.aboutUs": string;
  "bc.stores": string;
  "bc.courses": string;
  "bc.openStore": string;
  "bc.becomePartner": string;
  "bc.tradeIn": string;
  "bc.tracker": string;

  // ─── Catalog hero ───────────────────────────────────────────────────
  "ch.products.eyebrow": string;
  "ch.products.title": string;
  "ch.products.accent": string;
  "ch.products.description": string;
  "ch.phones.eyebrow": string;
  "ch.phones.title": string;
  "ch.phones.accent": string;
  "ch.phones.description": string;
  "ch.phones.metric.new": string;
  "ch.phones.metric.refurbished": string;
  "ch.phones.metric.used": string;
  "ch.phones.metric.total": string;
  "ch.parts.eyebrow": string;
  "ch.parts.title": string;
  "ch.parts.accent": string;
  "ch.parts.description": string;
  "ch.parts.metric.inCatalog": string;
  "ch.parts.metric.models": string;
  "ch.accessories.eyebrow": string;
  "ch.accessories.title": string;
  "ch.accessories.accent": string;
  "ch.accessories.description": string;
  "ch.accessories.metric.inCatalog": string;
  "ch.used.eyebrow": string;
  "ch.used.title": string;
  "ch.used.accent": string;
  "ch.used.description": string;
  "ch.used.metric.forSale": string;
  "ch.used.metric.ottimo": string;
  "ch.used.metric.buono": string;
  "ch.used.metric.warranty": string;
  "ch.used.metric.warrantyValue": string;

  // ─── Catalog landing /prodotti ──────────────────────────────────────
  "catalog.land.sec.phones.title": string;
  "catalog.land.sec.phones.description": string;
  "catalog.land.sec.parts.title": string;
  "catalog.land.sec.parts.description": string;
  "catalog.land.sec.accessories.title": string;
  "catalog.land.sec.accessories.description": string;
  "catalog.land.featured.eyebrow": string;
  "catalog.land.featured.titleA": string;
  "catalog.land.featured.accent": string;
  "catalog.land.featured.titleB": string;
  "catalog.land.featured.cta": string;

  // ─── Pillars grid ───────────────────────────────────────────────────
  "pillars.section.eyebrow": string;
  "pillars.section.titleA": string;
  "pillars.section.accent": string;
  "pillars.section.intro": string;
  "pillars.buy.eyebrow": string;
  "pillars.buy.titleA": string;
  "pillars.buy.accent": string;
  "pillars.buy.body": string;
  "pillars.buy.b1": string;
  "pillars.buy.b2": string;
  "pillars.buy.b3": string;
  "pillars.buy.cta": string;
  "pillars.repair.eyebrow": string;
  "pillars.repair.titleA": string;
  "pillars.repair.accent": string;
  "pillars.repair.body": string;
  "pillars.repair.b1": string;
  "pillars.repair.b2": string;
  "pillars.repair.b3": string;
  "pillars.repair.cta": string;
  "pillars.resell.eyebrow": string;
  "pillars.resell.titleA": string;
  "pillars.resell.accent": string;
  "pillars.resell.body": string;
  "pillars.resell.b1": string;
  "pillars.resell.b2": string;
  "pillars.resell.b3": string;
  "pillars.resell.cta": string;
  "pillars.learn.eyebrow": string;
  "pillars.learn.titleA": string;
  "pillars.learn.accent": string;
  "pillars.learn.body": string;
  "pillars.learn.b1": string;
  "pillars.learn.b2": string;
  "pillars.learn.b3": string;
  "pillars.learn.cta": string;

  // ─── Brand marquee ──────────────────────────────────────────────────
  "marquee.shipping": string;
  "marquee.warranty": string;
  "marquee.freePickup": string;
  "marquee.stockVerified": string;

  // ─── Immersive pin (3D scroll) ──────────────────────────────────────
  "immersive.loading3D": string;
  "immersive.scrollHint": string;
  "immersive.m1.eyebrow": string;
  "immersive.m1.titleA": string;
  "immersive.m1.italic": string;
  "immersive.m1.body": string;
  "immersive.m2.eyebrow": string;
  "immersive.m2.titleA": string;
  "immersive.m2.italic": string;
  "immersive.m2.titleB": string;
  "immersive.m2.body": string;
  "immersive.m3.eyebrow": string;
  "immersive.m3.italic": string;
  "immersive.m3.titleA": string;
  "immersive.m3.body": string;
  "immersive.m3.cta": string;

  // ─── /riparazioni ───────────────────────────────────────────────────
  "rep.hero.eyebrow": string;
  "rep.hero.titleA": string;
  "rep.hero.accent": string;
  "rep.hero.description": string;
  "rep.hero.cta1": string;
  "rep.hero.cta2": string;
  "rep.hero.subtitle": string;
  "rep.how.eyebrow": string;
  "rep.how.titleA": string;
  "rep.how.accent": string;
  "rep.how.intro": string;
  "rep.how.s1.title": string;
  "rep.how.s1.text": string;
  "rep.how.s2.title": string;
  "rep.how.s2.text": string;
  "rep.how.s3.title": string;
  "rep.how.s3.text": string;
  "rep.how.s4.title": string;
  "rep.how.s4.text": string;
  "rep.intake.eyebrow": string;
  "rep.intake.titleA": string;
  "rep.intake.accent": string;
  "rep.intake.titleB": string;
  "rep.intake.intro": string;
  "rep.intake.opt1.eyebrow": string;
  "rep.intake.opt1.title": string;
  "rep.intake.opt1.text": string;
  "rep.intake.opt1.cta": string;
  "rep.intake.opt2.eyebrow": string;
  "rep.intake.opt2.title": string;
  "rep.intake.opt2.text": string;
  "rep.intake.opt2.cta": string;
  "rep.intake.opt3.eyebrow": string;
  "rep.intake.opt3.title": string;
  "rep.intake.opt3.text": string;
  "rep.intake.opt3.cta": string;
  "rep.request.eyebrow": string;
  "rep.request.titleA": string;
  "rep.request.accent": string;
  "rep.request.intro": string;

  // ─── Auth (B2B + customer) ──────────────────────────────────────────
  "auth.common.backToSite": string;
  "auth.common.backToLogin": string;
  "auth.common.passwordForgot": string;
  "auth.b2b.eyebrow": string;
  "auth.b2b.login.title": string;
  "auth.b2b.login.subtitle": string;
  "auth.b2b.login.sessionExpired": string;
  "auth.b2b.login.noCredentials": string;
  "auth.b2b.login.requestActivation": string;
  "auth.b2b.login.emailLabel": string;
  "auth.b2b.login.passwordLabel": string;
  "auth.b2b.login.emailPlaceholder": string;
  "auth.b2b.login.cta": string;
  "auth.b2b.login.ctaBusy": string;
  "auth.b2b.login.newReseller": string;
  "auth.b2b.login.newResellerCta": string;
  "auth.b2b.login.errInvalidCreds": string;
  "auth.b2b.login.errPending": string;
  "auth.b2b.login.errRejected": string;
  "auth.b2b.login.errNotB2B": string;
  "auth.b2b.login.errGeneric": string;
  "auth.b2b.register.eyebrow": string;
  "auth.b2b.register.title": string;
  "auth.b2b.register.subtitle": string;
  "auth.b2b.register.nameLabel": string;
  "auth.b2b.register.namePh": string;
  "auth.b2b.register.emailLabel": string;
  "auth.b2b.register.emailPh": string;
  "auth.b2b.register.companyLabel": string;
  "auth.b2b.register.companyPh": string;
  "auth.b2b.register.vatLabel": string;
  "auth.b2b.register.vatPh": string;
  "auth.b2b.register.phoneLabel": string;
  "auth.b2b.register.phonePh": string;
  "auth.b2b.register.consent": string;
  "auth.b2b.register.privacyLinkLabel": string;
  "auth.b2b.register.cta": string;
  "auth.b2b.register.ctaBusy": string;
  "auth.b2b.register.done.title": string;
  "auth.b2b.register.done.body": string;
  "auth.b2b.register.errGeneric": string;
  "auth.b2b.forgot.title": string;
  "auth.b2b.forgot.subtitle": string;
  "auth.b2b.forgot.emailLabel": string;
  "auth.b2b.forgot.emailPh": string;
  "auth.b2b.forgot.cta": string;
  "auth.b2b.forgot.ctaBusy": string;
  "auth.b2b.forgot.done.title": string;
  "auth.b2b.forgot.done.body": string;
  "auth.b2b.reset.eyebrow": string;
  "auth.b2b.reset.title": string;
  "auth.b2b.reset.subtitle": string;
  "auth.b2b.reset.passwordLabel": string;
  "auth.b2b.reset.cta": string;
  "auth.b2b.reset.ctaBusy": string;
  "auth.b2b.reset.done.title": string;
  "auth.b2b.reset.done.body": string;
  "auth.b2b.reset.done.cta": string;
  "auth.b2b.reset.invalidToken": string;
  "auth.b2b.reset.invalidLinkBefore": string;
  "auth.b2b.reset.invalidLinkAnchor": string;
  "auth.b2b.reset.minLengthHint": string;
  "auth.b2b.reset.titleInline": string;
  "auth.b2b.reset.confirmLabel": string;
  "auth.b2b.reset.errMinLength": string;
  "auth.b2b.reset.errMismatch": string;
  "auth.b2b.reset.errGeneric": string;
  "auth.b2b.reset.successTitle": string;
  "auth.b2b.reset.successBody": string;
  "auth.b2b.reset.submitting": string;
  "auth.b2b.reset.submit": string;
  "auth.customer.eyebrow": string;
  "auth.customer.title": string;
  "auth.customer.subtitle": string;
  "auth.customer.inlineTitle": string;
  "auth.customer.inlineSubtitle": string;
  "auth.customer.emailLabel": string;
  "auth.customer.emailPh": string;
  "auth.customer.passwordLabel": string;
  "auth.customer.cta": string;
  "auth.customer.ctaBusy": string;
  "auth.customer.errInvalidCreds": string;
  "auth.customer.errGeneric": string;
  "auth.customer.noCredentials": string;
  "auth.customer.noCredentialsHint": string;

  // ─── /negozi ────────────────────────────────────────────────────────
  "stores.hero.eyebrow": string;
  "stores.hero.titleA": string;
  "stores.hero.accent": string;
  "stores.hero.description": string;
  "stores.features.eyebrow": string;
  "stores.features.titleA": string;
  "stores.features.accent": string;
  "stores.features.intro": string;
  "stores.f1.title": string;
  "stores.f1.text": string;
  "stores.f2.title": string;
  "stores.f2.text": string;
  "stores.f3.title": string;
  "stores.f3.text": string;

  // ─── /chi-siamo ─────────────────────────────────────────────────────
  "about.hero.eyebrow": string;
  "about.hero.titleA": string;
  "about.hero.accent": string;
  "about.hero.description": string;
  "about.stat.products": string;
  "about.stat.brands": string;
  "about.stat.delivery": string;
  "about.stat.warranty": string;
  "about.brands.eyebrow": string;
  "about.brands.titleA": string;
  "about.brands.accent": string;
  "about.brands.intro": string;
  "about.b1.role": string;
  "about.b1.description": string;
  "about.b2.role": string;
  "about.b2.description": string;
  "about.b3.role": string;
  "about.b3.description": string;
  "about.b4.role": string;
  "about.b4.description": string;
  "about.manifesto.eyebrow": string;
  "about.manifesto.titleA": string;
  "about.manifesto.accent": string;
  "about.s1.title": string;
  "about.s1.description": string;
  "about.s2.title": string;
  "about.s2.description": string;
  "about.s3.title": string;
  "about.s3.description": string;

  // ─── /rivendi ───────────────────────────────────────────────────────
  "ti.hero.eyebrow": string;
  "ti.hero.titleA": string;
  "ti.hero.accent": string;
  "ti.hero.descA": string;
  "ti.hero.descBoldBonus": string;
  "ti.hero.descB": string;
  "ti.how.eyebrow": string;
  "ti.how.titleA": string;
  "ti.how.accent": string;
  "ti.how.intro": string;
  "ti.s1.title": string;
  "ti.s1.text": string;
  "ti.s2.title": string;
  "ti.s2.text": string;
  "ti.s3.title": string;
  "ti.s3.text": string;
  "ti.s4.title": string;
  "ti.s4.text": string;
  "ti.faq.eyebrow": string;
  "ti.faq.titleA": string;
  "ti.faq.accent": string;
  "ti.faq.titleB": string;
  "ti.faq.q1.q": string;
  "ti.faq.q1.a": string;
  "ti.faq.q2.q": string;
  "ti.faq.q2.a": string;
  "ti.faq.q3.q": string;
  "ti.faq.q3.a": string;
  "ti.faq.q4.q": string;
  "ti.faq.q4.a": string;
  "ti.faq.q5.q": string;
  "ti.faq.q5.a": string;
  "ti.faq.q6.q": string;
  "ti.faq.q6.a": string;
  "ti.faq.q7.q": string;
  "ti.faq.q7.a": string;
  "ti.faq.q8.q": string;
  "ti.faq.q8.a": string;

  // ─── /corsi ─────────────────────────────────────────────────────────
  "cou.hero.eyebrow": string;
  "cou.hero.titleA": string;
  "cou.hero.accent": string;
  "cou.hero.description": string;
  "cou.hero.cta1": string;
  "cou.hero.cta2": string;
  "cou.hero.subtitle": string;
  "cou.hero.reqName": string;
  "cou.levels.eyebrow": string;
  "cou.levels.titleA": string;
  "cou.levels.accent": string;
  "cou.levels.intro": string;
  "cou.levels.empty": string;
  "cou.tools.eyebrow": string;
  "cou.tools.titleA": string;
  "cou.tools.accent": string;
  "cou.tools.intro": string;
  "cou.tools.t1": string;
  "cou.tools.t2": string;
  "cou.tools.t3": string;
  "cou.tools.t4": string;
  "cou.tools.t5": string;
  "cou.tools.t6": string;
  "cou.cta.titleA": string;
  "cou.cta.accent": string;
  "cou.cta.intro": string;
  "cou.cta.cta": string;
  "cou.cta.reqName": string;
  "cou.card.priceOnReq": string;
  "cou.card.enroll": string;

  // ─── /apri-negozio ──────────────────────────────────────────────────
  "os.hero.eyebrow": string;
  "os.hero.titleA": string;
  "os.hero.accent": string;
  "os.hero.description": string;
  "os.hero.cta1": string;
  "os.hero.cta2": string;
  "os.hero.subtitle": string;
  "os.hero.reqName": string;
  "os.steps.eyebrow": string;
  "os.steps.titleA": string;
  "os.steps.accent": string;
  "os.steps.intro": string;
  "os.s1.title": string;
  "os.s1.text": string;
  "os.s2.title": string;
  "os.s2.text": string;
  "os.s3.title": string;
  "os.s3.text": string;
  "os.s4.title": string;
  "os.s4.text": string;
  "os.s5.title": string;
  "os.s5.text": string;
  "os.included.eyebrow": string;
  "os.included.titleA": string;
  "os.included.accent": string;
  "os.included.intro": string;
  "os.i1": string;
  "os.i2": string;
  "os.i3": string;
  "os.i4": string;
  "os.i5": string;
  "os.i6": string;
  "os.cta.titleA": string;
  "os.cta.accent": string;
  "os.cta.intro": string;
  "os.cta.cta": string;
  "os.cta.reqName": string;

  // ─── /diventa-partner ───────────────────────────────────────────────
  "bp.hero.eyebrow": string;
  "bp.hero.titleA": string;
  "bp.hero.accent": string;
  "bp.hero.description": string;
  "bp.hero.cta1": string;
  "bp.hero.cta2": string;
  "bp.hero.subtitle": string;
  "bp.hero.reqName": string;
  "bp.benefits.eyebrow": string;
  "bp.benefits.titleA": string;
  "bp.benefits.accent": string;
  "bp.benefits.intro": string;
  "bp.b1.title": string;
  "bp.b1.text": string;
  "bp.b2.title": string;
  "bp.b2.text": string;
  "bp.b3.title": string;
  "bp.b3.text": string;
  "bp.req.eyebrow": string;
  "bp.req.titleA": string;
  "bp.req.accent": string;
  "bp.req.intro": string;
  "bp.r1": string;
  "bp.r2": string;
  "bp.r3": string;
  "bp.r4": string;
  "bp.cta.titleA": string;
  "bp.cta.accent": string;
  "bp.cta.intro": string;
  "bp.cta.cta": string;
  "bp.cta.reqName": string;

  // ─── Repair Wizard ──────────────────────────────────────────────────
  "rw.step.device": string;
  "rw.step.repairs": string;
  "rw.step.service": string;
  "rw.cat.heading": string;
  "rw.cat.subheading": string;
  "rw.cat.smartphone": string;
  "rw.cat.tablet": string;
  "rw.cat.watch": string;
  "rw.cat.laptop": string;
  "rw.cat.desktop": string;
  "rw.cat.console": string;
  "rw.brand.heading": string;
  "rw.brand.subheading": string;
  "rw.brand.other": string;
  "rw.brand.back": string;
  "rw.model.heading": string;
  "rw.model.searchPh": string;
  "rw.model.orChoose": string;
  "rw.model.findMine": string;
  "rw.nonSmartphone.heading": string;
  "rw.nonSmartphone.intro": string;
  "rw.nonSmartphone.modelLabel": string;
  "rw.nonSmartphone.modelPh": string;

  // ─── Enum labels riusati ovunque ────────────────────────────────────
  "enum.condition.new": string;
  "enum.condition.used": string;
  "enum.condition.refurbished": string;
  "enum.usedCondition.ottimo": string;
  "enum.usedCondition.buono": string;
  "enum.usedCondition.discreto": string;
  "enum.usedCondition.rotto": string;
  "enum.repairStatus.accepted": string;
  "enum.repairStatus.diagnosed": string;
  "enum.repairStatus.in_repair": string;
  "enum.repairStatus.awaiting_parts": string;
  "enum.repairStatus.ready_for_pickup": string;
  "enum.repairStatus.delivered": string;
  "enum.repairStatus.cancelled": string;
};

const IT: Dict = {
  "chat.header.title": "Assistenza Cellcom",
  "chat.header.statusOnline": "Risposta in pochi minuti",
  "chat.header.statusStreaming": "Sta scrivendo…",
  "chat.header.closeAria": "Chiudi chat",
  "chat.fab.openAria": "Apri chat assistenza",
  "chat.fab.closeAria": "Chiudi chat assistenza",
  "chat.welcome":
    "Ciao — sono l'assistente Cellcom. Cerco prodotti, traccio riparazioni, indico negozi e ti apro la richiesta giusta. Da dove vuoi partire?",
  "chat.input.placeholder": "Scrivi un messaggio…",
  "chat.input.placeholderStreaming": "Attendi la risposta…",
  "chat.input.sendAria": "Invia messaggio",
  "chat.input.stopAria": "Ferma la risposta",
  "chat.input.charsLeft": (n) => `${n} caratteri rimasti`,
  "chat.bubble.streamingPolite": "L'assistente sta rispondendo, attendi prima di scrivere",
  "chat.bubble.errorBadge": "Errore — riprova",
  "chat.bubble.abortedBadge": "Risposta interrotta",
  "chat.bubble.truncatedBadge": "Risposta troncata — riformula per continuare",
  "chat.error.networkFallback":
    "Connessione persa. Riprova o apri una richiesta diretta →",
  "chat.error.tooManyRequests": "Troppe richieste, riprova fra qualche minuto",
  "chat.quickReply.buyPhone": "Compra un telefono",
  "chat.quickReply.repairScreen": "Mi si è rotto lo schermo",
  "chat.quickReply.sellUsed": "Vendo il mio usato",
  "chat.quickReply.reseller": "Sono un rivenditore",
  "chat.quickReply.userBuyPhone": "Voglio comprare un telefono",
  "chat.quickReply.userRepairScreen": "Mi si è rotto lo schermo, come si fa?",
  "chat.quickReply.userSellUsed": "Vorrei vendere il mio telefono usato",
  "chat.quickReply.userReseller":
    "Sono un rivenditore, come accedo ai prezzi B2B?",
  "chat.toolLabel.searchProducts": "Cerco nel catalogo…",
  "chat.toolLabel.getProductBySlug": "Apro la scheda prodotto…",
  "chat.toolLabel.searchUsedDevices": "Cerco tra l'usato garantito…",
  "chat.toolLabel.lookupRepair": "Cerco il ticket riparazione…",
  "chat.toolLabel.listStores": "Recupero i negozi…",
  "chat.toolLabel.openRequestForm": "Preparo la richiesta…",
  "chat.toolLabel.getHealth": "Verifico lo stato del sistema…",
  "chat.regionAria": "Chat assistenza Cellcom",
  "chat.openAnnounce": "Chat assistenza aperta",

  "lang.label": "Lingua",
  "lang.it": "Italiano",
  "lang.en": "English",
  "lang.switchAria": "Cambia lingua",

  "nav.products": "Prodotti",
  "nav.used": "Usato",
  "nav.repairs": "Riparazioni",
  "nav.resell": "Rivendi",
  "nav.courses": "Corsi",
  "nav.stores": "Negozi",
  "nav.about": "Chi siamo",
  "nav.login": "Area clienti",
  "nav.b2b": "Area B2B",
  "nav.repairCta": "Ripara ora",
  "nav.customerArea": "Area clienti",
  "nav.openMenu": "Apri menu",
  "nav.closeMenu": "Chiudi menu",

  "footer.copyrightGroup": "Cellcom Group",
  "footer.legal.privacy": "Privacy",
  "footer.legal.cookie": "Cookie",
  "footer.legal.terms": "Termini",

  "hero.pillar.buy": "Compra",
  "hero.pillar.repair": "Ripara",
  "hero.pillar.resell": "Rivendi",
  "hero.pillar.learn": "Impara",
  "hero.pillar.b2b": "B2B",

  "trust.shipping.value": "Spedizione 24-48h",
  "trust.shipping.desc": "Con corrieri selezionati in tutta Italia.",
  "trust.warranty.value": "Garanzia 12 mesi",
  "trust.warranty.desc": "Su prodotti, ricambi e riparazioni.",
  "trust.technician.value": "Tecnici Fast-Fix",
  "trust.technician.desc": "Laboratorio interno, diagnosi in giornata.",
  "trust.b2b.value": "Supporto B2B",
  "trust.b2b.desc": "Account manager dedicato per i rivenditori.",
  "hero.catalogCta.eyebrow": "Catalogo completo",
  "hero.catalogCta.title": "Tutti gli smartphone, ricambi, accessori",
  "hero.catalogCta.explore": "Esplora",
  "hero.pricesReservedHint": "Prezzo riservato → accedi",
  "hero.newDevicesEyebrow": "Nuovi in catalogo",
  "hero.priceOnRequest": "Su richiesta",
  "hero.claim.preItalic": "Vendiamo,",
  "hero.claim.italicA": "ripariamo",
  "hero.claim.between": ", riforniamo",
  "hero.claim.italicB": "chi li vende",
  "hero.intro.lead": "Tre attività, un solo magazzino.",
  "hero.intro.boldA": "Vendita al pubblico",
  "hero.intro.bodyA": " di smartphone, accessori e ricambi.",
  "hero.intro.boldB": "Centro assistenza",
  "hero.intro.bodyB": " con laboratorio interno e garanzia 12 mesi.",
  "hero.intro.boldC": "Ingrosso B2B",
  "hero.intro.bodyC": " per rivenditori, centri assistenza e aziende.",

  "home.numbers.eyebrow": "I numeri del gruppo",
  "home.numbers.titleA": "Tre brand. Un solo",
  "home.numbers.titleB": "magazzino.",
  "home.numbers.intro":
    "Cellcom (e-commerce + B2B), Fast-Fix (negozi e riparazioni), ItalianParts (ricambi). Specializzati ognuno nel suo, stesso stock dietro le quinte. I numeri qui sotto arrivano live dal CRM — niente vetrine vuote.",
  "home.numbers.stat.brands": "Brand del gruppo",
  "home.numbers.stat.parts": "Ricambi a stock",
  "home.numbers.stat.phones": "Telefoni in catalogo",
  "home.numbers.stat.accessories": "Accessori disponibili",
  "home.numbers.cta.catalog": "Vai al catalogo",
  "home.numbers.cta.about": "Chi siamo",
  "home.b2b.eyebrow": "Per rivenditori, operatori, aziende",
  "home.b2b.titleA": "Vendi telefoni per mestiere?",
  "home.b2b.titleB": "Il listino giusto cambia tutto.",
  "home.b2b.intro":
    "Stesso stock del pubblico, prezzi a volumi, account manager dedicato, pagamento a 30/60 giorni. Serve solo P.IVA: chiamiamo noi in giornata, credenziali entro 24 ore.",
  "home.b2b.feature1.title": "Listino a tier",
  "home.b2b.feature1.body":
    "Rivenditore, Operatore, VIP — il prezzo scende automatico al volume. Niente da chiedere ogni volta.",
  "home.b2b.feature2.title": "Stock prioritario",
  "home.b2b.feature2.body":
    "Ricambi scarsi riservati prima a chi ha contratto attivo, poi al pubblico.",
  "home.b2b.feature3.title": "Una persona vera",
  "home.b2b.feature3.body":
    "Account manager dedicato. Email diretta, WhatsApp business. Sa chi sei.",
  "home.b2b.cta.login": "Accedi all'area B2B",
  "home.b2b.cta.contact": "Richiedi attivazione",

  "pg.filter.all": "Tutte",
  "pg.cat.smartphone": "Smartphone",
  "pg.cat.part": "Ricambio",
  "pg.stock.outOfStock": "Esaurito",
  "pg.stock.checkAvailable": "Verifica disponibilità",
  "pg.stock.lastN": (n) => `Ultimi ${n} pezzi`,
  "pg.stock.available": "Disponibile",
  "pg.price.onRequest": "Su richiesta",
  "pg.price.hiddenTooltip":
    "Il prezzo pubblico non è esposto per questo articolo. Contattaci per il listino.",
  "pg.price.reserved": "Prezzo riservato",
  "pg.cta.loginForPrice": "Accedi per il prezzo",
  "pg.cta.notifyWhenBack": "Avvisami quando torna",
  "pg.cta.buyOn": (channel) => `Acquista su ${channel}`,
  "pg.empty": "Nessun prodotto trovato.",

  "bc.home": "Home",
  "bc.products": "Prodotti",
  "bc.phones": "Telefoni",
  "bc.parts": "Ricambi",
  "bc.accessories": "Accessori",
  "bc.used": "Usato",
  "bc.repairs": "Riparazioni",
  "bc.aboutUs": "Chi siamo",
  "bc.stores": "Negozi",
  "bc.courses": "Corsi",
  "bc.openStore": "Apri un negozio",
  "bc.becomePartner": "Diventa partner",
  "bc.tradeIn": "Rivendi",
  "bc.tracker": "Traccia riparazione",

  "ch.products.eyebrow": "Magazzino unificato del Gruppo",
  "ch.products.title": "Il nostro",
  "ch.products.accent": "catalogo",
  "ch.products.description":
    "Telefoni, ricambi, accessori. Disponibilità reale dai canali del Gruppo Cellcom: nuovo, ricondizionato e usato garantito.",
  "ch.phones.eyebrow": "Smartphone",
  "ch.phones.title": "I nostri",
  "ch.phones.accent": "telefoni",
  "ch.phones.description":
    "Apple, Samsung, Google, Xiaomi e tutti i brand principali. IMEI verificato, batteria sopra l'80% per il ricondizionato, report tecnico per l'usato.",
  "ch.phones.metric.new": "Nuovi",
  "ch.phones.metric.refurbished": "Ricondizionati",
  "ch.phones.metric.used": "Usati",
  "ch.phones.metric.total": "Totale",
  "ch.parts.eyebrow": "Ricambi",
  "ch.parts.title": "I nostri",
  "ch.parts.accent": "ricambi",
  "ch.parts.description":
    "Display, batterie, scocche, schede madri e vetri posteriori. Originali e compatibili certificati. Filtra per brand e modello: il pezzo giusto al primo colpo.",
  "ch.parts.metric.inCatalog": "A catalogo",
  "ch.parts.metric.models": "Modelli compatibili",
  "ch.accessories.eyebrow": "Accessori",
  "ch.accessories.title": "I nostri",
  "ch.accessories.accent": "accessori",
  "ch.accessories.description":
    "Cover, vetri temprati, caricabatterie veloci, cavi USB-C e Lightning originali, cuffie wireless. Compatibilità verificata, garanzia inclusa.",
  "ch.accessories.metric.inCatalog": "A catalogo",
  "ch.used.eyebrow": "Usato garantito",
  "ch.used.title": "Usato",
  "ch.used.accent": "testato e garantito",
  "ch.used.description":
    "Ogni telefono passa dal nostro laboratorio: IMEI verificato, batteria controllata, report tecnico e garanzia inclusa. Quello che vedi è disponibile davvero — quando si vende, sparisce dal listino.",
  "ch.used.metric.forSale": "In vendita",
  "ch.used.metric.ottimo": "Ottimo",
  "ch.used.metric.buono": "Buono",
  "ch.used.metric.warranty": "Mesi di garanzia",
  "ch.used.metric.warrantyValue": "fino a 12",

  "catalog.land.sec.phones.title": "Telefoni",
  "catalog.land.sec.phones.description":
    "Nuovi sigillati, ricondizionati certificati, usati testati. Apple, Samsung, Xiaomi, Google Pixel e tutti i principali brand.",
  "catalog.land.sec.parts.title": "Ricambi",
  "catalog.land.sec.parts.description":
    "Display, batterie, scocche, schede madri, vetri posteriori. Filtra per modello e ricevi il pezzo giusto al primo colpo.",
  "catalog.land.sec.accessories.title": "Accessori",
  "catalog.land.sec.accessories.description":
    "Cover, vetri temprati, caricabatterie veloci, cavi MFi e USB-C, cuffie wireless. Tutto con garanzia inclusa.",
  "catalog.land.featured.eyebrow": "In evidenza",
  "catalog.land.featured.titleA": "I più",
  "catalog.land.featured.accent": "richiesti",
  "catalog.land.featured.titleB": "del momento",
  "catalog.land.featured.cta": "Vedi tutti i telefoni",

  "pillars.section.eyebrow": "Phone lifecycle hub",
  "pillars.section.titleA": "Quattro cose,",
  "pillars.section.accent": "un solo posto.",
  "pillars.section.intro":
    "Compri, ripari, rivendi, impari. Stesso magazzino, stesse persone, stessa garanzia.",
  "pillars.buy.eyebrow": "Compra",
  "pillars.buy.titleA": "Il prossimo telefono.",
  "pillars.buy.accent": "Anche ricondizionato.",
  "pillars.buy.body":
    "Nuovi, ricondizionati e usati testati. Tutti i brand, un solo magazzino, garanzia 12 mesi su tutto.",
  "pillars.buy.b1": "Spedizione 24-48h in Italia",
  "pillars.buy.b2": "Ritiro gratis nei negozi",
  "pillars.buy.b3": "Rate Klarna/Scalapay disponibili",
  "pillars.buy.cta": "Sfoglia il catalogo",
  "pillars.repair.eyebrow": "Ripara",
  "pillars.repair.titleA": "Quasi tutto si ripara,",
  "pillars.repair.accent": "e in 24 ore.",
  "pillars.repair.body":
    "Schermo, batteria, scheda madre, scocca. Diagnosi gratuita, preventivo prima di toccarlo, sigillo davanti a te.",
  "pillars.repair.b1": "Garanzia 12 mesi su lavoro e ricambi",
  "pillars.repair.b2": "Microsaldatura BGA in laboratorio",
  "pillars.repair.b3": "Ritiro, spedizione o negozio",
  "pillars.repair.cta": "Richiedi riparazione",
  "pillars.resell.eyebrow": "Rivendi",
  "pillars.resell.titleA": "Il tuo vecchio telefono",
  "pillars.resell.accent": "vale ancora.",
  "pillars.resell.body":
    "Valutazione gratis dalle foto in 24 ore. Spedizione o ritiro gratis, pagamento entro 48 ore.",
  "pillars.resell.b1": "Bonus +10% in credito Cellcom",
  "pillars.resell.b2": "Quotazione scritta, niente trucchi",
  "pillars.resell.b3": "Ritiriamo anche telefoni rotti",
  "pillars.resell.cta": "Valuta il tuo usato",
  "pillars.learn.eyebrow": "Impara",
  "pillars.learn.titleA": "Diventa",
  "pillars.learn.accent": "tecnico riparatore.",
  "pillars.learn.body":
    "Tre livelli alla Cellcom Academy: base, intermedio, microsaldatura BGA. Gli stessi formatori dei nostri tecnici.",
  "pillars.learn.b1": "Postazioni ESD professionali",
  "pillars.learn.b2": "Aule limitate a 6 allievi",
  "pillars.learn.b3": "Attestato + sbocco interno",
  "pillars.learn.cta": "Scopri i corsi",

  "marquee.shipping": "Spedizione 24-48h",
  "marquee.warranty": "Garanzia 12 mesi",
  "marquee.freePickup": "Ritiro gratis in negozio",
  "marquee.stockVerified": "Stock verificato dal CRM",

  "immersive.loading3D": "Caricamento 3D…",
  "immersive.scrollHint": "Scrolla",
  "immersive.m1.eyebrow": "Phone Lifecycle",
  "immersive.m1.titleA": "Tutto il telefono,",
  "immersive.m1.italic": "una sola casa.",
  "immersive.m1.body":
    "Dal primo acquisto fino al riciclo — quattro servizi, un solo gruppo.",
  "immersive.m2.eyebrow": "Lo riparo, lo ricondiziono",
  "immersive.m2.titleA": "Quasi tutto si",
  "immersive.m2.italic": "ripara",
  "immersive.m2.titleB": ", e in 24 ore.",
  "immersive.m2.body":
    "Microscopio, microsaldatura, ricambi originali. Garanzia 12 mesi.",
  "immersive.m3.eyebrow": "E quando hai finito",
  "immersive.m3.italic": "Vale ancora.",
  "immersive.m3.titleA": "Lo ricompriamo noi.",
  "immersive.m3.body":
    "Valutazione gratis, spedizione gratis, pagamento entro 48h.",
  "immersive.m3.cta": "Scopri come",

  "rep.hero.eyebrow": "Fast-Fix · Centro riparazioni del Gruppo",
  "rep.hero.titleA": "Quale dispositivo",
  "rep.hero.accent": "vuoi riparare?",
  "rep.hero.description":
    "Trova il modello, dicci cosa non va, scegli se portarcelo, spedirlo o farti ritirare a casa. Diagnosi gratuita, preventivo entro 24 ore, garanzia 12 mesi su lavoro e ricambi.",
  "rep.hero.cta1": "Inizia la richiesta",
  "rep.hero.cta2": "Ho già un ticket → traccialo",
  "rep.hero.subtitle":
    "Diagnosi gratuita · Preventivo entro 24h · Nessun costo se rifiuti",
  "rep.how.eyebrow": "Come funziona",
  "rep.how.titleA": "Dal primo messaggio al telefono",
  "rep.how.accent": "come nuovo.",
  "rep.how.intro":
    "Quattro passi tracciati dal nostro gestionale. Nessuna sorpresa sul prezzo, niente \"richiami giovedì\": appena cambia qualcosa ti scriviamo.",
  "rep.how.s1.title": "Ci dici cos'è successo",
  "rep.how.s1.text":
    "Apri una richiesta qui sotto o chiama il negozio più vicino. Modello, problema (vetro rotto, batteria, non si accende…), una stima del danno. Niente di tecnico — basta spiegare cosa hai visto.",
  "rep.how.s2.title": "Diagnosi gratuita",
  "rep.how.s2.text":
    "Un nostro tecnico verifica il telefono entro 24-48h dall'arrivo. Se serve smontarlo, lo smontiamo, fotografiamo i componenti e ti mandiamo un preventivo scritto. Decidi tu — nessun obbligo, nessun costo se rifiuti.",
  "rep.how.s3.title": "Riparazione in laboratorio",
  "rep.how.s3.text":
    "Approvato il preventivo, lavoriamo nel laboratorio interno con ricambi originali o certificati. Microscopio per microsaldatura, calibrazione True Tone, sigillatura impermeabile rifatta. Tipici: 24h batteria/schermo, 3-5 giorni scheda madre.",
  "rep.how.s4.title": "Ritiro o consegna",
  "rep.how.s4.text":
    "Quando è pronto ti avvisiamo via SMS/email. Vieni a ritirarlo in negozio oppure te lo rispediamo gratis. Garanzia 12 mesi sul ricambio E sulla manodopera — se torna il problema entro l'anno, intervento gratuito.",
  "rep.intake.eyebrow": "Come ce lo fai arrivare",
  "rep.intake.titleA": "Tre modi per",
  "rep.intake.accent": "portarcelo",
  "rep.intake.titleB": "— scegli il più comodo.",
  "rep.intake.intro":
    "Non vendiamo solo nei negozi fisici: lavoriamo in tutta Italia. Qualunque opzione scegli, il telefono entra nel nostro gestionale e segui lo stato in tempo reale.",
  "rep.intake.opt1.eyebrow": "Opzione 1",
  "rep.intake.opt1.title": "Portacelo in negozio",
  "rep.intake.opt1.text":
    "Vieni in uno dei punti vendita del Gruppo. Diagnosi sul momento se è disponibile un tecnico, altrimenti ricevuta e chiamata entro 24h con preventivo.",
  "rep.intake.opt1.cta": "Trova negozio più vicino",
  "rep.intake.opt2.eyebrow": "Opzione 2",
  "rep.intake.opt2.title": "Spediscilo a noi",
  "rep.intake.opt2.text":
    "Niente negozio vicino? Ti mandiamo il kit di spedizione assicurata: imbusti, lasci al corriere, te lo rispediamo gratis a riparazione conclusa.",
  "rep.intake.opt2.cta": "Richiedi kit di spedizione",
  "rep.intake.opt3.eyebrow": "Opzione 3",
  "rep.intake.opt3.title": "Lo veniamo a prendere",
  "rep.intake.opt3.text":
    "Solo in alcune zone (San Benedetto del Tronto e provincia, principali città di Marche e Abruzzo su richiesta). Passiamo a ritirare, riportiamo riparato. Disponibile sopra una soglia minima.",
  "rep.intake.opt3.cta": "Verifica la tua zona",
  "rep.request.eyebrow": "Wizard riparazione",
  "rep.request.titleA": "Quale telefono",
  "rep.request.accent": "vuoi riparare?",
  "rep.request.intro":
    "Tre passi rapidi: telefono → problema → come fartelo arrivare. Diagnosi gratuita, nessun impegno fino al preventivo.",

  "auth.common.backToSite": "← Torna al sito pubblico",
  "auth.common.backToLogin": "← Torna al login",
  "auth.common.passwordForgot": "Password dimenticata?",
  "auth.b2b.eyebrow": "Area B2B",
  "auth.b2b.login.title": "Accedi al tuo listino",
  "auth.b2b.login.subtitle":
    "Prezzi riservati per rivenditori, operatori e aziende del Gruppo.",
  "auth.b2b.login.sessionExpired":
    "Sessione scaduta. Effettua di nuovo l'accesso.",
  "auth.b2b.login.noCredentials": "Non hai ancora le credenziali?",
  "auth.b2b.login.requestActivation": "Richiedi attivazione →",
  "auth.b2b.login.emailLabel": "Email",
  "auth.b2b.login.passwordLabel": "Password",
  "auth.b2b.login.emailPlaceholder": "nome@azienda.it",
  "auth.b2b.login.cta": "Accedi all'area B2B →",
  "auth.b2b.login.ctaBusy": "Accesso in corso…",
  "auth.b2b.login.newReseller": "Sono nuovo rivenditore —",
  "auth.b2b.login.newResellerCta": "registrami →",
  "auth.b2b.login.errInvalidCreds": "Credenziali non valide",
  "auth.b2b.login.errPending":
    "Il tuo account è in attesa di approvazione dal nostro staff. Riceverai una mail appena sarà attivo.",
  "auth.b2b.login.errRejected":
    "La richiesta di account B2B è stata rifiutata. Contattaci per maggiori informazioni.",
  "auth.b2b.login.errNotB2B":
    "Questo account non è abilitato all'area B2B. Registra un'azienda per accedere.",
  "auth.b2b.login.errGeneric": "Errore di accesso",
  "auth.b2b.register.eyebrow": "Diventa rivenditore",
  "auth.b2b.register.title": "Registrati come rivenditore",
  "auth.b2b.register.subtitle":
    "Lasciaci i dati della tua attività. Lo staff Cellcom verifica la richiesta entro 24h lavorative e ti manda una mail per impostare la password.",
  "auth.b2b.register.nameLabel": "Nome e cognome referente *",
  "auth.b2b.register.namePh": "Mario Rossi",
  "auth.b2b.register.emailLabel": "Email aziendale *",
  "auth.b2b.register.emailPh": "nome@azienda.it",
  "auth.b2b.register.companyLabel": "Ragione sociale *",
  "auth.b2b.register.companyPh": "Es. Rivenditore srl",
  "auth.b2b.register.vatLabel": "P.IVA",
  "auth.b2b.register.vatPh": "01234567890",
  "auth.b2b.register.phoneLabel": "Telefono",
  "auth.b2b.register.phonePh": "+39 091 1234567",
  "auth.b2b.register.consent":
    "Acconsento al trattamento dei miei dati personali da parte di Cellcom Smartphone Fix SRLS per gestire la richiesta di attivazione dell'account rivenditore (art. 13 GDPR — Reg. UE 2016/679).",
  "auth.b2b.register.privacyLinkLabel": "Leggi l'informativa privacy",
  "auth.b2b.register.cta": "Invia la richiesta →",
  "auth.b2b.register.ctaBusy": "Invio…",
  "auth.b2b.register.done.title": "Richiesta inviata.",
  "auth.b2b.register.done.body":
    "Ti contatteremo via email entro 24h lavorative. Una volta approvato riceverai un link per impostare la password e accedere all'area B2B con i prezzi a volumi.",
  "auth.b2b.register.errGeneric": "Errore nell'invio",
  "auth.b2b.forgot.title": "Password dimenticata",
  "auth.b2b.forgot.subtitle":
    "Inserisci la tua email B2B. Se l'account esiste ti mandiamo un link per impostare una nuova password.",
  "auth.b2b.forgot.emailLabel": "Email",
  "auth.b2b.forgot.emailPh": "azienda@email.it",
  "auth.b2b.forgot.cta": "Manda il link →",
  "auth.b2b.forgot.ctaBusy": "Invio…",
  "auth.b2b.forgot.done.title": "Richiesta inviata.",
  "auth.b2b.forgot.done.body":
    "Se l'email è registrata come account B2B, riceverai un link entro qualche minuto. Controlla anche la cartella spam.",
  "auth.b2b.reset.eyebrow": "Reimposta password",
  "auth.b2b.reset.title": "Nuova password",
  "auth.b2b.reset.subtitle":
    "Imposta una nuova password per il tuo account B2B. Minimo 8 caratteri.",
  "auth.b2b.reset.passwordLabel": "Nuova password",
  "auth.b2b.reset.cta": "Imposta password →",
  "auth.b2b.reset.ctaBusy": "Invio…",
  "auth.b2b.reset.done.title": "Password aggiornata.",
  "auth.b2b.reset.done.body":
    "La tua password è stata cambiata. Puoi accedere all'area B2B con le nuove credenziali.",
  "auth.b2b.reset.done.cta": "Vai al login →",
  "auth.b2b.reset.invalidToken": "Link non valido o scaduto",
  "auth.b2b.reset.invalidLinkBefore":
    "Link non valido. Richiedi un nuovo invio dalla",
  "auth.b2b.reset.invalidLinkAnchor": "pagina password dimenticata",
  "auth.b2b.reset.minLengthHint":
    "Almeno 8 caratteri. Tutte le tue sessioni attive verranno revocate.",
  "auth.b2b.reset.titleInline": "Imposta una nuova password",
  "auth.b2b.reset.confirmLabel": "Conferma password",
  "auth.b2b.reset.errMinLength": "La password deve avere almeno 8 caratteri",
  "auth.b2b.reset.errMismatch": "Le due password non coincidono",
  "auth.b2b.reset.errGeneric": "Operazione non riuscita",
  "auth.b2b.reset.successTitle": "Password aggiornata.",
  "auth.b2b.reset.successBody": "Ti porto al login…",
  "auth.b2b.reset.submitting": "Aggiorno…",
  "auth.b2b.reset.submit": "Imposta nuova password →",
  "auth.customer.eyebrow": "Area clienti",
  "auth.customer.title": "Accedi al tuo account",
  "auth.customer.subtitle":
    "Lo stato delle tue riparazioni, i preventivi da approvare e i corsi a cui sei iscritto.",
  "auth.customer.inlineTitle": "Accedi",
  "auth.customer.inlineSubtitle":
    "Vedi le tue riparazioni, i preventivi e i prezzi riservati.",
  "auth.customer.emailLabel": "Email",
  "auth.customer.emailPh": "nome@email.it",
  "auth.customer.passwordLabel": "Password",
  "auth.customer.cta": "Accedi →",
  "auth.customer.ctaBusy": "Accesso in corso…",
  "auth.customer.errInvalidCreds": "Credenziali non valide",
  "auth.customer.errGeneric": "Errore",
  "auth.customer.noCredentials": "Non hai ancora le credenziali?",
  "auth.customer.noCredentialsHint":
    "Porta un dispositivo in riparazione: ti arriverà via email un link per impostare la password.",

  "stores.hero.eyebrow": "I punti vendita",
  "stores.hero.titleA": "I nostri",
  "stores.hero.accent": "negozi.",
  "stores.hero.description":
    "Trova il punto vendita più vicino tra i brand del Gruppo Cellcom. Centri assistenza, magazzino ricambi, vendita al pubblico — tutti gli orari, gli indirizzi e i contatti in tempo reale.",
  "stores.features.eyebrow": "Cosa puoi fare in negozio",
  "stores.features.titleA": "Non solo vendita —",
  "stores.features.accent": "servizi completi.",
  "stores.features.intro":
    "Ogni punto vendita del Gruppo offre molto più dello scaffale: riparazioni, valutazione usato, consulenza commerciale per rivenditori che hanno bisogno di assistenza fisica.",
  "stores.f1.title": "Diagnosi sul momento",
  "stores.f1.text":
    "Porti il device in negozio, se c'è un tecnico disponibile lo vede in 10 minuti e ti dice cosa serve.",
  "stores.f2.title": "Ritiro ordini gratuito",
  "stores.f2.text":
    "Ordini online e ritiri in qualsiasi punto vendita del Gruppo senza spese di spedizione.",
  "stores.f3.title": "Trade-in al banco",
  "stores.f3.text":
    "Porti il tuo vecchio telefono, lo valutiamo davanti a te, esci con bonifico o credito Cellcom.",

  "about.hero.eyebrow": "Il gruppo",
  "about.hero.titleA": "Cinque brand. Una sola",
  "about.hero.accent": "fiducia.",
  "about.hero.description":
    "Vendiamo, ripariamo e riforniamo telefoni. Siamo di San Benedetto del Tronto, ma lavoriamo in tutta Italia. Tre brand specializzati, un magazzino solo, le stesse persone dietro a tutto.",
  "about.stat.products": "Prodotti a catalogo",
  "about.stat.brands": "Brand verticali",
  "about.stat.delivery": "Consegna in Italia",
  "about.stat.warranty": "Garanzia ricambi",
  "about.brands.eyebrow": "I 5 brand",
  "about.brands.titleA": "Un gruppo,",
  "about.brands.accent": "cinque specializzazioni.",
  "about.brands.intro":
    "Ogni marchio fa una cosa sola e la fa bene. Insieme coprono l'intero ciclo di vita del telefono: vendita, riparazione, ricambi, formazione, software. Stesso magazzino, stessi standard.",
  "about.b1.role": "Magazzino B2B",
  "about.b1.description":
    "L'ingrosso del gruppo. Vendiamo a rivenditori, centri assistenza e aziende con listini a volumi.",
  "about.b2.role": "Negozi e riparazioni",
  "about.b2.description":
    "I punti vendita fisici dove porti il telefono a riparare o vieni a comprarne uno nuovo.",
  "about.b3.role": "Ricambi",
  "about.b3.description":
    "Display, batterie, scocche, schede madri. Per chi ripara smartphone di mestiere.",
  "about.b4.role": "Academy",
  "about.b4.description":
    "La scuola interna dove formiamo i nostri tecnici. Aperta anche a chi vuole imparare il mestiere.",
  "about.manifesto.eyebrow": "Cosa ci distingue",
  "about.manifesto.titleA": "Tre principi,",
  "about.manifesto.accent": "non negoziabili.",
  "about.s1.title": "Prezzi onesti",
  "about.s1.description":
    "Stessi listini su tutti i nostri canali. Quello che vedi al pubblico è quello che paga il pubblico — il B2B paga meno, ma solo se compra a volumi.",
  "about.s2.title": "Ogni intervento tracciato",
  "about.s2.description":
    "Sei riparazioni o ordini entrano nel gestionale, lo vedi anche tu in tempo reale. Foto del device, ricambi usati, tecnico responsabile — tutto registrato.",
  "about.s3.title": "Una specializzazione per brand",
  "about.s3.description":
    "I brand del Gruppo fanno ognuno una cosa sola e la fanno seriamente. Mettendoli insieme copriamo tutto il ciclo di vita del telefono.",

  "ti.hero.eyebrow": "Trade-in Cellcom",
  "ti.hero.titleA": "Il tuo vecchio telefono",
  "ti.hero.accent": "vale ancora.",
  "ti.hero.descA":
    "Dicci che telefono hai e in che condizioni è. I tecnici lo valutano gratuitamente dopo aver ricevuto le foto e ti rispondono via email entro poche ore. Spedizione gratuita o ritiro nei negozi. Bonus ",
  "ti.hero.descBoldBonus": "+10%",
  "ti.hero.descB": " se scegli credito spendibile sul Gruppo Cellcom.",
  "ti.how.eyebrow": "Come funziona",
  "ti.how.titleA": "Quattro passi,",
  "ti.how.accent": "zero sorprese.",
  "ti.how.intro":
    "Dalla compilazione al pagamento, tutto tracciato. Niente algoritmi opachi, niente offerte gonfiate che poi scendono al ricevimento — la persona che ti scrive il prezzo è la stessa che controlla il telefono in laboratorio.",
  "ti.s1.title": "Compila il form",
  "ti.s1.text":
    "Scegli marca, modello, memoria e condizione del tuo telefono. Bastano 30 secondi, niente account.",
  "ti.s2.title": "Foto via email",
  "ti.s2.text":
    "Ti scriviamo entro poche ore chiedendoti 4-6 foto guidate (fronte, retro, IMEI, schermo acceso).",
  "ti.s3.title": "Valutazione personalizzata",
  "ti.s3.text":
    "Un tecnico verifica le foto e ti manda la valutazione dedicata via email — niente algoritmi, una persona vera.",
  "ti.s4.title": "Spedizione + pagamento",
  "ti.s4.text":
    "Accetti, spedizione gratis o ritiro in negozio. Controllo finale e pagamento entro 48h.",
  "ti.faq.eyebrow": "FAQ",
  "ti.faq.titleA": "Le",
  "ti.faq.accent": "domande",
  "ti.faq.titleB": "che ci fanno tutti.",
  "ti.faq.q1.q": "Perché non vedo subito un prezzo?",
  "ti.faq.q1.a":
    "Perché vogliamo darti una valutazione onesta, non un range generico tirato a caso. I nostri tecnici controllano le foto vere del tuo telefono — vetro, schermo, segni d'uso reali — e ti scrivono il prezzo esatto che ti pagheremmo. Niente sorprese al ricevimento.",
  "ti.faq.q2.q": "Quanto ci mette davvero ad arrivare l'offerta?",
  "ti.faq.q2.a":
    "Entro 24 ore lavorative dall'invio delle foto. Spesso anche più velocemente — i nostri tecnici lavorano dal lunedì al sabato.",
  "ti.faq.q3.q": "Quando ricevo la valutazione finale?",
  "ti.faq.q3.a":
    "Subito dopo che ci hai inviato le foto. Se la spedizione corrisponde alle foto, paghiamo esattamente la cifra dell'email. Se trovassimo qualcosa che non avevamo visto nelle foto, ti contattiamo prima di chiudere la pratica — sei libero di accettare o ritirare gratis.",
  "ti.faq.q4.q": "Come funziona la spedizione gratuita?",
  "ti.faq.q4.a":
    "Dopo che accetti l'offerta ti mandiamo un'etichetta prepagata via email. Spedisci da qualsiasi ufficio postale con il telefono ben imballato (idealmente in scatola originale). In alternativa fissi un appuntamento e te lo ritiriamo a casa.",
  "ti.faq.q5.q": "Cos'è il bonus +10% per il credito Cellcom?",
  "ti.faq.q5.a":
    "Se invece del bonifico scegli credito spendibile sui siti del Gruppo Cellcom, maggioriamo l'offerta del 10%. Esempio: offerta €500 → credito €550. Valido 24 mesi.",
  "ti.faq.q6.q": "Comprate solo telefoni o anche tablet, smartwatch?",
  "ti.faq.q6.a":
    "Adesso solo smartphone. Tablet, smartwatch, AirPods, console: scrivici a hello@cellcom.it e ti diciamo cosa possiamo fare caso per caso.",
  "ti.faq.q7.q": "Il mio telefono è rotto, posso venderlo lo stesso?",
  "ti.faq.q7.a":
    "Sì ma cambia il flusso. Per schermi rotti, batterie guaste, telefoni che non accendono: meglio passare prima dal nostro centro riparazioni. Spesso ripariamo a costo basso e poi il valore di rivendita sale del 3-5x.",
  "ti.faq.q8.q": "Il mio modello non è nella lista, cosa faccio?",
  "ti.faq.q8.a":
    "Seleziona 'Altro / non in lista' e scrivi marca e modello a mano. Il nostro tecnico farà la valutazione esattamente come per i modelli in lista.",

  "cou.hero.eyebrow": "Cellcom Academy",
  "cou.hero.titleA": "Impara a riparare,",
  "cou.hero.accent": "come un tecnico vero.",
  "cou.hero.description":
    "Tre livelli — base, intermedio, avanzato BGA. Postazioni ESD, strumentazione professionale, gli stessi formatori che addestrano i tecnici del Gruppo prima di mandarli in laboratorio. Attestato di frequenza e corsia preferenziale per assunzioni interne.",
  "cou.hero.cta1": "Richiedi info iscrizioni →",
  "cou.hero.cta2": "Confronta i livelli",
  "cou.hero.subtitle":
    "Iscrizione su approvazione · Pagamento online · Materiale incluso",
  "cou.hero.reqName": "Cellcom Academy — Richiesta iscrizione",
  "cou.levels.eyebrow": "I livelli",
  "cou.levels.titleA": "Dal primo screen",
  "cou.levels.accent": "alla microsaldatura BGA.",
  "cou.levels.intro":
    "Il percorso completo è pensato per crescere: ogni livello apre il successivo. Puoi anche entrare direttamente dal Base o dall'Intermedio se hai già esperienza — chiediamo solo una breve chiamata di valutazione.",
  "cou.levels.empty":
    "Calendario in aggiornamento. Apri una richiesta info per le prossime date in partenza →",
  "cou.tools.eyebrow": "Strumentazione",
  "cou.tools.titleA": "Tutto quello che usano i",
  "cou.tools.accent": "nostri tecnici.",
  "cou.tools.intro":
    "Niente lezione frontale: dal primo giorno hai sotto le mani la stessa strumentazione professionale che usiamo in laboratorio, con un istruttore in postazione. Le aule sono limitate a 6 allievi per garantire seguito reale.",
  "cou.tools.t1": "Microscopio Mantis triangolare",
  "cou.tools.t2": "Stazione ad aria calda + preheater",
  "cou.tools.t3": "Postazioni ESD a norma",
  "cou.tools.t4": "Multimetro da banco + oscilloscopio",
  "cou.tools.t5": "Programmatori NAND multi-modello",
  "cou.tools.t6": "Stencil BGA per i chip più diffusi",
  "cou.cta.titleA": "Iscriviti al prossimo",
  "cou.cta.accent": "corso in partenza.",
  "cou.cta.intro":
    "Calendario, prezzi tier (privati / centri assistenza / scuole) e agevolazioni: ti rispondiamo entro 24h con tutto quello che ti serve.",
  "cou.cta.cta": "Richiedi calendario e iscrizione →",
  "cou.cta.reqName": "Cellcom Academy — Iscrizione corso",
  "cou.card.priceOnReq": "Prezzo su richiesta",
  "cou.card.enroll": "Iscriviti →",

  "os.hero.eyebrow": "Apri il tuo negozio",
  "os.hero.titleA": "Da zero al tuo",
  "os.hero.accent": "negozio aperto.",
  "os.hero.description":
    "Ti accompagniamo passo per passo: consulenza, formazione, fornitura, setup negozio, accesso al CRM e supporto continuo. Niente franchising, niente royalty — solo i nostri prezzi B2B + il know-how del gruppo.",
  "os.hero.cta1": "Parla con un consulente →",
  "os.hero.cta2": "Vedi il percorso",
  "os.hero.subtitle": "Risposta entro 24h · Consulenza iniziale gratuita",
  "os.hero.reqName": "Apri un negozio Cellcom — richiesta consulenza",
  "os.steps.eyebrow": "Il percorso, 5 step",
  "os.steps.titleA": "Dalla prima chiamata",
  "os.steps.accent": "al primo cliente.",
  "os.steps.intro":
    "Niente promesse vaghe — ogni step ha un esito misurabile e tempi chiari. Quando arrivi all'apertura sai già come stai, cosa hai in magazzino e a chi rivolgerti se serve.",
  "os.s1.title": "Consulenza iniziale",
  "os.s1.text":
    "Analizziamo zona, target e investimento. Definiamo insieme format del punto vendita, mix prodotti, listino e margini realistici.",
  "os.s2.title": "Formazione e Academy",
  "os.s2.text":
    "Mandiamo te o il tuo tecnico in Cellcom Academy: base, intermedio o avanzato BGA. Esci con un attestato e operatività vera dal primo giorno.",
  "os.s3.title": "Fornitura e magazzino",
  "os.s3.text":
    "Listino B2B Cellcom riservato: telefoni nuovi, ricondizionati, ricambi originali, accessori. Ordini rapidi dal portale, spedizione 24-48h.",
  "os.s4.title": "Setup negozio + CRM",
  "os.s4.text":
    "Layout, banco di lavoro, strumentazione consigliata, branding. Accesso al gestionale Cellcom per ticket riparazione, magazzino, fatture.",
  "os.s5.title": "Supporto continuo",
  "os.s5.text":
    "Linea diretta con il laboratorio Fast-Fix per le riparazioni difficili. Aggiornamenti su nuovi modelli, prezzi, listini stagionali.",
  "os.included.eyebrow": "Cosa è incluso",
  "os.included.titleA": "Quello che ti serve davvero —",
  "os.included.accent": "nient'altro.",
  "os.included.intro":
    "Non vendiamo franchising in scatola, vendiamo ricambi e telefoni e un metodo. Il negozio resta tuo, il listino resta nostro.",
  "os.i1": "Consulenza pre-apertura (zona, format, mix prodotti)",
  "os.i2": "Accesso al listino B2B Cellcom riservato",
  "os.i3": "Formazione tecnica Academy (1-3 livelli)",
  "os.i4": "Setup CRM e account B2B per ordini rapidi",
  "os.i5": "Supporto laboratorio Fast-Fix sulle riparazioni complesse",
  "os.i6": "Aggiornamenti su nuovi modelli e listini",
  "os.cta.titleA": "Partiamo dalla",
  "os.cta.accent": "chiacchierata.",
  "os.cta.intro":
    "Lasciaci 3 informazioni — chi sei, dove vuoi aprire, cosa hai già. Un nostro consulente ti richiama entro 24 ore.",
  "os.cta.cta": "Richiedi consulenza gratuita →",
  "os.cta.reqName": "Apri un negozio Cellcom — primo contatto",

  "bp.hero.eyebrow": "Network Fast-Fix",
  "bp.hero.titleA": "Diventa punto",
  "bp.hero.accent": "riparazione partner.",
  "bp.hero.description":
    "Hai già un laboratorio o un negozio di riparazioni? Entri nel network Fast-Fix: ricambi originali a listino B2B, supporto sulle riparazioni complesse, accesso al CRM per ticket e tracking. Niente fee d'ingresso, niente esclusiva — solo il nostro magazzino + il nostro laboratorio.",
  "bp.hero.cta1": "Candidati come partner →",
  "bp.hero.cta2": "Cosa includi",
  "bp.hero.subtitle":
    "Approvazione P.IVA · Risposta entro 24h · Nessuna fee d'ingresso",
  "bp.hero.reqName": "Diventa partner Fast-Fix — richiesta accordo",
  "bp.benefits.eyebrow": "Tre cose, fatte bene",
  "bp.benefits.titleA": "Ricambi, supporto,",
  "bp.benefits.accent": "e un gestionale serio.",
  "bp.benefits.intro":
    "Niente sigle vuote — sai esattamente cosa ti diamo, cosa ci aspettiamo, e a chi telefonare quando arriva la riparazione difficile.",
  "bp.b1.title": "Listino ricambi B2B",
  "bp.b1.text":
    "Display, batterie, scocche, schede madri originali Apple/Samsung/Google. Listino dedicato ai centri assistenza con sconti a volumi.",
  "bp.b2.title": "Supporto laboratorio Fast-Fix",
  "bp.b2.text":
    "Le riparazioni che non vuoi fare in laboratorio le mandi a noi: microsaldatura, BGA, recupero dati. Costo trasparente, garanzia su lavoro e ricambi.",
  "bp.b3.title": "Accesso al gestionale",
  "bp.b3.text":
    "Apri ticket di riparazione che ti rigiriamo gestiti dal CRM Cellcom. Il cliente del cliente vede stato e preventivo in tempo reale.",
  "bp.req.eyebrow": "Requisiti",
  "bp.req.titleA": "Per chi",
  "bp.req.accent": "ripara di mestiere.",
  "bp.req.intro":
    "Il network è selezionato — non tutti entrano. Filtriamo per garantire qualità ai clienti finali e margini sani a chi è dentro.",
  "bp.r1": "Partita IVA attiva — centro assistenza, telefonia o elettronica",
  "bp.r2": "Esperienza pratica su riparazione smartphone",
  "bp.r3": "Volume minimo ordini ricambi (per accedere al listino partner)",
  "bp.r4": "Adesione ai nostri standard qualità (ricambi originali, garanzia 12 mesi)",
  "bp.cta.titleA": "Mandaci la tua",
  "bp.cta.accent": "candidatura.",
  "bp.cta.intro":
    "P.IVA, zona di operatività, esperienza, volumi indicativi. Un commerciale ti richiama entro 24 ore per definire l'accordo.",
  "bp.cta.cta": "Invia candidatura →",
  "bp.cta.reqName": "Diventa partner Fast-Fix — candidatura",

  "rw.step.device": "Seleziona dispositivo",
  "rw.step.repairs": "Seleziona riparazione",
  "rw.step.service": "Conferma ordine",
  "rw.cat.heading": "Che dispositivo hai?",
  "rw.cat.subheading": "Scegli la categoria per cominciare.",
  "rw.cat.smartphone": "Smartphone",
  "rw.cat.tablet": "Tablet",
  "rw.cat.watch": "Watch",
  "rw.cat.laptop": "Laptop",
  "rw.cat.desktop": "Desktop",
  "rw.cat.console": "Console",
  "rw.brand.heading": "Seleziona il tuo marchio",
  "rw.brand.subheading": "Scegli il brand del tuo dispositivo.",
  "rw.brand.other": "Altro brand",
  "rw.brand.back": "← Cambia categoria",
  "rw.model.heading": "Quale modello hai?",
  "rw.model.searchPh": "Cerca modello…",
  "rw.model.orChoose": "oppure scegli dalla lista",
  "rw.model.findMine": "Trova il mio modello",
  "rw.nonSmartphone.heading": "Diagnosi su richiesta",
  "rw.nonSmartphone.intro":
    "Per questa categoria non abbiamo ancora un catalogo modelli online — scrivici marca + modello del tuo dispositivo, un nostro tecnico ti contatta entro 24h con diagnosi e preventivo.",
  "rw.nonSmartphone.modelLabel": "Marca e modello",
  "rw.nonSmartphone.modelPh": "Es. iPad Pro 11\" 2022 / Galaxy Watch 6 / MacBook Air M2",

  "enum.condition.new": "Nuovo",
  "enum.condition.used": "Usato",
  "enum.condition.refurbished": "Ricondizionato",
  "enum.usedCondition.ottimo": "Ottimo",
  "enum.usedCondition.buono": "Buono",
  "enum.usedCondition.discreto": "Discreto",
  "enum.usedCondition.rotto": "Rotto / per pezzi",
  "enum.repairStatus.accepted": "Accettato",
  "enum.repairStatus.diagnosed": "Diagnosticato",
  "enum.repairStatus.in_repair": "In lavorazione",
  "enum.repairStatus.awaiting_parts": "Attesa ricambi",
  "enum.repairStatus.ready_for_pickup": "Pronto al ritiro",
  "enum.repairStatus.delivered": "Consegnato",
  "enum.repairStatus.cancelled": "Annullato",
};

const EN: Dict = {
  "chat.header.title": "Cellcom Assistance",
  "chat.header.statusOnline": "Reply in minutes",
  "chat.header.statusStreaming": "Typing…",
  "chat.header.closeAria": "Close chat",
  "chat.fab.openAria": "Open assistance chat",
  "chat.fab.closeAria": "Close assistance chat",
  "chat.welcome":
    "Hi — I'm the Cellcom assistant. I search products, track repairs, find stores and open the right request for you. Where do you want to start?",
  "chat.input.placeholder": "Write a message…",
  "chat.input.placeholderStreaming": "Wait for the reply…",
  "chat.input.sendAria": "Send message",
  "chat.input.stopAria": "Stop the reply",
  "chat.input.charsLeft": (n) => `${n} characters left`,
  "chat.bubble.streamingPolite":
    "The assistant is replying, wait before writing again",
  "chat.bubble.errorBadge": "Error — retry",
  "chat.bubble.abortedBadge": "Reply interrupted",
  "chat.bubble.truncatedBadge": "Reply truncated — rephrase to continue",
  "chat.error.networkFallback":
    "Connection lost. Retry or open a direct request →",
  "chat.error.tooManyRequests": "Too many requests, try again in a few minutes",
  "chat.quickReply.buyPhone": "Buy a phone",
  "chat.quickReply.repairScreen": "My screen is broken",
  "chat.quickReply.sellUsed": "Sell my used phone",
  "chat.quickReply.reseller": "I'm a reseller",
  "chat.quickReply.userBuyPhone": "I want to buy a phone",
  "chat.quickReply.userRepairScreen": "My screen is broken, how do I fix it?",
  "chat.quickReply.userSellUsed": "I'd like to sell my used phone",
  "chat.quickReply.userReseller":
    "I'm a reseller, how do I access B2B prices?",
  "chat.toolLabel.searchProducts": "Searching the catalogue…",
  "chat.toolLabel.getProductBySlug": "Opening product details…",
  "chat.toolLabel.searchUsedDevices": "Searching warranty-backed used…",
  "chat.toolLabel.lookupRepair": "Looking up repair ticket…",
  "chat.toolLabel.listStores": "Loading stores…",
  "chat.toolLabel.openRequestForm": "Preparing the request…",
  "chat.toolLabel.getHealth": "Checking system status…",
  "chat.regionAria": "Cellcom assistance chat",
  "chat.openAnnounce": "Assistance chat opened",

  "lang.label": "Language",
  "lang.it": "Italiano",
  "lang.en": "English",
  "lang.switchAria": "Switch language",

  "nav.products": "Products",
  "nav.used": "Used",
  "nav.repairs": "Repairs",
  "nav.resell": "Resell",
  "nav.courses": "Courses",
  "nav.stores": "Stores",
  "nav.about": "About",
  "nav.login": "Customer area",
  "nav.b2b": "B2B area",
  "nav.repairCta": "Repair now",
  "nav.customerArea": "Customer area",
  "nav.openMenu": "Open menu",
  "nav.closeMenu": "Close menu",

  "footer.copyrightGroup": "Cellcom Group",
  "footer.legal.privacy": "Privacy",
  "footer.legal.cookie": "Cookies",
  "footer.legal.terms": "Terms",

  "hero.pillar.buy": "Buy",
  "hero.pillar.repair": "Repair",
  "hero.pillar.resell": "Resell",
  "hero.pillar.learn": "Learn",
  "hero.pillar.b2b": "B2B",

  "trust.shipping.value": "24-48h shipping",
  "trust.shipping.desc": "With trusted couriers across Italy.",
  "trust.warranty.value": "12-month warranty",
  "trust.warranty.desc": "On products, parts and repairs.",
  "trust.technician.value": "Fast-Fix technicians",
  "trust.technician.desc": "In-house lab, same-day diagnosis.",
  "trust.b2b.value": "B2B support",
  "trust.b2b.desc": "Dedicated account manager for resellers.",
  "hero.catalogCta.eyebrow": "Full catalogue",
  "hero.catalogCta.title": "All smartphones, parts and accessories",
  "hero.catalogCta.explore": "Browse",
  "hero.pricesReservedHint": "Price reserved → sign in",
  "hero.newDevicesEyebrow": "New in catalogue",
  "hero.priceOnRequest": "On request",
  "hero.claim.preItalic": "We sell,",
  "hero.claim.italicA": "we repair",
  "hero.claim.between": ", we supply",
  "hero.claim.italicB": "those who sell them",
  "hero.intro.lead": "Three businesses, one warehouse.",
  "hero.intro.boldA": "Retail sales",
  "hero.intro.bodyA": " of smartphones, accessories and parts.",
  "hero.intro.boldB": "Service centre",
  "hero.intro.bodyB": " with in-house lab and 12-month warranty.",
  "hero.intro.boldC": "B2B wholesale",
  "hero.intro.bodyC": " for resellers, repair shops and businesses.",

  "home.numbers.eyebrow": "The group in numbers",
  "home.numbers.titleA": "Three brands. One",
  "home.numbers.titleB": "warehouse.",
  "home.numbers.intro":
    "Cellcom (e-commerce + B2B), Fast-Fix (stores and repairs), ItalianParts (spare parts). Each one focused on its own thing, same stock behind the scenes. The numbers below come live from the CRM — no empty windows.",
  "home.numbers.stat.brands": "Group brands",
  "home.numbers.stat.parts": "Parts in stock",
  "home.numbers.stat.phones": "Phones in catalogue",
  "home.numbers.stat.accessories": "Accessories available",
  "home.numbers.cta.catalog": "Browse the catalogue",
  "home.numbers.cta.about": "About us",
  "home.b2b.eyebrow": "For resellers, operators, businesses",
  "home.b2b.titleA": "Sell phones for a living?",
  "home.b2b.titleB": "The right price list changes everything.",
  "home.b2b.intro":
    "Same stock as retail, volume pricing, dedicated account manager, net 30/60 payment. We just need your VAT number: we call you the same day, credentials within 24 hours.",
  "home.b2b.feature1.title": "Tiered pricing",
  "home.b2b.feature1.body":
    "Reseller, Operator, VIP — the price drops automatically with volume. Nothing to ask every time.",
  "home.b2b.feature2.title": "Priority stock",
  "home.b2b.feature2.body":
    "Scarce parts go first to active contracts, then to retail.",
  "home.b2b.feature3.title": "A real person",
  "home.b2b.feature3.body":
    "Dedicated account manager. Direct email, business WhatsApp. They know who you are.",
  "home.b2b.cta.login": "Sign into B2B area",
  "home.b2b.cta.contact": "Request activation",

  "pg.filter.all": "All",
  "pg.cat.smartphone": "Smartphone",
  "pg.cat.part": "Spare part",
  "pg.stock.outOfStock": "Out of stock",
  "pg.stock.checkAvailable": "Check availability",
  "pg.stock.lastN": (n) => `Last ${n} left`,
  "pg.stock.available": "In stock",
  "pg.price.onRequest": "On request",
  "pg.price.hiddenTooltip":
    "Retail price not published for this item. Contact us for pricing.",
  "pg.price.reserved": "Price reserved",
  "pg.cta.loginForPrice": "Sign in for the price",
  "pg.cta.notifyWhenBack": "Notify me when back",
  "pg.cta.buyOn": (channel) => `Buy on ${channel}`,
  "pg.empty": "No products found.",

  "bc.home": "Home",
  "bc.products": "Products",
  "bc.phones": "Phones",
  "bc.parts": "Spare parts",
  "bc.accessories": "Accessories",
  "bc.used": "Used",
  "bc.repairs": "Repairs",
  "bc.aboutUs": "About us",
  "bc.stores": "Stores",
  "bc.courses": "Courses",
  "bc.openStore": "Open a store",
  "bc.becomePartner": "Become a partner",
  "bc.tradeIn": "Trade-in",
  "bc.tracker": "Track repair",

  "ch.products.eyebrow": "The Group's unified warehouse",
  "ch.products.title": "Our",
  "ch.products.accent": "catalogue",
  "ch.products.description":
    "Phones, spare parts, accessories. Real availability from Cellcom Group channels: brand new, refurbished and warranty-backed used.",
  "ch.phones.eyebrow": "Smartphones",
  "ch.phones.title": "Our",
  "ch.phones.accent": "phones",
  "ch.phones.description":
    "Apple, Samsung, Google, Xiaomi and all the major brands. IMEI verified, battery above 80% on refurbished, technical report on used.",
  "ch.phones.metric.new": "New",
  "ch.phones.metric.refurbished": "Refurbished",
  "ch.phones.metric.used": "Used",
  "ch.phones.metric.total": "Total",
  "ch.parts.eyebrow": "Spare parts",
  "ch.parts.title": "Our",
  "ch.parts.accent": "spare parts",
  "ch.parts.description":
    "Displays, batteries, housings, motherboards and back glass. Certified original and compatible. Filter by brand and model: the right part first time.",
  "ch.parts.metric.inCatalog": "In catalogue",
  "ch.parts.metric.models": "Compatible models",
  "ch.accessories.eyebrow": "Accessories",
  "ch.accessories.title": "Our",
  "ch.accessories.accent": "accessories",
  "ch.accessories.description":
    "Cases, tempered glass, fast chargers, original USB-C and Lightning cables, wireless headphones. Verified compatibility, warranty included.",
  "ch.accessories.metric.inCatalog": "In catalogue",
  "ch.used.eyebrow": "Warranty-backed used",
  "ch.used.title": "Used,",
  "ch.used.accent": "tested and warranted",
  "ch.used.description":
    "Every phone goes through our lab: IMEI verified, battery checked, technical report and warranty included. What you see is actually in stock — once it sells, it's gone from the listing.",
  "ch.used.metric.forSale": "For sale",
  "ch.used.metric.ottimo": "Excellent",
  "ch.used.metric.buono": "Good",
  "ch.used.metric.warranty": "Months warranty",
  "ch.used.metric.warrantyValue": "up to 12",

  "catalog.land.sec.phones.title": "Phones",
  "catalog.land.sec.phones.description":
    "Brand new sealed, certified refurbished, tested used. Apple, Samsung, Xiaomi, Google Pixel and every major brand.",
  "catalog.land.sec.parts.title": "Spare parts",
  "catalog.land.sec.parts.description":
    "Displays, batteries, housings, motherboards, back glass. Filter by model and get the right part first time.",
  "catalog.land.sec.accessories.title": "Accessories",
  "catalog.land.sec.accessories.description":
    "Cases, tempered glass, fast chargers, MFi and USB-C cables, wireless headphones. All with warranty included.",
  "catalog.land.featured.eyebrow": "Featured",
  "catalog.land.featured.titleA": "The most",
  "catalog.land.featured.accent": "wanted",
  "catalog.land.featured.titleB": "right now",
  "catalog.land.featured.cta": "See all phones",

  "pillars.section.eyebrow": "Phone lifecycle hub",
  "pillars.section.titleA": "Four things,",
  "pillars.section.accent": "one place.",
  "pillars.section.intro":
    "Buy, repair, trade in, learn. Same warehouse, same people, same warranty.",
  "pillars.buy.eyebrow": "Buy",
  "pillars.buy.titleA": "Your next phone.",
  "pillars.buy.accent": "Refurbished works too.",
  "pillars.buy.body":
    "Brand new, refurbished and tested used. Every brand, one warehouse, 12-month warranty across the board.",
  "pillars.buy.b1": "24-48h shipping in Italy",
  "pillars.buy.b2": "Free pickup in our stores",
  "pillars.buy.b3": "Klarna/Scalapay instalments available",
  "pillars.buy.cta": "Browse the catalogue",
  "pillars.repair.eyebrow": "Repair",
  "pillars.repair.titleA": "Almost anything can be fixed,",
  "pillars.repair.accent": "and in 24 hours.",
  "pillars.repair.body":
    "Screen, battery, motherboard, housing. Free diagnosis, quote before we touch it, sealed in front of you.",
  "pillars.repair.b1": "12-month warranty on labour and parts",
  "pillars.repair.b2": "BGA micro-soldering in-house",
  "pillars.repair.b3": "Pickup, shipping or store",
  "pillars.repair.cta": "Request a repair",
  "pillars.resell.eyebrow": "Trade in",
  "pillars.resell.titleA": "Your old phone",
  "pillars.resell.accent": "is still worth something.",
  "pillars.resell.body":
    "Free valuation from photos within 24 hours. Free shipping or pickup, payment within 48 hours.",
  "pillars.resell.b1": "+10% bonus in Cellcom credit",
  "pillars.resell.b2": "Written quote, no tricks",
  "pillars.resell.b3": "We take broken phones too",
  "pillars.resell.cta": "Value your used phone",
  "pillars.learn.eyebrow": "Learn",
  "pillars.learn.titleA": "Become",
  "pillars.learn.accent": "a repair technician.",
  "pillars.learn.body":
    "Three levels at Cellcom Academy: foundation, intermediate, BGA micro-soldering. The same instructors who train our technicians.",
  "pillars.learn.b1": "Professional ESD workstations",
  "pillars.learn.b2": "Class size capped at 6 students",
  "pillars.learn.b3": "Certificate + in-house job pipeline",
  "pillars.learn.cta": "Discover the courses",

  "marquee.shipping": "24-48h shipping",
  "marquee.warranty": "12-month warranty",
  "marquee.freePickup": "Free pickup in store",
  "marquee.stockVerified": "Stock verified from the CRM",

  "immersive.loading3D": "Loading 3D…",
  "immersive.scrollHint": "Scroll",
  "immersive.m1.eyebrow": "Phone Lifecycle",
  "immersive.m1.titleA": "The whole phone,",
  "immersive.m1.italic": "one home.",
  "immersive.m1.body":
    "From the first purchase to recycling — four services, one group.",
  "immersive.m2.eyebrow": "I repair, I refurbish",
  "immersive.m2.titleA": "Almost anything can be",
  "immersive.m2.italic": "fixed",
  "immersive.m2.titleB": ", and in 24 hours.",
  "immersive.m2.body":
    "Microscope, micro-soldering, original parts. 12-month warranty.",
  "immersive.m3.eyebrow": "And when you're done",
  "immersive.m3.italic": "Still valuable.",
  "immersive.m3.titleA": "We buy it back.",
  "immersive.m3.body":
    "Free valuation, free shipping, payment within 48 hours.",
  "immersive.m3.cta": "Find out how",

  "rep.hero.eyebrow": "Fast-Fix · Group repair centre",
  "rep.hero.titleA": "Which device",
  "rep.hero.accent": "do you want to fix?",
  "rep.hero.description":
    "Find the model, tell us what's wrong, choose whether to drop it off, ship it or have it picked up. Free diagnosis, quote within 24 hours, 12-month warranty on labour and parts.",
  "rep.hero.cta1": "Start the request",
  "rep.hero.cta2": "I already have a ticket → track it",
  "rep.hero.subtitle":
    "Free diagnosis · Quote within 24h · No charge if you decline",
  "rep.how.eyebrow": "How it works",
  "rep.how.titleA": "From the first message to a phone",
  "rep.how.accent": "as good as new.",
  "rep.how.intro":
    "Four steps tracked in our system. No surprises on price, no \"call back Thursday\": as soon as anything changes we write to you.",
  "rep.how.s1.title": "Tell us what happened",
  "rep.how.s1.text":
    "Open a request below or call the nearest store. Model, problem (cracked glass, battery, won't turn on…), a rough estimate of the damage. Nothing technical — just describe what you saw.",
  "rep.how.s2.title": "Free diagnosis",
  "rep.how.s2.text":
    "One of our technicians checks the phone within 24-48h of arrival. If we need to open it, we open it, photograph the components and send you a written quote. You decide — no obligation, no charge if you decline.",
  "rep.how.s3.title": "Repair in the lab",
  "rep.how.s3.text":
    "Once the quote is approved, we work in our in-house lab with original or certified parts. Microscope for micro-soldering, True Tone calibration, waterproof sealing redone. Typical turnaround: 24h for battery/screen, 3-5 days for motherboard.",
  "rep.how.s4.title": "Pickup or delivery",
  "rep.how.s4.text":
    "When it's ready we let you know by SMS/email. Pick it up in store or we ship it back free. 12-month warranty on the part AND the labour — if the problem comes back within a year, the fix is free.",
  "rep.intake.eyebrow": "How to get it to us",
  "rep.intake.titleA": "Three ways to",
  "rep.intake.accent": "bring it in",
  "rep.intake.titleB": "— pick the easiest.",
  "rep.intake.intro":
    "We don't just work out of brick-and-mortar stores: we cover the whole country. Whichever option you pick, the phone enters our system and you follow its status live.",
  "rep.intake.opt1.eyebrow": "Option 1",
  "rep.intake.opt1.title": "Drop it off in store",
  "rep.intake.opt1.text":
    "Come to one of the Group's stores. On-the-spot diagnosis if a technician is available, otherwise a receipt and a call within 24h with the quote.",
  "rep.intake.opt1.cta": "Find your nearest store",
  "rep.intake.opt2.eyebrow": "Option 2",
  "rep.intake.opt2.title": "Ship it to us",
  "rep.intake.opt2.text":
    "No store nearby? We send you an insured shipping kit: pack it, hand it to the courier, we ship it back for free once the repair is done.",
  "rep.intake.opt2.cta": "Request a shipping kit",
  "rep.intake.opt3.eyebrow": "Option 3",
  "rep.intake.opt3.title": "We pick it up",
  "rep.intake.opt3.text":
    "Only in certain areas (San Benedetto del Tronto and surrounding province, main cities in Marche and Abruzzo on request). We swing by to collect, we bring it back fixed. Available above a minimum order value.",
  "rep.intake.opt3.cta": "Check if your area is covered",
  "rep.request.eyebrow": "Repair wizard",
  "rep.request.titleA": "Which phone",
  "rep.request.accent": "do you want to fix?",
  "rep.request.intro":
    "Three quick steps: phone → problem → how to get it to us. Free diagnosis, no commitment until the quote.",

  "auth.common.backToSite": "← Back to the public site",
  "auth.common.backToLogin": "← Back to sign-in",
  "auth.common.passwordForgot": "Forgot password?",
  "auth.b2b.eyebrow": "B2B area",
  "auth.b2b.login.title": "Sign in to your price list",
  "auth.b2b.login.subtitle":
    "Reserved prices for resellers, operators and businesses in the Group.",
  "auth.b2b.login.sessionExpired":
    "Session expired. Please sign in again.",
  "auth.b2b.login.noCredentials": "Don't have credentials yet?",
  "auth.b2b.login.requestActivation": "Request activation →",
  "auth.b2b.login.emailLabel": "Email",
  "auth.b2b.login.passwordLabel": "Password",
  "auth.b2b.login.emailPlaceholder": "name@company.com",
  "auth.b2b.login.cta": "Sign into B2B area →",
  "auth.b2b.login.ctaBusy": "Signing in…",
  "auth.b2b.login.newReseller": "I'm a new reseller —",
  "auth.b2b.login.newResellerCta": "register me →",
  "auth.b2b.login.errInvalidCreds": "Invalid credentials",
  "auth.b2b.login.errPending":
    "Your account is awaiting approval from our team. You'll get an email as soon as it's active.",
  "auth.b2b.login.errRejected":
    "Your B2B account request was rejected. Get in touch for more info.",
  "auth.b2b.login.errNotB2B":
    "This account isn't enabled for the B2B area. Register a business to access.",
  "auth.b2b.login.errGeneric": "Sign-in error",
  "auth.b2b.register.eyebrow": "Become a reseller",
  "auth.b2b.register.title": "Sign up as a reseller",
  "auth.b2b.register.subtitle":
    "Give us your business details. Cellcom staff reviews the request within 24 business hours and emails you a link to set the password.",
  "auth.b2b.register.nameLabel": "Contact full name *",
  "auth.b2b.register.namePh": "Jane Doe",
  "auth.b2b.register.emailLabel": "Business email *",
  "auth.b2b.register.emailPh": "name@company.com",
  "auth.b2b.register.companyLabel": "Company name *",
  "auth.b2b.register.companyPh": "e.g. Reseller Ltd",
  "auth.b2b.register.vatLabel": "VAT number",
  "auth.b2b.register.vatPh": "GB123456789",
  "auth.b2b.register.phoneLabel": "Phone",
  "auth.b2b.register.phonePh": "+44 20 1234 5678",
  "auth.b2b.register.consent":
    "I consent to the processing of my personal data by Cellcom Smartphone Fix SRLS to handle the reseller account activation request (art. 13 GDPR — EU Reg. 2016/679).",
  "auth.b2b.register.privacyLinkLabel": "Read the privacy policy",
  "auth.b2b.register.cta": "Send the request →",
  "auth.b2b.register.ctaBusy": "Sending…",
  "auth.b2b.register.done.title": "Request sent.",
  "auth.b2b.register.done.body":
    "We'll get in touch by email within 24 business hours. Once approved you'll receive a link to set the password and access the B2B area with volume pricing.",
  "auth.b2b.register.errGeneric": "Sending failed",
  "auth.b2b.forgot.title": "Forgot password",
  "auth.b2b.forgot.subtitle":
    "Enter your B2B email. If the account exists we'll send you a link to set a new password.",
  "auth.b2b.forgot.emailLabel": "Email",
  "auth.b2b.forgot.emailPh": "company@email.com",
  "auth.b2b.forgot.cta": "Send the link →",
  "auth.b2b.forgot.ctaBusy": "Sending…",
  "auth.b2b.forgot.done.title": "Request sent.",
  "auth.b2b.forgot.done.body":
    "If the email is registered as a B2B account, you'll receive a link within a few minutes. Check your spam folder too.",
  "auth.b2b.reset.eyebrow": "Reset password",
  "auth.b2b.reset.title": "New password",
  "auth.b2b.reset.subtitle":
    "Set a new password for your B2B account. Minimum 8 characters.",
  "auth.b2b.reset.passwordLabel": "New password",
  "auth.b2b.reset.cta": "Set password →",
  "auth.b2b.reset.ctaBusy": "Sending…",
  "auth.b2b.reset.done.title": "Password updated.",
  "auth.b2b.reset.done.body":
    "Your password has been changed. You can sign into the B2B area with the new credentials.",
  "auth.b2b.reset.done.cta": "Go to sign-in →",
  "auth.b2b.reset.invalidToken": "Invalid or expired link",
  "auth.b2b.reset.invalidLinkBefore":
    "Invalid link. Request a new one from the",
  "auth.b2b.reset.invalidLinkAnchor": "forgot password page",
  "auth.b2b.reset.minLengthHint":
    "At least 8 characters. All your active sessions will be revoked.",
  "auth.b2b.reset.titleInline": "Set a new password",
  "auth.b2b.reset.confirmLabel": "Confirm password",
  "auth.b2b.reset.errMinLength": "Password must be at least 8 characters",
  "auth.b2b.reset.errMismatch": "The two passwords don't match",
  "auth.b2b.reset.errGeneric": "Operation failed",
  "auth.b2b.reset.successTitle": "Password updated.",
  "auth.b2b.reset.successBody": "Taking you to sign-in…",
  "auth.b2b.reset.submitting": "Updating…",
  "auth.b2b.reset.submit": "Set new password →",
  "auth.customer.eyebrow": "Customer area",
  "auth.customer.title": "Sign in to your account",
  "auth.customer.subtitle":
    "Your repairs status, quotes to approve, and the courses you're enrolled in.",
  "auth.customer.inlineTitle": "Sign in",
  "auth.customer.inlineSubtitle":
    "See your repairs, quotes and reserved prices.",
  "auth.customer.emailLabel": "Email",
  "auth.customer.emailPh": "name@email.com",
  "auth.customer.passwordLabel": "Password",
  "auth.customer.cta": "Sign in →",
  "auth.customer.ctaBusy": "Signing in…",
  "auth.customer.errInvalidCreds": "Invalid credentials",
  "auth.customer.errGeneric": "Error",
  "auth.customer.noCredentials": "Don't have credentials yet?",
  "auth.customer.noCredentialsHint":
    "Bring a device in for repair: you'll get an email with a link to set the password.",

  "stores.hero.eyebrow": "The stores",
  "stores.hero.titleA": "Our",
  "stores.hero.accent": "stores.",
  "stores.hero.description":
    "Find the nearest store across the Cellcom Group brands. Service centres, parts warehouse, retail — all opening hours, addresses and contacts in real time.",
  "stores.features.eyebrow": "What you can do in store",
  "stores.features.titleA": "More than retail —",
  "stores.features.accent": "full services.",
  "stores.features.intro":
    "Every Group store offers way more than the shelves: repairs, used-phone valuation, commercial support for resellers who need in-person help.",
  "stores.f1.title": "On-the-spot diagnosis",
  "stores.f1.text":
    "Bring your device in, if a technician is free they look at it in 10 minutes and tell you what's needed.",
  "stores.f2.title": "Free order pickup",
  "stores.f2.text":
    "Order online and pick up at any Group store with no shipping fees.",
  "stores.f3.title": "Trade-in at the counter",
  "stores.f3.text":
    "Bring your old phone, we value it in front of you, you leave with bank transfer or Cellcom credit.",

  "about.hero.eyebrow": "The Group",
  "about.hero.titleA": "Five brands. One single",
  "about.hero.accent": "trust.",
  "about.hero.description":
    "We sell, we repair and we supply phones. We're based in San Benedetto del Tronto, but we work across Italy. Three specialised brands, one warehouse, the same people behind everything.",
  "about.stat.products": "Products in catalogue",
  "about.stat.brands": "Vertical brands",
  "about.stat.delivery": "Delivery in Italy",
  "about.stat.warranty": "Parts warranty",
  "about.brands.eyebrow": "The 5 brands",
  "about.brands.titleA": "One group,",
  "about.brands.accent": "five specialisations.",
  "about.brands.intro":
    "Each brand does one thing and does it well. Together they cover the entire phone lifecycle: sales, repair, parts, training, software. Same warehouse, same standards.",
  "about.b1.role": "B2B warehouse",
  "about.b1.description":
    "The Group's wholesale. We sell to resellers, repair shops and businesses on volume pricing.",
  "about.b2.role": "Stores & repairs",
  "about.b2.description":
    "The physical stores where you bring a phone to repair or come to buy a new one.",
  "about.b3.role": "Spare parts",
  "about.b3.description":
    "Displays, batteries, housings, motherboards. For people who fix phones for a living.",
  "about.b4.role": "Academy",
  "about.b4.description":
    "The in-house school where we train our technicians. Also open to anyone who wants to learn the trade.",
  "about.manifesto.eyebrow": "What sets us apart",
  "about.manifesto.titleA": "Three principles,",
  "about.manifesto.accent": "non-negotiable.",
  "about.s1.title": "Honest pricing",
  "about.s1.description":
    "Same price lists across all our channels. What the public sees is what the public pays — B2B pays less, but only if buying in volume.",
  "about.s2.title": "Every job tracked",
  "about.s2.description":
    "Your repairs or orders go into the system, you see them live too. Photo of the device, parts used, responsible technician — all logged.",
  "about.s3.title": "One specialisation per brand",
  "about.s3.description":
    "Each Group brand does one thing and takes it seriously. Put them together and we cover the entire phone lifecycle.",

  "ti.hero.eyebrow": "Cellcom trade-in",
  "ti.hero.titleA": "Your old phone",
  "ti.hero.accent": "is still worth something.",
  "ti.hero.descA":
    "Tell us what phone you have and what condition it's in. Our technicians value it for free after they receive the photos and reply by email within a few hours. Free shipping or store pickup. ",
  "ti.hero.descBoldBonus": "+10%",
  "ti.hero.descB": " bonus if you take Cellcom Group store credit.",
  "ti.how.eyebrow": "How it works",
  "ti.how.titleA": "Four steps,",
  "ti.how.accent": "no surprises.",
  "ti.how.intro":
    "From the form to the payout, every step tracked. No opaque algorithms, no inflated offers that drop on arrival — the person who quotes you is the same one who inspects the phone in the lab.",
  "ti.s1.title": "Fill in the form",
  "ti.s1.text":
    "Pick brand, model, storage and condition of your phone. Takes 30 seconds, no account needed.",
  "ti.s2.title": "Photos by email",
  "ti.s2.text":
    "We email you within a few hours asking for 4-6 guided photos (front, back, IMEI, screen on).",
  "ti.s3.title": "Personal valuation",
  "ti.s3.text":
    "A technician checks the photos and emails you a tailored quote — no algorithms, a real person.",
  "ti.s4.title": "Shipping + payment",
  "ti.s4.text":
    "You accept, free shipping or store pickup. Final inspection and payment within 48h.",
  "ti.faq.eyebrow": "FAQ",
  "ti.faq.titleA": "The",
  "ti.faq.accent": "questions",
  "ti.faq.titleB": "we always get.",
  "ti.faq.q1.q": "Why don't I see a price upfront?",
  "ti.faq.q1.a":
    "Because we want to give you an honest valuation, not a generic range pulled from thin air. Our technicians check the real photos of your phone — glass, screen, actual signs of wear — and write you the exact price we'd pay. No surprises on arrival.",
  "ti.faq.q2.q": "How long until the offer arrives?",
  "ti.faq.q2.a":
    "Within 24 business hours of sending the photos. Often faster — our technicians work Monday to Saturday.",
  "ti.faq.q3.q": "When do I get the final valuation?",
  "ti.faq.q3.a":
    "Right after you send us the photos. If the shipment matches the photos, we pay exactly the amount in the email. If we find something we hadn't seen in the photos, we get in touch before closing — you're free to accept or take it back for free.",
  "ti.faq.q4.q": "How does free shipping work?",
  "ti.faq.q4.a":
    "Once you accept the offer we email you a prepaid label. Ship from any post office with the phone well packed (ideally in the original box). Or you book an appointment and we pick it up at home.",
  "ti.faq.q5.q": "What's the +10% Cellcom credit bonus?",
  "ti.faq.q5.a":
    "If instead of a bank transfer you take store credit spendable on Cellcom Group sites, we top the offer up by 10%. Example: €500 offer → €550 credit. Valid for 24 months.",
  "ti.faq.q6.q": "Do you buy only phones or also tablets, smartwatches?",
  "ti.faq.q6.a":
    "Right now phones only. Tablets, smartwatches, AirPods, consoles: drop us an email at hello@cellcom.it and we'll let you know case by case.",
  "ti.faq.q7.q": "My phone is broken, can I still sell it?",
  "ti.faq.q7.a":
    "Yes but the flow changes. For broken screens, dead batteries, phones that won't turn on: better to go through our repair centre first. We often fix it cheaply and then the resale value jumps 3-5x.",
  "ti.faq.q8.q": "My model isn't in the list, what do I do?",
  "ti.faq.q8.a":
    "Pick 'Other / not in list' and type brand and model by hand. Our technician will value it exactly like the listed models.",

  "cou.hero.eyebrow": "Cellcom Academy",
  "cou.hero.titleA": "Learn to repair,",
  "cou.hero.accent": "like a real technician.",
  "cou.hero.description":
    "Three levels — foundation, intermediate, advanced BGA. ESD workstations, professional tools, the same instructors who train the Group's technicians before sending them into the lab. Certificate of attendance and priority track for in-house hiring.",
  "cou.hero.cta1": "Request enrolment info →",
  "cou.hero.cta2": "Compare the levels",
  "cou.hero.subtitle":
    "Enrolment subject to approval · Online payment · Materials included",
  "cou.hero.reqName": "Cellcom Academy — Enrolment request",
  "cou.levels.eyebrow": "The levels",
  "cou.levels.titleA": "From your first screen",
  "cou.levels.accent": "to BGA micro-soldering.",
  "cou.levels.intro":
    "The full path is designed to grow with you: each level unlocks the next. You can also jump in at Foundation or Intermediate if you already have experience — we just ask for a short evaluation call.",
  "cou.levels.empty":
    "Calendar being updated. Open an info request for the next start dates →",
  "cou.tools.eyebrow": "Equipment",
  "cou.tools.titleA": "Everything our",
  "cou.tools.accent": "technicians use.",
  "cou.tools.intro":
    "No lecture-style classes: from day one you have the same professional equipment we use in the lab, with an instructor at your station. Class size is capped at 6 students for real one-on-one follow-up.",
  "cou.tools.t1": "Mantis triangular microscope",
  "cou.tools.t2": "Hot air station + preheater",
  "cou.tools.t3": "Compliant ESD workstations",
  "cou.tools.t4": "Bench multimeter + oscilloscope",
  "cou.tools.t5": "Multi-model NAND programmers",
  "cou.tools.t6": "BGA stencils for the most common chips",
  "cou.cta.titleA": "Enrol in the next",
  "cou.cta.accent": "course starting soon.",
  "cou.cta.intro":
    "Calendar, tiered pricing (private / repair shops / schools) and discounts: we reply within 24h with everything you need.",
  "cou.cta.cta": "Request calendar and enrolment →",
  "cou.cta.reqName": "Cellcom Academy — Course enrolment",
  "cou.card.priceOnReq": "Price on request",
  "cou.card.enroll": "Enrol →",

  "os.hero.eyebrow": "Open your store",
  "os.hero.titleA": "From zero to your",
  "os.hero.accent": "store, open.",
  "os.hero.description":
    "We walk you through every step: consultation, training, supply, store setup, CRM access and ongoing support. No franchise fees, no royalties — just our B2B prices + the Group's know-how.",
  "os.hero.cta1": "Talk to a consultant →",
  "os.hero.cta2": "See the path",
  "os.hero.subtitle": "Reply within 24h · Free initial consultation",
  "os.hero.reqName": "Open a Cellcom store — consultation request",
  "os.steps.eyebrow": "The path, 5 steps",
  "os.steps.titleA": "From the first call",
  "os.steps.accent": "to your first customer.",
  "os.steps.intro":
    "No vague promises — each step has a measurable outcome and clear timing. By the time you open, you already know where you stand, what's in stock, and who to call when needed.",
  "os.s1.title": "Initial consultation",
  "os.s1.text":
    "We analyse area, target audience and investment. Together we define store format, product mix, price list and realistic margins.",
  "os.s2.title": "Training and Academy",
  "os.s2.text":
    "We send you or your technician to Cellcom Academy: foundation, intermediate or advanced BGA. You leave with a certificate and real operational skills from day one.",
  "os.s3.title": "Supply and warehouse",
  "os.s3.text":
    "Reserved Cellcom B2B price list: brand new and refurbished phones, original parts, accessories. Fast orders from the portal, 24-48h shipping.",
  "os.s4.title": "Store setup + CRM",
  "os.s4.text":
    "Layout, workbench, recommended equipment, branding. Access to the Cellcom system for repair tickets, inventory, invoices.",
  "os.s5.title": "Ongoing support",
  "os.s5.text":
    "Direct line to the Fast-Fix lab for tricky repairs. Updates on new models, prices, seasonal listings.",
  "os.included.eyebrow": "What's included",
  "os.included.titleA": "Only what you actually need —",
  "os.included.accent": "nothing else.",
  "os.included.intro":
    "We don't sell franchise-in-a-box, we sell parts and phones and a method. The store stays yours, the price list stays ours.",
  "os.i1": "Pre-opening consultation (area, format, product mix)",
  "os.i2": "Access to the reserved Cellcom B2B price list",
  "os.i3": "Academy technical training (1-3 levels)",
  "os.i4": "CRM setup and B2B account for fast orders",
  "os.i5": "Fast-Fix lab support on complex repairs",
  "os.i6": "Updates on new models and pricing",
  "os.cta.titleA": "Let's start with a",
  "os.cta.accent": "chat.",
  "os.cta.intro":
    "Tell us 3 things — who you are, where you want to open, what you already have. One of our consultants will call you back within 24 hours.",
  "os.cta.cta": "Request a free consultation →",
  "os.cta.reqName": "Open a Cellcom store — first contact",

  "bp.hero.eyebrow": "Fast-Fix Network",
  "bp.hero.titleA": "Become a partner",
  "bp.hero.accent": "repair shop.",
  "bp.hero.description":
    "You already have a workshop or a repair shop? Join the Fast-Fix network: original parts at B2B price, support on complex repairs, CRM access for tickets and tracking. No entry fee, no exclusivity — just our warehouse + our lab.",
  "bp.hero.cta1": "Apply as a partner →",
  "bp.hero.cta2": "What's included",
  "bp.hero.subtitle":
    "VAT-approved · Reply within 24h · No entry fee",
  "bp.hero.reqName": "Become a Fast-Fix partner — agreement request",
  "bp.benefits.eyebrow": "Three things, done well",
  "bp.benefits.titleA": "Parts, support,",
  "bp.benefits.accent": "and a proper system.",
  "bp.benefits.intro":
    "No empty acronyms — you know exactly what we give you, what we expect, and who to call when a tough repair lands.",
  "bp.b1.title": "B2B parts price list",
  "bp.b1.text":
    "Displays, batteries, housings, original Apple/Samsung/Google motherboards. Dedicated price list for repair shops with volume discounts.",
  "bp.b2.title": "Fast-Fix lab support",
  "bp.b2.text":
    "The repairs you don't want to do in-house, you send to us: micro-soldering, BGA, data recovery. Transparent cost, warranty on labour and parts.",
  "bp.b3.title": "System access",
  "bp.b3.text":
    "Open repair tickets that we handle through the Cellcom CRM. The customer's customer sees status and quote in real time.",
  "bp.req.eyebrow": "Requirements",
  "bp.req.titleA": "For people who",
  "bp.req.accent": "repair for a living.",
  "bp.req.intro":
    "The network is curated — not everyone gets in. We filter to guarantee quality to end customers and healthy margins to those who are in.",
  "bp.r1": "Active VAT number — repair shop, telco or electronics",
  "bp.r2": "Hands-on experience with smartphone repair",
  "bp.r3": "Minimum order volume on parts (to access partner pricing)",
  "bp.r4": "Adherence to our quality standards (original parts, 12-month warranty)",
  "bp.cta.titleA": "Send us your",
  "bp.cta.accent": "application.",
  "bp.cta.intro":
    "VAT number, area of operation, experience, indicative volumes. A sales rep will call you back within 24 hours to define the agreement.",
  "bp.cta.cta": "Submit application →",
  "bp.cta.reqName": "Become a Fast-Fix partner — application",

  "rw.step.device": "Select device",
  "rw.step.repairs": "Select repair",
  "rw.step.service": "Confirm order",
  "rw.cat.heading": "What device do you have?",
  "rw.cat.subheading": "Pick a category to get started.",
  "rw.cat.smartphone": "Smartphone",
  "rw.cat.tablet": "Tablet",
  "rw.cat.watch": "Watch",
  "rw.cat.laptop": "Laptop",
  "rw.cat.desktop": "Desktop",
  "rw.cat.console": "Console",
  "rw.brand.heading": "Pick your brand",
  "rw.brand.subheading": "Select your device's brand.",
  "rw.brand.other": "Other brand",
  "rw.brand.back": "← Change category",
  "rw.model.heading": "Which model do you have?",
  "rw.model.searchPh": "Search model…",
  "rw.model.orChoose": "or pick from the list",
  "rw.model.findMine": "Find my model",
  "rw.nonSmartphone.heading": "Diagnosis on request",
  "rw.nonSmartphone.intro":
    "We don't have an online model catalogue for this category yet — tell us the brand + model of your device, a technician will get in touch within 24h with a diagnosis and quote.",
  "rw.nonSmartphone.modelLabel": "Brand and model",
  "rw.nonSmartphone.modelPh": "e.g. iPad Pro 11\" 2022 / Galaxy Watch 6 / MacBook Air M2",

  "enum.condition.new": "New",
  "enum.condition.used": "Used",
  "enum.condition.refurbished": "Refurbished",
  "enum.usedCondition.ottimo": "Excellent",
  "enum.usedCondition.buono": "Good",
  "enum.usedCondition.discreto": "Fair",
  "enum.usedCondition.rotto": "Faulty / for parts",
  "enum.repairStatus.accepted": "Accepted",
  "enum.repairStatus.diagnosed": "Diagnosed",
  "enum.repairStatus.in_repair": "In repair",
  "enum.repairStatus.awaiting_parts": "Awaiting parts",
  "enum.repairStatus.ready_for_pickup": "Ready for pickup",
  "enum.repairStatus.delivered": "Delivered",
  "enum.repairStatus.cancelled": "Cancelled",
};

const DICTS: Record<Lang, Dict> = { it: IT, en: EN };

export function getDict(lang: Lang): Dict {
  return DICTS[lang];
}

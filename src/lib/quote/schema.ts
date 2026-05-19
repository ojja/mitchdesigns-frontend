export const QUOTE_SERVICES = [
  "corporate-website",
  "ecommerce",
  "mobile-app",
  "custom-web",
] as const;

export type QuoteService = (typeof QUOTE_SERVICES)[number];

export type QuoteStepKind =
  | "form"
  | "service-select"
  | "radio"
  | "file-upload"
  | "completion-choice"
  | "summary";

export type QuoteInputType =
  | "text"
  | "email"
  | "tel"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox-group";

export type QuoteFieldKey =
  | "firstName"
  | "service"
  | "hasSitemap"
  | "sitemapFile"
  | "websiteLanguages"
  | "industry"
  | "websitePurpose"
  | "websiteSections"
  | "specialFeatures"
  | "companyProfile"
  | "additionalNotes"
  | "lastName"
  | "mobileNumber"
  | "email"
  | "companyName"
  | "companyCountry"
  | "companyStage"
  | "nextAction"
  | "platformType"
  | "platformFeatures"
  | "mobilePlatform"
  | "mobileFeatures"
  | "storeType"
  | "storeFeatures"
  | "timeline"
  | "budget"
  | "brief"
  | "contact";

export type QuoteOutcome =
  | {
      readonly type: "step";
      readonly step: number;
    }
  | {
      readonly type: "route";
      readonly href: `/quote/${string}` | "/";
    };

export type QuoteValidationRule = {
  readonly required?: boolean;
  readonly minSelected?: number;
  readonly maxSelected?: number;
  readonly acceptedFileTypes?: readonly string[];
  readonly maxFileSizeMb?: number;
  readonly minLength?: number;
  readonly maxLength?: number;
};

export type QuoteStepOption = {
  readonly label: string;
  readonly value: string;
  readonly description?: string;
  readonly helperText?: string;
  readonly recommended?: boolean;
  readonly service?: QuoteService;
  readonly nextStep?: number;
  readonly outcome?: QuoteOutcome;
};

export type QuoteField = {
  readonly id: QuoteFieldKey;
  readonly label: string;
  readonly type: QuoteInputType;
  readonly required?: boolean;
  readonly helperText?: string;
  readonly placeholder?: string;
  readonly defaultValue?: string;
  readonly prefix?: string;
  readonly options?: readonly QuoteStepOption[];
  readonly validation?: QuoteValidationRule;
};

export type QuoteStepBase = {
  readonly id: QuoteFieldKey;
  readonly step: number;
  readonly kind: QuoteStepKind;
  readonly title: string;
  readonly eyebrow?: string;
  readonly description?: string;
  readonly nextLabel?: string;
  readonly validation?: QuoteValidationRule;
  readonly outcome?: QuoteOutcome;
};

export type QuoteFormStep = QuoteStepBase & {
  readonly kind: "form";
  readonly fields: readonly QuoteField[];
};

export type QuoteChoiceStep = QuoteStepBase & {
  readonly kind: "service-select" | "radio" | "completion-choice";
  readonly label?: string;
  readonly helperText?: string;
  readonly options: readonly QuoteStepOption[];
};

export type QuoteFileUploadStep = QuoteStepBase & {
  readonly kind: "file-upload";
  readonly uploadLabel: string;
  readonly helperText?: string;
};

export type QuoteSummaryStep = QuoteStepBase & {
  readonly kind: "summary";
  readonly submitLabel: string;
  readonly outcome: QuoteOutcome;
};

export type QuoteStep =
  | QuoteFormStep
  | QuoteChoiceStep
  | QuoteFileUploadStep
  | QuoteSummaryStep;

export type QuoteFlow = {
  readonly service: QuoteService;
  readonly label: string;
  readonly description: string;
  readonly startHref: `/quote/${QuoteService}/1`;
  readonly steps: readonly QuoteStep[];
};

const uploadValidation = {
  acceptedFileTypes: [".jpeg", ".jpg", ".png", ".pdf"],
  maxFileSizeMb: 50,
} as const satisfies QuoteValidationRule;

const budgetOptions = [
  { label: "Under $5k", value: "under-5k" },
  { label: "$5k-$10k", value: "5k-10k" },
  { label: "$10k-$25k", value: "10k-25k" },
  { label: "$25k+", value: "25k-plus" },
] as const satisfies readonly QuoteStepOption[];

const timelineOptions = [
  { label: "ASAP", value: "asap" },
  { label: "1-2 months", value: "1-2-months" },
  { label: "3-6 months", value: "3-6-months" },
  { label: "Just exploring", value: "exploring" },
] as const satisfies readonly QuoteStepOption[];

const contactStep = (step: number): QuoteFormStep => ({
  id: "contact",
  step,
  kind: "form",
  title: "Where should we send the proposal?",
  description: "We will use this to follow up with a scoped recommendation.",
  fields: [
    {
      id: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "you@example.com",
    },
    {
      id: "mobileNumber",
      label: "Phone",
      type: "tel",
      placeholder: "+1 555 000 0000",
    },
    {
      id: "additionalNotes",
      label: "Anything else we should know?",
      type: "textarea",
      placeholder: "Goals, constraints, references, or must-haves",
    },
  ],
});

const summaryStep = (step: number): QuoteSummaryStep => ({
  id: "contact",
  step,
  kind: "summary",
  title: "Review your quote request",
  description: "Confirm the details before sending them to MitchDesigns.",
  submitLabel: "Submit quote request",
  outcome: { type: "route", href: "/quote/thank-you" },
});

export const quoteFlows = {
  "corporate-website": {
    service: "corporate-website",
    label: "Corporate website",
    description: "A brand, marketing, or company website built to convert.",
    startHref: "/quote/corporate-website/1",
    steps: [
      {
        id: "hasSitemap",
        step: 1,
        kind: "radio",
        title: "Do you already have a sitemap for the new website?",
        validation: { required: true },
        options: [
          {
            label: "Yes, I'll upload it now",
            value: "yes",
            nextStep: 2,
          },
          {
            label: "No, help me to create my own sitemap",
            value: "no",
            nextStep: 3,
          },
        ],
      },
      {
        id: "sitemapFile",
        step: 2,
        kind: "file-upload",
        title: "Perfect. Please upload your sitemap file",
        uploadLabel: "Browse File",
        helperText: "Choose a file or drag & drop it here.",
        validation: uploadValidation,
        outcome: { type: "step", step: 4 },
      },
      {
        id: "websiteLanguages",
        step: 3,
        kind: "form",
        title: "Now, tell us more about your business",
        fields: [
          {
            id: "websiteLanguages",
            label: "What languages will your website support?",
            type: "radio",
            required: true,
            options: [
              { label: "Arabic only", value: "arabic-only" },
              { label: "English only", value: "english-only" },
              { label: "Arabic and English", value: "arabic-and-english" },
              {
                label: "Arabic and English and a third language",
                value: "arabic-english-third-language",
              },
            ],
          },
        ],
      },
      {
        id: "industry",
        step: 4,
        kind: "form",
        title: "Now, tell us more about your business",
        fields: [
          {
            id: "industry",
            label: "Which industry is your business in?",
            type: "text",
            required: true,
          },
          {
            id: "websitePurpose",
            label: "What's the main purpose of your website?",
            type: "checkbox-group",
            required: true,
            helperText: "Maximum two choices",
            validation: { required: true, minSelected: 1, maxSelected: 2 },
            options: [
              { label: "Generate leads", value: "generate-leads" },
              { label: "Build brand credibility", value: "brand-credibility" },
              { label: "Recruit or attract talent", value: "recruit-talent" },
              { label: "Other", value: "other" },
            ],
          },
        ],
      },
      {
        id: "websiteSections",
        step: 5,
        kind: "form",
        title: "Now, tell us more about your business",
        fields: [
          {
            id: "websiteSections",
            label: "What main pages or sections do you want on your site?",
            type: "checkbox-group",
            required: true,
            helperText: "You can choose multiple options",
            validation: { required: true, minSelected: 1 },
            options: [
              { label: "About us", value: "about-us" },
              { label: "Our projects", value: "our-projects" },
              { label: "Blog", value: "blog" },
              { label: "Portfolio", value: "portfolio" },
              { label: "Product Catalog", value: "product-catalog" },
              { label: "FAQ", value: "faq" },
              { label: "Construction Updates", value: "construction-updates" },
              { label: "Custom Landing Page", value: "custom-landing-page" },
              { label: "News", value: "news" },
              { label: "Events", value: "events" },
            ],
          },
          {
            id: "specialFeatures",
            label: "Do you need any special website features?",
            type: "checkbox-group",
            required: true,
            helperText: "You can choose multiple options",
            validation: { required: true, minSelected: 1 },
            options: [
              { label: "Finance calculator", value: "finance-calculator" },
              { label: "Chatbot", value: "chatbot" },
              { label: "CRM integration", value: "crm-integration" },
              { label: "Multi-language support", value: "multi-language" },
              { label: "Payment gateway", value: "payment-gateway" },
              {
                label: "Google Tags Manager & Pixel Code Integration",
                value: "gtm-pixel-integration",
              },
              { label: "Other", value: "other" },
            ],
          },
        ],
      },
      {
        id: "companyProfile",
        step: 6,
        kind: "file-upload",
        title:
          "Do you have a company profile or presentation deck that precisely describes your business?",
        description: "Hit \"Next\" to skip if you don't have one.",
        uploadLabel: "Browse File",
        helperText: "Choose a file or drag & drop it here.",
        validation: uploadValidation,
      },
      {
        id: "additionalNotes",
        step: 7,
        kind: "form",
        title: "Anything else you'd like to add, {firstName}?",
        fields: [
          {
            id: "additionalNotes",
            label: "Type in what you got in mind",
            type: "textarea",
            placeholder:
              "Add any unique features, references, or goals you want us to consider in your estimate.",
            validation: { maxLength: 2500 },
          },
        ],
      },
      {
        id: "lastName",
        step: 8,
        kind: "form",
        title: "Let's Complete Your Contact Information",
        fields: [
          {
            id: "lastName",
            label: "Last Name",
            type: "text",
            required: true,
          },
          {
            id: "mobileNumber",
            label: "Mobile Number",
            type: "tel",
            required: true,
            defaultValue: "+20",
            prefix: "Egypt",
          },
          {
            id: "email",
            label: "E-mail Address",
            type: "email",
            required: true,
          },
        ],
      },
      {
        id: "companyName",
        step: 9,
        kind: "form",
        title: "Now, tell us more about your company",
        fields: [
          {
            id: "companyName",
            label: "What's your company name?",
            type: "text",
            required: true,
          },
          {
            id: "companyCountry",
            label: "Where is your company based?",
            type: "select",
            required: true,
            defaultValue: "egypt",
            options: [{ label: "Egypt", value: "egypt" }],
          },
          {
            id: "companyStage",
            label:
              "Which of the following best describes your current company stage?",
            type: "checkbox-group",
            required: true,
            validation: { required: true, minSelected: 1 },
            options: [
              { label: "Just me for now", value: "just-me" },
              { label: "Small team (1-10)", value: "small-team" },
              { label: "Growing business (11-50)", value: "growing-business" },
              {
                label: "Established company (51-200)",
                value: "established-company",
              },
              { label: "Enterprise (200+)", value: "enterprise" },
              {
                label: "Company setup in progress",
                value: "setup-in-progress",
              },
            ],
          },
        ],
      },
      {
        id: "nextAction",
        step: 10,
        kind: "completion-choice",
        title: "Choose What's Next",
        description:
          "Your project details have been received. Our team is reviewing your requirements to prepare a tailored, high-converting strategy.",
        validation: { required: true },
        options: [
          {
            label: "Schedule a Call",
            value: "schedule-call",
            recommended: true,
            outcome: { type: "route", href: "/quote/schedule-call" },
          },
          {
            label: "Get A Quick Estimate",
            value: "quick-estimate",
            outcome: { type: "route", href: "/quote/thank-you" },
          },
        ],
      },
      {
        id: "contact",
        step: 11,
        kind: "summary",
        title: "Thank You!",
        description:
          "Your project details have been received. Our team is reviewing your requirements to prepare a tailored, high-converting strategy.",
        submitLabel: "Back to Homepage",
        outcome: { type: "route", href: "/" },
      },
    ],
  },
  ecommerce: {
    service: "ecommerce",
    label: "eCommerce website",
    description: "An online store, catalog, or commerce experience.",
    startHref: "/quote/ecommerce/1",
    steps: [
      {
        id: "storeType",
        step: 1,
        kind: "radio",
        title: "What kind of commerce project is this?",
        validation: { required: true },
        options: [
          { label: "New online store", value: "new-store" },
          { label: "Redesign existing store", value: "redesign" },
          { label: "Subscription commerce", value: "subscription" },
          { label: "Product catalog", value: "catalog" },
        ],
      },
      {
        id: "storeFeatures",
        step: 2,
        kind: "form",
        title: "Which store features do you need?",
        fields: [
          {
            id: "storeFeatures",
            label: "Store features",
            type: "checkbox-group",
            required: true,
            validation: { required: true, minSelected: 1 },
            options: [
              { label: "Product variants", value: "variants" },
              { label: "Inventory management", value: "inventory" },
              { label: "Coupons or discounts", value: "discounts" },
              { label: "Subscriptions", value: "subscriptions" },
              { label: "Shipping rules", value: "shipping" },
              { label: "Analytics", value: "analytics" },
            ],
          },
        ],
      },
      {
        id: "timeline",
        step: 3,
        kind: "radio",
        title: "When do you want to launch?",
        validation: { required: true },
        options: timelineOptions,
      },
      {
        id: "budget",
        step: 4,
        kind: "radio",
        title: "What budget range are you planning around?",
        validation: { required: true },
        options: budgetOptions,
      },
      contactStep(5),
      summaryStep(6),
    ],
  },
  "mobile-app": {
    service: "mobile-app",
    label: "Mobile app",
    description: "A mobile product for iOS, Android, or both.",
    startHref: "/quote/mobile-app/1",
    steps: [
      {
        id: "mobilePlatform",
        step: 1,
        kind: "radio",
        title: "Which platform do you need first?",
        validation: { required: true },
        options: [
          { label: "iOS", value: "ios" },
          { label: "Android", value: "android" },
          { label: "Both", value: "both" },
          { label: "Not sure yet", value: "not-sure" },
        ],
      },
      {
        id: "mobileFeatures",
        step: 2,
        kind: "form",
        title: "What should the app include?",
        fields: [
          {
            id: "mobileFeatures",
            label: "App features",
            type: "checkbox-group",
            required: true,
            validation: { required: true, minSelected: 1 },
            options: [
              { label: "User accounts", value: "accounts" },
              { label: "Push notifications", value: "push-notifications" },
              { label: "Payments", value: "payments" },
              { label: "Location features", value: "location" },
              { label: "Chat or messaging", value: "chat" },
              { label: "Offline access", value: "offline-access" },
            ],
          },
        ],
      },
      {
        id: "timeline",
        step: 3,
        kind: "radio",
        title: "When do you want to launch?",
        validation: { required: true },
        options: timelineOptions,
      },
      {
        id: "budget",
        step: 4,
        kind: "radio",
        title: "What budget range are you planning around?",
        validation: { required: true },
        options: budgetOptions,
      },
      contactStep(5),
      summaryStep(6),
    ],
  },
  "custom-web": {
    service: "custom-web",
    label: "Custom-App platform",
    description: "A tailored web app, portal, dashboard, or internal platform.",
    startHref: "/quote/custom-web/1",
    steps: [
      {
        id: "platformType",
        step: 1,
        kind: "radio",
        title: "What are we building?",
        validation: { required: true },
        options: [
          { label: "Customer portal", value: "customer-portal" },
          { label: "Internal dashboard", value: "internal-dashboard" },
          { label: "Marketplace", value: "marketplace" },
          { label: "Booking or workflow tool", value: "workflow-tool" },
        ],
      },
      {
        id: "platformFeatures",
        step: 2,
        kind: "form",
        title: "Which features are likely needed?",
        fields: [
          {
            id: "platformFeatures",
            label: "Platform features",
            type: "checkbox-group",
            required: true,
            validation: { required: true, minSelected: 1 },
            options: [
              { label: "User accounts", value: "accounts" },
              { label: "Payments", value: "payments" },
              { label: "Admin dashboard", value: "admin-dashboard" },
              { label: "Messaging or notifications", value: "messaging" },
              { label: "Third-party integrations", value: "integrations" },
              { label: "Reporting", value: "reporting" },
            ],
          },
        ],
      },
      {
        id: "timeline",
        step: 3,
        kind: "radio",
        title: "When should the first usable version be ready?",
        validation: { required: true },
        options: timelineOptions,
      },
      {
        id: "budget",
        step: 4,
        kind: "radio",
        title: "What budget range are you planning around?",
        validation: { required: true },
        options: budgetOptions,
      },
      contactStep(5),
      summaryStep(6),
    ],
  },
} as const satisfies Record<QuoteService, QuoteFlow>;

export const quoteServiceOptions = QUOTE_SERVICES.map((service) => ({
  service,
  label: quoteFlows[service].label,
  description: quoteFlows[service].description,
  href: quoteFlows[service].startHref,
}));

export type QuoteFormValue =
  | string
  | readonly string[]
  | File
  | null
  | Record<string, string>;

export type QuoteFormState = Partial<Record<QuoteFieldKey, QuoteFormValue>>;

export function isQuoteService(value: string): value is QuoteService {
  return QUOTE_SERVICES.includes(value as QuoteService);
}

export function getQuoteFlow(service: QuoteService): QuoteFlow {
  return quoteFlows[service];
}

export function getStepConfig(
  service: QuoteService,
  step: number,
): QuoteStep | undefined {
  return quoteFlows[service].steps.find((item) => item.step === step);
}

export function getStepCount(service: QuoteService): number {
  return quoteFlows[service].steps.length;
}

export function getPreviousStep(service: QuoteService, step: number): number | null {
  const previousStep = quoteFlows[service].steps
    .map((item) => item.step)
    .filter((candidate) => candidate < step)
    .at(-1);

  return previousStep ?? null;
}

export function getNextOutcome(
  service: QuoteService,
  step: number,
  selectedValue?: string,
): QuoteOutcome {
  const config = getStepConfig(service, step);

  if (
    config &&
    selectedValue &&
    (config.kind === "radio" ||
      config.kind === "service-select" ||
      config.kind === "completion-choice")
  ) {
    const selectedOption = config.options.find(
      (option) => option.value === selectedValue,
    );

    if (selectedOption?.outcome) return selectedOption.outcome;
    if (selectedOption?.nextStep) {
      return { type: "step", step: selectedOption.nextStep };
    }
  }

  if (config?.outcome) {
    return config.outcome;
  }

  const nextStep = quoteFlows[service].steps.find((item) => item.step > step);

  if (!nextStep) {
    return { type: "route", href: "/quote/thank-you" };
  }

  return { type: "step", step: nextStep.step };
}

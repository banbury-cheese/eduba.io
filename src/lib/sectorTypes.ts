export interface Sector {
  slug: string;
  title: string;
  pageIndex: string;
  pageTag: string;
  hero: {
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
    exploreLabel: string;
  };
  consulting: {
    label: string;
    title: string;
    description: string[];
    cards: {
      id: string;
      title: string;
      body: string;
    }[];
  };
  whyUs: {
    label: string;
    title: string;
    items: {
      id: string;
      title: string;
      description: string;
    }[];
  };
  services: {
    label: string;
    title: string;
    intro: string;
    cards: {
      id: string;
      title: string;
      price?: string;
      body: string;
    }[];
  };
  methodology: {
    label: string;
    title: string;
    steps: {
      id: string;
      title: string;
      description: string;
    }[];
  };
  engagement: {
    label: string;
    title: string;
    intro: string;
    cards: {
      id: string;
      title: string;
      body: string;
    }[];
  };
  faq: {
    label: string;
    title: string;
    items: {
      question: string;
      answer: string;
    }[];
  };
  cta: {
    label: string;
    title: string;
    buttonLabel: string;
    buttonHref: string;
  };
}

const home = {
  heroHeading: "Let’s make it happen", heroSubheading: "Enterprise software, web design, AI automation and digital marketing for ambitious businesses across East Africa.",
  imageUrl: "/hero-image.png", videoUrl: null, posterUrl: null,
  primaryCtaText: "Start a project", primaryCtaLink: "/contact", secondaryCtaText: "View our work", secondaryCtaLink: "/projects",
  featuredProjectsKicker: " Featured Projects", featuredProjectsTitle: "Proven Results\nAcross Diverse\nVerticals.", featuredProjectsDescription: "Explore our impactful solutions across diverse client verticals, from customer service to e-commerce, delivering real value and innovation.",
  stat1Label: "Projects Delivered", stat1Value: "50+", stat2Label: "Partners", stat2Value: "15+", stat3Label: "Team Experts", stat3Value: "10+", stat4Label: "PROJECT SUCCESS", stat4Value: "98%",
  introStatement: "We design and engineer the websites, software and AI systems that ambitious East African businesses run on, and we stay until they work.",
  introImages: ["p-lime", "p-orange", "p-green", "p-white"].map((n) => ({ url: `/${n}.png`, alt: n })),
  faqs: [
    { question: "What services do you provide?", answer: "Four things: web design and development, custom software, AI and automation, and digital marketing." },
    { question: "How do you approach a new project?", answer: "It starts with a 30-minute call to understand the business problem." },
    { question: "What is the typical timeline for a project?", answer: "It depends on scope." },
  ],
};
const projects = [
  { _id: "1", title: "JekaBet", category: "iGaming", projectUrl: "https://www.jekabet.ug/en/", imageUrl: "/logo-sq.png", imageWidth: 400 },
  { _id: "2", title: "Jolex Freight Services", category: "Logistics", projectUrl: null, imageUrl: "/logo-sq.png", imageWidth: 400 },
  { _id: "3", title: "Netbet UG", category: "iGaming", projectUrl: null, imageUrl: "/logo-sq.png", imageWidth: 400 },
  { _id: "4", title: "Abeeka Band", category: "Web Design", projectUrl: null, imageUrl: "/hero-image.png", imageWidth: 1210 },
  { _id: "5", title: "Sync Sales", category: "Web Design", projectUrl: null, imageUrl: "/logo-sq.png", imageWidth: 400 },
  { _id: "6", title: "Talk 2 Me", category: "Software", projectUrl: null, imageUrl: "/logo-sq.png", imageWidth: 400 },
];
const services = [
  { _id: "s1", title: "Custom Web Development", description: "We create stunning, responsive websites that captivate your audience and drive conversions.", features: ["Custom UI", "SEO", "Performance optimization", "Responsive Layouts"], imageUrl: "/s-1.png" },
  { _id: "s2", title: "Software Development", description: "Custom software solutions built with modern technologies for real business problems.", features: ["Full-Stack Development", "API Integration", "Cloud Architecture"], imageUrl: "/s-2.png" },
  { _id: "s3", title: "Digital Marketing", description: "Creative digital marketing that attracts customers and accelerates growth.", features: ["Social Media Marketing", "SEO", "Paid Advertising"], imageUrl: "/s-3.png" },
  { _id: "s4", title: "AI Automation", description: "Leverage artificial intelligence to automate processes.", features: ["AI Chatbots", "AI Agents"], imageUrl: "/s-4.png" },
];
const posts = [
  { _id: "b1", title: "Your Marketing Budget Doesn't Need Five Channels. It Needs One, Done Right.", slug: "a", excerpt: "UGX 500,000 doesn't buy five marketing channels in Uganda—it barely covers one.", publishedAt: "2026-09-18", imageUrl: "/b-1.png", characters: 6200 },
  { _id: "b2", title: "Uganda's Newest Marketplace Doesn't Have an App. That's the Point.", slug: "b", excerpt: "Boda riders just built Uganda's newest marketplace with no app.", publishedAt: "2026-09-16", imageUrl: "/b-1.png", characters: 5400 },
  { _id: "b3", title: "Uganda's Faster Internet Is Raising the Bar for Business Websites", slug: "c", excerpt: "Uganda's internet is getting faster, but many business websites haven't caught up.", publishedAt: "2026-09-07", imageUrl: "/b-1.png", characters: 4100 },
];
export function createClient(_: unknown) {
  return { fetch: async (q: string) => {
    if (q.includes('"home":')) return { home, about: null, projects, projectCount: 7, services, posts };
    if (q.includes('"footer"')) return { footer: { companyText: "We build digital solutions that power real business growth.", email: "hello@makeithappen.ug", phone: "+256790879117", location: "Kampala, Uganda", socialLinks: [] }, settings: { logoUrl: "/logo.png", socialLinks: [] } };
    if (q.includes('"siteSettings"')) return { siteTitle: "Make It Happen", logoUrl: "/logo.png", projectCount: 7 };
    if (q.includes('_type == "post"')) return posts;
    if (q.includes('_type == "service"')) return services;
    return null;
  } };
}

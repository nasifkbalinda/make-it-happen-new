import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // --- GLOBAL SETTINGS ---
      S.listItem()
        .title('Global Site Settings')
        .id('siteSettingsSingleton')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Global Site Settings'),
        ),
        
      S.divider(), // Adds a nice visual line in the sidebar

      // --- PAGE SETTINGS ---
      S.listItem()
        .title('Homepage Settings')
        .id('homepageSingleton')
        .child(
          S.document().schemaType('homepage').documentId('homepage').title('Homepage Settings')
        ),
      S.listItem()
        .title('Services Page Settings')
        .id('servicesPageSingleton')
        .child(
          S.document().schemaType('servicesPage').documentId('servicesPage').title('Services Page Settings')
        ),
      S.listItem()
        .title('Projects Page Settings')
        .id('projectsPageSingleton')
        .child(
          S.document().schemaType('projectsPage').documentId('projectsPage').title('Projects Page Settings')
        ),
      S.listItem()
        .title('Blog Page Settings')
        .id('blogPageSingleton')
        .child(
          S.document().schemaType('blogPage').documentId('blogPage').title('Blog Page Settings')
        ),
      S.listItem()
        .title('About Us')
        .id('aboutSingleton')
        .child(
          S.document().schemaType('about').documentId('about').title('About Us')
        ),
      S.listItem()
        .title('Contact Page')
        .id('contactSingleton')
        .child(
          S.document().schemaType('contact').documentId('contact').title('Contact Page')
        ),
        
      S.divider(),

      // --- FOOTER ---
      S.listItem()
        .title('Site Footer')
        .id('footerSingleton')
        .child(
          S.document().schemaType('footer').documentId('footer').title('Site Footer')
        ),

      S.divider(),

      // --- DYNAMIC LISTS (Services, Posts, Projects) ---
      // This automatically lists everything else while hiding the singletons we defined above
      ...S.documentTypeListItems().filter(
        (item) => ![
          'siteSettings', 
          'homepage', 
          'servicesPage', 
          'projectsPage', 
          'blogPage', 
          'about', 
          'contact', 
          'footer'
        ].includes(item.getId() ?? ''),
      ),
    ])
import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('About Us')
        .id('aboutSingleton')
        .child(
          S.document()
            .schemaType('about')
            .documentId('about')
            .title('About Us'),
        ),
      S.listItem()
        .title('Contact Page')
        .id('contactSingleton')
        .child(
          S.document()
            .schemaType('contact')
            .documentId('contact')
            .title('Contact Page'),
        ),
      S.listItem()
        .title('Site Footer')
        .id('footerSingleton')
        .child(
          S.document()
            .schemaType('footer')
            .documentId('footer')
            .title('Site Footer'),
        ),
      ...S.documentTypeListItems().filter(
        (item) => !['about', 'contact', 'footer'].includes(item.getId() ?? ''),
      ),
    ])

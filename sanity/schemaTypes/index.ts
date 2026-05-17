import { type SchemaTypeDefinition } from 'sanity'
import { about } from './about'
import { contact } from './contact'
import { footer } from './footer'
import { homepage } from './homepage'
import { post } from './post'
import { project } from './project'
import { service } from './service'
import { servicesPage } from './servicesPage'
import { projectsPage } from './projectsPage'
import { blogPage } from './blogPage'

// 1. IMPORT IT HERE
import { siteSettings } from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    about, 
    contact, 
    footer, 
    homepage, 
    project, 
    service, 
    post,
    servicesPage,
    projectsPage,
    blogPage,
    // 2. ADD IT HERE
    siteSettings 
  ],
}
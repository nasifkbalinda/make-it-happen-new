import { type SchemaTypeDefinition } from 'sanity'
import { about } from './about'
import { contact } from './contact'
import { footer } from './footer'
import { homepage } from './homepage'
import { post } from './post'
import { project } from './project'
import { service } from './service'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [about, contact, footer, homepage, project, service, post],
}
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title: 'Palisade Realty',
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem().title('Blog Posts').schemaType('post').child(S.documentTypeList('post').title('Blog Posts')),
            S.listItem()
              .title('Blog Posts (Content Machine)')
              .schemaType('blogPost')
              .child(S.documentTypeList('blogPost').title('Blog Posts (Content Machine)')),
          ]),
    }),
  ],
})

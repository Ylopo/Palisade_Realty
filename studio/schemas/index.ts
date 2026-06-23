import type { SchemaTypeDefinition } from 'sanity'
import featuredListing from './featuredListing'
import teamMember from './teamMember'
import headerCarousel from './headerCarousel'
import testimonial from './testimonial'
import teamPage from './teamPage'

export const schemaTypes: SchemaTypeDefinition[] = [featuredListing, teamMember, headerCarousel, testimonial, teamPage]

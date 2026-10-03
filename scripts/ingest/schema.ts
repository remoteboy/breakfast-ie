import { z } from 'zod/v4';

export const SourceKindSchema = z.enum([
  'website',
  'menu',
  'hours',
  'about',
]);

export const SourceSchema = z.object({
  kind: SourceKindSchema,
  url: z.string().url(),
  label: z.string().min(1),
});

export const VenueManifestEntrySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  city: z.string().min(1),
  sources: z.array(SourceSchema).min(1),
});

export const VenueManifestSchema = z.array(VenueManifestEntrySchema);

export type SourceKind = z.infer<typeof SourceKindSchema>;
export type Source = z.infer<typeof SourceSchema>;
export type VenueManifestEntry = z.infer<typeof VenueManifestEntrySchema>;

export const ComponentSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().positive().nullable(),
  unit: z.string().nullable(),
  notes: z.string().nullable(),
});

export const IncludedDrinkSchema = z.object({
  name: z.string().min(1),
  choice: z.boolean().nullable(),
  notes: z.string().nullable(),
});

export const DietarySchema = z.object({
  vegetarian: z.boolean().nullable(),
  vegan: z.boolean().nullable(),
  glutenFree: z.boolean().nullable(),
  glutenFreeAvailable: z.boolean().nullable(),
});

export const MealContextSchema = z.enum([
  'breakfast',
  'brunch',
  'all-day-breakfast',
  'other',
]);

export const AudienceSchema = z.enum([
  'general',
  'kids',
]);

export const EvidenceTypeSchema = z.enum([
  'menu',
  'review',
  'testimonial',
  'marketing',
  'faq',
  'other',
]);

export const MenuItemSchema = z.object({
  name: z.string().min(1),
  category: z.enum([
    'full-irish',
    'irish-breakfast',
    'breakfast-roll',
    'eggs',
    'pancakes',
    'porridge',
    'granola',
    'sandwich',
    'other',
  ]),
  section: z.string().nullable(),
  mealContext: MealContextSchema,
  audience: AudienceSchema,
  seasonal: z.boolean().nullable(),
  description: z.string().nullable(),
  price: z.object({
    amount: z.number().nonnegative(),
    currency: z.literal('EUR'),
  }).nullable(),
  components: z.array(ComponentSchema),
  includedDrinks: z.array(IncludedDrinkSchema),
  dietary: DietarySchema,
  availabilityNotes: z.string().nullable(),
  sourceUrl: z.string().min(1),
  evidence: z.string().nullable(),
  evidenceType: EvidenceTypeSchema,
  confidence: z.number().min(0).max(1),
});

export const VenueExtractionSchema = z.object({
  slug: z.string().min(1),
  venueName: z.string().min(1),
  summary: z.string().nullable(),
  menuItems: z.array(MenuItemSchema),
  warnings: z.array(z.string()),
});

export type MenuItem = z.infer<typeof MenuItemSchema>;
export type VenueExtraction = z.infer<typeof VenueExtractionSchema>;

export const QualityItemDecisionSchema = z.enum([
  'accept',
  'review',
  'reject',
]);

export const QualityStatusSchema = z.enum([
  'publishable',
  'review-required',
  'source-too-thin',
  'source-stale',
]);

export const ItemQualityAssessmentSchema = z.object({
  index: z.number().int().nonnegative(),
  name: z.string(),
  decision: QualityItemDecisionSchema,
  reasons: z.array(z.string()),
});

export const VenueQualityAssessmentSchema = z.object({
  status: QualityStatusSchema,
  publishableItems: z.number().int().nonnegative(),
  reviewItems: z.number().int().nonnegative(),
  rejectedItems: z.number().int().nonnegative(),
  reasons: z.array(z.string()),
  items: z.array(ItemQualityAssessmentSchema),
});

export const VenueCandidateSchema = VenueExtractionSchema.extend({
  quality: VenueQualityAssessmentSchema,
});

export type VenueCandidate = z.infer<typeof VenueCandidateSchema>;
export type VenueQualityAssessment = z.infer<typeof VenueQualityAssessmentSchema>;

export const FetchedDocumentSchema = z.object({
  slug: z.string(),
  source: SourceSchema,
  fetchedAt: z.string(),
  contentType: z.string(),
  sha256: z.string(),
  rawPath: z.string(),
  textPath: z.string(),
  characterCount: z.number().int().nonnegative(),
});

export type FetchedDocument = z.infer<typeof FetchedDocumentSchema>;

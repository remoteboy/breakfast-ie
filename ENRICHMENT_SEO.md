# Venue enrichment + structured data

This patch adds a manually verified metadata layer beside the ingestion pipeline.

## What it adds

- day-specific breakfast/brunch service windows for promoted Dublin venues
- current general opening hours where an official venue source states them clearly
- fallback coordinates for a subset of venues whose curated place record has no geo point
- those fallback coordinates feed the existing "nearest" sort and Directions links
- breakfast-hours UI on venue pages
- venue-hours UI in Details
- Restaurant + Menu + MenuItem + BreadcrumbList JSON-LD on place pages
- CollectionPage + ItemList JSON-LD on `/dublin/`
- static `/sitemap.xml`
- static `/robots.txt`
- an integrity checker for enrichment records

Current enrichment coverage in this patch: **19 venue records**, **11 fallback geo points**, and **18 venues with explicit breakfast/brunch service windows**. Keogh's is intentionally the exception: its current site publishes venue opening hours and a breakfast menu, but not a trustworthy breakfast finish time.

## Data rules

- Official venue pages are authoritative for hours.
- Opening hours and breakfast/brunch service hours are distinct fields.
- Unknown finish times stay unknown.
- Coordinates never overwrite a curated place coordinate; they are fallback-only.
- Menu structured data comes only from promoted menu items already accepted by the ingestion gate.
- Restaurant opening-hours JSON-LD is emitted only from true venue opening hours, never from a breakfast/brunch service window.
- JSON-LD is serialized defensively so menu text cannot terminate the script element.
- No review content or inferred menu facts are emitted in structured data.

## Check

```bash
yarn astro check
yarn tsx scripts/check-enrichment.ts
yarn build
```

Then inspect:

- `/places/house-dublin/` — weekday vs Saturday breakfast/brunch windows
- `/places/laylas-ranelagh/` — weekday breakfast and weekend breakfast/brunch
- `/places/tang-abbey-street/` — weekday breakfast + Saturday all-day brunch
- `/places/social-fabric/` — all-day breakfast mapped to current opening hours
- `/dublin/?sort=nearest` — more venues now participate in distance sorting
- `/sitemap.xml`
- `/robots.txt`

Suggested commit:

```bash
git add .
git commit -m "feat: enrich venue hours and structured data"
```

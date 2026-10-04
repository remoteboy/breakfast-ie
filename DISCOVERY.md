# Dublin discovery pass

This patch turns the Dublin listing into a menu-aware discovery surface while keeping the site static-first.

## What changes

- Adds `src/lib/discovery.ts` as the single derivation layer between promoted menu data and UI discovery.
- Adds menu-aware filters: **Under €15**, **GF option**, **Drink included**, and **Verified menu** alongside the existing venue filters.
- Full Irish / vegetarian / vegan filters can be augmented by accepted menu data when the dish itself explicitly says so.
- Adds sorting by lowest menu price, most menu choice, name, and nearest when location is available.
- Place rows show accepted menu item counts and minimum menu price.
- Search/autocomplete now indexes promoted breakfast dish names.
- Filter buttons show the number of results the click would produce and disable impossible combinations.
- Adds a dataset summary at the top of `/dublin/`.
- Adds a lightweight discovery integrity check.

## Deliberately conservative derivation

The discovery layer does not infer ingredients or dietary suitability from components.

- `Under €15` only uses explicit EUR prices on accepted promoted menu items.
- `Drink included` only uses explicit `includedDrinks` data.
- `GF option` only uses `glutenFree` / `glutenFreeAvailable` flags.
- Vegetarian / vegan can use the structured dietary flag or an explicit dish name containing `Vegetarian` / `Vegan`.
- Full Irish uses the `full-irish` category or an explicit `Full Irish` dish name.
- Existing hand-curated venue facts remain valid and are merged with menu-derived signals.

## Check

```bash
yarn astro check
yarn tsx scripts/check-discovery.ts
yarn dev
```

Useful URLs:

```text
/dublin/?filter=full-irish
/dublin/?filter=under-15
/dublin/?filter=drink-included
/dublin/?filter=vegan&filter=under-15
/dublin/?sort=price
```

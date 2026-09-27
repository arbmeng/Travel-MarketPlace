// Curated placeholder photography (Unsplash CDN, hotlinked for prototype purposes).
// Every URL below was fetched and visually verified to depict its labeled theme.
// Swap for licensed/original agency photography before production launch.

function u(id: string, w = 1200) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
}

export const MOUNTAIN_IMAGES = [
  u("photo-1506905925346-21bda4d32df4"), // snow-capped peak at sunset, clouds
  u("photo-1544735716-392fe2489ffa"), // high snow mountain range with small temple
  u("photo-1464822759023-fed622ff2c3b"), // green mountain valley with river
  u("photo-1470071459604-3b5ec3a7fe05"), // sunset over layered green mountain ridges
  u("photo-1476514525535-07fb3b4ae5f1"), // boat approaching mountain lake
  u("photo-1500534623283-312aade485b7"), // mountain range silhouette at sunset
];

export const LAKE_IMAGES = [
  u("photo-1439853949127-fa647821eba0"), // turquoise mountain lake (Lake Louise style)
  u("photo-1439066615861-d1af74d74000"), // wooden dock on calm forest lake
  u("photo-1476514525535-07fb3b4ae5f1"), // boat on mountain lake
  u("photo-1470770903676-69b98201ea1c"), // mountain lake with wooden rowboats at dock
];

export const VALLEY_IMAGES = [
  u("photo-1441974231531-c6227db76b6e"), // forest path with light rays
  u("photo-1470252649378-9c29740c9fa8"), // golden sunset over green fields
  u("photo-1500534623283-312aade485b7"), // mountain silhouette at dusk
  u("photo-1568454537842-d933259bb258"), // hiker overlooking a deep green valley/fjord
];

export const WATERFALL_IMAGES = [
  u("photo-1432405972618-c60b0225b8f9"), // waterfall over mossy rocks in forest
  u("photo-1433086966358-54859d0ed716"), // tall waterfall through green canyon
];

export const VILLAGE_IMAGES = [
  u("photo-1533105079780-92b9be482077"), // whitewashed hillside village by the sea
  u("photo-1478131143081-80f7f84ca84d"), // community gathered around a fire at dusk
  u("photo-1441974231531-c6227db76b6e"), // forest path near village
];

export const HIKING_IMAGES = [
  u("photo-1551632811-561732d1e306"), // hiker with red backpack on mountain trail
  u("photo-1568454537842-d933259bb258"), // hiker overlooking valley and lake
  u("photo-1516939884455-1445c8652f83"), // van camping at night under the stars
];

export const CAMPING_IMAGES = [
  u("photo-1504280390367-361c6d9f38f4"), // view from inside a tent into the forest
  u("photo-1478131143081-80f7f84ca84d"), // campfire gathering at dusk
  u("photo-1487730116645-74489c95b41b"), // illuminated tent at night with campfire
];

export const FOOD_IMAGES = [
  u("photo-1504674900247-0877df9cc836"), // plated traditional meal
  u("photo-1546069901-ba9599a7e63c"), // fresh bowl of food, top view
  u("photo-1551632436-cbf8dd35adfa"), // warmly lit restaurant interior
];

export const HISTORICAL_IMAGES = [
  u("photo-1544735716-392fe2489ffa"), // small stone temple perched on a mountain
  u("photo-1533105079780-92b9be482077"), // historic whitewashed hillside town
  u("photo-1470252649378-9c29740c9fa8"), // golden countryside at sunset
];

export function avatar(seed: string) {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=EAF3F1,F4EFE4`;
}

export function logoPlaceholder(seed: string) {
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0F3D3E,B5652F,D9A441`;
}

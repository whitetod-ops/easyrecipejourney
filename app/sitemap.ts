import type { MetadataRoute } from 'next';
import { getAllRecipes } from '@/lib/recipes';
import { CUISINES } from '@/lib/cuisines';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recipes = await getAllRecipes();
  const base = 'https://easyrecipejourney.com';

  const staticRoutes: MetadataRoute.Sitemap = ['', '/recipes', '/cuisine', '/about'].map(path => ({
    url: base + path,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.8,
  }));

  const recipeRoutes: MetadataRoute.Sitemap = recipes.map(r => ({
    url: `${base}/recipe/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const cuisineRoutes: MetadataRoute.Sitemap = CUISINES.map(c => ({
    url: `${base}/cuisine/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...recipeRoutes, ...cuisineRoutes];
}

import { type CollectionEntry } from 'astro:content';

export type CollectionData = CollectionEntry<'dev' | 'docs' | 'snippet'> & { href: string };

export type AllCollectionEntry = CollectionEntry<'dev'> | CollectionEntry<'docs'> | CollectionEntry<'snippet'>;

export type TOCSection = {
  slug: string;
  text: string;
  level: 1 | 2 | 3;
};

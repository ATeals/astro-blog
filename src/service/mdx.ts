import { type CollectionEntry, getCollection } from 'astro:content';

export type CollectionData = CollectionEntry<'dev' | 'docs'> & { href: string };

export type AllCollectionEntry = CollectionEntry<'dev'> | CollectionEntry<'docs'>;

const getAllCollection = async () => {
  const dev = await getCollection('dev');
  const docs = await getCollection('docs');

  return [...dev, ...docs];
};

export class Document {
  public collections: CollectionData[];

  constructor(collections: AllCollectionEntry[]) {
    this.collections = collections
      .map((collection) => this.parseCollection(collection))
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  }

  static async getAll() {
    const collections = await getAllCollection();

    return new Document(collections);
  }

  static async getByCollection(name: 'dev' | 'docs') {
    const collections = await getCollection(name);

    return new Document(collections);
  }

  static async getByType(type: string) {
    const collections = await getAllCollection();

    return new Document(collections.filter((collection) => collection.data.type === type));
  }

  static async getBySeries(series: string) {
    const collections = await getAllCollection();

    return new Document(collections).collections.filter((collection) => collection.data?.series === series);
  }

  parseCollection(collection: AllCollectionEntry) {
    return {
      ...collection,
      data: {
        ...collection.data,
        date: new Date(collection.data.date),
        description: collection.data.description || collection.body.substring(0, 100),
        img: collection.data.img || '/images/astro.png'
      },
      href: `/posts/${collection.slug}`
    };
  }

  sort(type: 'asc' | 'desc') {
    this.collections = this.collections.sort((a, b) =>
      type === 'asc' ? a.data.date.getTime() - b.data.date.getTime() : b.data.date.getTime() - a.data.date.getTime()
    );

    return this;
  }

  *[Symbol.iterator]() {
    for (const collection of this.collections) {
      yield collection;
    }
  }
}

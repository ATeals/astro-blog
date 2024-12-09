import { type CollectionEntry, getCollection } from 'astro:content';

export type CollectionData = CollectionEntry<'dev'> & { href: string };

const getAllCollection = async () => {
  const collections = await getCollection('dev');

  return collections;
};

export class Document {
  public collections: CollectionData[];

  constructor(collections: CollectionEntry<'dev'>[]) {
    this.collections = collections
      .map((collection) => this.parseCollection(collection))
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  }

  static async getAll() {
    const collections = await getAllCollection();

    return new Document(collections);
  }

  static async getByCollection(name: 'dev') {
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

  parseCollection(collection: CollectionEntry<'dev'>) {
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

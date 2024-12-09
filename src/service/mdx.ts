import { type CollectionEntry, getCollection } from 'astro:content';

export type CollectionData = CollectionEntry<'dev' | 'docs'> & { href: string };

export type AllCollectionEntry = CollectionEntry<'dev'> | CollectionEntry<'docs'>;

const getAllCollection = async () => {
  const dev = await getCollection('dev');
  const docs = await getCollection('docs');

  return [...dev, ...docs];
};

export class PostBuilder {
  public collections: CollectionData[];

  constructor(collections: AllCollectionEntry[]) {
    this.collections = collections
      .map((collection) => this.parseCollection(collection))
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  }

  static async getAll() {
    const collections = await getAllCollection();

    return new PostBuilder(collections);
  }

  static async getByCollection(name: string) {
    const collections = PostBuilder.isCollectionType(name) ? await getCollection(name) : await getAllCollection();

    return new PostBuilder(collections);
  }

  static isCollectionType(type: string): type is 'dev' | 'docs' {
    return ['dev', 'docs'].includes(type);
  }

  static async getBySeries(series: string) {
    const collections = await getAllCollection();

    return new PostBuilder(collections).collections.filter((collection) => collection.data?.series === series);
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

  static async getAdjacentPosts(post: AllCollectionEntry) {
    const collections = [...(await PostBuilder.getAll())];

    const index = collections.findIndex((collection) => collection.id === post.id);

    return {
      prev: collections[index - 1],
      next: collections[index + 1]
    };
  }

  static async getAdjacentType(post: AllCollectionEntry) {
    const collections = [...(await PostBuilder.getByCollection(post.data.type))];

    const index = collections.findIndex((collection) => collection.id === post.id);

    return {
      prev: collections[index - 1],
      next: collections[index + 1]
    };
  }

  *[Symbol.iterator]() {
    for (const collection of this.collections) {
      yield collection;
    }
  }
}

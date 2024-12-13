import { getCollection } from 'astro:content';

import { SITE } from '@/consts';

import { POST_TYPES, type PostTypeKey } from './const';
import type { AllCollectionEntry, CollectionData, TOCSection } from './type';

const isCollectionType = (type: string): type is PostTypeKey => {
  return POST_TYPES.some((postType) => postType.type === type && type !== 'ALL');
};

const getAllCollection = async () => {
  const posts = await Promise.all(POST_TYPES.map(({ type }) => getCollection(type as PostTypeKey)));

  return posts.flat();
};

const isUrlString = (str?: string | null) => {
  return /^(http|https):\/\//.test(str || '');
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
    const collections = isCollectionType(name) ? await getCollection(name) : await getAllCollection();

    return new PostBuilder(collections);
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
        image: collection.data.image || SITE.img
      },
      iconType: isUrlString(collection.data.icon) ? 'url' : 'string',
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
      prev: collections[index + 1],
      next: collections[index - 1]
    };
  }

  static parseToc(source: string) {
    return source
      .split('\n')
      .filter((line) => line.match(/(^#{1,3})\s/))
      .reduce<TOCSection[]>((ac, rawHeading) => {
        const removeMdx = rawHeading
          .replace(/^##*\s/, '')
          .replace(/[*,~]{2,}/g, '')
          .replace(/(?<=\])\((.*?)\)/g, '')
          .replace(/(?<!\S)((http)(s?):\/\/|www\.).+?(?=\s)/g, '')
          .replaceAll('`', '')
          .replaceAll('[#]', '');

        const level = rawHeading.match(/^#+/)?.[0].length ?? 0;

        const section = {
          slug: removeMdx
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣 -]/g, '')
            .replace(/\s/g, '-'),
          text: removeMdx.replace(/\[(.*?)\]\(.*?\)/g, '$1'),
          level: level as 1 | 2 | 3
        };

        return [...ac, section];
      }, []);
  }

  *[Symbol.iterator]() {
    for (const collection of this.collections) {
      yield collection;
    }
  }
}

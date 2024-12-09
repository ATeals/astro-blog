import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { type CollectionData, PostBuilder } from '@/service/mdx';

const HEADING_LEVELS_MAP = {
  1: 'mb-8 font-bold',
  2: 'pt-2 font-semibold',
  3: 'pt-2 border-r border-r-zinc-200 font-thin'
};

export const Toc = ({ post }: { post: CollectionData }) => {
  const { activeHeading } = useSelectedHeading();

  const tocHeadings = PostBuilder.parseToc(post.body);

  const goHeading = ({ slug }: { slug: string }) => {
    window.location.replace(`#${slug}`);
  };

  return (
    <ul className="mb-10 max-h-[700px] overflow-scroll scrollbar-hide">
      {tocHeadings.map(({ text, level, slug }, index) => (
        <li
          key={text + level + index}
          style={{ marginRight: (level - 2) * 5, paddingRight: (level - 2) * 5 }}
          className={cn(
            HEADING_LEVELS_MAP[level],
            'mr-2 hover:text-primary-lg hover:underline',
            activeHeading.value === text && activeHeading.level === level && 'text-secondary-md'
          )}
        >
          <span className="hover:cursor-pointer" onClick={() => goHeading({ slug })}>
            {text}
          </span>
        </li>
      ))}
    </ul>
  );
};

export const useSelectedHeading = ({
  intersectionObserverOptions = { rootMargin: '0px 0px -80% 0px' }
}: {
  intersectionObserverOptions?: IntersectionObserverInit;
} = {}) => {
  const [activeHeading, setActiveHeading] = useState({ value: '', level: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const headingElement = entry.target as HTMLHeadingElement;

          setActiveHeading({
            value: headingElement.innerText,
            level: Number(headingElement.tagName.replace('H', ''))
          });
        }
      });
    }, intersectionObserverOptions);

    const headingElements = document.querySelectorAll('h1, h2, h3');

    headingElements.forEach((element) => observer.observe(element));

    return () => {
      headingElements.forEach((element) => observer.unobserve(element));
    };
  }, []);

  return { activeHeading };
};

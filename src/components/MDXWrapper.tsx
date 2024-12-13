import '@/styles/codeHighlight.css';
import '@/styles/callout.css';

import { cn } from '@/lib/utils';

export const MDXWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn(MARKDOWN_STYLE_CLASSNAME, className, 'prose-h3:first-of-type:text-red-300')} data-animate>
    {children}
  </div>
);

const MARKDOWN_STYLES = {
  base: [
    'mdx',
    'px-2 md:px-0 ',
    'prose prose-stone !max-w-none',
    'dark:prose-invert',
    'prose-strong:dark:text-zinc-300'
  ],
  paragraph: [
    'prose-p:leading-7 prose-p:tracking-normal antialiased',
    'prose-p:break-words',
    'prose-p:text-[#464646] dark:prose-p:text-gray-300',
    'prose-p:font-normal ',
    'prose-p:mb-8'
  ],
  headings: [
    'prose-headings:mb-8',
    'prose-h1:text-2xl',
    'prose-h2:text-xl prose-h2:mt-40 prose-h2:border-b prose-h2:border-gray-300',
    'prose-h2:font-semibold',
    'prose-h3:text-base prose-h3:font-bold prose-h3:mt-36'
  ],
  blockquote: [
    'prose-quoteless',
    'dark:prose-blockquote:text-zinc-400',
    'dark:prose-blockquote:bg-zinc-800',
    'prose-blockquote:not-italic',
    'prose-blockquote:border-primary-lg',
    'dark:prose-blockquote:border-primary-md',
    'prose-blockquote-p:mb-[0.5rem]',
    'prose-blockquote:pr-4',
    'prose-blockquote:bg-slate-50',
    'prose-blockquote:shadow-inner',
    'prose-blockquote:shadow-zinc-300',
    'prose-blockquote:rounded-r-lg',
    'dark:prose-blockquote:bg-zinc-900',
    'dark:prose-blockquote:shadow-inner',
    'dark:prose-blockquote:shadow-black',
    'prose-blockquote:my-8'
  ],
  inlineCode: [
    'prose-inline-code:inline-block',
    'prose-inline-code:px-1',
    'prose-inline-code:font-normal',
    'prose-inline-code:relative',
    'prose-inline-code:-top-[0.125rem]',
    'prose-inline-code:bg-zinc-100',
    'prose-inline-code:text-secondary-lg',
    'prose-inline-code:rounded-md',
    'prose-inline-code:shadow-md',
    'dark:prose-inline-code:shadow-black',
    'dark:prose-inline-code:bg-zinc-900',
    'dark:prose-inline-code:text-secondary-md'
  ],
  code: ['prose-code:before:hidden', 'prose-code:after:hidden', 'prose-code:text-[0.725rem]'],
  codeBlock: ['prose-pre:shadow-lg', 'dark:prose-pre:shadow-black', 'prose-pre:p-2', 'prose-pre:bg-transparent'],
  image: ['prose-img:mx-auto', 'prose-img:rounded-md', 'prose-img:shadow-lg', 'dark:prose-img:shadow-black'],
  list: ['prose-li:text-gray-700', 'dark:prose-li:text-gray-300', 'prose-li:font-[350]'],
  table: ['prose-th:text-start'],
  link: [
    'prose-a:text-gray-500 hover:prose-a:no-underline hover:prose-a:text-primary-md prose-a:transition-all prose-a:duration-500',
    'prose-a:relative',
    'prose-a:before:absolute prose-a:before:bottom-0 prose-a:before:left-0 prose-a:before:w-0 prose-a:before:h-[1px] prose-a:before:bg-primary-md prose-a:before:transition-all prose-a:before:duration-500',
    'hover:prose-a:before:w-full'
  ]
} as const;

const MARKDOWN_STYLE_CLASSNAME = Object.values(MARKDOWN_STYLES)
  .map((style) => style.join(' '))
  .join(' ');

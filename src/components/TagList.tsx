import { cn } from '@/lib/utils';

import { Badge } from './ui/badge';

export const TagList = ({ tags, className }: { tags?: string[]; className?: string }) => {
  return (
    <ul className={cn(className)}>
      {tags?.map((tag) => (
        <Badge key={tag} className="mr-1 text-[0.5rem]">
          {tag}
        </Badge>
      ))}
    </ul>
  );
};

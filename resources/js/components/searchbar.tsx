import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const searchBarVariants = cva(
    'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm focus-within:ring-2 focus-within:ring-ring transition-all',
    {
        variants: {
            variant: {
                default: 'bg-background text-foreground',
                subtle: 'bg-muted text-muted-foreground',
                outline: 'border border-input',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof searchBarVariants> {
    icon?: React.ReactNode;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(({ className, variant, icon, ...props }, ref) => {
    return (
        <div className={cn(searchBarVariants({ variant }), className)}>
            {icon && <span className="text-muted-foreground pl-1">{icon}</span>}
            <input ref={ref} type="text" className="placeholder:text-muted-foreground w-full bg-transparent outline-none" {...props} />
        </div>
    );
});

SearchBar.displayName = 'SearchBar';

export { SearchBar };

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface NavMainProps {
  items: NavItem[];
  title?: string; // Make title optional
}

export function NavMain({ items, title = "Main" }: NavMainProps) {
  const { url } = usePage();
  
  return (
    <SidebarMenu>
      {title && (
        <div className="px-4 py-2">
          <h2 className="px-2 text-xs font-semibold tracking-tight text-muted-foreground">
            {title}
          </h2>
        </div>
      )}
      {items.map((item) => {
        // Check if current URL matches this nav item
        const isActive = url.startsWith(item.href);
        
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton 
              asChild
              className={isActive ? "bg-blue-100 text-blue-600" : ""}
            >
              <Link href={item.href} prefetch>
                {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

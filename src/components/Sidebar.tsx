import { Link, useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BarChart2, Users, Settings, Component, ChevronLeft, TowerControl, DatabaseZap, ShieldCheck } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Analytics",
    icon: BarChart2,
    subItems: [
      {
        label: "Performance",
        href: "/analytics/performance",
        icon: BarChart2,
      },
      {
        label: "User Demographics",
        href: "/analytics/users",
        icon: Users,
      },
    ],
  },
  {
    label: "Components",
    href: "/components",
    icon: Component,
  },
  {
    label: "Migration",
    href: "/migration",
    icon: DatabaseZap,
  },
  {
    label: "Fund Eligibility",
    href: "/fund-eligibility",
    icon: ShieldCheck,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const { isCollapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "flex flex-col border-r transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64",
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b h-16">
        {!isCollapsed && (
          <div className="flex items-center">
            <TowerControl className="h-8 w-8 mr-3 text-primary" />
            <h1 className="text-2xl font-bold">WatchTower</h1>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={toggle} className="ml-auto">
          <ChevronLeft className={cn("h-6 w-6 transition-transform", isCollapsed && "rotate-180")} />
        </Button>
      </div>
      <div className="flex-grow p-2">
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) =>
            item.subItems ? (
              isCollapsed ? (
                <Tooltip key={item.label} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={item.subItems.some(sub => location.pathname.startsWith(sub.href)) ? "secondary" : "ghost"}
                          className="w-full justify-center"
                          size="icon"
                        >
                          <item.icon className="h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="right" align="start" className="ml-2 p-1 w-48">
                        <div className="flex flex-col gap-1">
                          <p className="px-2 py-1.5 text-sm font-medium text-muted-foreground">{item.label}</p>
                          {item.subItems.map((subItem) => (
                            <Button
                              key={subItem.label}
                              asChild
                              variant="ghost"
                              className={cn(
                                "justify-start gap-3",
                                location.pathname === subItem.href && "bg-accent text-accent-foreground"
                              )}
                            >
                              <Link to={subItem.href}>
                                <subItem.icon className="h-4 w-4" />
                                {subItem.label}
                              </Link>
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              ) : (
                <Accordion key={item.label} type="single" collapsible defaultValue={item.subItems.some(sub => location.pathname.startsWith(sub.href)) ? "item-1" : undefined}>
                  <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="py-2 px-3 rounded-md hover:bg-muted hover:no-underline">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-8 pt-1">
                      <div className="flex flex-col gap-1">
                        {item.subItems.map((subItem) => (
                          <Button
                            key={subItem.label}
                            asChild
                            variant="ghost"
                            className={cn(
                              "justify-start gap-3",
                              location.pathname === subItem.href && "bg-primary/10 text-primary dark:bg-primary/20"
                            )}
                          >
                            <Link to={subItem.href}>
                              <subItem.icon className="h-4 w-4" />
                              {subItem.label}
                            </Link>
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )
            ) : (
              <Tooltip key={item.label} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="ghost"
                    className={cn(
                      "justify-start gap-3 px-3",
                      location.pathname === item.href && "bg-primary/10 text-primary dark:bg-primary/20",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <Link to={item.href}>
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && item.label}
                    </Link>
                  </Button>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
              </Tooltip>
            )
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
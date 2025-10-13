import { Link, useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BarChart2, Users, Settings, Component } from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/",
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
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-100/40 dark:bg-gray-800/40 border-r">
      <div className="flex-grow p-4">
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) =>
            item.subItems ? (
              <Accordion key={item.label} type="single" collapsible defaultValue={item.subItems.some(sub => location.pathname.startsWith(sub.href)) ? "item-1" : undefined}>
                <AccordionItem value="item-1" className="border-b-0">
                  <AccordionTrigger className="py-2 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 hover:no-underline">
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
                            location.pathname === subItem.href && "bg-gray-200 dark:bg-gray-700"
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
            ) : (
              <Button
                key={item.label}
                asChild
                variant="ghost"
                className={cn(
                  "justify-start gap-3 px-3",
                  location.pathname === item.href && "bg-gray-200 dark:bg-gray-700"
                )}
              >
                <Link to={item.href}>
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </Button>
            )
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
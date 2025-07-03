import { FloatingDock } from "./ui/floatingDock";
import {
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";

export function FloatingDockNav() {
  const links = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#info",
    },
    {
      title: "About",
      icon: <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#about",
    },
    {
      title: "Services",
      icon: <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#features",
    },
    {
      title: "Contact",
      icon: <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#contact",
    },
    {
      title: "Twitter",
      icon: <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://twitter.com/PharmaFly",
    },
    {
      title: "Login",
      icon: <img src="/icons/google.svg" alt="Google" className="h-full w-full" />,
      href: "/Login",
    },
  ];
  return (
    <div className="fixed bottom-4 right-4 z-50 w-fit md:left-1/2 md:-translate-x-1/2 md:right-auto">
      <FloatingDock
        items={links}
      />
    </div>
  );
} 
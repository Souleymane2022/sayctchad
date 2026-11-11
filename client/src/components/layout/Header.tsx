import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoSayc from "@assets/LOGO_SADA_OFFICIEL.png";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

const getNavLinks = (t: any) => [
  { href: "/a-propos", label: t("nav.about") },
  { href: "/programmes", label: t("nav.programs") },
  { href: "/programmes/thunderbird", label: "Thunderbird" },
  { href: "/programmes/aws-restart", label: "AWS re/Start" },
  { href: "/programmes/invest-ready-tchad", label: "Invest Ready" },
  { href: "/formations", label: t("nav.training") },
  { href: "/opportunites", label: t("nav.opportunities") },
  { href: "/evenements", label: "Événements" },
  { href: "/plan-activites", label: "Plan" },
  { href: "/elections", label: "Élections" },
  { href: "/actualites", label: "Actualités" },
  { href: "/contact", label: t("nav.contact") },
];

export function Header() {
  const { t, i18n } = useTranslation();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = getNavLinks(t);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img src={logoSayc} alt="SAYC Tchad" className="h-10 md:h-11 w-auto max-w-none object-contain" data-testid="img-logo" />
        </Link>

        <nav className="hidden 2xl:flex items-center gap-0.5" data-testid="nav-desktop">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={location === link.href ? "secondary" : "ghost"}
                size="sm"
                className="font-medium px-2.5 text-[13px]"
                data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link href="/rejoindre" className="hidden sm:block">
            <Button className="bg-accent text-accent-foreground border-accent-border" data-testid="button-join-cta">
              {t("nav.join")}
            </Button>
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="2xl:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side={i18n.language === 'ar' ? 'left' : 'right'} className="w-[280px] sm:w-[350px]">
              <div className="flex flex-col gap-6 mt-6">
                <div className="flex items-center gap-3">
                  <img src={logoSayc} alt="SAYC Tchad" className="h-12 w-auto object-contain" />
                </div>
                <nav className="flex flex-col gap-1" data-testid="nav-mobile">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                      <Button
                        variant={location === link.href ? "secondary" : "ghost"}
                        className="w-full justify-start font-medium"
                        data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                </nav>
                <Link href="/rejoindre" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-accent text-accent-foreground border-accent-border" data-testid="button-mobile-join">
                    {t("nav.join")}
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

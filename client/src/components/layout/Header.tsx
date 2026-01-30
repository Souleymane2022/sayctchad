import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const logoPath = "/favicon.png";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  { href: "/programmes", label: "Programmes" },
  { href: "/formations", label: "Formations" },
  { href: "/evenements", label: "Événements" },
  { href: "/actualites", label: "Actualités" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <img src={logoPath} alt="SAYC Tchad" className="h-10 w-10" data-testid="img-logo" />
          <div className="hidden sm:block">
            <span className="font-heading text-lg font-bold text-foreground" data-testid="text-brand-name">SAYC Tchad</span>
            <span className="hidden lg:block text-xs text-muted-foreground">Smart Africa Youth Chapter</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" data-testid="nav-desktop">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={location === link.href ? "secondary" : "ghost"}
                size="sm"
                className="font-medium"
                data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/rejoindre" className="hidden sm:block">
            <Button className="bg-accent text-accent-foreground border-accent-border" data-testid="button-join-cta">
              Rejoindre
            </Button>
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <div className="flex flex-col gap-6 mt-6">
                <div className="flex items-center gap-3">
                  <img src={logoPath} alt="SAYC Tchad" className="h-10 w-10" />
                  <div>
                    <span className="font-heading text-lg font-bold">SAYC Tchad</span>
                    <p className="text-xs text-muted-foreground">Smart Africa Youth Chapter</p>
                  </div>
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
                    Rejoindre le SAYC
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

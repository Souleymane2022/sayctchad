import { Link } from "wouter";
import { ExternalLink, Mail, MapPin } from "lucide-react";
import { SiFacebook, SiLinkedin, SiYoutube } from "react-icons/si";
import logoSayc from "@assets/LOGO_SAYC_1770103155971.jpg";

const footerLinks = {
  navigation: [
    { href: "/", label: "Accueil" },
    { href: "/a-propos", label: "À propos" },
    { href: "/programmes", label: "Programmes" },
    { href: "/formations", label: "Formations" },
    { href: "/opportunites", label: "Opportunités" },
  ],
  resources: [
    { href: "/evenements", label: "Événements" },
    { href: "/actualites", label: "Actualités" },
    { href: "/contact", label: "Contact" },
  ],
};

const socialLinks = [
  { icon: SiFacebook, href: "https://www.facebook.com/profile.php?id=61585729201040", label: "Facebook" },
  { icon: SiLinkedin, href: "https://www.linkedin.com/company/110439974/", label: "LinkedIn" },
  { icon: SiYoutube, href: "https://www.youtube.com/@RealSmartAfrica", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img src={logoSayc} alt="SAYC Tchad" className="h-16 w-auto object-contain bg-white rounded-md p-1" data-testid="img-footer-logo" />
            </div>
            <p className="text-sm text-sidebar-foreground/80 leading-relaxed mb-4" data-testid="text-footer-description">
              Plateforme dédiée aux jeunes de 15 à 35 ans, axée sur l'éducation, la collaboration et l'innovation numérique.
            </p>
            <p className="text-xs text-sidebar-foreground/60 mb-4" data-testid="text-focal-point">
              Point Focal SAYC Tchad: Souleymane Mahamat Saleh
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-md bg-sidebar-accent flex items-center justify-center hover-elevate transition-colors"
                  aria-label={social.label}
                  data-testid={`link-social-${social.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-base mb-4" data-testid="text-footer-nav-title">Navigation</h4>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-base mb-4" data-testid="text-footer-resources-title">Ressources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-sidebar-border mt-2">
                <h5 className="text-xs text-sidebar-foreground/50 mb-2">Smart Africa</h5>
              </li>
              <li>
                <a href="https://smartafrica.org/fr/page-daccueil/" target="_blank" rel="noopener noreferrer" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors flex items-center gap-1" data-testid="link-footer-smart-africa">
                  Smart Africa Alliance <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://sada.smartafrica.org" target="_blank" rel="noopener noreferrer" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors flex items-center gap-1" data-testid="link-footer-sada">
                  SADA (Acad&eacute;mie) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://transformafricasummit.org" target="_blank" rel="noopener noreferrer" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors flex items-center gap-1" data-testid="link-footer-tas">
                  Transform Africa Summit <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-base mb-4" data-testid="text-footer-contact-title">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                <span className="text-sm text-sidebar-foreground/70" data-testid="text-footer-address">
                  N'Djamena, Tchad
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a 
                  href="/contact" 
                  className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                  data-testid="link-footer-contact-form"
                >
                  Formulaire de contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sidebar-border mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-sidebar-foreground/60" data-testid="text-footer-copyright">
            © {new Date().getFullYear()} SAYC Tchad. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/mentions-legales" className="text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

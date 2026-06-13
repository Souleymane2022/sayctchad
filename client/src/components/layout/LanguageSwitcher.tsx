import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";

const languages = [
  { code: "fr", name: "Français", flag: "FR" },
  { code: "en", name: "English", flag: "EN" },
  { code: "ar", name: "العربية", flag: "AR" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 px-2 gap-2 flex items-center hover:bg-muted/50 transition-colors border-none" data-testid="button-language-switcher">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase">{currentLanguage.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32 animate-in fade-in zoom-in-95 duration-200">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer py-2"
          >
            <span className={lang.code === 'ar' ? 'font-arabic' : ''}>{lang.name}</span>
            {i18n.language === lang.code && <Check className="h-3 w-3 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

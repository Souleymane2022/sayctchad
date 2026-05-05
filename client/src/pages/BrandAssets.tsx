import React, { useState, useRef, useEffect } from "react";
import { toPng, toBlob } from "html-to-image";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Download, Loader2, Image as ImageIcon, Sparkles, Megaphone, 
  Smartphone, Facebook, Instagram, MessageSquare, Calendar, 
  Award, Briefcase, GraduationCap, MapPin, Zap, Upload, Quote, Clock, Lock, Shield, Vote, Users, Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Imports des logos
import logoSayc from "@assets/LOGO_SAYC_1770103155971.jpg";
import smartAfricaAllianceLogo from "@assets/SMART_AFRICA_LOGO_1770443171460.png";
import sadaLogo from "@assets/SADA_1770443171461.jpg";

type Category = "formation" | "news" | "testimony" | "event" | "announcement" | "bureau";

function BrandLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (pw: string) => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      return data;
    },
    onSuccess: () => {
      onLogin();
      toast({ title: "Accès Autorisé", description: "Bienvenue dans le Creative Studio" });
    },
    onError: (err: any) => {
      setErrorMessage(err?.error || "Mot de passe incorrect");
    },
  });

  return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-[#14171f] border-slate-800 shadow-2xl rounded-[2rem] space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-orange-600/20 rounded-2xl">
            <Lock className="h-10 w-10 text-orange-500" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-white">Creative Studio</h1>
            <p className="text-sm text-slate-400">Accès restreint aux administrateurs</p>
          </div>
        </div>
        
        {errorMessage && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-sm text-destructive text-center font-bold">
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginMutation.mutate(password);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label className="text-slate-400 font-bold uppercase text-[10px] tracking-widest px-1">MOT DE PASSE</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-900 border-slate-800 h-14 rounded-xl text-white"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full h-14 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-lg shadow-lg" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? <Loader2 className="animate-spin" /> : "Vérifier l'identitié"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function BrandAssets() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("formation");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  // Auth Check
  useQuery({
    queryKey: ["/api/admin/check-brand"],
    queryFn: async () => {
      const res = await fetch("/api/admin/check", { credentials: "include" });
      const data = await res.json();
      setIsAuthenticated(data.isAdmin);
      setChecking(false);
      return data;
    },
  });

  // Load real candidates from API
  const { data: candidates } = useQuery<any[]>({
    queryKey: ["/api/elections/candidates"],
    enabled: isAuthenticated,
  });

  // Identifie le Bureau National (Top 4 par rôle)
  const bureauNational = React.useMemo(() => {
    if (!candidates) return [];

    const getWinnerByRole = (role: string, nameQueries: string[] = []) => {
      // Priorité à la recherche par nom si des requêtes sont fournies (pour assurer la correspondance spécifique demandée)
      if (nameQueries.length > 0) {
        const specific = candidates.find(c => {
          const fullName = `${c.firstName || c.first_name || ''} ${c.lastName || c.last_name || ''} ${c.nomSpecifiqueUnique || ''}`.toUpperCase();
          return nameQueries.every(q => fullName.includes(q.toUpperCase()));
        });
        if (specific) return specific;
      }

      // Sinon, on prend le gagnant par votes (approuvé)
      return candidates
        .filter(c => c.role === role && c.status === 'approved')
        .sort((a, b) => (b.votesCount || 0) - (a.votesCount || 0))[0];
    };

    const results = [
      { role: "Leader Adjoint", leader: getWinnerByRole("Leader Adjoint", ["MOUNIR", "ISSA"]) },
      { role: "Secteur Privé", leader: getWinnerByRole("Secteur Privé", ["ALLAMINE", "TIDJANI"]) },
      { role: "Académique", leader: getWinnerByRole("Académique", ["JÉRÉMIE", "IGNEBE"]) },
      { role: "Inclusion", leader: getWinnerByRole("Inclusion", ["ADELINE", "GOLDÉ"]) || getWinnerByRole("Inclusion", ["ADELINE", "AMOUGOU"]) }
    ];

    // Corrections d'images et données
    return results.map(r => {
        if (!r.leader) return r;
        const leader = { ...r.leader };
        
        // Overrides d'images spécifiques
        if (leader.firstName?.toLowerCase().includes("adeline")) {
            leader.photoUrl = "/images/adeline.jpg";
        }
        if (leader.firstName?.toLowerCase().includes("mounir")) {
            leader.photoUrl = "/images/mounir.jpg"; // Path attendu pour sa tenue traditionnelle
        }
        
        return { ...r, leader };
    }).filter(r => r.leader);
  }, [candidates]);

  const nationalLeader = React.useMemo(() => {
    if (!candidates) return null;
    
    // Recherche spécifique de Souleymane (Leader National Mandaté)
    const souleymane = candidates.find(c => {
      const fullName = `${c.firstName || c.first_name || ''} ${c.lastName || c.last_name || ''} ${c.nomSpecifiqueUnique || ''}`.toUpperCase();
      return fullName.includes("SOULEYMANE") && (fullName.includes("MAHAMAT SALEH") || fullName.includes("SALEH"));
    });

    if (souleymane) {
      return {
        ...souleymane,
        photoUrl: "/national-leader.jpg" // Image officielle
      };
    }

    return null;
  }, [candidates]);
  
  // Dynamic State for Editor
  const [formData, setFormData] = useState({
    titleLine1: "LANCEZ VOTRE",
    titleLine2: "CARRIÈRE",
    titleLine3: "CLOUD",
    subtitle: "PROCHAINEMENT AU TCHAD",
    badge: "FORMATION AWS",
    mainText: "Mon expérience avec la formation SADA a été une révélation. Ce cursus intensif de 12 semaines m'a non seulement permis de maîtriser les technologies complexes d'Amazon Web Services (AWS), mais il a aussi totalement transformé ma perspective de carrière.\\n\\nL'encadrement expert et les projets pratiques ont fait toute la différence. Aujourd'hui, je me sens pleinement outillé pour relever les défis du cloud computing en Afrique avec le soutien de Smart Africa et du SAYC Tchad.",
    skill1: "ARCHITECTURES CLOUD",
    skill2: "DEV OPS & LINUX",
    skill3: "SÉCURITÉ RÉSEAU",
    date: "Mai - Juillet 2026",
    location: "N'Djamena & En ligne",
    personName: "MAHAMAT SALEH",
    personRole: "Ancien Étudiant SADA",
    quote: "Grâce au SAYC Tchad, j'ai pu obtenir ma certification AWS et décrocher mon premier emploi dans le Cloud.",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=60"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imageUrl: url }));
      toast({ title: "Image importée !", description: "Votre photo a été chargée dans le design." });
    }
  };

  const downloadPoster = async (elementId: string, filename: string) => {
    setDownloadingId(elementId);
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error("Element not found");

      const images = element.getElementsByTagName('img');
      const imageConversionPromises = Array.from(images).map(async (img) => {
        try {
          const response = await fetch(img.src, { mode: 'cors' });
          const blob = await response.blob();
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              img.src = reader.result as string;
              resolve(true);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (e) {
          console.warn("Could not pre-process image for export:", img.src);
        }
      });

      await Promise.all(imageConversionPromises);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const blob = await toBlob(element, { 
        quality: 0.95, 
        pixelRatio: 2, 
        width: 1080,
        height: 1080,
        cacheBust: true,
      });

      if (!blob) throw new Error("Blob generation failed");
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 5000);
      
      toast({ title: "Visuel Généré !", description: "Votre support est prêt." });
    } catch (err) {
      console.error("Export error:", err);
      toast({ title: "Erreur d'exportation", description: "Le rendu a échoué. Vérifiez votre connexion.", variant: "destructive" });
    } finally {
      setDownloadingId(null);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <BrandLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 pt-24 pb-12 px-4 md:px-8 font-sans selection:bg-orange-500/30">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT PANEL: ELITE DASHBOARD */}
        <Card className="lg:col-span-4 bg-[#14171f] border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden h-fit sticky top-24">
          <div className="bg-gradient-to-r from-[#0f172a] to-slate-900 p-8 border-b border-slate-800">
            <h2 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-3 text-white">
              <div className="p-2 bg-sayc-teal/20 rounded-xl">
                 <Sparkles className="w-6 h-6 text-sayc-teal" />
              </div>
              Creative Studio
            </h2>
            <p className="text-slate-400 font-medium">Design System automatisé pour SAYC Tchad</p>
          </div>
          
          <CardContent className="p-8 space-y-8">
            <div className="space-y-4">
              <Label className="uppercase text-xs font-bold text-slate-500 tracking-[0.2em]">TYPE DE COMMUNICATION</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "formation", icon: GraduationCap, label: "Formation" },
                  { id: "news", icon: Megaphone, label: "Actualité" },
                  { id: "event", icon: Calendar, label: "Événement" },
                  { id: "bureau", icon: Award, label: "Bureau National" },
                  { id: "testimony", icon: Quote, label: "Témoignage" },
                  { id: "announcement", icon: Megaphone, label: "Annonce" }
                ].map((cat) => (
                  <Button
                    key={cat.id}
                    variant="outline"
                    className={`h-14 rounded-2xl font-black transition-all border-slate-800 hover:bg-slate-800/50 ${activeCategory === cat.id ? 'bg-orange-600 border-orange-500 text-white hover:bg-orange-700' : 'bg-transparent text-slate-400'}`}
                    onClick={() => setActiveCategory(cat.id as Category)}
                  >
                    <cat.icon className="w-5 h-5 mr-2" /> {cat.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-800">
               <Label className="uppercase text-xs font-bold text-slate-500 tracking-[0.2em]">CONFIGURATION DU CONTENU ({activeCategory.toUpperCase()})</Label>
               
               <div className="grid gap-5">
                  {(activeCategory === "formation" || activeCategory === "news" || activeCategory === "event") && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-400 text-xs font-bold">ACCROCHE HAUTE</Label>
                          <Input name="titleLine1" value={formData.titleLine1} onChange={handleInputChange} className="bg-slate-900 border-slate-800 rounded-xl h-12 text-white font-bold" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-400 text-xs font-bold">MOT CLÉ IMPACT</Label>
                          <Input name="titleLine2" value={formData.titleLine2} onChange={handleInputChange} className="bg-slate-900 border-slate-800 rounded-xl h-12 text-orange-500 font-bold" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-400 text-xs font-bold">SUR-TITRE (BADGE)</Label>
                        <Input name="subtitle" value={formData.subtitle} onChange={handleInputChange} className="bg-slate-900 border-slate-800 rounded-xl h-12" />
                      </div>
                    </>
                  )}

                  {activeCategory === "testimony" && (
                    <>
                       <div className="space-y-2">
                          <Label className="text-slate-400 text-xs font-bold">NOM COMPLET</Label>
                          <Input name="personName" value={formData.personName} onChange={handleInputChange} className="bg-slate-900 border-slate-800 rounded-xl h-12 font-bold" />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-slate-400 text-xs font-bold">RÔLE / TITRE</Label>
                          <Input name="personRole" value={formData.personRole} onChange={handleInputChange} className="bg-slate-900 border-slate-800 rounded-xl h-12" />
                       </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label className="text-slate-400 text-xs font-bold">{activeCategory === "testimony" ? "LE TÉMOIGNAGE (CITATION)" : "DÉTAILS OU DESCRIPTION"}</Label>
                    <Textarea name="mainText" value={formData.mainText} onChange={handleInputChange} className="bg-slate-900 border-slate-800 rounded-xl min-h-[100px] text-white" />
                  </div>

                  {(activeCategory === "event" || activeCategory === "formation") && (
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label className="text-slate-400 text-xs font-bold">{activeCategory === "event" ? "DATE / HEURE" : "COMPÉTENCE 1"}</Label>
                          <Input name={activeCategory === "event" ? "date" : "skill1"} value={activeCategory === "event" ? formData.date : formData.skill1} onChange={handleInputChange} className="bg-slate-900 border-slate-800 rounded-xl h-12" />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-slate-400 text-xs font-bold">{activeCategory === "event" ? "LIEU" : "COMPÉTENCE 2"}</Label>
                          <Input name={activeCategory === "event" ? "location" : "skill2"} value={activeCategory === "event" ? formData.location : formData.skill2} onChange={handleInputChange} className="bg-slate-900 border-slate-800 rounded-xl h-12" />
                       </div>
                    </div>
                  )}

                  <div className="space-y-4 pt-4">
                    <Label className="text-slate-400 text-xs font-bold">VISUEL / PHOTO</Label>
                    <div className="flex gap-3">
                       <Input 
                        placeholder="URL de l'image..." 
                        name="imageUrl" 
                        value={formData.imageUrl} 
                        onChange={handleInputChange} 
                        className="bg-slate-900 border-slate-800 rounded-xl h-12 flex-1" 
                       />
                       <Button 
                        variant="secondary" 
                        className="rounded-xl h-12 px-6 font-bold bg-slate-800 hover:bg-slate-700 text-white"
                        onClick={() => fileInputRef.current?.click()}
                       >
                         <Upload className="w-4 h-4 mr-2" /> Import
                       </Button>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </div>
               </div>
            </div>

            <Button 
              className="w-full h-16 rounded-[1.5rem] bg-orange-600 hover:bg-orange-700 text-white font-black text-xl gap-3 shadow-[0_10px_30px_rgba(234,88,12,0.4)] transition-all active:scale-95"
              disabled={downloadingId !== null}
              onClick={() => downloadPoster(`poster-render`, `SAYC_Creative_${activeCategory}_${Date.now()}.png`)}
            >
              {downloadingId ? <Loader2 className="w-7 h-7 animate-spin" /> : <Download className="w-7 h-7" />}
              EXPORTATION HAUTE DÉFINITION
            </Button>
          </CardContent>
        </Card>

        {/* RIGHT PANEL: ELITE PREVIEW ENGINE */}
        <div className="lg:col-span-8 flex flex-col items-center w-full px-0 space-y-10">
          
          <div className="text-center space-y-3">
            <div className="inline-block px-4 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
               <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">Aperçu Réel 1080x1080</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">Vérification de Rendu</h1>
          </div>

          <div className="relative group bg-[#1a1d27] p-8 rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.6)] border border-slate-800 w-fit mx-auto overflow-hidden">
            <div className="overflow-hidden w-[600px] h-[600px] relative rounded-[2rem] bg-[#020202] ring-1 ring-white/10 shadow-2xl">
              <div 
                style={{ 
                  transform: 'scale(0.5555)',
                  transformOrigin: 'top center', 
                  width: '1080px', 
                  height: '1080px',
                  position: 'absolute',
                  left: '50%',
                  marginLeft: '-540px'
                }} 
              >
                <div 
                  id="poster-render"
                  className="w-[1080px] h-[1080px] relative overflow-hidden text-white font-sans"
                >
                  {/* 1. CATEGORY: FORMATION (AWS SADA STYLE) */}
                  {activeCategory === "formation" && (
                    <div className="w-[1080px] h-[1080px] bg-[#02040A] text-white relative overflow-hidden font-sans">
                       {/* Background Layer */}
                       <div className="absolute inset-0 bg-gradient-to-br from-[#02040A] via-[#0B0F1A] to-black z-0" />
                       <div className="absolute top-[-200px] right-[-200px] w-[700px] h-[700px] bg-orange-600/10 rounded-full blur-[200px] z-0 animate-pulse" />
                       <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-sayc-teal/5 rounded-full blur-[150px] z-0" />
                       
                       {/* Premium Header */}
                       <div className="absolute top-0 left-0 w-full h-[160px] bg-white z-20 flex items-center px-24 justify-between shadow-2xl border-b-[10px] border-orange-500">
                          <div className="flex items-center gap-12">
                             <img src={logoSayc} alt="SAYC" className="h-[70px] object-contain" />
                             <div className="w-[2px] h-12 bg-slate-200" />
                             <div className="flex items-center gap-8">
                                <img src={smartAfricaAllianceLogo} alt="Smart Africa" className="h-[45px] object-contain" />
                                <img src={sadaLogo} alt="SADA" className="h-[60px] object-contain" />
                             </div>
                          </div>
                          <div className="bg-orange-600 px-12 py-5 rounded-[2rem] shadow-xl">
                             <span className="text-white font-black text-2xl uppercase tracking-[0.2em]">{formData.badge || "FORMATION"}</span>
                          </div>
                       </div>

                       {/* Content Area */}
                       <div className="absolute top-[220px] left-24 right-24 z-10">
                          <p className="text-orange-500 font-black text-3xl uppercase tracking-[0.6em] mb-6 drop-shadow-lg">{formData.subtitle}</p>
                          <h1 className="text-[100px] font-black text-white leading-[0.9] tracking-tighter m-0 uppercase mb-12">
                             {formData.titleLine1} <br/>
                             <span className="text-orange-600 drop-shadow-[0_0_30px_rgba(234,88,12,0.4)]">{formData.titleLine2}</span> <br/>
                             <span className="text-white opacity-90">{formData.titleLine3}</span>
                          </h1>

                          <div className="grid grid-cols-12 gap-12 items-start">
                             <div className="col-span-7 bg-white/5 border-l-[12px] border-orange-600 p-12 backdrop-blur-2xl rounded-r-[3rem] shadow-2xl">
                                <h4 className="text-orange-500 font-black text-2xl uppercase tracking-widest mb-6">À PROPOS DU PROGRAMME</h4>
                                <p className="text-slate-100 font-bold text-[1.6rem] leading-[1.5] text-left text-justify">
                                   {formData.mainText}
                                </p>
                             </div>
                             <div className="col-span-5 flex flex-col gap-5 pt-4">
                                {[formData.skill1, formData.skill2, formData.skill3].map((s, i) => (
                                   <div key={i} className="flex items-center gap-6 bg-white/10 px-10 py-6 rounded-3xl border border-white/5 backdrop-blur-md transform transition-all hover:translate-x-2">
                                      <div className="w-5 h-5 bg-orange-600 rounded-full shadow-[0_0_25px_#ea580c]" />
                                      <span className="text-white font-black text-2xl uppercase tracking-tight">{s}</span>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>

                       {/* Elegant Footer */}
                       <div className="absolute bottom-0 left-0 w-full h-[130px] bg-black/40 backdrop-blur-3xl border-t border-white/10 z-20 flex items-center px-24 justify-between">
                          <div className="flex items-center gap-6">
                             <Zap className="w-10 h-10 text-orange-500 animate-pulse" />
                             <div className="flex flex-col">
                                <span className="text-white font-black text-3xl tracking-widest uppercase leading-none">SAYCTCHAD.ORG</span>
                                <span className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Plateforme Technologique Nationale</span>
                             </div>
                          </div>
                          <div className="text-orange-500 font-black text-2xl uppercase tracking-[0.5em] italic">REJOIGNEZ L'ÉLITE</div>
                       </div>
                    </div>
                  )}

                  {/* 2. CATEGORY: NEWS (MODERN HUB STYLE) */}
                  {activeCategory === "news" && (
                    <div className="w-[1080px] h-[1080px] bg-[#05050A] text-white relative overflow-hidden font-sans">
                       <div className="absolute inset-0 bg-gradient-to-tr from-[#1E3A8A] via-[#05050A] to-[#1E1E1E] opacity-90 z-0" />
                       <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sayc-teal/10 rounded-full blur-[200px] z-0" />
                       
                       {/* Header */}
                       <div className="absolute top-0 left-0 w-full h-[180px] bg-white z-20 flex items-center px-20 justify-between shadow-2xl">
                          <div className="flex items-center gap-10">
                             <img src={logoSayc} alt="SAYC" className="h-[80px] object-contain p-2 bg-slate-50 rounded-2xl" />
                             <div className="w-[3px] h-16 bg-sayc-teal" />
                             <div className="flex flex-col">
                                <span className="text-[#05050A] font-black text-4xl uppercase tracking-tighter">SAYC TCHAD</span>
                                <span className="text-sayc-teal font-black text-lg uppercase tracking-[0.3em]">ACTUALITÉS OFFICIELLES</span>
                             </div>
                          </div>
                          <div className="bg-orange-600 px-12 py-6 rounded-full shadow-[0_0_50px_rgba(234,88,12,0.4)] border-4 border-white">
                             <span className="text-white font-black text-3xl uppercase tracking-[0.4em] animate-pulse">BREAKING</span>
                          </div>
                       </div>

                       {/* News Content Area */}
                       <div className="absolute top-[260px] left-20 right-20 z-10">
                          <div className="inline-block px-8 py-3 bg-sayc-teal/20 border border-sayc-teal/30 rounded-2xl mb-10">
                             <span className="text-sayc-teal font-black text-3xl uppercase tracking-[0.4em]">{formData.subtitle || "DERNIÈRE MINUTE"}</span>
                          </div>
                          
                          <h1 className="text-[100px] font-black text-white leading-[0.9] tracking-tighter uppercase italic drop-shadow-2xl mb-16">
                             {formData.titleLine1} <br/>
                             <span className="text-transparent bg-clip-text bg-gradient-to-r from-sayc-teal via-blue-400 to-white">{formData.titleLine2}</span>
                          </h1>

                          <div className="relative">
                             <div className="absolute -left-10 top-0 bottom-0 w-3 bg-sayc-teal rounded-full shadow-[0_0_30px_#2dd4bf]" />
                             <div className="bg-white/5 backdrop-blur-3xl p-16 rounded-[4rem] border border-white/10 shadow-3xl">
                                <p className="text-white font-bold text-[2.6rem] leading-[1.5] text-left italic text-justify">
                                   {formData.mainText}
                                </p>
                             </div>
                          </div>
                       </div>

                       {/* News Footer */}
                       <div className="absolute bottom-0 left-0 w-full h-[150px] bg-[#05050A]/80 backdrop-blur-3xl border-t-8 border-sayc-teal z-20 flex items-center px-20 justify-between">
                          <div className="flex items-center gap-8">
                             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                                <Zap className="w-10 h-10 text-[#05050A]" />
                             </div>
                             <div className="flex flex-col">
                                <span className="text-white font-black text-3xl tracking-widest uppercase leading-none">WWW.SAYCTCHAD.ORG</span>
                                <span className="text-sayc-teal font-bold text-sm uppercase tracking-[0.5em] mt-1">Le Hub Digital de la Jeunesse</span>
                             </div>
                          </div>
                          <div className="text-right">
                             <span className="text-white/40 font-black text-xl uppercase tracking-widest">SAYC MEDIA DIVISION</span>
                          </div>
                       </div>
                    </div>
                  )}

                  {/* 3. CATEGORY: TESTIMONY (PREMIUM QUOTE STYLE) */}
                  {activeCategory === "testimony" && (
                    <div className="w-[1080px] h-[1080px] bg-[#0A0D14] text-white relative overflow-hidden font-sans">
                       {/* High-End Artistic Background */}
                       <div className="absolute inset-0 bg-[#0A0D14] z-0" />
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(45,212,191,0.05)_0%,transparent_70%)] z-0" />
                       <div className="absolute top-[-150px] left-[-150px] w-[600px] h-[600px] bg-sayc-teal/10 rounded-full blur-[150px] z-0" />
                       
                       {/* Minimalist Top Branding */}
                       <div className="absolute top-0 left-0 w-full h-[180px] bg-white z-20 flex items-center justify-center shadow-xl border-b-[8px] border-sayc-teal">
                          <div className="flex items-center gap-20">
                             <img src={logoSayc} alt="SAYC" className="h-[75px] object-contain" />
                             <div className="w-[2px] h-12 bg-slate-200" />
                             <img src={smartAfricaAllianceLogo} alt="Smart Africa" className="h-[50px] object-contain" />
                             <div className="w-[2px] h-12 bg-slate-200" />
                             <img src={sadaLogo} alt="SADA" className="h-[65px] object-contain" />
                          </div>
                       </div>

                       {/* Centered Large Quote Area */}
                       <div className="absolute top-[260px] left-24 right-24 z-10 flex flex-col items-center text-center">
                          <Quote className="w-40 h-40 text-sayc-teal opacity-10 mb-8" />
                          <div className="relative">
                             <p className="text-[3rem] font-black leading-[1.3] italic text-white tracking-tighter drop-shadow-2xl">
                                "{formData.mainText || formData.quote}"
                             </p>
                          </div>
                       </div>

                       {/* Premium Speaker Profile - Centered Balance */}
                       <div className="absolute bottom-[100px] left-1/2 -translate-x-1/2 w-[900px] z-30">
                          <div className="bg-white/5 border border-white/10 backdrop-blur-[50px] p-12 rounded-[4rem] flex items-center gap-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                             <div className="relative">
                                <div className="absolute inset-0 bg-sayc-teal rounded-[2.5rem] blur-2xl opacity-20 animate-pulse" />
                                <div className="w-48 h-48 rounded-[2.5rem] border-4 border-sayc-teal overflow-hidden shrink-0 relative z-10 shadow-2xl">
                                   <img src={formData.imageUrl} alt={formData.personName} className="w-full h-full object-cover" crossOrigin="anonymous" />
                                </div>
                             </div>
                             <div className="flex-1 text-left">
                                <h4 className="text-6xl font-black text-white uppercase tracking-tighter mb-4">{formData.personName}</h4>
                                <div className="flex items-center gap-6">
                                   <div className="h-2 w-20 bg-sayc-teal rounded-full" />
                                   <span className="text-sayc-teal font-black text-3xl uppercase tracking-[0.2em]">{formData.personRole}</span>
                                </div>
                             </div>
                             <div className="opacity-40">
                                <div className="text-white font-black text-4xl italic tracking-tighter">SAYC<span className="text-sayc-teal">TCHAD</span></div>
                             </div>
                          </div>
                       </div>
                    </div>
                  )}

                  {/* 4. CATEGORY: BUREAU NATIONAL (INSTITUTIONAL EXCELLENCE) */}
                  {activeCategory === "bureau" && (
                     <div className="w-[1080px] h-[1080px] bg-[#0A1A2F] text-white relative overflow-hidden font-sans">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1A2F] via-[#1E2A44] to-black z-0" />
                        <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-orange-500/10 to-transparent z-0" />
                        
                        {/* Header Section */}
                        <div className="absolute top-0 left-0 w-full h-[160px] bg-white z-20 flex items-center justify-center shadow-2xl border-b-[8px] border-orange-500">
                           <div className="flex items-center gap-20">
                              <img src={logoSayc} alt="SAYC" className="h-[70px] object-contain" />
                              <div className="w-[2px] h-12 bg-slate-200" />
                              <img src={smartAfricaAllianceLogo} alt="Smart Africa" className="h-[50px] object-contain" />
                              <div className="w-[2px] h-12 bg-slate-200" />
                              <img src={sadaLogo} alt="SADA" className="h-[65px] object-contain" />
                           </div>
                        </div>

                        {/* Title Section */}
                        <div className="absolute top-[200px] left-0 w-full text-center z-10 px-20">
                           <div className="inline-block px-10 py-3 bg-orange-600/20 border border-orange-600/30 rounded-full mb-8">
                              <span className="text-orange-500 font-black text-2xl uppercase tracking-[0.5em]">MANDAT NATIONAL 2026-2028</span>
                           </div>
                           <h1 className="text-[100px] font-black text-white leading-[0.9] tracking-tighter uppercase drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
                              BUREAU <span className="text-orange-500">NATIONAL</span>
                           </h1>
                        </div>
  
                        {/* National Leader Focus */}
                        <div className="absolute top-[420px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                            <div className="w-[360px] h-[420px] rounded-[3rem] border-[10px] border-orange-500 shadow-[0_0_60px_rgba(234,88,12,0.5)] overflow-hidden bg-slate-800 relative group">
                               <img 
                                 src={nationalLeader?.photoUrl || nationalLeader?.photo_url || "/images/souleymane-1.jpg"} 
                                 alt="National Leader" 
                                 className="w-full h-full object-cover object-top scale-105" 
                                 crossOrigin="anonymous" 
                               />
                               <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black via-black/90 to-transparent" />
                               <div className="absolute bottom-8 inset-x-0 text-center px-6">
                                  <p className="text-orange-500 font-black text-base uppercase tracking-[0.4em] mb-3 drop-shadow-md">LEADER NATIONAL</p>
                                  <h4 className="text-[2.5rem] font-black text-white uppercase tracking-tight leading-[1.1] drop-shadow-2xl">
                                    {nationalLeader?.firstName || nationalLeader?.first_name || "SOULEYMANE"}<br/>
                                    {nationalLeader?.nomSpecifiqueUnique || nationalLeader?.last_name || "MAHAMAT SALEH"}
                                  </h4>
                               </div>
                            </div>
                        </div>

                        {/* Board Grid - Correctly Spaced */}
                        <div className="absolute top-[850px] inset-x-12 z-20 flex justify-center gap-8 items-start">
                           {(bureauNational && bureauNational.length > 0 ? bureauNational : [
                             { role: "Leader Adjoint", leader: { firstName: "MOUNIR", nomSpecifiqueUnique: "ISSA", photoUrl: "/images/mounir.jpg" } },
                             { role: "Secteur Privé", leader: { firstName: "ALLAMINE", nomSpecifiqueUnique: "TIDJANI", photoUrl: "/images/leaders/leader_2.png" } },
                             { role: "Académique", leader: { firstName: "JÉRÉMIE", nomSpecifiqueUnique: "IGNEBE", photoUrl: "/images/leaders/leader_3.png" } },
                             { role: "Inclusion", leader: { firstName: "ADELINE", nomSpecifiqueUnique: "GOLDÉ", photoUrl: "/images/adeline.jpg" } }
                           ]).map((b, i) => (
                             <div key={i} className="flex flex-col items-center">
                               <div className="w-[210px] h-[260px] rounded-[2rem] border-[4px] border-white/20 shadow-2xl overflow-hidden bg-slate-900 relative">
                                  <img
                                    src={b.leader?.photoUrl || b.leader?.photo_url || "/images/leaders/leader_1.png"}
                                    alt="Leader"
                                    className="w-full h-full object-cover object-top"
                                    crossOrigin="anonymous"
                                  />
                                  <div className="absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-t from-black via-black/90 to-transparent" />
                                  <div className="absolute bottom-4 inset-x-0 text-center px-3 flex flex-col items-center">
                                     <div className="bg-gradient-to-r from-orange-400 to-amber-600 px-4 py-1.5 rounded-lg mb-3 shadow-lg">
                                        <p className="text-black font-black text-[10px] uppercase tracking-widest leading-tight whitespace-nowrap">{b.role.toUpperCase()}</p>
                                     </div>
                                     <h4 className="text-[1.2rem] font-black text-white uppercase tracking-tight leading-none drop-shadow-md truncate w-full mb-1">
                                       {b.leader?.firstName || b.leader?.first_name}
                                     </h4>
                                     <h4 className="text-[1.2rem] font-black text-orange-500 uppercase tracking-tight leading-none drop-shadow-md truncate w-full">
                                       {b.leader?.nomSpecifiqueUnique || b.leader?.last_name}
                                     </h4>
                                  </div>
                               </div>
                             </div>
                           ))}
                        </div>

                        {/* Official Footer */}
                        <div className="absolute bottom-0 left-0 w-full h-[120px] bg-black z-30 flex items-center justify-between px-24 border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                           <div className="flex items-center gap-6">
                              <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                                 <Zap className="w-8 h-8 text-white" />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-white font-black text-2xl tracking-widest uppercase leading-none">PROFIL VÉRIFIÉ</span>
                                 <span className="text-slate-500 font-bold text-xs uppercase mt-1 tracking-widest">Liste Officielle des Membres Élus</span>
                              </div>
                           </div>
                           <div className="text-white font-black text-4xl tracking-[0.5em] uppercase">SAYCTCHAD.ORG</div>
                           <div className="flex flex-col items-end">
                              <span className="text-slate-400 font-black text-xs uppercase tracking-widest mb-1">AUTHENTICITÉ</span>
                              <span className="text-orange-500 font-black text-3xl italic">DÉLÉGATION</span>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* 5. CATEGORY: EVENT (VIP INVITATION STYLE) */}
                  {activeCategory === "event" && (
                    <div className="w-[1080px] h-[1080px] bg-[#050510] text-white relative overflow-hidden font-sans">
                       <img src={formData.imageUrl} className="absolute inset-0 w-full h-full object-cover scale-110 blur-md opacity-30" alt="" crossOrigin="anonymous" />
                       <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/80 to-transparent z-0" />
                       
                       {/* Top Branding Header */}
                       <div className="absolute top-12 left-16 right-16 flex justify-between items-center z-30">
                          <div className="flex items-center gap-6 bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10">
                             <img src={logoSayc} alt="SAYC" className="h-[60px] bg-white p-3 rounded-2xl" />
                             <div className="w-[1px] h-10 bg-white/20" />
                             <span className="text-white font-black text-2xl tracking-widest uppercase">ÉVÉNEMENT SPÉCIAL</span>
                          </div>
                          <div className="bg-orange-600 px-10 py-5 rounded-full shadow-2xl border-4 border-white/20">
                             <span className="text-white font-black text-3xl uppercase tracking-widest">{formData.badge || "INVITATION"}</span>
                          </div>
                       </div>

                       {/* Main Invite Content */}
                       <div className="absolute top-[280px] left-20 right-20 z-20 space-y-12">
                          <div className="inline-block px-10 py-4 bg-sayc-teal/20 border border-sayc-teal/30 rounded-[2rem]">
                             <span className="text-sayc-teal font-black text-4xl uppercase italic tracking-[0.5em]">{formData.subtitle}</span>
                          </div>
                          <h1 className="text-[140px] font-black text-white leading-[0.8] tracking-tighter uppercase drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
                             {formData.titleLine1} <br/>
                             <span className="text-transparent bg-clip-text bg-gradient-to-r from-sayc-teal via-blue-400 to-white">{formData.titleLine2}</span>
                          </h1>
                          <div className="max-w-4xl">
                             <p className="text-white/80 font-bold text-3xl leading-relaxed italic border-l-8 border-orange-600 pl-10">
                                "{formData.mainText}"
                             </p>
                          </div>
                       </div>

                       {/* Event Details Grid */}
                       <div className="absolute bottom-[160px] left-20 right-20 z-20 grid grid-cols-2 gap-12">
                          <div className="flex items-center gap-10 bg-white/5 border border-white/10 p-10 rounded-[3.5rem] shadow-3xl backdrop-blur-2xl">
                             <div className="p-6 bg-sayc-teal rounded-[2rem] shadow-[0_0_40px_#2dd4bf55]"><Clock className="w-12 h-12 text-white" /></div>
                             <div>
                                <p className="text-slate-400 font-bold uppercase text-base tracking-[0.3em] mb-2">DATE & HEURE</p>
                                <p className="text-white font-black text-[2.6rem] leading-none">{formData.date}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-10 bg-white/5 border border-white/10 p-10 rounded-[3.5rem] shadow-3xl backdrop-blur-2xl">
                             <div className="p-6 bg-orange-600 rounded-[2rem] shadow-[0_0_40px_#ea580c55]"><MapPin className="w-12 h-12 text-white" /></div>
                             <div>
                                <p className="text-slate-400 font-bold uppercase text-base tracking-[0.3em] mb-2">LOCALISATION</p>
                                <p className="text-white font-black text-[2.6rem] leading-none">{formData.location}</p>
                             </div>
                          </div>
                       </div>

                       {/* Event Signature Footer */}
                       <div className="absolute bottom-0 left-0 w-full h-[110px] bg-black/40 backdrop-blur-2xl border-t border-white/10 flex items-center justify-center px-20">
                          <div className="text-white/30 font-black text-3xl tracking-[1.5em] uppercase">WWW.SAYCTCHAD.ORG</div>
                       </div>
                    </div>
                  )}

                  {/* 6. CATEGORY: ANNOUNCEMENT (FORMAL COMMUNIQUÉ STYLE) */}
                  {activeCategory === "announcement" && (
                    <div className="w-[1080px] h-[1080px] bg-white text-[#0A0D14] relative overflow-hidden font-sans border-[30px] border-[#0A0D14]">
                       {/* Formal Header Layer */}
                       <div className="absolute top-0 left-0 w-full h-[240px] bg-white border-b-8 border-orange-600 flex flex-col items-center justify-center gap-6 px-20">
                          <div className="flex items-center gap-16">
                             <img src={logoSayc} alt="SAYC" className="h-[70px] object-contain" />
                             <div className="w-[1px] h-12 bg-slate-200" />
                             <img src={smartAfricaAllianceLogo} alt="Smart Africa" className="h-[50px] object-contain" />
                             <div className="w-[1px] h-12 bg-slate-200" />
                             <img src={sadaLogo} alt="SADA" className="h-[65px] object-contain" />
                          </div>
                          <div className="w-[400px] h-1.5 bg-gradient-to-r from-transparent via-orange-600 to-transparent" />
                          <span className="text-[#0A0D14] font-black text-2xl uppercase tracking-[0.8em] text-center">COMMUNIQUÉ OFFICIEL</span>
                       </div>

                       {/* Formal Body Area */}
                       <div className="absolute top-[320px] left-24 right-24 flex flex-col items-center text-center space-y-16">
                          <div className="space-y-6">
                             <h4 className="text-sayc-teal font-black text-3xl uppercase tracking-[0.5em]">{formData.subtitle || "SAYC TCHAD — SECRÉTARIAT GÉNÉRAL"}</h4>
                             <h1 className="text-[100px] font-black text-[#0A0D14] leading-[0.9] tracking-tighter uppercase">
                                {formData.titleLine1 || "DÉCISION"}<br/>
                                <span className="text-orange-600">{formData.titleLine2 || "SAYC TCHAD"}</span>
                             </h1>
                          </div>

                          <div className="w-full h-[3px] bg-slate-100" />

                          <div className="max-w-5xl">
                             <p className="text-[#0A0D14]/90 font-bold text-[2.8rem] leading-[1.5] italic text-justify px-10 border-l-[15px] border-sayc-teal/20">
                                "{formData.mainText}"
                             </p>
                          </div>
                       </div>

                       {/* Formal Footer & Signature */}
                       <div className="absolute bottom-[60px] left-24 right-24 flex items-end justify-between">
                          <div className="flex flex-col">
                             <span className="text-slate-400 font-bold text-lg uppercase tracking-widest mb-1">FAIT À N'DJAMENA, LE</span>
                             <span className="text-[#0A0D14] font-black text-3xl uppercase">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                             <div className="text-right">
                                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">SCEAU D'AUTHENTICITÉ</span>
                             </div>
                             <div className="p-6 bg-[#0A0D14] rounded-3xl shadow-xl">
                                <Zap className="w-12 h-12 text-orange-600" />
                             </div>
                             <span className="text-[#0A0D14] font-black text-2xl tracking-[0.3em] uppercase">SAYCTCHAD.ORG</span>
                          </div>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Elite Hint Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded-[3.5rem] pointer-events-none z-[100]">
              <div className="bg-white text-[#0f172a] px-10 py-5 rounded-full font-black text-xl flex items-center gap-4 shadow-2xl transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                <div className="w-3 h-3 bg-sayc-teal rounded-full animate-ping" />
                DÉTAILS HD PRÊTS
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* DASHBOARD BOTTOM INFO */}
      <div className="max-w-[1600px] mx-auto mt-20 pt-16 border-t border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-12 text-slate-400">
         <div className="space-y-4">
            <h4 className="text-white font-black text-lg uppercase tracking-widest">SAYC STUDIO</h4>
            <p className="text-sm leading-relaxed italic">"Propulser le leadership des jeunes tchadiens par une identité visuelle forte et inspirante."</p>
         </div>
         <div className="space-y-4">
            <h4 className="text-white font-black text-lg uppercase tracking-widest">RÉSEAUX</h4>
            <p className="text-sm">Optimisé pour Facebook, Instagram, LinkedIn et WhatsApp Business.</p>
         </div>
         <div className="space-y-4">
            <h4 className="text-white font-black text-lg uppercase tracking-widest">QUALITÉ</h4>
            <p className="text-sm font-bold text-orange-500">Résolution 4K Supersampling <br/> export HDR via HTML-to-Image.</p>
         </div>
         <div className="text-right space-y-4">
            <h4 className="text-white font-black text-lg uppercase tracking-widest">CRÉDITS</h4>
            <p className="text-xs">© 2026 Smart Africa Youth Chapter Tchad <br/> Marketing & Branding Division</p>
         </div>
      </div>
    </div>
  );
}

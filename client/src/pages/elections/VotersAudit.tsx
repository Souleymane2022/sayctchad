import { useQuery } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, ShieldCheck, UserCheck, Clock, Award, Lock, Megaphone } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface VoteRecord {
  id: string;
  voterId: string;
  role: string;
  createdAt: string;
  candidateFirstName: string;
  candidateLastName: string;
}

export default function VotersAudit({ preview = false }: { preview?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: votes, isLoading } = useQuery<VoteRecord[]>({
    queryKey: ["/api/elections/audit-votes"],
  });

  const anonymizeId = (id: string) => {
    if (!id) return "****";
    // If it's a membership ID like SAYC-2026-1234-email@test.com
    // or just email@test.com
    // We want to show only a part of it
    const parts = id.split('-');
    if (parts.length > 1) {
        // Assume format SAYC-2026-XXXX-email@test.com
        const membershipId = `${parts[0]}-${parts[1]}-${parts[2]}`;
        const email = parts[3];
        const [user, domain] = email.split('@');
        return `${membershipId} (***@${domain})`;
    }
    return id.replace(/(.{3}).*@(.*)/, "$1***@$2");
  };

  const filteredVotes = votes?.filter(vote => 
    vote.voterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vote.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${vote.candidateFirstName} ${vote.candidateLastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // PAGE SOUS SCELLÉS AVANT 15H (Sauf en mode preview)
  if (!preview) {
    return (
      <div className="min-h-screen bg-[#020817] flex flex-col items-center justify-center px-4 py-20 text-center relative overflow-hidden">
      <SEOHead 
        title="Audit Sous Scellés - Élections SAYC Tchad"
        description="Le Procès-Verbal des élections est temporairement sous scellés jusqu'à la proclamation des résultats."
        path="/elections/transparence"
      />
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl w-full space-y-10 animate-in fade-in zoom-in-95 duration-700 relative z-10">
        <div className="relative inline-block">
            <div className="w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto border-4 border-slate-800 shadow-2xl relative z-10">
                <Lock className="w-16 h-16 text-orange-500" />
            </div>
            <div className="absolute inset-0 bg-orange-600 rounded-[2.5rem] blur-3xl opacity-20 animate-pulse" />
        </div>

        <div className="space-y-6">
            <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 px-6 py-1.5 text-sm font-black tracking-widest uppercase">
                Résultats sous scellés
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                LE PROCÈS-VERBAL EST<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600">EN COURS D'AUDIT</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-lg mx-auto leading-relaxed">
                Le vote est clos. Le Comité Technique centralise actuellement les suffrages pour garantir la transparence absolue.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-10">
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl text-left">
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2">PROCHAINE ÉTAPE</p>
                <p className="text-white font-black text-2xl flex items-center gap-2">
                    <Megaphone className="w-6 h-6 text-orange-500" /> PROCLAMATION
                </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl text-left">
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2">HEURE OFFICIELLE</p>
                <p className="text-white font-black text-2xl flex items-center gap-2">
                    <Clock className="w-6 h-6 text-sayc-teal" /> 15H00 EXACTES
                </p>
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <SEOHead 
        title="Audit de Transparence - Élections SAYC Tchad"
        description="Consultez la liste anonymisée des votants pour garantir l'intégrité et la transparence du scrutin."
        path="/elections/transparence"
      />

      <div className="container mx-auto max-w-6xl space-y-10">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="bg-sayc-teal/10 text-sayc-teal border-sayc-teal/20 px-4 py-1 uppercase tracking-widest text-xs font-black">
            Registre de Transparence
          </Badge>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-[#1e3a8a]">
            Audit Public des <span className="text-sayc-teal">Suffrages</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Afin de garantir l'intégrité absolue de l'élection, ce registre permet de vérifier chaque vote émis. 
            Les identités sont <span className="font-bold text-orange-600">partiellement masquées</span> pour protéger la vie privée des membres.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-none shadow-md bg-white">
                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <div className="p-3 bg-sayc-teal/10 rounded-xl">
                        <UserCheck className="w-6 h-6 text-sayc-teal" />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-black uppercase text-slate-500">Votes Totaux</CardTitle>
                        <p className="text-2xl font-black text-[#1e3a8a]">{votes?.length || 0}</p>
                    </div>
                </CardHeader>
            </Card>

            <Card className="border-none shadow-md bg-white">
                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <div className="p-3 bg-orange-100 rounded-xl">
                        <ShieldCheck className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-black uppercase text-slate-500">Intégrité</CardTitle>
                        <p className="text-2xl font-black text-[#1e3a8a]">Vérifiée</p>
                    </div>
                </CardHeader>
            </Card>

            <Card className="border-none shadow-md bg-white">
                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <div className="p-3 bg-blue-100 rounded-xl">
                        <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-black uppercase text-slate-500">Dernière MaJ</CardTitle>
                        <p className="text-lg font-black text-[#1e3a8a]">En temps réel</p>
                    </div>
                </CardHeader>
            </Card>
        </div>

        {/* Leaderboard Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
           {Array.from(new Set(votes?.map(v => `${v.candidateFirstName} ${v.candidateLastName}`))).map(name => {
              const count = votes?.filter(v => `${v.candidateFirstName} ${v.candidateLastName}` === name).length;
              return (
                <Card 
                  key={name} 
                  className={`border-2 transition-all cursor-pointer hover:shadow-lg ${searchTerm === name ? 'border-sayc-teal bg-sayc-teal/5' : 'border-transparent bg-white'}`}
                  onClick={() => setSearchTerm(searchTerm === name ? "" : name)}
                >
                  <CardContent className="p-4 text-center space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Candidat</p>
                    <h4 className="font-black text-[#1e3a8a] text-sm truncate uppercase">{name}</h4>
                    <p className="text-2xl font-black text-sayc-teal">{count}</p>
                    <p className="text-[9px] font-bold text-slate-400 italic">Cliquez pour filtrer</p>
                  </CardContent>
                </Card>
              );
           })}
        </div>

        <Card className="border-none shadow-2xl overflow-hidden rounded-3xl">
          <CardHeader className="bg-white border-b p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-black text-[#1e3a8a]">Journal d'audit du scrutin</CardTitle>
                <CardDescription>Liste chronologique des votes validés par le système.</CardDescription>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Rechercher un ID ou un poste..." 
                  className="pl-10 h-12 rounded-xl bg-slate-50 border-slate-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-b">
                    <TableHead className="font-black text-slate-700 h-14 px-8">Votant (ID Anonymisé)</TableHead>
                    <TableHead className="font-black text-slate-700 h-14">Candidat Choisi</TableHead>
                    <TableHead className="font-black text-slate-700 h-14">Poste</TableHead>
                    <TableHead className="font-black text-slate-700 h-14 px-8 text-right">Date & Heure</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={4} className="h-16 animate-pulse bg-slate-100/50" />
                      </TableRow>
                    ))
                  ) : filteredVotes?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-40 text-center text-slate-400 font-medium">
                        Aucun vote trouvé pour cette recherche.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVotes?.map((vote) => (
                      <TableRow key={vote.id} className="hover:bg-slate-50 transition-colors border-b">
                        <TableCell className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                              <ShieldCheck className="w-4 h-4 text-slate-500" />
                            </div>
                            <span className="font-mono font-bold text-slate-600">{anonymizeId(vote.voterId)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                             <Award className="w-4 h-4 text-orange-500" />
                             <span className="font-black text-slate-800">{vote.candidateFirstName} {vote.candidateLastName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-blue-50 text-[#1e3a8a] border-blue-100 px-3 py-1 font-bold">
                            {vote.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-8 text-right text-slate-500 font-medium italic">
                          {format(new Date(vote.createdAt), "dd MMMM yyyy HH:mm:ss", { locale: fr })}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Banner Security */}
        <div className="bg-orange-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 max-w-2xl text-center md:text-left">
                    <h3 className="text-2xl font-black">Sécurité & Anonymat</h3>
                    <p className="text-orange-100 font-medium">
                        Smart Africa Chapter Tchad utilise un système de signature cryptographique. 
                        Même si l'ID est public, il est impossible de faire le lien direct avec votre identité civile sans accès aux registres cryptés du bureau électoral central.
                    </p>
                </div>
                <div className="shrink-0 flex items-center justify-center w-20 h-20 bg-white/20 rounded-full backdrop-blur-md">
                    <ShieldCheck className="w-10 h-10" />
                </div>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10" />
        </div>
      </div>
    </div>
  );
}

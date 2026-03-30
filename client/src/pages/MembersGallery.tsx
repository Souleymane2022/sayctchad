import { useState, useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Users,
  Search,
  Award,
  MapPin,
  BookOpen,
  Calendar,
  Shield,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import type { Member } from "@shared/schema";
import SEOHead from "@/components/SEOHead";

export default function MembersGallery() {
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 24;

  const { data: galleryData, isLoading } = useQuery<{ members: Member[], total: number, totalPages: number }>({
    queryKey: ["/api/members/gallery", page, search],
    queryFn: async () => {
      const res = await fetch(`/api/members/gallery?page=${page}&limit=${PER_PAGE}&search=${encodeURIComponent(search)}`);
      if (!res.ok) throw new Error("Erreur lors du chargement de la galerie");
      return res.json();
    },
    placeholderData: keepPreviousData,
  });

  // Separate query for global stats (optional but good for the hero)
  const { data: statsData } = useQuery<{ total: number, withPhoto: number }>({
    queryKey: ["/api/members/stats"],
    queryFn: async () => {
      const res = await fetch("/api/members/stats");
      if (!res.ok) return { total: 615, withPhoto: 130 }; // Hardcoded fallbacks if route not ready
      return res.json();
    }
  });

  const members = galleryData?.members || [];
  const totalPages = galleryData?.totalPages || 0;
  const totalCountMatching = galleryData?.total || 0;

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.94 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.35, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-sidebar text-sidebar-foreground overflow-hidden">
      <SEOHead
        title="Galerie des Membres - SAYC Tchad"
        description="Galerie officielle des membres du Smart Africa Youth Chapter Tchad."
        path="/sayc-membres-galerie"
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        {/* Floating shapes - brand colors */}
        <div className="absolute top-10 right-16 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-0 left-1/2 w-96 h-48 bg-sayc-teal/5 rounded-full blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 md:px-6 pt-32 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-accent/15 border border-accent/30 rounded-full px-5 py-2 text-sm text-accent font-semibold mb-8">
              <Star className="w-4 h-4 fill-accent" />
              Communauté Officielle SAYC Tchad
            </div>

            <h1 className="font-heading text-5xl md:text-7xl font-black mb-6 leading-tight">
              Nos{" "}
              <span className="relative">
                <span className="text-accent">Membres</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                >
                  <path
                    d="M0 4 Q50 0 100 4 Q150 8 200 4"
                    stroke="hsl(24 95% 53%)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="text-lg text-sidebar-foreground/70 max-w-2xl mx-auto mb-12 leading-relaxed">
              Découvrez les visages de la génération numérique tchadienne — membres officiels
              du <strong className="text-sidebar-foreground">Smart Africa Youth Chapter Tchad</strong>.
            </p>

            {/* Stats band */}
            <div className="flex justify-center gap-10 mb-12 flex-wrap">
              {[
                { value: statsData?.withPhoto || 0, label: "Membres avec photo", color: "text-accent" },
                { value: statsData?.total || 0, label: "Membres au total", color: "text-sayc-teal" },
                { value: "2025", label: "Année de fondation", color: "text-sidebar-foreground" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className={`text-4xl font-black ${stat.color} tabular-nums`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-sidebar-foreground/40 uppercase tracking-widest mt-1.5 font-semibold">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Search bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sidebar-foreground/30" />
              <Input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Rechercher par nom, ID membre, ville..."
                className="pl-12 pr-10 h-14 bg-white/8 border-white/15 text-sidebar-foreground placeholder:text-sidebar-foreground/30 rounded-2xl text-base focus:border-accent/50 focus:ring-1 focus:ring-accent/30 backdrop-blur-sm"
                style={{ background: "rgba(255,255,255,0.07)" }}
              />
              {search && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sidebar-foreground/30 hover:text-sidebar-foreground/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {search && (
              <p className="text-sm text-sidebar-foreground/40 mt-3">
                {totalCountMatching} résultat{totalCountMatching !== 1 ? "s" : ""} pour «{" "}
                <span className="text-accent font-medium">{search}</span> »
              </p>
            )}
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-sidebar to-transparent" />
      </div>

      {/* ── Gallery Grid ─────────────────────────────────────── */}
      <div className="container mx-auto px-4 md:px-6 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl animate-pulse"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 mx-auto text-sidebar-foreground/10 mb-4" />
            <p className="text-sidebar-foreground/30 text-lg">Aucun membre trouvé</p>
          </div>
        ) : (
          <>
            <motion.div
              key={page + search}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {members.map((member) => (
                <motion.div
                  key={member.id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.05, y: -6 }}
                  onClick={() => setSelectedMember(member)}
                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-lg"
                >
                  {/* Photo */}
                  <img
                    src={member.photoUrl!}
                    alt={`${member.firstName} ${member.nomSpecifiqueUnique}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Permanent subtle gradient at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-sidebar/80 via-transparent to-transparent" />

                  {/* Info overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                  {/* Name + ID revealed on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <p className="text-white text-xs font-bold leading-tight truncate drop-shadow-lg">
                      {member.firstName} {member.nomSpecifiqueUnique}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Award className="w-2.5 h-2.5 text-accent" />
                      <p className="text-accent text-[9px] font-mono font-bold tracking-wider truncate">
                        {member.membershipId}
                      </p>
                    </div>
                  </div>

                  {/* Official badge corner */}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-sidebar/80 backdrop-blur-sm border border-white/10 rounded-full p-1">
                      <Shield className="w-2.5 h-2.5 text-sayc-teal" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <Button
                  variant="ghost"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-white/5 rounded-xl disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Précédent
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                          p === page
                            ? "bg-accent text-white shadow-lg shadow-accent/30"
                            : "text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-white/5"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  {totalPages > 5 && (
                    <span className="text-sidebar-foreground/30 text-sm">
                      ... {totalPages}
                    </span>
                  )}
                </div>

                <Button
                  variant="ghost"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-white/5 rounded-xl disabled:opacity-30"
                >
                  Suivant
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Member Detail Modal ───────────────────────────────── */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-sm p-0 overflow-hidden border border-white/10 bg-sidebar shadow-2xl rounded-3xl">
          <DialogHeader className="sr-only">
            <DialogTitle>
              Profil de {selectedMember?.firstName} {selectedMember?.nomSpecifiqueUnique}
            </DialogTitle>
            <DialogDescription>
              Fiche membre SAYC Tchad officielle
            </DialogDescription>
          </DialogHeader>

          {selectedMember && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Portrait photo */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={selectedMember.photoUrl!}
                    alt={`${selectedMember.firstName} ${selectedMember.nomSpecifiqueUnique}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-sidebar" />

                  {/* Official badge */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-1.5 bg-sidebar/70 border border-sayc-teal/40 backdrop-blur-md rounded-full px-3 py-1.5">
                      <Shield className="w-3 h-3 text-sayc-teal" />
                      <span className="text-[10px] text-sayc-teal font-bold uppercase tracking-widest">
                        Membre Officiel
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info section */}
                <div className="px-6 pt-2 pb-6">
                  {/* Name */}
                  <div className="mb-5">
                    <h2 className="font-heading text-2xl font-black text-sidebar-foreground leading-tight">
                      {selectedMember.firstName}{" "}
                      <span className="text-accent">{selectedMember.nomSpecifiqueUnique}</span>
                    </h2>

                    {/* Membership ID chip */}
                    <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/25 rounded-xl px-3 py-1.5 mt-2">
                      <Award className="w-3.5 h-3.5 text-accent" />
                      <span className="font-mono text-xs text-accent font-black tracking-widest">
                        {selectedMember.membershipId}
                      </span>
                    </div>
                  </div>

                  {/* Public infos only - NO email, NO phone */}
                  <div className="space-y-3">
                    {selectedMember.city && (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(255,255,255,0.06)" }}>
                          <MapPin className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-[10px] text-sidebar-foreground/40 uppercase tracking-wider font-semibold">Ville</p>
                          <p className="text-sm text-sidebar-foreground font-medium">{selectedMember.city}, Tchad</p>
                        </div>
                      </div>
                    )}

                    {selectedMember.education && (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(255,255,255,0.06)" }}>
                          <BookOpen className="w-4 h-4 text-sayc-teal" />
                        </div>
                        <div>
                          <p className="text-[10px] text-sidebar-foreground/40 uppercase tracking-wider font-semibold">Formation</p>
                          <p className="text-sm text-sidebar-foreground font-medium">{selectedMember.education}</p>
                        </div>
                      </div>
                    )}

                    {selectedMember.createdAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(255,255,255,0.06)" }}>
                          <Calendar className="w-4 h-4 text-sidebar-foreground/50" />
                        </div>
                        <div>
                          <p className="text-[10px] text-sidebar-foreground/40 uppercase tracking-wider font-semibold">Membre depuis</p>
                          <p className="text-sm text-sidebar-foreground font-medium">
                            {new Date(selectedMember.createdAt).toLocaleDateString("fr-FR", {
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/8 my-5" />

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src="/favicon.png" alt="SAYC" className="w-6 h-6 rounded-lg" />
                      <div>
                        <p className="text-[10px] font-black text-sidebar-foreground leading-none">SAYC Tchad</p>
                        <p className="text-[8px] text-sidebar-foreground/40 font-semibold uppercase tracking-wider leading-none mt-0.5">
                          Smart Africa Youth Chapter
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-sayc-teal/15 text-sayc-teal border-sayc-teal/25 text-[10px]">
                      ✓ Vérifié
                    </Badge>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

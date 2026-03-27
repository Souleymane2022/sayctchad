import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Programs from "@/pages/Programs";
import Trainings from "@/pages/Trainings";
import Events from "@/pages/Events";
import News from "@/pages/News";
import Contact from "@/pages/Contact";
import Join from "@/pages/Join";
import Opportunities from "@/pages/Opportunities";
import ThunderbirdProgram from "@/pages/ThunderbirdProgram";
import Admin from "@/pages/Admin";
import MembershipRegistration from "@/pages/MembershipRegistration";
import VerifyMember from "@/pages/VerifyMember";
import ElectionsOverview from "@/pages/ElectionsOverview";
import CandidateApplication from "@/pages/CandidateApplication";
import VotingInterface from "@/pages/VotingInterface";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/a-propos" component={About} />
      <Route path="/programmes/thunderbird" component={ThunderbirdProgram} />
      <Route path="/programmes" component={Programs} />
      <Route path="/opportunites" component={Opportunities} />
      <Route path="/opportunites/:id" component={Opportunities} />
      <Route path="/formations" component={Trainings} />
      <Route path="/formations/:id" component={Trainings} />
      <Route path="/evenements" component={Events} />
      <Route path="/evenements/:id" component={Events} />
      <Route path="/actualites" component={News} />
      <Route path="/contact" component={Contact} />
      <Route path="/rejoindre" component={Join} />
      <Route path="/elections" component={ElectionsOverview} />
      <Route path="/elections/postuler" component={CandidateApplication} />
      <Route path="/elections/voter" component={VotingInterface} />
      <Route path="/admin" component={Admin} />
      <Route path="/devenir-membre-sayc" component={MembershipRegistration} />
      <Route path="/verify/:membershipId" component={VerifyMember} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Chargement...</div>}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </Suspense>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

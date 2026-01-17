import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/i18n";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import OffersList from "@/pages/OffersList";
import OfferDetails from "@/pages/OfferDetails";
import Dashboard from "@/pages/Dashboard";
import Contact from "@/pages/Contact";
import Services from "@/pages/Services";
import AuthPage from "@/pages/AuthPage";
import HotelService from "@/pages/services/Hotel";
import CarRentService from "@/pages/services/CarRent";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/omra" component={OffersList} />
          <Route path="/travel" component={OffersList} />
          <Route path="/packs" component={OffersList} />
          <Route path="/offer/:id" component={OfferDetails} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/contact" component={Contact} />
          <Route path="/services" component={Services} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/services/hotel" component={HotelService} />
          <Route path="/services/car-rent" component={CarRentService} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Upload from "@/pages/upload";
import Tutorials from "@/pages/tutorials";
import Info from "@/pages/info";
import Sidebar from "@/components/sidebar";
import ExportButton from "@/components/export-button";

function Router() {
  return (
    <div className="flex min-h-screen bg-bmw-dark">
      <Sidebar />
      <main className="flex-1 ml-[280px] relative">
        {/* Export Button - Top Right */}
        <div className="absolute top-4 right-4 z-10">
          <ExportButton />
        </div>
        
        <div className="p-8">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/upload" component={Upload} />
            <Route path="/tutorials" component={Tutorials} />
            <Route path="/info" component={Info} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ExportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    if (password !== "1501") {
      toast({
        title: "Falsches Passwort",
        description: "Das eingegebene Passwort ist nicht korrekt.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/export');
      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'bmw-me9-export.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export erfolgreich",
        description: "Die Daten wurden erfolgreich exportiert.",
      });
      
      setIsOpen(false);
      setPassword("");
    } catch (error) {
      toast({
        title: "Export fehlgeschlagen",
        description: "Der Export konnte nicht durchgeführt werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-bmw-silver hover:text-bmw-cyan hover:bg-bmw-gray/50"
          data-testid="button-export"
        >
          <Download className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-bmw-gray border border-bmw">
        <DialogHeader>
          <DialogTitle className="text-bmw-white">Seite exportieren</DialogTitle>
          <DialogDescription className="text-bmw-silver">
            Geben Sie das Passwort ein, um alle Daten der Plattform zu exportieren.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-bmw-silver">Passwort</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort eingeben"
              className="bg-bmw-dark border-bmw text-bmw-white placeholder-bmw-silver/60"
              data-testid="input-export-password"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleExport();
                }
              }}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setPassword("");
              }}
              className="bg-bmw-light-gray border-bmw text-bmw-silver hover:bg-hover"
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleExport}
              disabled={isLoading}
              className="bmw-button-gradient hover:shadow-lg transition-all duration-300"
              data-testid="button-confirm-export"
            >
              {isLoading ? "Exportiere..." : "Exportieren"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
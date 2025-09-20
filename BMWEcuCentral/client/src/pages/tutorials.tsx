import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import VideoEmbed from "@/components/video-embed";
import type { Tutorial } from "@shared/schema";

const categories = [
  { value: "basic", label: "Grundlagen" },
  { value: "advanced", label: "Fortgeschritten" },
  { value: "troubleshooting", label: "Fehlerbehebung" },
  { value: "tools", label: "Tools & Software" },
];

export default function Tutorials() {
  const [formData, setFormData] = useState({
    title: "",
    youtubeUrl: "",
    category: "",
    description: "",
  });
  const { toast } = useToast();

  const { data: tutorials = [], isLoading } = useQuery<Tutorial[]>({
    queryKey: ["/api/tutorials"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/tutorials", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tutorials"] });
      toast({
        title: "Tutorial hinzugefügt",
        description: "Das Tutorial wurde erfolgreich hinzugefügt.",
      });
      setFormData({ title: "", youtubeUrl: "", category: "", description: "" });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Das Tutorial konnte nicht hinzugefügt werden.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/tutorials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tutorials"] });
      toast({
        title: "Tutorial gelöscht",
        description: "Das Tutorial wurde erfolgreich gelöscht.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.youtubeUrl || !formData.category) {
      toast({
        title: "Ungültige Eingabe",
        description: "Bitte füllen Sie alle Pflichtfelder aus.",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate(formData);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(cat => cat.value === category)?.label || category;
  };

  return (
    <div>
      <div className="mb-8 pb-4 border-b-2 border-bmw">
        <h1 className="text-4xl font-bold text-bmw-white mb-2">Tutorials</h1>
        <p className="text-lg text-bmw-silver">Video-Anleitungen und Wissensdatenbank</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Tutorial Form */}
        <Card className="bmw-card-gradient border border-bmw">
          <CardHeader>
            <CardTitle className="flex items-center text-bmw-cyan">
              <Plus className="w-6 h-6 mr-3" />
              Neues Tutorial hinzufügen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="youtubeUrl" className="text-bmw-silver">YouTube URL *</Label>
                <Input
                  id="youtubeUrl"
                  type="url"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                  className="bg-bmw-gray border-bmw text-bmw-white placeholder-bmw-silver/60"
                  data-testid="input-youtube-url"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-bmw-silver">Titel *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Tutorial-Titel"
                  className="bg-bmw-gray border-bmw text-bmw-white placeholder-bmw-silver/60"
                  data-testid="input-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-bmw-silver">Kategorie *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="bg-bmw-gray border-bmw text-bmw-white" data-testid="select-category">
                    <SelectValue placeholder="Kategorie wählen" />
                  </SelectTrigger>
                  <SelectContent className="bg-bmw-gray border-bmw">
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value} className="text-bmw-white">
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-bmw-silver">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Kurze Beschreibung des Tutorials..."
                  className="bg-bmw-gray border-bmw text-bmw-white placeholder-bmw-silver/60"
                  rows={3}
                  data-testid="textarea-description"
                />
              </div>

              <Button
                type="submit"
                className="w-full bmw-button-gradient hover:shadow-lg transition-all duration-300"
                disabled={createMutation.isPending}
                data-testid="button-add-tutorial"
              >
                {createMutation.isPending ? "Wird hinzugefügt..." : "Tutorial hinzufügen"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Tutorials */}
        <Card className="bmw-card-gradient border border-bmw">
          <CardHeader>
            <CardTitle className="flex items-center text-bmw-cyan">
              <Video className="w-6 h-6 mr-3" />
              Aktuelle Tutorials
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-bmw-silver">Lädt...</div>
            ) : tutorials.length === 0 ? (
              <div className="text-bmw-silver">Noch keine Tutorials vorhanden.</div>
            ) : (
              <div className="space-y-6">
                {tutorials.slice(0, 3).map((tutorial) => (
                  <div key={tutorial.id} className="space-y-3">
                    <VideoEmbed youtubeId={tutorial.youtubeId} />
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-bmw-white mb-1">{tutorial.title}</h4>
                        <p className="text-sm text-bmw-silver/80 mb-1">
                          {getCategoryLabel(tutorial.category)} • {formatDate(tutorial.createdAt)}
                        </p>
                        {tutorial.description && (
                          <p className="text-sm text-bmw-silver/90">{tutorial.description}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(tutorial.id)}
                        disabled={deleteMutation.isPending}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 ml-2"
                        data-testid={`button-delete-tutorial-${tutorial.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {tutorials.length > 3 && (
                  <Button variant="outline" className="w-full bg-bmw-light-gray border-bmw text-bmw-silver hover:bg-hover hover:text-bmw-white">
                    Alle Tutorials anzeigen ({tutorials.length} gesamt)
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

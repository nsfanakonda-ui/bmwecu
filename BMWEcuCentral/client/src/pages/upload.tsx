import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload as UploadIcon, FileText, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import FileUpload from "@/components/file-upload";
import type { File as SchemaFile } from "@shared/schema";

const bmwModels = [
  { value: "e46", label: "E46 (1998-2006)" },
  { value: "e39", label: "E39 (1995-2003)" },
  { value: "e60", label: "E60 (2003-2010)" },
  { value: "e90", label: "E90 (2005-2013)" },
  { value: "e87", label: "E87 (2004-2013)" },
];

const motors = [
  { value: "m54", label: "M54 (2.5i, 3.0i)" },
  { value: "n52", label: "N52 (2.5i, 3.0i)" },
  { value: "n54", label: "N54 (3.0i Twin Turbo)" },
  { value: "m47", label: "M47 (Diesel)" },
];

export default function Upload() {
  const [formData, setFormData] = useState({
    bmwModel: "",
    motor: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const { data: files = [], isLoading } = useQuery<SchemaFile[]>({
    queryKey: ["/api/files"],
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, data }: { file: File; data: typeof formData }) => {
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      formDataObj.append('bmwModel', data.bmwModel);
      formDataObj.append('motor', data.motor);
      formDataObj.append('description', data.description);

      const response = await fetch('/api/files', {
        method: 'POST',
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      toast({
        title: "Upload erfolgreich",
        description: "Datei wurde erfolgreich hochgeladen.",
      });
      setFormData({ bmwModel: "", motor: "", description: "" });
      setSelectedFile(null);
    },
    onError: () => {
      toast({
        title: "Upload fehlgeschlagen",
        description: "Die Datei konnte nicht hochgeladen werden.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/files/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      toast({
        title: "Datei gelöscht",
        description: "Die Datei wurde erfolgreich gelöscht.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !formData.bmwModel || !formData.motor) {
      toast({
        title: "Ungültige Eingabe",
        description: "Bitte füllen Sie alle Pflichtfelder aus und wählen Sie eine Datei.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({ file: selectedFile, data: formData });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  return (
    <div>
      <div className="mb-8 pb-4 border-b-2 border-bmw">
        <h1 className="text-4xl font-bold text-bmw-white mb-2">Datei-Upload</h1>
        <p className="text-lg text-bmw-silver">XDF und BIN Dateien für BMW E-Modelle hochladen</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Form */}
        <Card className="bmw-card-gradient border border-bmw">
          <CardHeader>
            <CardTitle className="flex items-center text-bmw-cyan">
              <UploadIcon className="w-6 h-6 mr-3" />
              Dateien hochladen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FileUpload
                onFileSelect={setSelectedFile}
                selectedFile={selectedFile}
              />

              <div className="space-y-2">
                <Label htmlFor="bmwModel" className="text-bmw-silver">BMW Modell *</Label>
                <Select
                  value={formData.bmwModel}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, bmwModel: value }))}
                >
                  <SelectTrigger className="bg-bmw-gray border-bmw text-bmw-white" data-testid="select-bmw-model">
                    <SelectValue placeholder="Modell auswählen" />
                  </SelectTrigger>
                  <SelectContent className="bg-bmw-gray border-bmw">
                    {bmwModels.map((model) => (
                      <SelectItem key={model.value} value={model.value} className="text-bmw-white">
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motor" className="text-bmw-silver">Motor *</Label>
                <Select
                  value={formData.motor}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, motor: value }))}
                >
                  <SelectTrigger className="bg-bmw-gray border-bmw text-bmw-white" data-testid="select-motor">
                    <SelectValue placeholder="Motor auswählen" />
                  </SelectTrigger>
                  <SelectContent className="bg-bmw-gray border-bmw">
                    {motors.map((motor) => (
                      <SelectItem key={motor.value} value={motor.value} className="text-bmw-white">
                        {motor.label}
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
                  placeholder="Beschreibung der Datei..."
                  className="bg-bmw-gray border-bmw text-bmw-white placeholder-bmw-silver/60"
                  rows={4}
                  data-testid="textarea-description"
                />
              </div>

              <Button
                type="submit"
                className="w-full bmw-button-gradient hover:shadow-lg transition-all duration-300"
                disabled={uploadMutation.isPending}
                data-testid="button-upload-submit"
              >
                {uploadMutation.isPending ? "Wird hochgeladen..." : "Upload starten"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Files */}
        <Card className="bmw-card-gradient border border-bmw">
          <CardHeader>
            <CardTitle className="flex items-center text-bmw-cyan">
              <FileText className="w-6 h-6 mr-3" />
              Letzte Uploads
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-bmw-silver">Lädt...</div>
            ) : files.length === 0 ? (
              <div className="text-bmw-silver">Noch keine Dateien hochgeladen.</div>
            ) : (
              <div className="space-y-3">
                {files.slice(0, 5).map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-bmw-gray rounded-lg border border-bmw">
                    <div className="flex-1">
                      <div className="font-medium text-bmw-cyan">{file.originalName}</div>
                      <div className="text-sm text-bmw-silver/80">
                        {formatDate(file.uploadedAt)} • {file.bmwModel.toUpperCase()} • {file.motor.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-bmw-silver text-sm">{formatFileSize(file.fileSize)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = `/api/files/${file.id}/download`;
                          link.download = file.originalName;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="text-bmw-cyan hover:text-bmw-blue hover:bg-bmw-gray/50"
                        data-testid={`button-download-${file.id}`}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(file.id)}
                        disabled={deleteMutation.isPending}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        data-testid={`button-delete-${file.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {files.length > 5 && (
                  <Button variant="outline" className="w-full bg-bmw-light-gray border-bmw text-bmw-silver hover:bg-hover hover:text-bmw-white">
                    Alle Dateien anzeigen ({files.length} gesamt)
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

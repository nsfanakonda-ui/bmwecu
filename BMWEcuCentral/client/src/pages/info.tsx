import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar, AlertTriangle, Settings } from "lucide-react";

const ecuInfo = [
  { label: "Hersteller", value: "Bosch" },
  { label: "Typ", value: "ME9.2" },
  { label: "Verwendung", value: "BMW E-Serie" },
  { label: "Prozessor", value: "Infineon C167" },
  { label: "Speicher", value: "512KB Flash" },
];

const compatibleModels = [
  { label: "E46", value: "1998-2006" },
  { label: "E39", value: "1995-2003" },
  { label: "E60", value: "2003-2010" },
  { label: "E90", value: "2005-2013" },
  { label: "E87", value: "2004-2013" },
];

const supportedEngines = [
  { label: "M54B25", value: "2.5L Benzin" },
  { label: "M54B30", value: "3.0L Benzin" },
  { label: "N52B25", value: "2.5L Benzin" },
  { label: "N52B30", value: "3.0L Benzin" },
  { label: "M47D20", value: "2.0L Diesel" },
];

function InfoList({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between items-center py-3 border-b border-bmw last:border-b-0">
          <span className="font-semibold text-bmw-cyan">{item.label}</span>
          <span className="text-bmw-silver">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function Info() {
  return (
    <div>
      <div className="mb-8 pb-4 border-b-2 border-bmw">
        <h1 className="text-4xl font-bold text-bmw-white mb-2">Allgemeine Informationen</h1>
        <p className="text-lg text-bmw-silver">Technische Details zu BMW Steuergeräten</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* BMW ME9.2 Overview */}
        <Card className="bmw-card-gradient border border-bmw">
          <CardHeader>
            <CardTitle className="flex items-center text-bmw-cyan">
              <User className="w-6 h-6 mr-3" />
              BMW ME9.2 Übersicht
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoList items={ecuInfo} />
          </CardContent>
        </Card>

        {/* Compatible Models */}
        <Card className="bmw-card-gradient border border-bmw">
          <CardHeader>
            <CardTitle className="flex items-center text-bmw-cyan">
              <Settings className="w-6 h-6 mr-3" />
              Kompatible Modelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoList items={compatibleModels} />
          </CardContent>
        </Card>

        {/* Supported Engines */}
        <Card className="bmw-card-gradient border border-bmw">
          <CardHeader>
            <CardTitle className="flex items-center text-bmw-cyan">
              <Calendar className="w-6 h-6 mr-3" />
              Unterstützte Motoren
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoList items={supportedEngines} />
          </CardContent>
        </Card>
      </div>

      {/* Important Notes */}
      <Card className="bmw-card-gradient border border-bmw">
        <CardHeader>
          <CardTitle className="flex items-center text-bmw-cyan">
            <AlertTriangle className="w-6 h-6 mr-3" />
            Wichtige Hinweise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 text-bmw-silver leading-relaxed">
            <div>
              <h4 className="font-semibold text-bmw-cyan mb-2">⚠️ Warnung:</h4>
              <p>Die Verwendung dieser Software und Dateien erfolgt auf eigene Gefahr. Falsche Programmierung kann zu Motorschäden führen.</p>
            </div>

            <div>
              <h4 className="font-semibold text-bmw-cyan mb-2">💾 Backup:</h4>
              <p>Erstellen Sie immer ein Backup der Original-Software, bevor Sie Änderungen vornehmen.</p>
            </div>

            <div>
              <h4 className="font-semibold text-bmw-cyan mb-2">⚖️ Rechtliches:</h4>
              <p>Beachten Sie die lokalen Gesetze bezüglich Fahrzeugmodifikationen und Emissionen.</p>
            </div>

            <div>
              <h4 className="font-semibold text-bmw-cyan mb-2">🛠️ Support:</h4>
              <p>Bei Fragen wenden Sie sich an die Community oder erfahrene Tuner.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

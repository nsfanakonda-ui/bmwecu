import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Video, Info } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="bmw-hero-gradient rounded-2xl p-12 text-center mb-12 border-2 border-bmw">
        <h1 className="text-5xl font-bold text-bmw-white mb-4">BMW ME9.2 Platform</h1>
        <p className="text-xl text-bmw-cyan mb-8">Professionelle Plattform für BMW Steuergeräte</p>
        <p className="text-lg text-bmw-silver max-w-3xl mx-auto mb-8 leading-relaxed">
          Willkommen auf der umfassenden Plattform für BMW ME9.2 Steuergeräte. 
          Hier finden Sie alles für Uploads, Tutorials und Fachwissen rund um BMW E-Modell ECUs. 
          Unsere Plattform bietet Ihnen die Möglichkeit, XDF- und BIN-Dateien zu verwalten, 
          Video-Tutorials anzusehen und Ihr Wissen über BMW Motorsteuerungen zu erweitern.
        </p>
        <Link href="/upload">
          <Button 
            className="bmw-button-gradient hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-lg px-8 py-3"
            data-testid="button-explore-platform"
          >
            Platform erkunden
          </Button>
        </Link>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bmw-card-gradient border border-bmw p-8 text-center hover:-translate-y-2 transition-all duration-300 hover:shadow-xl">
          <Upload className="w-12 h-12 text-bmw-cyan mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-bmw-white mb-4">Datei-Management</h3>
          <p className="text-bmw-silver opacity-90">
            Upload und Verwaltung von XDF- und BIN-Dateien speziell für BMW E-Modelle. 
            Unterstützte Formate und sichere Speicherung.
          </p>
        </Card>

        <Card className="bmw-card-gradient border border-bmw p-8 text-center hover:-translate-y-2 transition-all duration-300 hover:shadow-xl">
          <Video className="w-12 h-12 text-bmw-cyan mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-bmw-white mb-4">Video-Tutorials</h3>
          <p className="text-bmw-silver opacity-90">
            Umfangreiche Sammlung von YouTube-Videos und die Möglichkeit, 
            eigene Tutorial-Links zu teilen und zu verwalten.
          </p>
        </Card>

        <Card className="bmw-card-gradient border border-bmw p-8 text-center hover:-translate-y-2 transition-all duration-300 hover:shadow-xl">
          <Info className="w-12 h-12 text-bmw-cyan mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-bmw-white mb-4">Technische Infos</h3>
          <p className="text-bmw-silver opacity-90">
            Detaillierte Informationen über BMW Steuergeräte, 
            technische Spezifikationen und Kompatibilitätslisten.
          </p>
        </Card>
      </div>
    </div>
  );
}

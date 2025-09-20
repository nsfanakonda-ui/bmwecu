import { Link, useLocation } from "wouter";
import { Home, Upload, Video, Info } from "lucide-react";

const navItems = [
  { path: "/", label: "Startseite", icon: Home },
  { path: "/upload", label: "Datei-Upload", icon: Upload },
  { path: "/tutorials", label: "Tutorials", icon: Video },
  { path: "/info", label: "Allgemeine Infos", icon: Info },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <nav className="fixed left-0 top-0 h-full w-[280px] bmw-gradient border-r-2 border-bmw z-50 overflow-y-auto">
      <div className="p-8 border-b border-bmw text-center">
        <div className="text-3xl font-bold text-bmw-cyan mb-2">BMW ME9.2</div>
        <div className="text-sm text-bmw-silver opacity-80">Steuergeräte Platform</div>
      </div>
      
      <ul className="py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <li key={item.path} className="mb-2">
              <Link href={item.path}>
                <a
                  className={`flex items-center px-6 py-4 text-bmw-silver transition-all duration-300 border-l-3 ${
                    isActive
                      ? "bg-hover text-bmw-cyan border-l-bmw-cyan"
                      : "border-l-transparent hover:bg-hover hover:text-bmw-cyan"
                  }`}
                  data-testid={`nav-${item.path.replace("/", "home")}`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

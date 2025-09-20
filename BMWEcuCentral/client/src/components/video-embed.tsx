import { Play } from "lucide-react";

interface VideoEmbedProps {
  youtubeId: string;
  title?: string;
}

export default function VideoEmbed({ youtubeId, title }: VideoEmbedProps) {
  if (!youtubeId) {
    return (
      <div className="relative w-full h-0 pb-[56.25%] bg-bmw-darker rounded-xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-bmw-gradient">
          <Play className="w-16 h-16 text-bmw-blue" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-0 pb-[56.25%] bg-bmw-darker rounded-xl overflow-hidden">
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title={title || "BMW Tutorial Video"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

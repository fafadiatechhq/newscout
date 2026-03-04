import { BadgeCheck, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
import { type Source } from "@/utils/mock-data";

interface SourceEntry {
  source: Source;
  url: string;
}

interface SourcesModalProps {
  sources: SourceEntry[];
  articleTitle: string;
  trigger: React.ReactNode;
}

const SourcesModal = ({ sources, articleTitle, trigger }: SourcesModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md bg-background">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            Published on {sources.length} {sources.length === 1 ? "source" : "sources"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">{articleTitle}</p>
        </DialogHeader>

        <ul className="mt-2 divide-y divide-border">
          {sources.map(({ source, url }) => (
            <li key={source.id}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-secondary"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {source.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 font-medium text-foreground">
                    {source.name}
                    {source.is_verified && (
                      <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {source.is_verified ? "Verified Publisher" : "Publisher"}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
              </a>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default SourcesModal;

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface GenerateKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function generateFakeKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const rand = Array.from({ length: 20 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `ns_live_${rand}`;
}

const GenerateKeyDialog = ({ open, onOpenChange }: GenerateKeyDialogProps) => {
  const [keyName, setKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!keyName.trim()) return;
    setGeneratedKey(generateFakeKey());
  };

  const handleCopy = async () => {
    if (!generatedKey) return;
    await navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = (val: boolean) => {
    if (!val) {
      setKeyName("");
      setGeneratedKey(null);
      setCopied(false);
    }
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate New API Key</DialogTitle>
          <DialogDescription>
            {generatedKey
              ? "Copy your key now — it won't be shown again."
              : "Give your key a descriptive name."}
          </DialogDescription>
        </DialogHeader>

        {!generatedKey ? (
          <>
            <div className="space-y-2 py-2">
              <Label htmlFor="key-name">Key Name</Label>
              <Input
                id="key-name"
                placeholder="e.g., Production API"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleClose(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={!keyName.trim()}>
                Generate Key
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-2 py-2">
              <Label>Your API Key</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-md border border-border bg-muted px-3 py-2 text-sm font-mono break-all">
                  {generatedKey}
                </code>
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Store this key securely. You won't be able to see it again.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={() => handleClose(false)}>Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GenerateKeyDialog;

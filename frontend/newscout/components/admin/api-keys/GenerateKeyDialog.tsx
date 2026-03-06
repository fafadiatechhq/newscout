'use client'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Check } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export interface ApiKey {
  id: string
  name: string
  key_masked: string
  full_key: string
  created_at: string
  last_used: string | null
  status: 'active' | 'revoked'
  created_by: string
}

interface GenerateKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onKeyCreated?: (key: ApiKey) => void
}

const GenerateKeyDialog = ({
  open,
  onOpenChange,
  onKeyCreated,
}: GenerateKeyDialogProps) => {
  const [keyName, setKeyName] = useState('')
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)



  const generatePreviewKey = () => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    const randomPart = Array.from(
      { length: 20 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join('')

    return `ns_live_${randomPart}`
  }

  const createApiKeyObject = (name: string, key: string): ApiKey => ({
    id: crypto.randomUUID(),
    name,
    key_masked: `${key.slice(0, 6)}****${key.slice(-4)}`,
    full_key: key,
    created_at: new Date().toISOString(),
    last_used: null,
    status: 'active',
    created_by: 'Admin',
  })

  const resetState = () => {
    setGeneratedKey(null)
    setKeyName('')
    setCopied(false)
  }

  

  const handleGenerate = () => {
    if (!keyName.trim()) return

    const previewKey = generatePreviewKey()
    const newKey = createApiKeyObject(keyName, previewKey)

    setGeneratedKey(previewKey)
    onKeyCreated?.(newKey)

    toast({
      title: 'API Key Generated',
      description: `${keyName} created successfully`,
    })
  }

  const handleCopy = async () => {
    if (!generatedKey) return

    await navigator.clipboard.writeText(generatedKey)

    setCopied(true)

    toast({
      title: 'Copied to clipboard',
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const handleClose = () => {
    resetState()
    onOpenChange(false)
  }

  const descriptionText = generatedKey
    ? "Copy your key now — it won't be shown again."
    : 'Give your key a descriptive name.'

  return (
    <Dialog open={open} onOpenChange={(isOpen) => onOpenChange(isOpen)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate New API Key</DialogTitle>
          <DialogDescription>{descriptionText}</DialogDescription>
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
              <Button
                variant="outline"
                onClick={handleClose}
                className="cursor-pointer"
              >
                Cancel
              </Button>

              <Button
                onClick={handleGenerate}
                disabled={!keyName.trim()}
                className="cursor-pointer"
              >
                Generate Key
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-2 py-2">
              <Label>Your API Key</Label>

              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-md border bg-muted px-3 py-2 text-sm font-mono break-all">
                  {generatedKey}
                </code>

                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Store this key securely. You won't be able to see it again.
              </p>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default GenerateKeyDialog

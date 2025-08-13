import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

interface BulkImportProps {
  isOpen: boolean
  onClose: () => void
  onImportComplete: () => void
  tableName: string
  tableDisplayName: string
  sampleFormat: string
}

export default function BulkImport({
  isOpen,
  onClose,
  onImportComplete,
  tableName,
  tableDisplayName,
  sampleFormat
}: BulkImportProps) {
  const [jsonData, setJsonData] = useState('')
  const [loading, setLoading] = useState(false)
  const [importResults, setImportResults] = useState<{
    success: number
    failed: number
    errors: string[]
  } | null>(null)
  const { toast } = useToast()

  const validateAndTransformData = (data: any[], tableName: string) => {
    const transformedData: any[] = []
    const errors: string[] = []

    data.forEach((item, index) => {
      try {
        let transformedItem: any = {}

        switch (tableName) {
          case 'saints':
            if (!item.name) {
              errors.push(`Item ${index + 1}: Name is required`)
              return
            }
            transformedItem = {
              name: item.name,
              name_hi: item.name_hi || '',
              period: item.period || '',
              region: item.region || '',
              image_url: item.image_url || '',
              description: item.description || '',
              description_hi: item.description_hi || '',
              specialty: item.specialty || '',
              specialty_hi: item.specialty_hi || '',
              biography: item.biography || '',
              biography_hi: item.biography_hi || ''
            }
            break

          case 'bhajans':
            if (!item.title) {
              errors.push(`Item ${index + 1}: Title is required`)
              return
            }
            transformedItem = {
              title: item.title,
              title_hi: item.title_hi || '',
              category: item.category || '',
              lyrics: item.lyrics || '',
              lyrics_hi: item.lyrics_hi || '',
              meaning: item.meaning || '',
              author: item.author || '',
              youtube_url: item.youtube_url || ''
            }
            break

          case 'divine_forms':
            if (!item.name) {
              errors.push(`Item ${index + 1}: Name is required`)
              return
            }
            transformedItem = {
              name: item.name,
              name_hi: item.name_hi || '',
              domain: item.domain || '',
              domain_hi: item.domain_hi || '',
              image_url: item.image_url || '',
              description: item.description || '',
              description_hi: item.description_hi || '',
              mantra: item.mantra || '',
              significance: item.significance || '',
              significance_hi: item.significance_hi || '',
              attributes: Array.isArray(item.attributes) ? item.attributes : 
                         (item.attributes ? item.attributes.split(',').map((a: string) => a.trim()) : null),
              stories: item.stories || '',
              stories_hi: item.stories_hi || '',
              festivals: Array.isArray(item.festivals) ? item.festivals :
                        (item.festivals ? item.festivals.split(',').map((f: string) => f.trim()) : null),
              temples: Array.isArray(item.temples) ? item.temples :
                      (item.temples ? item.temples.split(',').map((t: string) => t.trim()) : null),
              symbols: Array.isArray(item.symbols) ? item.symbols :
                      (item.symbols ? item.symbols.split(',').map((s: string) => s.trim()) : null)
            }
            break

          case 'living_saints':
            if (!item.name) {
              errors.push(`Item ${index + 1}: Name is required`)
              return
            }
            transformedItem = {
              name: item.name,
              name_hi: item.name_hi || '',
              birth_year: item.birth_year || null,
              location: item.location || '',
              image_url: item.image_url || '',
              description: item.description || '',
              description_hi: item.description_hi || '',
              specialty: item.specialty || '',
              specialty_hi: item.specialty_hi || '',
              biography: item.biography || '',
              biography_hi: item.biography_hi || '',
              teachings: item.teachings || '',
              contact_info: item.contact_info || ''
            }
            break

          case 'quotes':
            if (!item.quote_text) {
              errors.push(`Item ${index + 1}: Quote text is required`)
              return
            }
            transformedItem = {
              quote_text: item.quote_text,
              quote_hi: item.quote_hi || '',
              author: item.author || '',
              source: item.source || '',
              category: item.category || '',
              tags: Array.isArray(item.tags) ? item.tags :
                   (item.tags ? item.tags.split(',').map((t: string) => t.trim()) : null)
            }
            break

          default:
            errors.push(`Unknown table: ${tableName}`)
            return
        }

        transformedData.push(transformedItem)
      } catch (error) {
        errors.push(`Item ${index + 1}: ${error.message}`)
      }
    })

    return { transformedData, errors }
  }

  const handleImport = async () => {
    if (!jsonData.trim()) {
      toast({
        title: "Error",
        description: "Please paste your JSON data",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    setImportResults(null)

    try {
      // Parse JSON
      let parsedData
      try {
        parsedData = JSON.parse(jsonData)
      } catch (error) {
        throw new Error('Invalid JSON format. Please check your data.')
      }

      // Ensure it's an array
      if (!Array.isArray(parsedData)) {
        parsedData = [parsedData]
      }

      if (parsedData.length === 0) {
        throw new Error('No items found in the JSON data.')
      }

      // Validate and transform data
      const { transformedData, errors } = validateAndTransformData(parsedData, tableName)

      if (errors.length > 0 && transformedData.length === 0) {
        throw new Error(`Validation failed:\n${errors.join('\n')}`)
      }

      // Import data in batches
      const batchSize = 50
      let successCount = 0
      let failedCount = 0
      const importErrors: string[] = [...errors]

      for (let i = 0; i < transformedData.length; i += batchSize) {
        const batch = transformedData.slice(i, i + batchSize)
        
        try {
          const { data, error } = await supabase
            .from(tableName)
            .insert(batch)
            .select()

          if (error) {
            throw error
          }

          successCount += batch.length
        } catch (error) {
          failedCount += batch.length
          importErrors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`)
        }
      }

      setImportResults({
        success: successCount,
        failed: failedCount,
        errors: importErrors
      })

      if (successCount > 0) {
        toast({
          title: "Import Completed",
          description: `Successfully imported ${successCount} ${tableDisplayName.toLowerCase()}`,
        })
        onImportComplete()
      }

      if (failedCount > 0) {
        toast({
          title: "Partial Import",
          description: `${successCount} succeeded, ${failedCount} failed. Check results below.`,
          variant: "destructive"
        })
      }

    } catch (error) {
      console.error('Import error:', error)
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const clearData = () => {
    setJsonData('')
    setImportResults(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Import {tableDisplayName}</DialogTitle>
          <DialogDescription>
            Paste your JSON data below. You can import multiple {tableDisplayName.toLowerCase()} at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sample Format */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Expected JSON Format:</Label>
            <div className="bg-gray-100 p-3 rounded-md">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap">{sampleFormat}</pre>
            </div>
          </div>

          {/* JSON Input */}
          <div className="space-y-2">
            <Label htmlFor="jsonData">JSON Data:</Label>
            <Textarea
              id="jsonData"
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              placeholder={`Paste your ${tableDisplayName.toLowerCase()} JSON data here...`}
              rows={12}
              className="font-mono text-sm"
            />
          </div>

          {/* Import Results */}
          {importResults && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Import Results:</Label>
              <div className="bg-gray-50 p-4 rounded-md space-y-2">
                <div className="flex gap-4">
                  <span className="text-green-600 font-medium">✓ Success: {importResults.success}</span>
                  <span className="text-red-600 font-medium">✗ Failed: {importResults.failed}</span>
                </div>
                
                {importResults.errors.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-red-600 mb-2">Errors:</p>
                    <div className="bg-red-50 p-2 rounded text-xs text-red-700 max-h-32 overflow-y-auto">
                      {importResults.errors.map((error, index) => (
                        <div key={index} className="mb-1">{error}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={clearData}>
            Clear
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleImport} disabled={loading || !jsonData.trim()}>
            {loading ? 'Importing...' : `Import ${tableDisplayName}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
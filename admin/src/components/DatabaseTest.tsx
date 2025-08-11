import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function DatabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'failed'>('testing')
  const [saints, setSaints] = useState([])
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      setConnectionStatus('testing')
      setError(null)
      
      console.log('🔗 Testing Supabase connection...')
      
      // Test basic connection
      const { data, error, count } = await supabase
        .from('saints')
        .select('*', { count: 'exact' })
        .limit(5)

      if (error) {
        throw error
      }

      console.log('✅ Database connected successfully!')
      console.log(`📊 Found ${count} saints in database`)
      console.log('🔍 Sample data:', data)

      setSaints(data || [])
      setConnectionStatus('connected')
      
      toast({
        title: "Database Connected!",
        description: `Successfully connected to Supabase. Found ${count} saints.`
      })

    } catch (err) {
      console.error('❌ Database connection failed:', err)
      setError(err.message)
      setConnectionStatus('failed')
      
      toast({
        title: "Connection Failed",
        description: err.message,
        variant: "destructive"
      })
    }
  }

  const addTestSaint = async () => {
    try {
      const testSaint = {
        name: 'Test Saint ' + Date.now(),
        name_hi: 'परीक्षण संत',
        period: '21st Century',
        region: 'Digital Realm',
        specialty: 'Testing Database',
        specialty_hi: 'डेटाबेस परीक्षण',
        description: 'This is a test saint created from the admin panel to verify database connectivity.',
        description_hi: 'यह एक परीक्षण संत है जो डेटाबेस कनेक्टिविटी की जांच के लिए एडमिन पैनल से बनाया गया है।',
        biography: 'A saint dedicated to testing the digital spiritual platform.',
        biography_hi: 'डिजिटल आध्यात्मिक मंच के परीक्षण को समर्पित संत।',
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
      }

      const { data, error } = await supabase
        .from('saints')
        .insert([testSaint])
        .select()

      if (error) throw error

      console.log('✅ Test saint added:', data)
      
      toast({
        title: "Test Saint Added!",
        description: "Successfully added a test saint to the database."
      })

      // Refresh the connection test
      testConnection()

    } catch (err) {
      console.error('❌ Failed to add test saint:', err)
      toast({
        title: "Failed to Add Test Saint",
        description: err.message,
        variant: "destructive"
      })
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Database Connection Test</h3>
        <Button
          onClick={testConnection}
          variant="outline"
          size="sm"
          disabled={connectionStatus === 'testing'}
        >
          {connectionStatus === 'testing' ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            'Test Again'
          )}
        </Button>
      </div>

      {/* Connection Status */}
      <div className="flex items-center space-x-3 mb-4">
        {connectionStatus === 'testing' && (
          <>
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            <span className="text-blue-600">Testing connection...</span>
          </>
        )}
        {connectionStatus === 'connected' && (
          <>
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-600">Connected to Supabase database</span>
          </>
        )}
        {connectionStatus === 'failed' && (
          <>
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-600">Connection failed</span>
          </>
        )}
      </div>

      {/* Error Details */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p className="text-sm text-red-700">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Success Details */}
      {connectionStatus === 'connected' && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
          <p className="text-sm text-green-700 mb-2">
            <strong>✅ Database Status:</strong> Connected and ready to use
          </p>
          <p className="text-sm text-green-600">
            <strong>📊 Saints Count:</strong> {saints.length} records found
          </p>
          {saints.length > 0 && (
            <p className="text-sm text-green-600">
              <strong>🔍 Latest Saint:</strong> {saints[0]?.name}
            </p>
          )}
        </div>
      )}

      {/* Test Actions */}
      {connectionStatus === 'connected' && (
        <div className="flex space-x-3">
          <Button
            onClick={addTestSaint}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Test Saint
          </Button>
          <Button
            onClick={() => window.open('http://localhost:8081/saints', '_blank')}
            variant="outline"
            size="sm"
          >
            View on Frontend
          </Button>
        </div>
      )}
    </div>
  )
}
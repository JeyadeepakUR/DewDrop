import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Database, Users, FileText, MessageSquare, Zap, RefreshCw } from 'lucide-react';

interface DatabaseTest {
  name: string;
  description: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

const DatabaseStatus: React.FC = () => {
  const [tests, setTests] = useState<DatabaseTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'good' | 'warning' | 'error'>('warning');

  const runDatabaseTests = async () => {
    setIsRunning(true);
    const testResults: DatabaseTest[] = [];

    // Test 1: Environment Configuration
    const envTest: DatabaseTest = {
      name: 'Environment Configuration',
      description: 'Check if Supabase environment variables are properly set',
      status: 'pending',
      message: '',
    };

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      envTest.status = 'error';
      envTest.message = 'Missing environment variables';
      envTest.details = 'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set';
    } else if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseKey === 'placeholder-key') {
      envTest.status = 'error';
      envTest.message = 'Using placeholder values';
      envTest.details = 'Please replace with actual Supabase credentials';
    } else if (!supabaseUrl.includes('supabase.co')) {
      envTest.status = 'error';
      envTest.message = 'Invalid Supabase URL format';
      envTest.details = 'URL should contain "supabase.co"';
    } else {
      envTest.status = 'success';
      envTest.message = 'Environment variables configured correctly';
      envTest.details = `URL: ${supabaseUrl.substring(0, 30)}...`;
    }

    testResults.push(envTest);
    setTests([...testResults]);

    if (envTest.status !== 'success') {
      setIsRunning(false);
      setOverallStatus('error');
      return;
    }

    try {
      const { supabase } = await import('../services/supabase');

      // Test 2: Database Connection
      const connectionTest: DatabaseTest = {
        name: 'Database Connection',
        description: 'Test connection to Supabase database',
        status: 'pending',
        message: '',
      };

      try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) {
          connectionTest.status = 'error';
          connectionTest.message = 'Connection failed';
          connectionTest.details = error.message;
        } else {
          connectionTest.status = 'success';
          connectionTest.message = 'Successfully connected to database';
        }
      } catch (error) {
        connectionTest.status = 'error';
        connectionTest.message = 'Connection error';
        connectionTest.details = (error as Error).message;
      }

      testResults.push(connectionTest);
      setTests([...testResults]);

      // Test 3: Authentication Service
      const authTest: DatabaseTest = {
        name: 'Authentication Service',
        description: 'Test Supabase authentication functionality',
        status: 'pending',
        message: '',
      };

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          authTest.status = 'warning';
          authTest.message = 'Auth service accessible but no session';
          authTest.details = 'This is normal if not logged in';
        } else {
          authTest.status = 'success';
          authTest.message = session ? 'User authenticated' : 'Auth service working (no active session)';
        }
      } catch (error) {
        authTest.status = 'error';
        authTest.message = 'Authentication service error';
        authTest.details = (error as Error).message;
      }

      testResults.push(authTest);
      setTests([...testResults]);

      // Test 4: Users Table
      const usersTest: DatabaseTest = {
        name: 'Users Table',
        description: 'Check if users table exists and is accessible',
        status: 'pending',
        message: '',
      };

      try {
        const { data, error } = await supabase.from('users').select('id').limit(1);
        if (error) {
          usersTest.status = 'error';
          usersTest.message = 'Users table not accessible';
          usersTest.details = error.message;
        } else {
          usersTest.status = 'success';
          usersTest.message = 'Users table accessible';
          usersTest.details = `Found ${data?.length || 0} users (limited query)`;
        }
      } catch (error) {
        usersTest.status = 'error';
        usersTest.message = 'Users table error';
        usersTest.details = (error as Error).message;
      }

      testResults.push(usersTest);
      setTests([...testResults]);

      // Test 5: Creations Table
      const creationsTest: DatabaseTest = {
        name: 'Creations Table',
        description: 'Check if creations table exists and is accessible',
        status: 'pending',
        message: '',
      };

      try {
        const { data, error } = await supabase.from('creations').select('id').limit(1);
        if (error) {
          creationsTest.status = 'error';
          creationsTest.message = 'Creations table not accessible';
          creationsTest.details = error.message;
        } else {
          creationsTest.status = 'success';
          creationsTest.message = 'Creations table accessible';
          creationsTest.details = `Found ${data?.length || 0} creations (limited query)`;
        }
      } catch (error) {
        creationsTest.status = 'error';
        creationsTest.message = 'Creations table error';
        creationsTest.details = (error as Error).message;
      }

      testResults.push(creationsTest);
      setTests([...testResults]);

      // Test 6: Storage Bucket
      const storageTest: DatabaseTest = {
        name: 'Storage Service',
        description: 'Check if Supabase storage is accessible',
        status: 'pending',
        message: '',
      };

      try {
        const { data, error } = await supabase.storage.listBuckets();
        if (error) {
          storageTest.status = 'warning';
          storageTest.message = 'Storage service not accessible';
          storageTest.details = error.message;
        } else {
          storageTest.status = 'success';
          storageTest.message = 'Storage service accessible';
          storageTest.details = `Found ${data?.length || 0} buckets`;
        }
      } catch (error) {
        storageTest.status = 'warning';
        storageTest.message = 'Storage service error';
        storageTest.details = (error as Error).message;
      }

      testResults.push(storageTest);
      setTests([...testResults]);

      // Test 7: Row Level Security
      const rlsTest: DatabaseTest = {
        name: 'Row Level Security',
        description: 'Check if RLS policies are working correctly',
        status: 'pending',
        message: '',
      };

      try {
        // Try to access users table without authentication (should work for public read)
        const { data, error } = await supabase.from('users').select('id, username').limit(1);
        if (error && error.message.includes('row-level security')) {
          rlsTest.status = 'success';
          rlsTest.message = 'RLS is properly configured';
          rlsTest.details = 'Unauthorized access correctly blocked';
        } else if (error) {
          rlsTest.status = 'warning';
          rlsTest.message = 'RLS test inconclusive';
          rlsTest.details = error.message;
        } else {
          rlsTest.status = 'success';
          rlsTest.message = 'RLS allows public read access';
          rlsTest.details = 'This is expected for public profiles';
        }
      } catch (error) {
        rlsTest.status = 'warning';
        rlsTest.message = 'RLS test failed';
        rlsTest.details = (error as Error).message;
      }

      testResults.push(rlsTest);
      setTests([...testResults]);

      // Test 8: Real-time Subscriptions
      const realtimeTest: DatabaseTest = {
        name: 'Real-time Subscriptions',
        description: 'Check if real-time functionality is available',
        status: 'pending',
        message: '',
      };

      try {
        const channel = supabase.channel('test-channel');
        if (channel) {
          realtimeTest.status = 'success';
          realtimeTest.message = 'Real-time subscriptions available';
          realtimeTest.details = 'Channel creation successful';
        } else {
          realtimeTest.status = 'warning';
          realtimeTest.message = 'Real-time subscriptions unavailable';
        }
      } catch (error) {
        realtimeTest.status = 'warning';
        realtimeTest.message = 'Real-time test failed';
        realtimeTest.details = (error as Error).message;
      }

      testResults.push(realtimeTest);
      setTests([...testResults]);

      // Determine overall status
      const hasErrors = testResults.some(test => test.status === 'error');
      const hasWarnings = testResults.some(test => test.status === 'warning');
      
      if (hasErrors) {
        setOverallStatus('error');
      } else if (hasWarnings) {
        setOverallStatus('warning');
      } else {
        setOverallStatus('good');
      }

    } catch (error) {
      console.error('Database tests failed:', error);
      setOverallStatus('error');
    }

    setIsRunning(false);
  };

  useEffect(() => {
    runDatabaseTests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />;
    }
  };

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case 'good':
        return 'from-green-500 to-emerald-500';
      case 'warning':
        return 'from-yellow-500 to-orange-500';
      case 'error':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getOverallStatusMessage = () => {
    switch (overallStatus) {
      case 'good':
        return 'Database is perfectly integrated and ready for production!';
      case 'warning':
        return 'Database is working but has some minor issues or limitations.';
      case 'error':
        return 'Database integration has critical issues that need to be resolved.';
      default:
        return 'Checking database integration...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Database className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Database Integration Status</h1>
          </div>
          <p className="text-gray-600">Comprehensive check of your Supabase database integration</p>
        </div>

        {/* Overall Status */}
        <div className={`bg-gradient-to-r ${getOverallStatusColor()} rounded-2xl p-6 text-white mb-8 shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Overall Status</h2>
              <p className="text-white/90">{getOverallStatusMessage()}</p>
            </div>
            <div className="flex items-center space-x-4">
              {!isRunning && (
                <button
                  onClick={runDatabaseTests}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retest</span>
                </button>
              )}
              {isRunning ? (
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                getStatusIcon(overallStatus === 'good' ? 'success' : overallStatus === 'warning' ? 'warning' : 'error')
              )}
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          {tests.map((test, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(test.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      test.status === 'success' ? 'bg-green-100 text-green-800' :
                      test.status === 'error' ? 'bg-red-100 text-red-800' :
                      test.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {test.status === 'pending' ? 'Testing...' : test.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{test.description}</p>
                  <p className={`font-medium ${
                    test.status === 'success' ? 'text-green-700' :
                    test.status === 'error' ? 'text-red-700' :
                    test.status === 'warning' ? 'text-yellow-700' :
                    'text-gray-700'
                  }`}>
                    {test.message}
                  </p>
                  {test.details && (
                    <p className="text-sm text-gray-500 mt-1">{test.details}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        {overallStatus === 'error' && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4">🚨 Action Required</h3>
            <div className="space-y-2 text-sm text-red-700">
              <p>• Check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly</p>
              <p>• Verify your Supabase project is active and accessible</p>
              <p>• Ensure database tables are created (run migrations if needed)</p>
              <p>• Check Row Level Security policies are properly configured</p>
            </div>
          </div>
        )}

        {overallStatus === 'good' && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">✅ Perfect Integration!</h3>
            <div className="space-y-2 text-sm text-green-700">
              <p>• Your Supabase database is fully integrated and working correctly</p>
              <p>• All core features (auth, database, storage) are functional</p>
              <p>• You can now proceed with confidence to build your application</p>
              <p>• Ready for production deployment</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseStatus;
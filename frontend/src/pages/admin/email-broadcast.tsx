import React, { useState, useEffect } from 'react';
import { Send, Users, Mail, Sparkles, CheckCircle, AlertCircle, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Admin emails - only these users can access this page
const ADMIN_EMAILS = [
  'adityasrivastav9721057380@gmail.com',
  'santvaani.digitalashram@gmail.com'
];

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

const EmailBroadcast = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  // Check if user is admin - redirect if not
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Not logged in - redirect to login
        navigate('/login');
        return;
      }

      // Check if user email is in admin list
      if (!ADMIN_EMAILS.includes(user.email || '')) {
        // Not an admin - redirect to dashboard
        navigate('/dashboard');
        return;
      }
    }
  }, [user, authLoading, navigate]);

  // Fetch all users on mount
  useEffect(() => {
    if (user && ADMIN_EMAILS.includes(user.email || '')) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setFetchingUsers(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/users`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      } else {
        setStatus({ type: 'error', message: 'Failed to fetch users' });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setStatus({ type: 'error', message: 'Error loading users' });
    } finally {
      setFetchingUsers(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAll = () => {
    setSelectedUsers(users.map(u => u.id));
  };

  const deselectAll = () => {
    setSelectedUsers([]);
  };

  const getSelectedEmails = () => {
    return users
      .filter(u => selectedUsers.includes(u.id))
      .map(u => u.email);
  };

  const generateEmailHTML = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 20px; text-align: center; }
    .om-symbol { font-size: 72px; color: white; margin-bottom: 20px; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header-title { color: white; font-size: 28px; font-weight: bold; margin: 0; }
    .content { padding: 40px 30px; color: #374151; line-height: 1.8; }
    .message { white-space: pre-wrap; }
    .footer { background-color: #f9fafb; padding: 30px; text-align: center; color: #6b7280; }
    .signature { color: #f97316; font-weight: 600; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="om-symbol">ॐ</div>
      <h1 class="header-title">Santvaani Digital Ashram</h1>
    </div>
    <div class="content">
      <div class="message">${message.replace(/\n/g, '<br>')}</div>
      <div class="signature">
        🙏 Santvaani Team
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0; font-size: 14px;">
        You're receiving this email because you're part of the Santvaani community.
      </p>
      <p style="margin: 10px 0 0 0; font-size: 12px;">
        © 2025 Santvaani Digital Ashram. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();
  };

  const handleSendBroadcast = async () => {
    if (selectedUsers.length === 0) {
      setStatus({ type: 'error', message: 'Please select at least one recipient' });
      return;
    }

    if (!subject.trim()) {
      setStatus({ type: 'error', message: 'Please enter an email subject' });
      return;
    }

    if (!message.trim()) {
      setStatus({ type: 'error', message: 'Please enter a message' });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: null, message: '' });

      const recipients = getSelectedEmails();
      const htmlContent = generateEmailHTML();

      const response = await fetch(`${API_BASE_URL}/api/email/send-broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipients,
          subject,
          htmlContent,
          adminEmail: 'admin@santvaani.com' // TODO: Get from auth context
        })
      });

      const data = await response.json();

      if (data.success) {
        setStatus({
          type: 'success',
          message: `Successfully sent email to ${data.sentCount} recipients!`
        });
        // Clear form
        setSubject('');
        setMessage('');
        setSelectedUsers([]);
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Failed to send broadcast email'
        });
      }
    } catch (error) {
      console.error('Error sending broadcast:', error);
      setStatus({
        type: 'error',
        message: 'Network error. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized if not admin
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Access Denied
              </h2>
              <p className="text-gray-600 mb-6">
                This page is restricted to administrators only.
              </p>
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-orange-500 to-red-500"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Email Broadcast Center
          </h1>
          <p className="text-gray-600">
            Send beautiful emails to your Santvaani community
          </p>
        </div>

        {/* Status Messages */}
        {status.type && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
            status.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {status.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Recipient Selection */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-orange-500" />
                <span>Recipients ({selectedUsers.length}/{users.length})</span>
              </CardTitle>
              <CardDescription>
                Select users to send email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Select All / Deselect All */}
                <div className="flex space-x-2">
                  <Button
                    onClick={selectAll}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Select All
                  </Button>
                  <Button
                    onClick={deselectAll}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Clear
                  </Button>
                </div>

                {/* User List */}
                <div className="max-h-96 overflow-y-auto space-y-2 border rounded-lg p-3">
                  {fetchingUsers ? (
                    <p className="text-sm text-gray-500 text-center py-8">
                      Loading users...
                    </p>
                  ) : users.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">
                      No users found
                    </p>
                  ) : (
                    users.map(user => (
                      <label
                        key={user.id}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="w-4 h-4 text-orange-500 rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: Email Composer */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <span>Compose Email</span>
              </CardTitle>
              <CardDescription>
                Create your custom email message
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Special Announcement from Santvaani"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here... It will be beautifully formatted with the Santvaani branding."
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Your message will include the Santvaani header with ॐ symbol and branding
                </p>
              </div>

              {/* Preview Info */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-900 mb-2">
                  Email Preview Features:
                </h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>✓ Beautiful gradient header with ॐ symbol</li>
                  <li>✓ Professional Santvaani branding</li>
                  <li>✓ Mobile-responsive design</li>
                  <li>✓ Automatic signature included</li>
                </ul>
              </div>

              {/* Send Button */}
              <Button
                onClick={handleSendBroadcast}
                disabled={loading || selectedUsers.length === 0 || !subject || !message}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-6 text-lg"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>Send to {selectedUsers.length} Recipients</span>
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EmailBroadcast;

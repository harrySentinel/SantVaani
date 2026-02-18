import { useState, useEffect } from 'react';
import { Send, Users, Mail, Sparkles, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

const EmailBroadcast = () => {
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

  // Fetch all users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

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

  const getSelectedRecipients = () => {
    return users
      .filter(u => selectedUsers.includes(u.id))
      .map(u => ({ email: u.email, name: u.name }));
  };

  const generateEmailHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; font-size: 16px; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.7;">

  <p>Namaste {{name}},</p>

  ${message.split('\n').filter(line => line.trim()).map(line => `<p>${line}</p>`).join('\n  ')}

  <p style="margin-top: 24px;">🙏 Aditya<br>SantVaani Digital Ashram<br><a href="https://santvaani.com" style="color: #ea580c;">santvaani.com</a></p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #999;">You are receiving this because you are part of the SantVaani community.</p>

</body>
</html>`.trim();
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

      const recipients = getSelectedRecipients();
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
          adminEmail: 'santvaani.digitalashram@gmail.com'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Mail className="w-8 h-8 text-orange-500" />
          Email Broadcast Center
        </h1>
        <p className="text-gray-600 mt-1">
          Send beautiful emails to your Santvaani community
        </p>
      </div>

      {/* Status Messages */}
      {status.type && (
        <div className={`p-4 rounded-lg flex items-center space-x-3 ${
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  <div className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Loading users...</p>
                  </div>
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
                  <Loader2 className="w-5 h-5 animate-spin" />
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
  );
};

export default EmailBroadcast;

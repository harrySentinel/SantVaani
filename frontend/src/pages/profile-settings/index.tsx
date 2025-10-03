import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Loader2, ArrowLeft, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  getUserProfile,
  updateUserProfile,
  checkUsernameAvailability,
  createUserProfile
} from '@/services/userProfileService';

const ProfileSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    bio: '',
    avatarUrl: ''
  });

  const [originalUsername, setOriginalUsername] = useState('');

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const result = await getUserProfile(user.id);

        if (result.success && result.profile) {
          setHasProfile(true);
          setFormData({
            username: result.profile.username || '',
            fullName: result.profile.full_name || '',
            bio: result.profile.bio || '',
            avatarUrl: result.profile.avatar_url || ''
          });
          setOriginalUsername(result.profile.username || '');
        } else {
          // No profile exists - set default values from user metadata
          setHasProfile(false);
          setFormData({
            username: '',
            fullName: user.user_metadata?.name || user.email?.split('@')[0] || '',
            bio: '',
            avatarUrl: ''
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // Check username availability
  const checkUsername = async (username: string) => {
    if (username === originalUsername) {
      setUsernameAvailable(true);
      return;
    }

    if (username.length < 3) {
      setUsernameAvailable(false);
      return;
    }

    setCheckingUsername(true);
    const result = await checkUsernameAvailability(username, user?.id);
    setUsernameAvailable(result.available);
    setCheckingUsername(false);
  };

  // Handle username change
  const handleUsernameChange = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setFormData(prev => ({ ...prev, username: cleaned }));

    if (cleaned.length >= 3) {
      const debounce = setTimeout(() => {
        checkUsername(cleaned);
      }, 500);
      return () => clearTimeout(debounce);
    } else {
      setUsernameAvailable(null);
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!user) return;

    // Validation
    if (!formData.username || formData.username.length < 3) {
      toast({
        title: "⚠️ Invalid Username",
        description: "Username must be at least 3 characters",
        duration: 3000,
      });
      return;
    }

    if (!/^[a-z0-9_]+$/.test(formData.username)) {
      toast({
        title: "⚠️ Invalid Username",
        description: "Username can only contain lowercase letters, numbers, and underscores",
        duration: 3000,
      });
      return;
    }

    if (usernameAvailable === false) {
      toast({
        title: "⚠️ Username Taken",
        description: "This username is already taken. Please choose another.",
        duration: 3000,
      });
      return;
    }

    if (!formData.fullName) {
      toast({
        title: "⚠️ Missing Name",
        description: "Please enter your full name",
        duration: 3000,
      });
      return;
    }

    setIsSaving(true);

    try {
      let result;

      if (hasProfile) {
        // Update existing profile
        result = await updateUserProfile(user.id, {
          username: formData.username,
          full_name: formData.fullName,
          bio: formData.bio,
          avatar_url: formData.avatarUrl || undefined
        });
      } else {
        // Create new profile
        result = await createUserProfile(
          user.id,
          formData.username,
          formData.fullName
        );

        if (result.success && formData.bio) {
          // Update with bio if provided
          await updateUserProfile(user.id, { bio: formData.bio });
        }
      }

      if (result.success) {
        toast({
          title: "✅ Profile Updated",
          description: "Your profile has been saved successfully!",
          duration: 3000,
        });
        setHasProfile(true);
        setOriginalUsername(formData.username);
      } else {
        throw new Error(result.error || 'Failed to save profile');
      }
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: "❌ Save Failed",
        description: error.message || "Failed to save profile. Please try again.",
        duration: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <p className="text-gray-600">Please log in to access profile settings</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-24">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your profile information</p>
        </div>

        {isLoading ? (
          <Card className="shadow-xl">
            <CardContent className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-600" />
              <p className="text-gray-600 mt-4">Loading profile...</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-orange-600" />
                <span>Edit Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="pl-10 bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-medium">Username *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a unique username"
                    value={formData.username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className="pl-10 pr-10 border-gray-200 focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                  />
                  {checkingUsername ? (
                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
                  ) : usernameAvailable === true && formData.username.length >= 3 ? (
                    <Check className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                  ) : usernameAvailable === false ? (
                    <X className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                  ) : null}
                </div>
                <p className="text-xs text-gray-500">
                  Lowercase letters, numbers, and underscores only
                </p>
                {usernameAvailable === false && (
                  <p className="text-xs text-red-500">This username is already taken</p>
                )}
                {usernameAvailable === true && formData.username !== originalUsername && (
                  <p className="text-xs text-green-500">This username is available!</p>
                )}
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="border-gray-200 focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-700 font-medium">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="border-gray-200 focus:ring-2 focus:ring-orange-300 focus:border-orange-400 min-h-24"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500">{formData.bio.length}/500 characters</p>
              </div>

              {/* Save Button */}
              <div className="flex space-x-4 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isSaving || usernameAvailable === false}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  disabled={isSaving}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProfileSettings;

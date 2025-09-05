"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Shield, Globe, Bell, FileText, User, Info, Settings, Eye, EyeOff, Upload, Download, TestTube, AlertTriangle, Phone, Mail, MapPin, Clock, Languages, Fingerprint, Lock, VolumeX, Volume2, Vibrate, Moon, Sun, HelpCircle, FileCheck, Trash, CheckCircle, XCircle, Camera, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  verified: boolean;
  priority: number;
}

interface Document {
  id: string;
  name: string;
  type: 'passport' | 'visa' | 'id' | 'insurance' | 'other';
  uploadDate: string;
  size: string;
  encrypted: boolean;
}

interface SettingsData {
  emergencyContacts: EmergencyContact[];
  privacy: {
    shareLocation: boolean;
    dataEncryption: boolean;
    biometricAuth: boolean;
    anonymousMode: boolean;
  };
  notifications: {
    emergencyAlerts: boolean;
    safetyUpdates: boolean;
    locationReminders: boolean;
    communityAlerts: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    quietHours: { enabled: boolean; start: string; end: string; };
  };
  language: {
    interface: string;
    region: string;
    timezone: string;
    autoDetect: boolean;
  };
  safety: {
    emergencyMode: 'panic' | 'silent' | 'voice';
    voiceActivation: boolean;
    testMode: boolean;
    responseDelay: number;
  };
  account: {
    name: string;
    email: string;
    phone: string;
    travelProfile: string;
  };
}

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' }
];

const RELATIONSHIPS = ['Family', 'Friend', 'Colleague', 'Spouse', 'Parent', 'Sibling', 'Other'];

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('emergency');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', relationship: 'Family' });
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [testInProgress, setTestInProgress] = useState(false);

  const [settings, setSettings] = useState<SettingsData>({
    emergencyContacts: [
      {
        id: '1',
        name: 'Priya Sharma',
        phone: '+91 98765 43210',
        email: 'priya.sharma@email.com',
        relationship: 'Family',
        verified: true,
        priority: 1
      },
      {
        id: '2',
        name: 'Raj Patel',
        phone: '+91 87654 32109',
        email: 'raj.patel@email.com',
        relationship: 'Friend',
        verified: true,
        priority: 2
      },
      {
        id: '3',
        name: 'Anita Kumar',
        phone: '+91 76543 21098',
        relationship: 'Colleague',
        verified: false,
        priority: 3
      }
    ],
    privacy: {
      shareLocation: true,
      dataEncryption: true,
      biometricAuth: false,
      anonymousMode: false
    },
    notifications: {
      emergencyAlerts: true,
      safetyUpdates: true,
      locationReminders: true,
      communityAlerts: true,
      soundEnabled: true,
      vibrationEnabled: true,
      quietHours: { enabled: false, start: '22:00', end: '07:00' }
    },
    language: {
      interface: 'en',
      region: 'IN',
      timezone: 'Asia/Kolkata',
      autoDetect: true
    },
    safety: {
      emergencyMode: 'panic',
      voiceActivation: false,
      testMode: false,
      responseDelay: 5
    },
    account: {
      name: 'Arjun Mehta',
      email: 'arjun.mehta@email.com',
      phone: '+91 99887 76655',
      travelProfile: 'Business Traveler'
    }
  });

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Passport - Arjun Mehta',
      type: 'passport',
      uploadDate: '2024-01-15',
      size: '2.4 MB',
      encrypted: true
    },
    {
      id: '2',
      name: 'Tourist Visa - Thailand',
      type: 'visa',
      uploadDate: '2024-01-18',
      size: '1.8 MB',
      encrypted: true
    },
    {
      id: '3',
      name: 'Travel Insurance',
      type: 'insurance',
      uploadDate: '2024-01-20',
      size: '1.2 MB',
      encrypted: true
    }
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const updateSettings = (section: keyof SettingsData, updates: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
    toast.success('Settings updated successfully');
  };

  const addEmergencyContact = () => {
    if (!contactForm.name || !contactForm.phone) {
      toast.error('Name and phone number are required');
      return;
    }

    if (settings.emergencyContacts.length >= 5) {
      toast.error('Maximum 5 emergency contacts allowed');
      return;
    }

    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: contactForm.name,
      phone: contactForm.phone,
      email: contactForm.email,
      relationship: contactForm.relationship,
      verified: false,
      priority: settings.emergencyContacts.length + 1
    };

    setSettings(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, newContact]
    }));

    setContactForm({ name: '', phone: '', email: '', relationship: 'Family' });
    toast.success('Emergency contact added successfully');
  };

  const removeEmergencyContact = (id: string) => {
    setSettings(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter(contact => contact.id !== id)
    }));
    toast.success('Emergency contact removed');
  };

  const verifyContact = (id: string) => {
    setSettings(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map(contact =>
        contact.id === id ? { ...contact, verified: true } : contact
      )
    }));
    toast.success('Contact verification sent');
  };

  const runEmergencyTest = async () => {
    setTestInProgress(true);
    toast.info('Starting emergency test...');
    
    // Simulate test process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setTestInProgress(false);
    toast.success('Emergency test completed successfully');
  };

  const handleDocumentUpload = (type: string) => {
    setUploadingDoc(true);
    // Simulate upload
    setTimeout(() => {
      const newDoc: Document = {
        id: Date.now().toString(),
        name: `${type} Document`,
        type: type as Document['type'],
        uploadDate: new Date().toISOString().split('T')[0],
        size: '1.5 MB',
        encrypted: true
      };
      setDocuments(prev => [...prev, newDoc]);
      setUploadingDoc(false);
      toast.success('Document uploaded successfully');
    }, 2000);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'guardian-angel-settings.json';
    link.click();
    toast.success('Settings exported successfully');
  };

  const deleteAccount = () => {
    toast.info('Account deletion initiated. You will receive a confirmation email.');
    setShowDeleteDialog(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-heading font-bold">Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your Guardian Angel preferences</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportSettings}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:grid-cols-7">
            <TabsTrigger value="emergency" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden lg:inline">Emergency</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden lg:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden lg:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span className="hidden lg:inline">Language</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden lg:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden lg:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden lg:inline">About</span>
            </TabsTrigger>
          </TabsList>

          {/* Emergency Contacts & Safety */}
          <TabsContent value="emergency" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Emergency Contacts
                </CardTitle>
                <CardDescription>
                  Add up to 5 emergency contacts who will be notified during emergencies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Contact Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                  <Input
                    placeholder="Full Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Phone Number"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                  <Input
                    placeholder="Email (Optional)"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <Select value={contactForm.relationship} onValueChange={(value) => setContactForm(prev => ({ ...prev, relationship: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RELATIONSHIPS.map(rel => (
                          <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={addEmergencyContact} disabled={settings.emergencyContacts.length >= 5}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Contact List */}
                <div className="space-y-3">
                  {settings.emergencyContacts.map((contact, index) => (
                    <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant={contact.verified ? "default" : "secondary"} className="text-xs">
                            Priority {contact.priority}
                          </Badge>
                          <h4 className="font-medium">{contact.name}</h4>
                          {contact.verified ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                        <div className="mt-1 space-y-1">
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {contact.phone}
                          </p>
                          {contact.email && (
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </p>
                          )}
                          <Badge variant="outline" className="text-xs">{contact.relationship}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!contact.verified && (
                          <Button size="sm" variant="outline" onClick={() => verifyContact(contact.id)}>
                            Verify
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => setEditingContact(contact)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => removeEmergencyContact(contact.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Safety Preferences
                </CardTitle>
                <CardDescription>
                  Configure emergency response settings and test functionality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Emergency Mode</Label>
                      <Select 
                        value={settings.safety.emergencyMode} 
                        onValueChange={(value: any) => updateSettings('safety', { emergencyMode: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="panic">Panic Mode (Loud Alert)</SelectItem>
                          <SelectItem value="silent">Silent Mode (Discrete)</SelectItem>
                          <SelectItem value="voice">Voice Activated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Response Delay (seconds)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="30"
                        value={settings.safety.responseDelay}
                        onChange={(e) => updateSettings('safety', { responseDelay: parseInt(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Time before emergency contacts are notified
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Voice Activation</Label>
                        <p className="text-sm text-muted-foreground">Enable "Help me" voice trigger</p>
                      </div>
                      <Switch
                        checked={settings.safety.voiceActivation}
                        onCheckedChange={(checked) => updateSettings('safety', { voiceActivation: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Test Mode</Label>
                        <p className="text-sm text-muted-foreground">Enable practice emergency triggers</p>
                      </div>
                      <Switch
                        checked={settings.safety.testMode}
                        onCheckedChange={(checked) => updateSettings('safety', { testMode: checked })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3">
                    <TestTube className="h-6 w-6 text-orange-600" />
                    <div>
                      <h4 className="font-medium text-orange-900">Emergency System Test</h4>
                      <p className="text-sm text-orange-700">Test your emergency contacts and response time</p>
                    </div>
                  </div>
                  <Button 
                    onClick={runEmergencyTest} 
                    disabled={testInProgress}
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    {testInProgress ? 'Testing...' : 'Run Test'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy & Security */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>
                  Control your data sharing and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Share Location</Label>
                        <p className="text-sm text-muted-foreground">Allow emergency contacts to see your location</p>
                      </div>
                      <Switch
                        checked={settings.privacy.shareLocation}
                        onCheckedChange={(checked) => updateSettings('privacy', { shareLocation: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Data Encryption</Label>
                        <p className="text-sm text-muted-foreground">Encrypt stored documents and data</p>
                      </div>
                      <Switch
                        checked={settings.privacy.dataEncryption}
                        onCheckedChange={(checked) => updateSettings('privacy', { dataEncryption: checked })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Biometric Authentication</Label>
                        <p className="text-sm text-muted-foreground">Use fingerprint or face ID to access app</p>
                      </div>
                      <Switch
                        checked={settings.privacy.biometricAuth}
                        onCheckedChange={(checked) => updateSettings('privacy', { biometricAuth: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Anonymous Mode</Label>
                        <p className="text-sm text-muted-foreground">Share safety data without personal identifiers</p>
                      </div>
                      <Switch
                        checked={settings.privacy.anonymousMode}
                        onCheckedChange={(checked) => updateSettings('privacy', { anonymousMode: checked })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Data Visibility
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <h5 className="font-medium text-green-900">Always Shared</h5>
                      <ul className="mt-2 space-y-1 text-green-700">
                        <li>• Emergency location</li>
                        <li>• Safety status</li>
                        <li>• Contact preferences</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h5 className="font-medium text-yellow-900">Conditionally Shared</h5>
                      <ul className="mt-2 space-y-1 text-yellow-700">
                        <li>• Travel itinerary</li>
                        <li>• Real-time location</li>
                        <li>• Device information</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <h5 className="font-medium text-red-900">Never Shared</h5>
                      <ul className="mt-2 space-y-1 text-red-700">
                        <li>• Personal documents</li>
                        <li>• Biometric data</li>
                        <li>• App usage patterns</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Control when and how you receive alerts and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Alert Types</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Emergency Alerts</Label>
                          <p className="text-sm text-muted-foreground">Critical safety notifications</p>
                        </div>
                        <Switch
                          checked={settings.notifications.emergencyAlerts}
                          onCheckedChange={(checked) => updateSettings('notifications', { emergencyAlerts: checked })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Safety Updates</Label>
                          <p className="text-sm text-muted-foreground">Area safety and travel advisories</p>
                        </div>
                        <Switch
                          checked={settings.notifications.safetyUpdates}
                          onCheckedChange={(checked) => updateSettings('notifications', { safetyUpdates: checked })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Location Reminders</Label>
                          <p className="text-sm text-muted-foreground">Check-in and location sharing reminders</p>
                        </div>
                        <Switch
                          checked={settings.notifications.locationReminders}
                          onCheckedChange={(checked) => updateSettings('notifications', { locationReminders: checked })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Community Alerts</Label>
                          <p className="text-sm text-muted-foreground">Safety reports from other users</p>
                        </div>
                        <Switch
                          checked={settings.notifications.communityAlerts}
                          onCheckedChange={(checked) => updateSettings('notifications', { communityAlerts: checked })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Delivery Options</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-4 w-4" />
                          <Label>Sound Alerts</Label>
                        </div>
                        <Switch
                          checked={settings.notifications.soundEnabled}
                          onCheckedChange={(checked) => updateSettings('notifications', { soundEnabled: checked })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Vibrate className="h-4 w-4" />
                          <Label>Vibration</Label>
                        </div>
                        <Switch
                          checked={settings.notifications.vibrationEnabled}
                          onCheckedChange={(checked) => updateSettings('notifications', { vibrationEnabled: checked })}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          <Label>Quiet Hours</Label>
                        </div>
                        <Switch
                          checked={settings.notifications.quietHours.enabled}
                          onCheckedChange={(checked) => updateSettings('notifications', { 
                            quietHours: { ...settings.notifications.quietHours, enabled: checked }
                          })}
                        />
                      </div>
                      
                      {settings.notifications.quietHours.enabled && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-sm">Start Time</Label>
                            <Input
                              type="time"
                              value={settings.notifications.quietHours.start}
                              onChange={(e) => updateSettings('notifications', {
                                quietHours: { ...settings.notifications.quietHours, start: e.target.value }
                              })}
                            />
                          </div>
                          <div>
                            <Label className="text-sm">End Time</Label>
                            <Input
                              type="time"
                              value={settings.notifications.quietHours.end}
                              onChange={(e) => updateSettings('notifications', {
                                quietHours: { ...settings.notifications.quietHours, end: e.target.value }
                              })}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Language & Regional */}
          <TabsContent value="language" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  Language & Regional Settings
                </CardTitle>
                <CardDescription>
                  Customize your language preferences and regional settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Interface Language</Label>
                      <Select 
                        value={settings.language.interface} 
                        onValueChange={(value) => updateSettings('language', { interface: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.map(lang => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name} ({lang.native})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Region</Label>
                      <Select 
                        value={settings.language.region} 
                        onValueChange={(value) => updateSettings('language', { region: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IN">India</SelectItem>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Time Zone</Label>
                      <Select 
                        value={settings.language.timezone} 
                        onValueChange={(value) => updateSettings('language', { timezone: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                          <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                          <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                          <SelectItem value="Australia/Sydney">Australia/Sydney (AEST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-detect Language</Label>
                        <p className="text-sm text-muted-foreground">Use device language settings</p>
                      </div>
                      <Switch
                        checked={settings.language.autoDetect}
                        onCheckedChange={(checked) => updateSettings('language', { autoDetect: checked })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Language Support Status</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {LANGUAGES.map(lang => (
                      <div key={lang.code} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{lang.name}</p>
                          <p className="text-sm text-muted-foreground">{lang.native}</p>
                        </div>
                        <Badge variant={lang.code === 'en' ? 'default' : 'secondary'}>
                          {lang.code === 'en' ? 'Full' : 'Basic'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Document Vault */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Vault
                </CardTitle>
                <CardDescription>
                  Securely store and manage your important travel documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { type: 'passport', label: 'Passport', icon: FileText },
                    { type: 'visa', label: 'Visa', icon: FileText },
                    { type: 'id', label: 'ID Card', icon: FileText },
                    { type: 'insurance', label: 'Insurance', icon: FileText }
                  ].map(({ type, label, icon: Icon }) => (
                    <Button
                      key={type}
                      variant="outline"
                      className="h-24 flex-col gap-2"
                      onClick={() => handleDocumentUpload(type)}
                      disabled={uploadingDoc}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-sm">Add {label}</span>
                    </Button>
                  ))}
                </div>

                {uploadingDoc && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Uploading document...</span>
                    </div>
                    <Progress value={75} className="w-full" />
                  </div>
                )}

                {/* Document List */}
                <div className="space-y-3">
                  <h4 className="font-medium">Stored Documents</h4>
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded">
                          <FileCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h5 className="font-medium">{doc.name}</h5>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {doc.uploadDate}
                            </span>
                            <span>{doc.size}</span>
                            {doc.encrypted && (
                              <Badge variant="secondary" className="text-xs">
                                <Lock className="h-3 w-3 mr-1" />
                                Encrypted
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Security Features</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>End-to-end encryption</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Biometric access control</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Automatic backup</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Version history</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Storage Usage</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Used</span>
                        <span>5.4 MB of 100 MB</span>
                      </div>
                      <Progress value={5.4} className="w-full" />
                      <p className="text-xs text-muted-foreground">
                        94.6 MB remaining
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account & Profile
                </CardTitle>
                <CardDescription>
                  Manage your personal information and account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={settings.account.name}
                        onChange={(e) => updateSettings('account', { name: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={settings.account.email}
                        onChange={(e) => updateSettings('account', { email: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        value={settings.account.phone}
                        onChange={(e) => updateSettings('account', { phone: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Travel Profile</Label>
                      <Select 
                        value={settings.account.travelProfile} 
                        onValueChange={(value) => updateSettings('account', { travelProfile: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Business Traveler">Business Traveler</SelectItem>
                          <SelectItem value="Leisure Tourist">Leisure Tourist</SelectItem>
                          <SelectItem value="Adventure Traveler">Adventure Traveler</SelectItem>
                          <SelectItem value="Solo Traveler">Solo Traveler</SelectItem>
                          <SelectItem value="Family Traveler">Family Traveler</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Data Management</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" onClick={exportSettings}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Settings
                    </Button>
                    <Button variant="outline">
                      <Trash className="h-4 w-4 mr-2" />
                      Clear Cache
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <h4 className="font-medium text-red-900">Danger Zone</h4>
                      <p className="text-sm text-red-700">These actions cannot be undone</p>
                    </div>
                    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Account</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove all your data from our servers including emergency contacts,
                            documents, and settings.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={deleteAccount} className="bg-red-600 hover:bg-red-700">
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  About Guardian Angel
                </CardTitle>
                <CardDescription>
                  App information, help resources, and legal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>App Version</Label>
                      <p className="text-lg font-mono">2.1.4</p>
                      <p className="text-sm text-muted-foreground">Released: January 25, 2024</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Last Updated</Label>
                      <p className="text-sm text-muted-foreground">Settings: Today, 2:30 PM</p>
                      <p className="text-sm text-muted-foreground">Safety Data: Today, 1:15 PM</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Support</Label>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <HelpCircle className="h-4 w-4 mr-2" />
                          Help Center
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Mail className="h-4 w-4 mr-2" />
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>System Status</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Emergency Services</span>
                          <Badge variant="default" className="bg-green-600">Online</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Location Services</span>
                          <Badge variant="default" className="bg-green-600">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Backup Sync</span>
                          <Badge variant="secondary">Synced</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Permissions</Label>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Location Access</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Camera Access</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Microphone Access</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Push Notifications</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Legal & Compliance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Button variant="outline" size="sm">Privacy Policy</Button>
                    <Button variant="outline" size="sm">Terms of Service</Button>
                    <Button variant="outline" size="sm">Data Processing</Button>
                    <Button variant="outline" size="sm">Open Source</Button>
                  </div>
                </div>

                <Separator />

                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-heading font-bold">Guardian Angel</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your safety companion for worry-free travel
                  </p>
                  <p className="text-xs text-muted-foreground">
                    © 2024 Guardian Angel. Made with ❤️ for travelers worldwide.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
"use client";

import { useState, useCallback, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Phone, Lock, Vault, Hospital, FileKey2, KeySquare, Component, LifeBuoy } from "lucide-react";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  verified: boolean;
  priority: number;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: Date;
  encrypted: boolean;
  size: number;
}

interface PrivacySettings {
  locationSharing: boolean;
  backgroundTracking: boolean;
  voiceActivation: boolean;
  pinForCancel: boolean;
}

interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
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

export default function SettingsAndDocs() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    locationSharing: false,
    backgroundTracking: false,
    voiceActivation: false,
    pinForCancel: true
  });
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    largeText: false,
    highContrast: false
  });
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isTestModeActive, setIsTestModeActive] = useState(false);
  const [consentDialog, setConsentDialog] = useState<{ open: boolean; setting: string; title: string; description: string }>({
    open: false,
    setting: '',
    title: '',
    description: ''
  });
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedContacts = localStorage.getItem('guardian-emergency-contacts');
      if (savedContacts) {
        setContacts(JSON.parse(savedContacts));
      }

      const savedDocuments = localStorage.getItem('guardian-documents');
      if (savedDocuments) {
        setDocuments(JSON.parse(savedDocuments));
      }

      const savedPrivacy = localStorage.getItem('guardian-privacy-settings');
      if (savedPrivacy) {
        setPrivacySettings(JSON.parse(savedPrivacy));
      }

      const savedLanguage = localStorage.getItem('guardian-language');
      if (savedLanguage) {
        setSelectedLanguage(savedLanguage);
      }

      const savedAccessibility = localStorage.getItem('guardian-accessibility');
      if (savedAccessibility) {
        setAccessibilitySettings(JSON.parse(savedAccessibility));
      }
    }
  }, []);

  // Save to localStorage when data changes
  const saveContacts = useCallback((newContacts: EmergencyContact[]) => {
    setContacts(newContacts);
    if (typeof window !== "undefined") {
      localStorage.setItem('guardian-emergency-contacts', JSON.stringify(newContacts));
    }
  }, []);

  const savePrivacySettings = useCallback((newSettings: PrivacySettings) => {
    setPrivacySettings(newSettings);
    if (typeof window !== "undefined") {
      localStorage.setItem('guardian-privacy-settings', JSON.stringify(newSettings));
    }
  }, []);

  const addContact = useCallback(() => {
    if (!newContact.name || !newContact.phone) {
      toast.error("Name and phone number are required");
      return;
    }

    if (contacts.length >= 5) {
      toast.error("Maximum 5 emergency contacts allowed");
      return;
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      name: newContact.name,
      phone: newContact.phone,
      relationship: newContact.relationship || 'Other',
      verified: false,
      priority: contacts.length + 1
    };

    saveContacts([...contacts, contact]);
    setNewContact({ name: '', phone: '', relationship: '' });
    setIsAddContactOpen(false);
    toast.success("Emergency contact added");
  }, [contacts, newContact, saveContacts]);

  const verifyContact = useCallback((contactId: string) => {
    const updatedContacts = contacts.map(contact =>
      contact.id === contactId ? { ...contact, verified: true } : contact
    );
    saveContacts(updatedContacts);
    toast.success("Test message sent - contact verification pending");
  }, [contacts, saveContacts]);

  const removeContact = useCallback((contactId: string) => {
    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    saveContacts(updatedContacts);
    toast.success("Emergency contact removed");
  }, [contacts, saveContacts]);

  const handlePrivacyToggle = useCallback((setting: keyof PrivacySettings, value: boolean) => {
    if (value && (setting === 'backgroundTracking' || setting === 'voiceActivation')) {
      const consentInfo = {
        backgroundTracking: {
          title: 'Enable Background Tracking?',
          description: 'This allows Guardian Angel to track your location even when the app is closed. This data is encrypted and only used for emergency services. You can disable this at any time.'
        },
        voiceActivation: {
          title: 'Enable Voice Activation?',
          description: 'This allows Guardian Angel to listen for emergency keywords. Voice data is processed locally and never transmitted unless you trigger an emergency. You can disable this at any time.'
        }
      };

      setConsentDialog({
        open: true,
        setting,
        title: consentInfo[setting].title,
        description: consentInfo[setting].description
      });
    } else {
      const newSettings = { ...privacySettings, [setting]: value };
      savePrivacySettings(newSettings);
      toast.success(`${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`);
    }
  }, [privacySettings, savePrivacySettings]);

  const confirmConsentToggle = useCallback(() => {
    const newSettings = { ...privacySettings, [consentDialog.setting]: true };
    savePrivacySettings(newSettings);
    setConsentDialog({ open: false, setting: '', title: '', description: '' });
    toast.success(`${consentDialog.setting.replace(/([A-Z])/g, ' $1').toLowerCase()} enabled`);
  }, [privacySettings, consentDialog.setting, savePrivacySettings]);

  const handleLanguageChange = useCallback((languageCode: string) => {
    setSelectedLanguage(languageCode);
    if (typeof window !== "undefined") {
      localStorage.setItem('guardian-language', languageCode);
    }
    const language = LANGUAGES.find(lang => lang.code === languageCode);
    toast.success(`Language changed to ${language?.name}`);
  }, []);

  const handleAccessibilityToggle = useCallback((setting: keyof AccessibilitySettings, value: boolean) => {
    const newSettings = { ...accessibilitySettings, [setting]: value };
    setAccessibilitySettings(newSettings);
    if (typeof window !== "undefined") {
      localStorage.setItem('guardian-accessibility', JSON.stringify(newSettings));
    }
    toast.success(`${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`);
  }, [accessibilitySettings]);

  const startEmergencySimulation = useCallback(() => {
    setIsTestModeActive(true);
    toast.info("Emergency simulation started - no real alerts will be sent");
    
    // Simulate emergency flow
    setTimeout(() => {
      toast.info("Simulation: Emergency detected");
    }, 1000);
    
    setTimeout(() => {
      toast.info("Simulation: Contacting emergency contacts");
    }, 2000);
    
    setTimeout(() => {
      toast.info("Simulation: Location shared with authorities");
    }, 3000);
    
    setTimeout(() => {
      toast.success("Emergency simulation completed successfully");
      setIsTestModeActive(false);
    }, 5000);
  }, []);

  const generateEmergencyToken = useCallback(() => {
    const token = Math.random().toString(36).substring(2, 15);
    navigator.clipboard.writeText(`GUARDIAN-${token}`);
    toast.success("Emergency access token copied to clipboard");
  }, []);

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <KeySquare className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-heading font-semibold">Settings & Documents</h2>
            <p className="text-sm text-muted-foreground">Manage your safety preferences and emergency information</p>
          </div>
        </div>

        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="contacts" className="text-xs">Contacts</TabsTrigger>
            <TabsTrigger value="documents" className="text-xs">Documents</TabsTrigger>
            <TabsTrigger value="privacy" className="text-xs">Privacy</TabsTrigger>
            <TabsTrigger value="language" className="text-xs">Language</TabsTrigger>
            <TabsTrigger value="test" className="text-xs">Test Mode</TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Emergency Contacts</h3>
                <p className="text-sm text-muted-foreground">Add up to 5 emergency contacts</p>
              </div>
              <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
                <DialogTrigger asChild>
                  <Button>Add Contact</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Emergency Contact</DialogTitle>
                    <DialogDescription>Add a trusted contact who will be notified during emergencies</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        placeholder="Contact name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <Label htmlFor="relationship">Relationship</Label>
                      <Select value={newContact.relationship} onValueChange={(value) => setNewContact({ ...newContact, relationship: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="family">Family</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="colleague">Colleague</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={addContact} className="flex-1">Add Contact</Button>
                      <Button variant="outline" onClick={() => setIsAddContactOpen(false)}>Cancel</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <ScrollArea className="h-64">
              <div className="space-y-3">
                {contacts.length === 0 ? (
                  <Card className="p-6 text-center">
                    <Phone className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No emergency contacts added yet</p>
                  </Card>
                ) : (
                  contacts.map((contact) => (
                    <Card key={contact.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-muted-foreground">{contact.phone}</p>
                            <Badge variant="secondary" className="text-xs">{contact.relationship}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {contact.verified ? (
                            <Badge variant="default" className="text-xs">Verified</Badge>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => verifyContact(contact.id)}>
                              Verify
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => removeContact(contact.id)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Document Vault</h3>
              <p className="text-sm text-muted-foreground">Securely store important documents with encryption</p>
            </div>

            <Card className="p-6 border-2 border-dashed">
              <div className="text-center">
                <Vault className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium mb-2">Upload Important Documents</p>
                <p className="text-xs text-muted-foreground mb-4">Passport, Visa, Medical Records, ID Cards</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  id="document-upload"
                  onChange={(e) => {
                    if (e.target.files) {
                      toast.success(`${e.target.files.length} document(s) uploaded and encrypted`);
                    }
                  }}
                />
                <Label htmlFor="document-upload" className="cursor-pointer">
                  <Button variant="outline">Choose Files</Button>
                </Label>
              </div>
            </Card>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Stored Documents</h4>
                <Button size="sm" variant="outline" onClick={generateEmergencyToken}>
                  Generate Emergency Token
                </Button>
              </div>
              
              {documents.length === 0 ? (
                <Card className="p-4 text-center">
                  <FileKey2 className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No documents stored yet</p>
                </Card>
              ) : (
                documents.map((doc) => (
                  <Card key={doc.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileKey2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.type} • {Math.round(doc.size / 1024)}KB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.encrypted && <Lock className="h-3 w-3 text-green-600" />}
                        <Badge variant="outline" className="text-xs">Encrypted</Badge>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Privacy & Permissions</h3>
              <p className="text-sm text-muted-foreground">Control how Guardian Angel accesses your device and data</p>
            </div>

            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Location Sharing</p>
                    <p className="text-sm text-muted-foreground">Share location with emergency contacts during alerts</p>
                  </div>
                  <Switch
                    checked={privacySettings.locationSharing}
                    onCheckedChange={(checked) => handlePrivacyToggle('locationSharing', checked)}
                  />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Background Tracking</p>
                    <p className="text-sm text-muted-foreground">Allow location tracking when app is closed</p>
                  </div>
                  <Switch
                    checked={privacySettings.backgroundTracking}
                    onCheckedChange={(checked) => handlePrivacyToggle('backgroundTracking', checked)}
                  />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Voice Activation</p>
                    <p className="text-sm text-muted-foreground">Listen for emergency keywords</p>
                  </div>
                  <Switch
                    checked={privacySettings.voiceActivation}
                    onCheckedChange={(checked) => handlePrivacyToggle('voiceActivation', checked)}
                  />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">PIN for Cancel</p>
                    <p className="text-sm text-muted-foreground">Require PIN to cancel emergency alerts</p>
                  </div>
                  <Switch
                    checked={privacySettings.pinForCancel}
                    onCheckedChange={(checked) => handlePrivacyToggle('pinForCancel', checked)}
                  />
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="language" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Language & Accessibility</h3>
              <p className="text-sm text-muted-foreground">Choose your preferred language and accessibility options</p>
            </div>

            <Card className="p-4">
              <div className="space-y-3">
                <Label htmlFor="language-select">Interface Language</Label>
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger id="language-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((language) => (
                      <SelectItem key={language.code} value={language.code}>
                        {language.name} ({language.native})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>

            <div className="space-y-3">
              <h4 className="font-medium">Accessibility Options</h4>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Large Text</p>
                    <p className="text-sm text-muted-foreground">Increase text size for better readability</p>
                  </div>
                  <Switch
                    checked={accessibilitySettings.largeText}
                    onCheckedChange={(checked) => handleAccessibilityToggle('largeText', checked)}
                  />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">High Contrast</p>
                    <p className="text-sm text-muted-foreground">Improve visibility with higher contrast colors</p>
                  </div>
                  <Switch
                    checked={accessibilitySettings.highContrast}
                    onCheckedChange={(checked) => handleAccessibilityToggle('highContrast', checked)}
                  />
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Test Mode & Diagnostics</h3>
              <p className="text-sm text-muted-foreground">Test emergency flows and run system diagnostics</p>
            </div>

            <Card className="p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Emergency Simulation</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Test the complete emergency flow without sending real alerts
                  </p>
                  <Button 
                    onClick={startEmergencySimulation}
                    disabled={isTestModeActive}
                    className="w-full"
                  >
                    {isTestModeActive ? 'Simulation Running...' : 'Start Emergency Simulation'}
                  </Button>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Setup Wizard</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Complete the onboarding flow and configure essential settings
                  </p>
                  <Dialog open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">Launch Setup Wizard</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Guardian Angel Setup</DialogTitle>
                        <DialogDescription>Let's configure your essential safety settings</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="text-center">
                          <LifeBuoy className="h-12 w-12 text-primary mx-auto mb-4" />
                          <h3 className="font-semibold mb-2">Welcome to Guardian Angel</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            To ensure your safety, please add at least 2 emergency contacts and enable location sharing.
                          </p>
                          <div className="space-y-2 text-left">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${contacts.length >= 2 ? 'bg-green-500' : 'bg-gray-300'}`} />
                              <span className="text-sm">Add emergency contacts ({contacts.length}/2 minimum)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${privacySettings.locationSharing ? 'bg-green-500' : 'bg-gray-300'}`} />
                              <span className="text-sm">Enable location sharing</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={() => setIsOnboardingOpen(false)}
                          className="w-full"
                          disabled={contacts.length < 2 || !privacySettings.locationSharing}
                        >
                          Complete Setup
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">System Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Emergency Contacts:</span>
                      <Badge variant={contacts.length >= 2 ? "default" : "destructive"}>
                        {contacts.length}/5
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Location Services:</span>
                      <Badge variant={privacySettings.locationSharing ? "default" : "destructive"}>
                        {privacySettings.locationSharing ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Documents Stored:</span>
                      <Badge variant="secondary">{documents.length}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={consentDialog.open} onOpenChange={(open) => setConsentDialog({ ...consentDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{consentDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{consentDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmConsentToggle}>Enable</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
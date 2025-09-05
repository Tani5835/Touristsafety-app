'use client';

import React, { useState, useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/ui/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  Shield,
  AlertTriangle,
  Users,
  MapPin,
  MessageSquare,
  Clock,
  Star,
  Phone,
  Navigation2,
  Camera,
  Bell,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Settings,
  Car,
  Heart,
  Home,
  Briefcase,
  ShoppingBag,
  Utensils,
  Coffee,
  Building,
  Plane,
  Map,
  AlertCircle,
  Filter,
  Send,
  RefreshCw,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Languages,
  DollarSign,
  Cloud
} from 'lucide-react';

// Interfaces
interface SafetyAlert {
  id: string;
  type: 'theft' | 'harassment' | 'scam' | 'fraud' | 'emergency' | 'weather';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  reporterCount: number;
  verified: boolean;
}

interface Helper {
  id: string;
  name: string;
  profileImage: string;
  rating: number;
  reviewCount: number;
  languages: string[];
  specialties: string[];
  isAvailable: boolean;
  distance: number;
  responseTime: string;
  verificationLevel: 'basic' | 'verified' | 'premium';
  hourlyRate?: number;
}

interface SafeHaven {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'embassy' | 'tourist_center' | 'hotel' | 'community';
  address: string;
  distance: number;
  isOpen: boolean;
  hours: string;
  phone?: string;
  services: string[];
  userRecommended: boolean;
}

interface IncidentReport {
  id: string;
  category: string;
  severity: string;
  description: string;
  location: string;
  timestamp: Date;
  status: 'pending' | 'reviewing' | 'verified' | 'resolved';
  anonymous: boolean;
}

export default function CommunityPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [safetyScore, setSafetyScore] = useState(75);
  const [activeTab, setActiveTab] = useState('alerts');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [reportForm, setReportForm] = useState({
    category: '',
    severity: '',
    description: '',
    location: '',
    anonymous: true
  });
  const [alertSettings, setAlertSettings] = useState({
    emergencyAlerts: true,
    safetyUpdates: true,
    helperNotifications: true,
    communityTips: false
  });

  // Mock data - in real app would come from API
  const [safetyAlerts] = useState<SafetyAlert[]>([
    {
      id: '1',
      type: 'theft',
      severity: 'high',
      title: 'Multiple pickpocketing reports',
      description: 'Several tourists reported pickpocketing incidents near the main square. Stay alert and keep valuables secure.',
      location: 'Plaza Mayor, 0.2km away',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      reporterCount: 8,
      verified: true
    },
    {
      id: '2',
      type: 'scam',
      severity: 'medium',
      title: 'Fake taxi scam reported',
      description: 'Unlicensed taxis overcharging tourists. Use official taxi apps or verify license plates.',
      location: 'Train Station Area, 0.8km away',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      reporterCount: 3,
      verified: true
    },
    {
      id: '3',
      type: 'weather',
      severity: 'medium',
      title: 'Heavy rain warning',
      description: 'Sudden thunderstorm expected in the next 2 hours. Seek indoor shelter.',
      location: 'City-wide',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      reporterCount: 1,
      verified: true
    }
  ]);

  const [helpers] = useState<Helper[]>([
    {
      id: '1',
      name: 'Maria Rodriguez',
      profileImage: '/api/placeholder/40/40',
      rating: 4.9,
      reviewCount: 127,
      languages: ['English', 'Spanish', 'French'],
      specialties: ['Local Guide', 'Emergency Support', 'Translation'],
      isAvailable: true,
      distance: 0.3,
      responseTime: '< 5 min',
      verificationLevel: 'premium',
      hourlyRate: 25
    },
    {
      id: '2',
      name: 'Ahmed Hassan',
      profileImage: '/api/placeholder/40/40',
      rating: 4.7,
      reviewCount: 89,
      languages: ['English', 'Arabic', 'German'],
      specialties: ['Medical Support', 'Navigation', 'Cultural Guidance'],
      isAvailable: true,
      distance: 0.7,
      responseTime: '< 10 min',
      verificationLevel: 'verified',
      hourlyRate: 20
    },
    {
      id: '3',
      name: 'Sophie Chen',
      profileImage: '/api/placeholder/40/40',
      rating: 4.8,
      reviewCount: 156,
      languages: ['English', 'Mandarin', 'Japanese'],
      specialties: ['Shopping Guide', 'Food Safety', 'Local Transport'],
      isAvailable: false,
      distance: 1.2,
      responseTime: '< 15 min',
      verificationLevel: 'verified',
      hourlyRate: 30
    }
  ]);

  const [safeHavens] = useState<SafeHaven[]>([
    {
      id: '1',
      name: 'Central Police Station',
      type: 'police',
      address: '123 Main Street',
      distance: 0.4,
      isOpen: true,
      hours: '24/7',
      phone: '+1-555-0101',
      services: ['Emergency Response', 'Tourist Police', 'Report Filing'],
      userRecommended: false
    },
    {
      id: '2',
      name: 'City General Hospital',
      type: 'hospital',
      address: '456 Health Avenue',
      distance: 0.8,
      isOpen: true,
      hours: '24/7 Emergency',
      phone: '+1-555-0102',
      services: ['Emergency Care', 'Pharmacy', 'Travel Medicine'],
      userRecommended: true
    },
    {
      id: '3',
      name: 'Tourist Information Center',
      type: 'tourist_center',
      address: '789 Welcome Plaza',
      distance: 0.2,
      isOpen: true,
      hours: '9:00 AM - 6:00 PM',
      phone: '+1-555-0103',
      services: ['Information', 'Maps', 'Emergency Contact'],
      userRecommended: true
    },
    {
      id: '4',
      name: 'Grand Hotel Lobby',
      type: 'hotel',
      address: '321 Luxury Lane',
      distance: 0.6,
      isOpen: true,
      hours: '24/7',
      services: ['Safe Space', 'WiFi', 'Phone Charging'],
      userRecommended: true
    }
  ]);

  const [incidentReports] = useState<IncidentReport[]>([
    {
      id: '1',
      category: 'theft',
      severity: 'high',
      description: 'Wallet stolen from backpack',
      location: 'Metro Station Line 2',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      status: 'verified',
      anonymous: true
    },
    {
      id: '2',
      category: 'harassment',
      severity: 'medium',
      description: 'Aggressive street vendor',
      location: 'Market Square',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      status: 'reviewing',
      anonymous: false
    }
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getSafetyScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'theft': return <ShoppingBag className="w-4 h-4" />;
      case 'harassment': return <Users className="w-4 h-4" />;
      case 'scam': return <AlertTriangle className="w-4 h-4" />;
      case 'emergency': return <AlertCircle className="w-4 h-4" />;
      case 'weather': return <Cloud className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleContactHelper = (helperId: string) => {
    toast.success('Connecting you with helper...');
  };

  const handleGetDirections = (destination: string) => {
    toast.success(`Opening directions to ${destination}`);
  };

  const handleSubmitReport = () => {
    if (!reportForm.category || !reportForm.severity || !reportForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Report submitted successfully. Thank you for keeping the community safe!');
    setReportForm({
      category: '',
      severity: '',
      description: '',
      location: '',
      anonymous: true
    });
  };

  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16 p-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16 p-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-heading font-bold">Community Safety</h1>
            </div>
            <p className="text-muted-foreground">
              Stay informed with real-time safety intelligence from fellow travelers and local community.
            </p>
          </div>

          {/* Safety Score Overview */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Current Area Safety Score</h2>
                  <p className="text-muted-foreground">Based on recent community reports and verified incidents</p>
                </div>
                <div className="text-center">
                  <div className={`w-20 h-20 rounded-full ${getSafetyScoreColor(safetyScore)} flex items-center justify-center text-white text-2xl font-bold mb-2`}>
                    {safetyScore}
                  </div>
                  <Badge variant={safetyScore >= 80 ? 'default' : safetyScore >= 60 ? 'secondary' : 'destructive'}>
                    {safetyScore >= 80 ? 'Safe' : safetyScore >= 60 ? 'Moderate' : 'Caution'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="alerts">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Alerts
              </TabsTrigger>
              <TabsTrigger value="helpers">
                <Users className="w-4 h-4 mr-2" />
                Helpers
              </TabsTrigger>
              <TabsTrigger value="safe-havens">
                <MapPin className="w-4 h-4 mr-2" />
                Safe Places
              </TabsTrigger>
              <TabsTrigger value="report">
                <FileText className="w-4 h-4 mr-2" />
                Report
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Bell className="w-4 h-4 mr-2" />
                Alerts
              </TabsTrigger>
            </TabsList>

            {/* Safety Alerts Tab */}
            <TabsContent value="alerts" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Safety Alerts</h3>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter alerts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Alerts</SelectItem>
                    <SelectItem value="theft">Theft</SelectItem>
                    <SelectItem value="harassment">Harassment</SelectItem>
                    <SelectItem value="scam">Scams</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="weather">Weather</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {safetyAlerts.map((alert) => (
                  <Card key={alert.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                            {getAlertIcon(alert.type)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{alert.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {alert.location}
                              <span>•</span>
                              <Clock className="w-3 h-3" />
                              {timeAgo(alert.timestamp)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={alert.verified ? 'default' : 'secondary'}>
                            {alert.verified ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </>
                            ) : (
                              'Unverified'
                            )}
                          </Badge>
                          <Badge variant="outline">
                            {alert.reporterCount} report{alert.reporterCount !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-foreground mb-4">{alert.description}</p>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          Helpful
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Navigation2 className="w-4 h-4 mr-2" />
                          Avoid Area
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Verified Helpers Tab */}
            <TabsContent value="helpers" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Verified Local Helpers Nearby</h3>
                <p className="text-muted-foreground mb-6">
                  Connect with trusted local guides and safety assistants in your area.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {helpers.map((helper) => (
                  <Card key={helper.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                              <Users className="w-6 h-6 text-muted-foreground" />
                            </div>
                            {helper.isAvailable && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold">{helper.name}</h4>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {helper.rating} ({helper.reviewCount})
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <Badge variant={helper.verificationLevel === 'premium' ? 'default' : 'secondary'}>
                            {helper.verificationLevel}
                          </Badge>
                          {helper.hourlyRate && (
                            <p className="text-sm text-muted-foreground mt-1">
                              <DollarSign className="w-3 h-3 inline" />{helper.hourlyRate}/hr
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Languages</p>
                          <div className="flex flex-wrap gap-1">
                            {helper.languages.map((lang, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-1">Specialties</p>
                          <div className="flex flex-wrap gap-1">
                            {helper.specialties.map((specialty, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{helper.distance}km away</span>
                          <span>Responds in {helper.responseTime}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          className="flex-1" 
                          disabled={!helper.isAvailable}
                          onClick={() => handleContactHelper(helper.id)}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                        <Button variant="outline" size="icon">
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Safe Havens Tab */}
            <TabsContent value="safe-havens" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Safe Haven Locations</h3>
                <p className="text-muted-foreground mb-6">
                  Emergency services, safe locations, and community-recommended places nearby.
                </p>
              </div>

              <div className="space-y-4">
                {safeHavens.map((haven) => {
                  const getHavenIcon = (type: string) => {
                    switch (type) {
                      case 'police': return <Shield className="w-5 h-5" />;
                      case 'hospital': return <Heart className="w-5 h-5" />;
                      case 'embassy': return <Building className="w-5 h-5" />;
                      case 'tourist_center': return <Map className="w-5 h-5" />;
                      case 'hotel': return <Home className="w-5 h-5" />;
                      default: return <MapPin className="w-5 h-5" />;
                    }
                  };

                  return (
                    <Card key={haven.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-lg text-primary">
                              {getHavenIcon(haven.type)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{haven.name}</h4>
                                {haven.userRecommended && (
                                  <Badge variant="secondary">
                                    <ThumbsUp className="w-3 h-3 mr-1" />
                                    Recommended
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{haven.address}</p>
                              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <span>{haven.distance}km away</span>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {haven.hours}
                                </div>
                                <div className="flex items-center gap-1">
                                  {haven.isOpen ? (
                                    <>
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                      Open now
                                    </>
                                  ) : (
                                    <>
                                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                      Closed
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Available Services</p>
                          <div className="flex flex-wrap gap-1">
                            {haven.services.map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            className="flex-1"
                            onClick={() => handleGetDirections(haven.name)}
                          >
                            <Navigation2 className="w-4 h-4 mr-2" />
                            Get Directions
                          </Button>
                          {haven.phone && (
                            <Button variant="outline">
                              <Phone className="w-4 h-4 mr-2" />
                              Call
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Incident Reporting Tab */}
            <TabsContent value="report" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Report Safety Incident</h3>
                <p className="text-muted-foreground mb-6">
                  Help keep the community safe by reporting incidents. All reports are anonymous by default.
                </p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="category">Incident Category *</Label>
                        <Select value={reportForm.category} onValueChange={(value) => setReportForm(prev => ({...prev, category: value}))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="theft">Theft / Pickpocketing</SelectItem>
                            <SelectItem value="harassment">Harassment</SelectItem>
                            <SelectItem value="scam">Scam / Fraud</SelectItem>
                            <SelectItem value="assault">Assault</SelectItem>
                            <SelectItem value="discrimination">Discrimination</SelectItem>
                            <SelectItem value="unsafe_conditions">Unsafe Conditions</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="severity">Severity Level *</Label>
                        <Select value={reportForm.severity} onValueChange={(value) => setReportForm(prev => ({...prev, severity: value}))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low - Minor inconvenience</SelectItem>
                            <SelectItem value="medium">Medium - Safety concern</SelectItem>
                            <SelectItem value="high">High - Serious incident</SelectItem>
                            <SelectItem value="critical">Critical - Emergency</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="location">Location (Optional)</Label>
                      <Input
                        id="location"
                        placeholder="Enter location or landmark"
                        value={reportForm.location}
                        onChange={(e) => setReportForm(prev => ({...prev, location: e.target.value}))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Incident Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Please provide details about what happened. Your report helps keep others safe."
                        rows={4}
                        value={reportForm.description}
                        onChange={(e) => setReportForm(prev => ({...prev, description: e.target.value}))}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="anonymous"
                          checked={reportForm.anonymous}
                          onCheckedChange={(checked) => setReportForm(prev => ({...prev, anonymous: checked}))}
                        />
                        <Label htmlFor="anonymous">Submit anonymously</Label>
                      </div>
                      <Button variant="outline" size="sm">
                        <Camera className="w-4 h-4 mr-2" />
                        Add Photo
                      </Button>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Save as Draft</Button>
                      <Button onClick={handleSubmitReport}>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Previous Reports */}
              <div>
                <h4 className="text-md font-semibold mb-4">Your Recent Reports</h4>
                <div className="space-y-3">
                  {incidentReports.map((report) => (
                    <Card key={report.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="capitalize">
                                {report.category}
                              </Badge>
                              <Badge className={getSeverityColor(report.severity)}>
                                {report.severity}
                              </Badge>
                              <Badge variant={
                                report.status === 'verified' ? 'default' :
                                report.status === 'reviewing' ? 'secondary' : 'outline'
                              }>
                                {report.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground">{report.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {report.location} • {timeAgo(report.timestamp)}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Alert Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Community Alert Settings</h3>
                <p className="text-muted-foreground mb-6">
                  Customize which types of safety alerts you want to receive.
                </p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Emergency Alerts</h4>
                        <p className="text-sm text-muted-foreground">Critical safety incidents and emergencies</p>
                      </div>
                      <Switch
                        checked={alertSettings.emergencyAlerts}
                        onCheckedChange={(checked) => setAlertSettings(prev => ({...prev, emergencyAlerts: checked}))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Safety Updates</h4>
                        <p className="text-sm text-muted-foreground">General safety information and area updates</p>
                      </div>
                      <Switch
                        checked={alertSettings.safetyUpdates}
                        onCheckedChange={(checked) => setAlertSettings(prev => ({...prev, safetyUpdates: checked}))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Helper Notifications</h4>
                        <p className="text-sm text-muted-foreground">When verified helpers become available nearby</p>
                      </div>
                      <Switch
                        checked={alertSettings.helperNotifications}
                        onCheckedChange={(checked) => setAlertSettings(prev => ({...prev, helperNotifications: checked}))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Community Tips</h4>
                        <p className="text-sm text-muted-foreground">Helpful tips and recommendations from other travelers</p>
                      </div>
                      <Switch
                        checked={alertSettings.communityTips}
                        onCheckedChange={(checked) => setAlertSettings(prev => ({...prev, communityTips: checked}))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4">Alert History</h4>
                  <div className="space-y-3">
                    {safetyAlerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded ${getSeverityColor(alert.severity)}`}>
                            {getAlertIcon(alert.type)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{alert.title}</p>
                            <p className="text-xs text-muted-foreground">{timeAgo(alert.timestamp)}</p>
                          </div>
                        </div>
                        <Badge variant="outline">Sent</Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Alerts
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
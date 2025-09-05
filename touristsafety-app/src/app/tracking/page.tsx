"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Navigation } from '@/components/ui/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  MapPin,
  Share2,
  Shield,
  Navigation2,
  Clock,
  Users,
  Smartphone,
  Wifi,
  Battery,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Settings,
  Eye,
  EyeOff,
  Route,
  Timer,
  Globe,
  Lock,
  Zap
} from 'lucide-react';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
}

interface SafeZone {
  id: string;
  name: string;
  type: 'hotel' | 'restaurant' | 'attraction' | 'transport' | 'custom';
  center: { lat: number; lng: number };
  radius: number;
  isActive: boolean;
  status: 'inside' | 'outside' | 'nearby';
}

interface SharedLocation {
  id: string;
  recipientName: string;
  recipientPhone: string;
  expiresAt: Date;
  isActive: boolean;
}

interface RouteData {
  origin: string;
  destination: string;
  estimatedTime: number;
  progress: number;
  isOnRoute: boolean;
  deviations: number;
}

export default function LocationTrackingPage() {
  const [locationSharing, setLocationSharing] = useState(false);
  const [continuousSharing, setContinuousSharing] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState(8);
  const [networkStatus, setNetworkStatus] = useState<'excellent' | 'good' | 'poor'>('good');
  const [batteryOptimized, setBatteryOptimized] = useState(true);
  const [shareableLinkDuration, setShareableLinkDuration] = useState('1hr');
  const [showShareOptions, setShowShareOptions] = useState(false);

  const [currentLocation] = useState<LocationData>({
    latitude: 48.8566,
    longitude: 2.3522,
    accuracy: 8,
    timestamp: new Date()
  });

  const [safeZones, setSafeZones] = useState<SafeZone[]>([
    {
      id: '1',
      name: 'Hotel Ambassador',
      type: 'hotel',
      center: { lat: 48.8566, lng: 2.3522 },
      radius: 100,
      isActive: true,
      status: 'inside'
    },
    {
      id: '2',
      name: 'Eiffel Tower Area',
      type: 'attraction',
      center: { lat: 48.8584, lng: 2.2945 },
      radius: 200,
      isActive: true,
      status: 'nearby'
    },
    {
      id: '3',
      name: 'Metro Station',
      type: 'transport',
      center: { lat: 48.8606, lng: 2.3376 },
      radius: 50,
      isActive: true,
      status: 'outside'
    }
  ]);

  const [sharedLocations, setSharedLocations] = useState<SharedLocation[]>([
    {
      id: '1',
      recipientName: 'Sarah Chen',
      recipientPhone: '+1-555-0123',
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      isActive: true
    },
    {
      id: '2',
      recipientName: 'Emergency Contact',
      recipientPhone: '+1-555-0456',
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
      isActive: true
    }
  ]);

  const [currentRoute] = useState<RouteData>({
    origin: 'Hotel Ambassador',
    destination: 'Louvre Museum',
    estimatedTime: 25,
    progress: 68,
    isOnRoute: true,
    deviations: 0
  });

  const [locationHistory] = useState([
    { time: '2:45 PM', location: 'Notre Dame Cathedral', duration: '45 min' },
    { time: '1:30 PM', location: 'Seine River Walk', duration: '1hr 15min' },
    { time: '11:45 AM', location: 'Café de Flore', duration: '1hr 45min' },
    { time: '10:00 AM', location: 'Hotel Ambassador', duration: '1hr 45min' }
  ]);

  const handleLocationSharingToggle = useCallback((enabled: boolean) => {
    setLocationSharing(enabled);
    if (enabled) {
      toast.success('Location sharing enabled');
    } else {
      toast.success('Location sharing disabled');
      setSharedLocations(prev => prev.map(share => ({ ...share, isActive: false })));
    }
  }, []);

  const handleContinuousSharingToggle = useCallback((enabled: boolean) => {
    setContinuousSharing(enabled);
    if (enabled) {
      toast.success('Continuous location broadcasting enabled for emergency situations');
    } else {
      toast.success('Continuous broadcasting disabled');
    }
  }, []);

  const generateShareableLink = useCallback(() => {
    const duration = shareableLinkDuration;
    const link = `https://guardianangel.app/track/${Math.random().toString(36).substring(7)}`;
    navigator.clipboard.writeText(link);
    toast.success(`Shareable link copied! Valid for ${duration}`);
    setShowShareOptions(false);
  }, [shareableLinkDuration]);

  const toggleSafeZone = useCallback((zoneId: string) => {
    setSafeZones(prev => prev.map(zone =>
      zone.id === zoneId ? { ...zone, isActive: !zone.isActive } : zone
    ));
    toast.success('Safe zone updated');
  }, []);

  const stopSharing = useCallback((shareId: string) => {
    setSharedLocations(prev => prev.map(share =>
      share.id === shareId ? { ...share, isActive: false } : share
    ));
    toast.success('Location sharing stopped');
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inside': return 'bg-green-500';
      case 'nearby': return 'bg-yellow-500';
      case 'outside': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'inside': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'nearby': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'outside': return <XCircle className="w-4 h-4 text-gray-600" />;
      default: return <XCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getNetworkIcon = () => {
    switch (networkStatus) {
      case 'excellent': return <Wifi className="w-4 h-4 text-green-600" />;
      case 'good': return <Wifi className="w-4 h-4 text-yellow-600" />;
      case 'poor': return <Wifi className="w-4 h-4 text-red-600" />;
      default: return <Wifi className="w-4 h-4 text-gray-600" />;
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setGpsAccuracy(prev => Math.max(3, Math.min(15, prev + (Math.random() - 0.5) * 2)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Main Controls */}
          <div className="flex-1 space-y-6">
            {/* Live Location Sharing */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-primary" />
                    <CardTitle>Live Location Sharing</CardTitle>
                  </div>
                  <Switch
                    checked={locationSharing}
                    onCheckedChange={handleLocationSharingToggle}
                  />
                </div>
                <CardDescription>
                  Share your real-time location with trusted contacts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {locationSharing && (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Share Duration</span>
                        <Select value={shareableLinkDuration} onValueChange={setShareableLinkDuration}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30min">30 minutes</SelectItem>
                            <SelectItem value="1hr">1 hour</SelectItem>
                            <SelectItem value="3hr">3 hours</SelectItem>
                            <SelectItem value="8hr">8 hours</SelectItem>
                            <SelectItem value="24hr">24 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        onClick={() => setShowShareOptions(!showShareOptions)}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Generate Shareable Link
                      </Button>

                      {showShareOptions && (
                        <div className="p-3 bg-muted rounded-lg space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Create a secure link valid for {shareableLinkDuration}
                          </p>
                          <Button onClick={generateShareableLink} size="sm" className="w-full">
                            <Globe className="w-4 h-4 mr-2" />
                            Generate & Copy Link
                          </Button>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Active Shares</span>
                        <Badge variant="secondary">
                          {sharedLocations.filter(s => s.isActive).length} active
                        </Badge>
                      </div>

                      {sharedLocations.filter(s => s.isActive).map((share) => (
                        <div key={share.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <div>
                              <p className="font-medium">{share.recipientName}</p>
                              <p className="text-sm text-muted-foreground">
                                Expires {share.expiresAt.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => stopSharing(share.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <EyeOff className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Route Monitoring */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Route className="w-5 h-5 text-primary" />
                  <CardTitle>Route Monitoring</CardTitle>
                </div>
                <CardDescription>
                  Real-time navigation and route safety
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Navigation2 className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Current Route</span>
                    </div>
                    <Badge variant={currentRoute.isOnRoute ? "default" : "destructive"}>
                      {currentRoute.isOnRoute ? 'On Route' : 'Off Route'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{currentRoute.origin} → {currentRoute.destination}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {currentRoute.estimatedTime} min
                      </span>
                    </div>
                    <Progress value={currentRoute.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{currentRoute.progress}% complete</span>
                      <span>{currentRoute.deviations} deviations</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" size="sm">
                    <Shield className="w-4 h-4 mr-2" />
                    Safe Routes
                  </Button>
                  <Button variant="outline" size="sm">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Report Issue
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Location Features */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-red-600" />
                  <CardTitle className="text-red-900">Emergency Location</CardTitle>
                </div>
                <CardDescription className="text-red-700">
                  Enhanced location broadcasting for emergencies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-900">Continuous Broadcasting</p>
                    <p className="text-sm text-red-700">Shares location every 30 seconds</p>
                  </div>
                  <Switch
                    checked={continuousSharing}
                    onCheckedChange={handleContinuousSharingToggle}
                  />
                </div>

                {continuousSharing && (
                  <div className="p-3 bg-red-100 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-red-900">Broadcasting Active</span>
                    </div>
                    <p className="text-xs text-red-700">
                      Location is being sent to all emergency contacts and authorities every 30 seconds
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-sm font-medium text-red-900">Backup Systems</p>
                    <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                      3 Active
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-red-900">Offline Cache</p>
                    <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                      Ready
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Status & Management */}
          <div className="flex-1 space-y-6">
            {/* GPS & Connectivity Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-primary" />
                  <CardTitle>System Status</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
                    <MapPin className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-green-900">GPS Accuracy</p>
                    <p className="text-lg font-bold text-green-700">{gpsAccuracy.toFixed(1)}m</p>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                    {getNetworkIcon()}
                    <p className="text-sm font-medium text-blue-900 mt-1">Network</p>
                    <p className="text-lg font-bold text-blue-700 capitalize">{networkStatus}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Battery className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Battery Optimized</span>
                    </div>
                    <Switch
                      checked={batteryOptimized}
                      onCheckedChange={setBatteryOptimized}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Location Permissions</span>
                    </div>
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      Granted
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safe Zones Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <CardTitle>Safe Zones</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription>
                  Manage geofenced safe areas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {safeZones.map((zone) => (
                  <div key={zone.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(zone.status)}`} />
                      <div>
                        <p className="font-medium">{zone.name}</p>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(zone.status)}
                          <span className="text-xs text-muted-foreground capitalize">
                            {zone.status} • {zone.radius}m radius
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={zone.isActive}
                        onCheckedChange={() => toggleSafeZone(zone.id)}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Location History */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <CardTitle>Location History</CardTitle>
                </div>
                <CardDescription>
                  Recent location updates and timeline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {locationHistory.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div>
                        <p className="font-medium text-sm">{entry.location}</p>
                        <p className="text-xs text-muted-foreground">{entry.time}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {entry.duration}
                    </Badge>
                  </div>
                ))}
                
                <Button variant="ghost" size="sm" className="w-full mt-3">
                  <Eye className="w-4 h-4 mr-2" />
                  View Full History
                </Button>
              </CardContent>
            </Card>

            {/* Current Location Display */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <CardTitle>Current Location</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-green-200/30" />
                  <div className="relative z-10 text-center">
                    <MapPin className="w-12 h-12 text-primary mx-auto mb-2 animate-bounce" />
                    <p className="font-semibold text-gray-700">Paris, France</p>
                    <p className="text-sm text-gray-600">
                      {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      ±{currentLocation.accuracy}m accuracy
                    </Badge>
                  </div>
                  
                  {/* Simulated map elements */}
                  <div className="absolute top-4 left-4 w-3 h-3 bg-red-400 rounded-full animate-pulse" />
                  <div className="absolute bottom-6 right-6 w-2 h-2 bg-blue-400 rounded-full" />
                  <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-green-400 rounded-full" />
                </div>
                
                <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                  <span>Updated: {currentLocation.timestamp.toLocaleTimeString()}</span>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-3 h-3 mr-1" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
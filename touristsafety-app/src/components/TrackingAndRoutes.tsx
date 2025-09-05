"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  MapPin, 
  Navigation, 
  Locate, 
  MapPinPlus, 
  Route,
  LocateOff,
  MapPinned,
  Navigation2
} from "lucide-react";

interface LocationShare {
  id: string;
  recipients: string[];
  startTime: Date;
  duration: number; // minutes
  isPublic: boolean;
  token?: string;
  isActive: boolean;
}

interface SafeZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number; // meters
  isEnabled: boolean;
  notifyOnEnter: boolean;
  notifyOnExit: boolean;
}

interface RouteMonitor {
  id: string;
  name: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  waypoints: Array<{ lat: number; lng: number }>;
  deviationThreshold: number; // meters
  expectedETA: Date;
  isActive: boolean;
}

export default function TrackingAndRoutes() {
  const [activeShare, setActiveShare] = useState<LocationShare | null>(null);
  const [shareMode, setShareMode] = useState<"contacts" | "public">("contacts");
  const [shareDuration, setShareDuration] = useState<number>(30);
  const [customDuration, setCustomDuration] = useState<string>("");
  const [safeZones, setSafeZones] = useState<SafeZone[]>([]);
  const [activeRoute, setActiveRoute] = useState<RouteMonitor | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [locationAccuracy, setLocationAccuracy] = useState<number>(5);
  const [newZoneName, setNewZoneName] = useState("");
  const [newZoneRadius, setNewZoneRadius] = useState([100]);
  const [routeStart, setRouteStart] = useState("");
  const [routeEnd, setRouteEnd] = useState("");
  const [deviationThreshold, setDeviationThreshold] = useState([50]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      setIsOffline(!navigator.onLine);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  // Simulate battery and accuracy updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof navigator !== "undefined" && "getBattery" in navigator) {
        // Real battery API would be used here
        setBatteryLevel(Math.max(20, batteryLevel - Math.random() * 2));
      }
      setLocationAccuracy(3 + Math.random() * 7);
    }, 30000);

    return () => clearInterval(interval);
  }, [batteryLevel]);

  const startLocationSharing = useCallback(async () => {
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newShare: LocationShare = {
              id: crypto.randomUUID(),
              recipients: shareMode === "contacts" ? ["emergency@example.com"] : [],
              startTime: new Date(),
              duration: shareDuration,
              isPublic: shareMode === "public",
              token: shareMode === "public" ? crypto.randomUUID() : undefined,
              isActive: true,
            };

            setActiveShare(newShare);
            toast.success(`Location sharing started for ${shareDuration} minutes`);
          },
          (error) => {
            toast.error("Location access denied. Please enable location services.");
          }
        );
      } else {
        toast.error("Geolocation not supported by this browser");
      }
    } catch (error) {
      toast.error("Failed to start location sharing");
    }
  }, [shareMode, shareDuration]);

  const stopLocationSharing = useCallback(() => {
    if (activeShare) {
      setActiveShare(null);
      toast.success("Location sharing stopped");
    }
  }, [activeShare]);

  const generateShareLink = useCallback(() => {
    if (activeShare?.token) {
      const link = `${window.location.origin}/track/${activeShare.token}`;
      navigator.clipboard.writeText(link);
      toast.success("Share link copied to clipboard");
    }
  }, [activeShare]);

  const addSafeZone = useCallback(() => {
    if (!newZoneName.trim()) {
      toast.error("Please enter a zone name");
      return;
    }

    const newZone: SafeZone = {
      id: crypto.randomUUID(),
      name: newZoneName,
      lat: 40.7128, // Default to NYC for demo
      lng: -74.0060,
      radius: newZoneRadius[0],
      isEnabled: true,
      notifyOnEnter: true,
      notifyOnExit: true,
    };

    setSafeZones(prev => [...prev, newZone]);
    setNewZoneName("");
    toast.success(`Safe zone "${newZone.name}" created`);
  }, [newZoneName, newZoneRadius]);

  const toggleSafeZone = useCallback((zoneId: string, enabled: boolean) => {
    setSafeZones(prev => 
      prev.map(zone => 
        zone.id === zoneId ? { ...zone, isEnabled: enabled } : zone
      )
    );
  }, []);

  const startRouteMonitoring = useCallback(() => {
    if (!routeStart.trim() || !routeEnd.trim()) {
      toast.error("Please enter start and end locations");
      return;
    }

    const newRoute: RouteMonitor = {
      id: crypto.randomUUID(),
      name: `${routeStart} → ${routeEnd}`,
      startLat: 40.7128,
      startLng: -74.0060,
      endLat: 40.7589,
      endLng: -73.9851,
      waypoints: [],
      deviationThreshold: deviationThreshold[0],
      expectedETA: new Date(Date.now() + 30 * 60 * 1000), // 30 min from now
      isActive: true,
    };

    setActiveRoute(newRoute);
    toast.success("Route monitoring started");
  }, [routeStart, routeEnd, deviationThreshold]);

  const stopRouteMonitoring = useCallback(() => {
    setActiveRoute(null);
    toast.success("Route monitoring stopped");
  }, []);

  const getElapsedTime = useCallback((startTime: Date) => {
    const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className="space-y-6">
      {/* Location Sharing Control */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading">
            <MapPin className="w-5 h-5 text-primary" />
            Live Location Sharing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!activeShare ? (
            <>
              {/* Share Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select
                    value={shareDuration.toString()}
                    onValueChange={(value) => setShareDuration(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="180">3 hours</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {shareDuration === 0 && (
                    <Input
                      placeholder="Minutes"
                      value={customDuration}
                      onChange={(e) => {
                        setCustomDuration(e.target.value);
                        setShareDuration(parseInt(e.target.value) || 0);
                      }}
                    />
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Privacy</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={shareMode === "public"}
                      onCheckedChange={(checked) => 
                        setShareMode(checked ? "public" : "contacts")
                      }
                    />
                    <span className="text-sm">
                      {shareMode === "public" ? "Public link" : "Contacts only"}
                    </span>
                  </div>
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={startLocationSharing}
                    className="w-full"
                    disabled={isOffline}
                  >
                    <Locate className="w-4 h-4 mr-2" />
                    Share Location
                  </Button>
                </div>
              </div>

              {isOffline && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-2 rounded">
                  <LocateOff className="w-4 h-4" />
                  Offline - Location sharing will resume when connected
                </div>
              )}
            </>
          ) : (
            /* Active Sharing Card */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Active
                    </Badge>
                    <span className="text-sm font-medium">
                      {getElapsedTime(activeShare.startTime)} elapsed
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sharing with {activeShare.isPublic ? "public link" : `${activeShare.recipients.length} contacts`}
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={stopLocationSharing}
                >
                  Stop Sharing
                </Button>
              </div>

              {/* Status Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>GPS Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>±{locationAccuracy.toFixed(0)}m accuracy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span>{batteryLevel.toFixed(0)}% battery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-red-500' : 'bg-green-500'}`} />
                  <span>{isOffline ? "Offline" : "Online"}</span>
                </div>
              </div>

              {/* Map Preview Placeholder */}
              <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPinned className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Live map preview</p>
                  <p className="text-xs">Current location updating...</p>
                </div>
              </div>

              {activeShare.isPublic && (
                <Button
                  variant="outline"
                  onClick={generateShareLink}
                  className="w-full"
                >
                  Copy Share Link
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for Route Monitoring and Safe Zones */}
      <Tabs defaultValue="routes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="routes">Route Monitoring</TabsTrigger>
          <TabsTrigger value="safezones">Safe Zones</TabsTrigger>
        </TabsList>

        {/* Route Monitoring */}
        <TabsContent value="routes">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading">
                <Route className="w-5 h-5 text-primary" />
                Route Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!activeRoute ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start">Start Location</Label>
                      <Input
                        id="start"
                        placeholder="Enter start address"
                        value={routeStart}
                        onChange={(e) => setRouteStart(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end">End Location</Label>
                      <Input
                        id="end"
                        placeholder="Enter destination"
                        value={routeEnd}
                        onChange={(e) => setRouteEnd(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Deviation Alert Threshold: {deviationThreshold[0]}m</Label>
                    <Slider
                      value={deviationThreshold}
                      onValueChange={setDeviationThreshold}
                      max={500}
                      min={10}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  <Button 
                    onClick={startRouteMonitoring}
                    className="w-full"
                    disabled={isOffline}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Start Route Monitoring
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{activeRoute.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ETA: {activeRoute.expectedETA.toLocaleTimeString()}
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={stopRouteMonitoring}
                    >
                      Stop Monitoring
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Navigation2 className="w-4 h-4 text-green-500" />
                      <span>On route</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>±{deviationThreshold[0]}m threshold</span>
                    </div>
                  </div>

                  {/* Route Map Preview Placeholder */}
                  <div className="h-40 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Route className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Route visualization</p>
                      <p className="text-xs">Tracking progress...</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Safe Zones */}
        <TabsContent value="safezones">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading">
                <MapPinPlus className="w-5 h-5 text-primary" />
                Safe Zones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Zone */}
              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold">Create Safe Zone</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zoneName">Zone Name</Label>
                    <Input
                      id="zoneName"
                      placeholder="e.g., Home, Office, Hotel"
                      value={newZoneName}
                      onChange={(e) => setNewZoneName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Radius: {newZoneRadius[0]}m</Label>
                    <Slider
                      value={newZoneRadius}
                      onValueChange={setNewZoneRadius}
                      max={1000}
                      min={50}
                      step={25}
                      className="w-full"
                    />
                  </div>
                </div>
                <Button onClick={addSafeZone} className="w-full">
                  <MapPinPlus className="w-4 h-4 mr-2" />
                  Add Safe Zone
                </Button>
              </div>

              {/* Existing Safe Zones */}
              <div className="space-y-3">
                {safeZones.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="w-8 h-8 mx-auto mb-2" />
                    <p>No safe zones created yet</p>
                    <p className="text-sm">Create your first safe zone above</p>
                  </div>
                ) : (
                  safeZones.map((zone) => (
                    <div key={zone.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{zone.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {zone.radius}m radius
                          </p>
                        </div>
                        <Switch
                          checked={zone.isEnabled}
                          onCheckedChange={(enabled) => toggleSafeZone(zone.id, enabled)}
                        />
                      </div>

                      {zone.isEnabled && (
                        <>
                          <Separator />
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center justify-between">
                              <span>Notify on enter</span>
                              <Switch
                                checked={zone.notifyOnEnter}
                                onCheckedChange={(checked) => {
                                  setSafeZones(prev => 
                                    prev.map(z => 
                                      z.id === zone.id ? { ...z, notifyOnEnter: checked } : z
                                    )
                                  );
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Notify on exit</span>
                              <Switch
                                checked={zone.notifyOnExit}
                                onCheckedChange={(checked) => {
                                  setSafeZones(prev => 
                                    prev.map(z => 
                                      z.id === zone.id ? { ...z, notifyOnExit: checked } : z
                                    )
                                  );
                                }}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
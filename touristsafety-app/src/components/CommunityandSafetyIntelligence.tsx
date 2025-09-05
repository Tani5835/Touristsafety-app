"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, MapPinCheckInside, TriangleAlert, MapPlus, Radar, EyeOff, Rss } from "lucide-react";
import { toast } from "sonner";

interface IncidentReport {
  id: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  location: string;
  timestamp: Date;
  anonymous: boolean;
  resolved: boolean;
  upvotes: number;
  userVoted: boolean;
}

interface SafeHaven {
  id: string;
  name: string;
  type: "police" | "hospital" | "embassy" | "hotel" | "store";
  verified: boolean;
  distance: number;
  open: boolean;
  hours: string;
  languages: string[];
  accessibility: boolean;
  phone: string;
  rating: number;
}

interface Helper {
  id: string;
  name: string;
  verified: boolean;
  distance: number;
  available: boolean;
  languages: string[];
  rating: number;
  specialties: string[];
}

export default function CommunityAndSafetyIntelligence() {
  const [activeTab, setActiveTab] = useState("incidents");
  const [showReportForm, setShowReportForm] = useState(false);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [safeHavens, setSafeHavens] = useState<SafeHaven[]>([]);
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapView, setMapView] = useState(false);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [reportData, setReportData] = useState({
    category: "",
    severity: "medium" as const,
    description: "",
    anonymous: true,
    location: ""
  });

  const mapRef = useRef<HTMLDivElement>(null);

  // Mock data initialization
  useEffect(() => {
    const initializeData = () => {
      const mockIncidents: IncidentReport[] = [
        {
          id: "1",
          category: "Theft",
          severity: "high",
          description: "Pickpocket in tourist area near main square",
          location: "Main Square, Zone 1",
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          anonymous: true,
          resolved: false,
          upvotes: 12,
          userVoted: false
        },
        {
          id: "2",
          category: "Scam",
          severity: "medium",
          description: "Overcharging at restaurant, be careful with prices",
          location: "Restaurant District",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          anonymous: false,
          resolved: true,
          upvotes: 8,
          userVoted: true
        },
        {
          id: "3",
          category: "Safety",
          severity: "low",
          description: "Well-lit area, feels safe even at night",
          location: "Park Avenue",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
          anonymous: false,
          resolved: false,
          upvotes: 15,
          userVoted: false
        }
      ];

      const mockSafeHavens: SafeHaven[] = [
        {
          id: "1",
          name: "Central Police Station",
          type: "police",
          verified: true,
          distance: 0.3,
          open: true,
          hours: "24/7",
          languages: ["English", "Spanish", "French"],
          accessibility: true,
          phone: "+1-555-0101",
          rating: 4.8
        },
        {
          id: "2",
          name: "Grand Hotel Lobby",
          type: "hotel",
          verified: true,
          distance: 0.1,
          open: true,
          hours: "24/7",
          languages: ["English", "Spanish"],
          accessibility: true,
          phone: "+1-555-0102",
          rating: 4.6
        },
        {
          id: "3",
          name: "City General Hospital",
          type: "hospital",
          verified: true,
          distance: 0.8,
          open: true,
          hours: "24/7 Emergency",
          languages: ["English", "Spanish", "French"],
          accessibility: true,
          phone: "+1-555-0103",
          rating: 4.9
        }
      ];

      const mockHelpers: Helper[] = [
        {
          id: "1",
          name: "Maria Rodriguez",
          verified: true,
          distance: 0.2,
          available: true,
          languages: ["English", "Spanish"],
          rating: 4.9,
          specialties: ["Local Guide", "Emergency Response"]
        },
        {
          id: "2",
          name: "Tourist Police Officer",
          verified: true,
          distance: 0.4,
          available: true,
          languages: ["English", "French", "German"],
          rating: 5.0,
          specialties: ["Security", "Legal Help"]
        }
      ];

      setIncidents(mockIncidents);
      setSafeHavens(mockSafeHavens);
      setHelpers(mockHelpers);
      setLoading(false);
    };

    const timer = setTimeout(initializeData, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-red-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "police": return <MapPinCheckInside className="h-4 w-4" />;
      case "hospital": return <MapPin className="h-4 w-4 text-red-500" />;
      case "embassy": return <MapPin className="h-4 w-4 text-blue-500" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const handleReportSubmit = () => {
    if (!reportData.category || !reportData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newReport: IncidentReport = {
      id: Date.now().toString(),
      category: reportData.category,
      severity: reportData.severity,
      description: reportData.description,
      location: reportData.location || "Current Location",
      timestamp: new Date(),
      anonymous: reportData.anonymous,
      resolved: false,
      upvotes: 0,
      userVoted: false
    };

    setIncidents(prev => [newReport, ...prev]);
    setReportData({
      category: "",
      severity: "medium",
      description: "",
      anonymous: true,
      location: ""
    });
    setShowReportForm(false);
    toast.success("Report submitted successfully");

    // Show alert banner for high severity reports
    if (reportData.severity === "high" || reportData.severity === "critical") {
      toast.warning("High severity report posted in your area", {
        duration: 5000,
      });
    }
  };

  const handleUpvote = (reportId: string) => {
    setIncidents(prev => prev.map(incident => {
      if (incident.id === reportId) {
        return {
          ...incident,
          upvotes: incident.userVoted ? incident.upvotes - 1 : incident.upvotes + 1,
          userVoted: !incident.userVoted
        };
      }
      return incident;
    }));
  };

  const handleResolve = (reportId: string) => {
    setIncidents(prev => prev.map(incident => {
      if (incident.id === reportId) {
        return { ...incident, resolved: !incident.resolved };
      }
      return incident;
    }));
    toast.success("Report status updated");
  };

  const handleCall = (phone: string) => {
    if (typeof window !== "undefined") {
      window.open(`tel:${phone}`, '_self');
    }
  };

  const handleDirections = (name: string) => {
    if (typeof window !== "undefined") {
      const query = encodeURIComponent(name);
      window.open(`https://maps.google.com/maps?q=${query}`, '_blank');
    }
  };

  const filteredIncidents = incidents.filter(incident => 
    filterSeverity === "all" || incident.severity === filterSeverity
  );

  if (loading) {
    return (
      <Card className="w-full bg-card">
        <CardHeader>
          <CardTitle className="font-heading">Community Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading">Community Intelligence</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMapView(!mapView)}
              className="flex items-center gap-1"
            >
              {mapView ? <Rss className="h-4 w-4" /> : <Radar className="h-4 w-4" />}
              {mapView ? "List" : "Map"}
            </Button>
            <Button
              onClick={() => setShowReportForm(true)}
              size="sm"
              className="flex items-center gap-1"
            >
              <MapPlus className="h-4 w-4" />
              Report
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {mapView ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="heatmap"
                    checked={heatmapEnabled}
                    onCheckedChange={setHeatmapEnabled}
                  />
                  <Label htmlFor="heatmap" className="text-sm">Heatmap</Label>
                </div>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div 
              ref={mapRef}
              className="h-64 bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center"
            >
              <div className="text-center space-y-2">
                <Radar className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Interactive map with incident clusters
                  {heatmapEnabled && " and heatmap overlay"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {filteredIncidents.length} incidents shown
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="incidents">Incidents</TabsTrigger>
              <TabsTrigger value="safe-havens">Safe Places</TabsTrigger>
              <TabsTrigger value="helpers">Helpers</TabsTrigger>
            </TabsList>

            <TabsContent value="incidents" className="space-y-4">
              <div className="flex items-center gap-2">
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="h-64">
                {filteredIncidents.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <div className="text-center">
                      <EyeOff className="h-8 w-8 mx-auto mb-2" />
                      <p>No incidents to display</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredIncidents.map((incident) => (
                      <Card key={incident.id} className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge className={getSeverityColor(incident.severity)}>
                                  {incident.severity}
                                </Badge>
                                <Badge variant="outline">{incident.category}</Badge>
                                {incident.anonymous && (
                                  <Badge variant="secondary" className="text-xs">
                                    Anonymous
                                  </Badge>
                                )}
                                {incident.resolved && (
                                  <Badge variant="default" className="bg-green-500 text-white">
                                    Resolved
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm">{incident.description}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{incident.location}</span>
                                <span>•</span>
                                <span>{incident.timestamp.toLocaleTimeString()}</span>
                              </div>
                            </div>
                            {incident.severity === "high" || incident.severity === "critical" ? (
                              <TriangleAlert className="h-5 w-5 text-destructive" />
                            ) : null}
                          </div>
                          
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpvote(incident.id)}
                                className={`text-xs ${incident.userVoted ? 'text-primary' : ''}`}
                              >
                                ↑ {incident.upvotes}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleResolve(incident.id)}
                                className="text-xs"
                              >
                                {incident.resolved ? "Unresolve" : "Mark Resolved"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="safe-havens" className="space-y-4">
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {safeHavens.map((place) => (
                    <Card key={place.id} className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(place.type)}
                              <h4 className="font-semibold text-sm">{place.name}</h4>
                              {place.verified && (
                                <MapPinCheckInside className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{place.distance}km away</span>
                              <span>•</span>
                              <span className={place.open ? "text-green-600" : "text-red-600"}>
                                {place.open ? "Open" : "Closed"}
                              </span>
                              <span>•</span>
                              <span>★ {place.rating}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {place.hours} • {place.languages.join(", ")}
                            </p>
                            {place.accessibility && (
                              <Badge variant="secondary" className="text-xs">
                                Accessible
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCall(place.phone)}
                            className="text-xs"
                          >
                            Call
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDirections(place.name)}
                            className="text-xs"
                          >
                            Directions
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="helpers" className="space-y-4">
              <ScrollArea className="h-64">
                {helpers.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <div className="text-center">
                      <p>No verified helpers nearby</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {helpers.map((helper) => (
                      <Card key={helper.id} className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-sm">{helper.name}</h4>
                                {helper.verified && (
                                  <MapPinCheckInside className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{helper.distance}km away</span>
                                <span>•</span>
                                <span className={helper.available ? "text-green-600" : "text-red-600"}>
                                  {helper.available ? "Available" : "Busy"}
                                </span>
                                <span>•</span>
                                <span>★ {helper.rating}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {helper.languages.join(", ")}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {helper.specialties.map((specialty) => (
                                  <Badge key={specialty} variant="secondary" className="text-xs">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={!helper.available}
                              className="text-xs"
                            >
                              Contact
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}

        {showReportForm && (
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Submit Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={reportData.category} 
                    onValueChange={(value) => setReportData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="theft">Theft</SelectItem>
                      <SelectItem value="scam">Scam</SelectItem>
                      <SelectItem value="safety">Safety</SelectItem>
                      <SelectItem value="harassment">Harassment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select 
                    value={reportData.severity} 
                    onValueChange={(value: "low" | "medium" | "high" | "critical") => 
                      setReportData(prev => ({ ...prev, severity: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what happened..."
                  value={reportData.description}
                  onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (optional)</Label>
                <Input
                  id="location"
                  placeholder="Specific location or use current location"
                  value={reportData.location}
                  onChange={(e) => setReportData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="anonymous"
                  checked={reportData.anonymous}
                  onCheckedChange={(checked) => setReportData(prev => ({ ...prev, anonymous: checked }))}
                />
                <Label htmlFor="anonymous">Submit anonymously</Label>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button onClick={handleReportSubmit} className="flex-1">
                  Submit Report
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowReportForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
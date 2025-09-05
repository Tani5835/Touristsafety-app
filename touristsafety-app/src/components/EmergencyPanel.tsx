"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  CircleAlert, 
  Siren, 
  TriangleAlert, 
  CircleStop, 
  Bell, 
  Monitor, 
  LifeBuoy, 
  CirclePower,
  FireExtinguisher,
  HeartPulse
} from "lucide-react";

interface EmergencyAlert {
  id: string;
  timestamp: Date;
  type: 'red' | 'orange' | 'yellow';
  status: 'active' | 'resolved' | 'cancelled';
  reason: string;
}

interface SafetyScore {
  score: number;
  level: 'green' | 'yellow' | 'orange' | 'red';
  reason: string;
  details?: string[];
}

interface EmergencySettings {
  pinProtectCancel: boolean;
  cancelPin: string;
  voiceActivation: boolean;
  voicePhrase: string;
  stealthMode: boolean;
  sirenEnabled: boolean;
  flashlightEnabled: boolean;
  testMode: boolean;
}

const EmergencyPanel: React.FC = () => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [emergencyMode, setEmergencyMode] = useState<'red' | 'orange' | 'yellow'>('red');
  const [showActivationDialog, setShowActivationDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const [tapCount, setTapCount] = useState(0);
  const [lastTap, setLastTap] = useState(0);
  const [enterPin, setEnterPin] = useState('');
  const [isStealthMode, setIsStealthMode] = useState(false);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [isFlashlightActive, setIsFlashlightActive] = useState(false);
  const [backgroundTimer, setBackgroundTimer] = useState<NodeJS.Timeout | null>(null);

  const [settings, setSettings] = useState<EmergencySettings>({
    pinProtectCancel: false,
    cancelPin: '',
    voiceActivation: false,
    voicePhrase: 'Emergency',
    stealthMode: false,
    sirenEnabled: true,
    flashlightEnabled: true,
    testMode: false
  });

  const [safetyScore] = useState<SafetyScore>({
    score: 78,
    level: 'yellow',
    reason: 'Moderate risk area',
    details: ['Tourist area with occasional incidents', 'Good police response time', 'Daylight hours']
  });

  const [recentAlerts] = useState<EmergencyAlert[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'yellow',
      status: 'resolved',
      reason: 'Safety check-in'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      type: 'orange',
      status: 'resolved',
      reason: 'Suspicious activity reported'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      type: 'red',
      status: 'cancelled',
      reason: 'False alarm - pocket dial'
    }
  ]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (holdTimer) clearTimeout(holdTimer);
      if (backgroundTimer) clearTimeout(backgroundTimer);
    };
  }, [holdTimer, backgroundTimer]);

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdownActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdownActive && countdown === 0) {
      handleEmergencyActivate();
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdownActive, countdown]);

  // Background emergency timer
  useEffect(() => {
    if (isEmergencyActive && !backgroundTimer) {
      const timer = setInterval(() => {
        // Update location every 30 seconds during active emergency
        updateLocationInBackground();
      }, 30000);
      setBackgroundTimer(timer);
    } else if (!isEmergencyActive && backgroundTimer) {
      clearInterval(backgroundTimer);
      setBackgroundTimer(null);
    }
  }, [isEmergencyActive, backgroundTimer]);

  const updateLocationInBackground = useCallback(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location updated:', position.coords);
          // Here you would send location to your backend
        },
        (error) => {
          console.error('Location update failed:', error);
        }
      );
    }
  }, []);

  const getScoreColor = (level: string) => {
    switch (level) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'orange': return 'bg-orange-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'red': return 'bg-red-500 hover:bg-red-600';
      case 'orange': return 'bg-orange-500 hover:bg-orange-600';
      case 'yellow': return 'bg-yellow-500 hover:bg-yellow-600';
      default: return 'bg-red-500 hover:bg-red-600';
    }
  };

  const handlePanicButtonPress = () => {
    const now = Date.now();
    
    // Double-tap detection
    if (now - lastTap < 300) {
      setTapCount(prev => prev + 1);
      if (tapCount + 1 === 2) {
        // Double-tap - silent emergency
        handleSilentEmergency();
        setTapCount(0);
        return;
      }
    } else {
      setTapCount(1);
    }
    setLastTap(now);

    setIsPressed(true);
    
    // Start hold timer for 3-second activation
    const timer = setTimeout(() => {
      handleHoldActivation();
    }, 3000);
    
    setHoldTimer(timer);
  };

  const handlePanicButtonRelease = () => {
    setIsPressed(false);
    
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }

    // Check for single tap after delay
    setTimeout(() => {
      if (tapCount === 1) {
        handleSingleTapActivation();
        setTapCount(0);
      }
    }, 300);
  };

  const handleSingleTapActivation = () => {
    setShowModeSelector(true);
  };

  const handleHoldActivation = () => {
    setShowActivationDialog(true);
    setCountdownActive(true);
    setCountdown(30);
  };

  const handleSilentEmergency = () => {
    toast.success("Silent emergency activated");
    handleEmergencyActivate();
  };

  const handleEmergencyActivate = () => {
    setCountdownActive(false);
    setShowActivationDialog(false);
    setShowModeSelector(false);
    setIsEmergencyActive(true);
    
    if (settings.stealthMode) {
      setIsStealthMode(true);
    }

    // Execute emergency actions
    executeEmergencyActions();
    
    toast.success(`Emergency alert sent - ${emergencyMode.toUpperCase()} mode`);
  };

  const executeEmergencyActions = async () => {
    try {
      // Request location permission and get current location
      if (typeof window !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };

            // Send emergency data to backend
            if (!settings.testMode) {
              await sendEmergencyAlert(location);
              await sendSMSAlerts(location);
              await sendEmailAlerts(location);
              
              if (emergencyMode === 'red') {
                await callEmergencyServices();
              }
            } else {
              toast.info("TEST MODE: No real alerts sent");
            }
          },
          (error) => {
            console.error('Location error:', error);
            toast.error("Could not get location - sending alert without coordinates");
            if (!settings.testMode) {
              sendEmergencyAlert(null);
            }
          }
        );
      }

      // Activate siren if enabled
      if (settings.sirenEnabled) {
        setIsSirenActive(true);
      }

      // Activate flashlight if enabled
      if (settings.flashlightEnabled) {
        setIsFlashlightActive(true);
      }

    } catch (error) {
      console.error('Emergency execution error:', error);
      toast.error("Some emergency actions failed - check network connection");
    }
  };

  const sendEmergencyAlert = async (location: { latitude: number; longitude: number } | null) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Emergency alert sent to backend:', { mode: emergencyMode, location });
        resolve(true);
      }, 1000);
    });
  };

  const sendSMSAlerts = async (location: { latitude: number; longitude: number } | null) => {
    // Simulate SMS sending
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('SMS alerts sent to emergency contacts');
        resolve(true);
      }, 500);
    });
  };

  const sendEmailAlerts = async (location: { latitude: number; longitude: number } | null) => {
    // Simulate email sending
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Email alerts sent to emergency contacts');
        resolve(true);
      }, 800);
    });
  };

  const callEmergencyServices = async () => {
    // Simulate emergency call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Emergency services contacted');
        resolve(true);
      }, 200);
    });
  };

  const handleCancelEmergency = () => {
    if (settings.pinProtectCancel && settings.cancelPin) {
      setShowCancelDialog(true);
    } else {
      confirmCancelEmergency();
    }
  };

  const confirmCancelEmergency = () => {
    setCountdownActive(false);
    setIsEmergencyActive(false);
    setShowActivationDialog(false);
    setShowCancelDialog(false);
    setIsStealthMode(false);
    setIsSirenActive(false);
    setIsFlashlightActive(false);
    setEnterPin('');
    
    if (backgroundTimer) {
      clearInterval(backgroundTimer);
      setBackgroundTimer(null);
    }
    
    toast.success("Emergency cancelled");
  };

  const handlePinSubmit = () => {
    if (enterPin === settings.cancelPin) {
      confirmCancelEmergency();
    } else {
      toast.error("Incorrect PIN");
      setEnterPin('');
    }
  };

  const handleShareLocation = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = `https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`;
          navigator.clipboard?.writeText(location);
          toast.success("Location copied to clipboard");
        },
        () => {
          toast.error("Could not get location");
        }
      );
    }
  };

  const handleCallPolice = () => {
    if (typeof window !== "undefined") {
      window.open('tel:911', '_self');
    }
  };

  const handleFakeCall = () => {
    toast.success("Fake call started");
    // Implement fake call UI
  };

  const handleSirenFlashlight = () => {
    setIsSirenActive(!isSirenActive);
    setIsFlashlightActive(!isFlashlightActive);
    toast.success(isSirenActive ? "Siren & flashlight off" : "Siren & flashlight on");
  };

  if (isStealthMode) {
    return (
      <Card className="w-full max-w-md mx-auto bg-card">
        <CardContent className="p-8 text-center">
          <Monitor className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">System Update</h3>
          <p className="text-muted-foreground mb-4">
            Updating system components. Please wait...
          </p>
          <Progress value={75} className="mb-4" />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsStealthMode(false)}
          >
            Cancel Update
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-heading">Emergency Control</CardTitle>
          <Badge 
            className={`${getScoreColor(safetyScore.level)} text-white`}
            variant="secondary"
          >
            Safety: {safetyScore.score}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{safetyScore.reason}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Panic Button */}
        <div className="flex flex-col items-center space-y-4">
          <button
            className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-red-600 ${
              isPressed ? 'bg-red-700 scale-95' : 'bg-red-500 hover:bg-red-600'
            } transition-all duration-150 shadow-lg active:shadow-md`}
            onMouseDown={handlePanicButtonPress}
            onMouseUp={handlePanicButtonRelease}
            onTouchStart={handlePanicButtonPress}
            onTouchEnd={handlePanicButtonRelease}
            disabled={isEmergencyActive}
          >
            <div className="flex flex-col items-center justify-center h-full text-white">
              <CircleAlert className="h-8 w-8 mb-1" />
              <span className="font-semibold text-sm">PANIC</span>
            </div>
            {holdTimer && (
              <div className="absolute inset-0 rounded-full border-4 border-white animate-pulse" />
            )}
          </button>
          
          {isEmergencyActive && (
            <Button
              onClick={handleCancelEmergency}
              variant="destructive"
              size="lg"
              className="w-full max-w-xs"
            >
              <CircleStop className="h-4 w-4 mr-2" />
              CANCEL EMERGENCY
            </Button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-14 flex-col gap-1"
            onClick={handleShareLocation}
          >
            <LifeBuoy className="h-4 w-4" />
            <span className="text-xs">Share Location</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-14 flex-col gap-1"
            onClick={handleCallPolice}
          >
            <Bell className="h-4 w-4" />
            <span className="text-xs">Call Police</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-14 flex-col gap-1"
            onClick={handleFakeCall}
          >
            <CirclePower className="h-4 w-4" />
            <span className="text-xs">Fake Call</span>
          </Button>
          
          <Button
            variant="outline"
            className={`h-14 flex-col gap-1 ${(isSirenActive || isFlashlightActive) ? 'bg-yellow-100' : ''}`}
            onClick={handleSirenFlashlight}
          >
            <Siren className="h-4 w-4" />
            <span className="text-xs">Siren + Light</span>
          </Button>
        </div>

        {/* Recent Alerts */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Recent Alerts</h4>
          {recentAlerts.length > 0 ? (
            <div className="space-y-2">
              {recentAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <TriangleAlert className={`h-3 w-3 ${
                      alert.type === 'red' ? 'text-red-500' :
                      alert.type === 'orange' ? 'text-orange-500' :
                      'text-yellow-500'
                    }`} />
                    <span className="text-xs">{alert.reason}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {alert.timestamp.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No recent alerts</p>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(true)}
          className="w-full"
        >
          Emergency Settings
        </Button>
      </CardContent>

      {/* Mode Selector Dialog */}
      <Dialog open={showModeSelector} onOpenChange={setShowModeSelector}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Emergency Mode</DialogTitle>
            <DialogDescription>
              Choose the type of emergency alert to send
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              onClick={() => {
                setEmergencyMode('red');
                handleEmergencyActivate();
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              RED - Full Emergency
              <small className="block text-xs opacity-80">Contacts + Police + Live tracking</small>
            </Button>
            <Button
              onClick={() => {
                setEmergencyMode('orange');
                handleEmergencyActivate();
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              ORANGE - Alert Contacts
              <small className="block text-xs opacity-80">Emergency contacts only</small>
            </Button>
            <Button
              onClick={() => {
                setEmergencyMode('yellow');
                handleEmergencyActivate();
              }}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              YELLOW - Safety Check
              <small className="block text-xs opacity-80">Advisory notification only</small>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Activation Dialog */}
      <Dialog open={showActivationDialog} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Emergency Activating</DialogTitle>
            <DialogDescription>
              Emergency alert will be sent in {countdown} seconds
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Progress value={((30 - countdown) / 30) * 100} />
            <Button
              onClick={handleCancelEmergency}
              variant="destructive"
              className="w-full"
            >
              <CircleStop className="h-4 w-4 mr-2" />
              CANCEL ({countdown}s)
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* PIN Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter PIN to Cancel</DialogTitle>
            <DialogDescription>
              PIN required to cancel emergency
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter PIN"
              value={enterPin}
              onChange={(e) => setEnterPin(e.target.value)}
              maxLength={4}
            />
            <div className="flex gap-2">
              <Button onClick={handlePinSubmit} disabled={enterPin.length !== 4}>
                Cancel Emergency
              </Button>
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                Back
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Emergency Settings</DialogTitle>
            <DialogDescription>
              Configure emergency behavior and security
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="pin-protect">PIN Protect Cancel</Label>
              <Switch
                id="pin-protect"
                checked={settings.pinProtectCancel}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, pinProtectCancel: checked }))
                }
              />
            </div>
            
            {settings.pinProtectCancel && (
              <div>
                <Label htmlFor="cancel-pin">Cancel PIN (4 digits)</Label>
                <Input
                  id="cancel-pin"
                  type="password"
                  placeholder="0000"
                  maxLength={4}
                  value={settings.cancelPin}
                  onChange={(e) => 
                    setSettings(prev => ({ ...prev, cancelPin: e.target.value }))
                  }
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="voice-activation">Voice Activation</Label>
              <Switch
                id="voice-activation"
                checked={settings.voiceActivation}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, voiceActivation: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="stealth-mode">Stealth Mode</Label>
              <Switch
                id="stealth-mode"
                checked={settings.stealthMode}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, stealthMode: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="test-mode">Test Mode</Label>
              <Switch
                id="test-mode"
                checked={settings.testMode}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, testMode: checked }))
                }
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EmergencyPanel;
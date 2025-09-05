"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  AlertTriangle, 
  Phone, 
  Shield, 
  Flashlight, 
  Volume2, 
  PhoneCall, 
  MapPin, 
  Wifi, 
  Battery, 
  Signal,
  Timer,
  X,
  Mic,
  Settings,
  TestTube,
  Users,
  Siren
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';

interface EmergencyStatus {
  isActive: boolean;
  level: 'red' | 'orange' | 'yellow' | null;
  countdown: number;
  canCancel: boolean;
}

interface SystemStatus {
  battery: number;
  gps: 'excellent' | 'good' | 'poor' | 'none';
  network: 'connected' | 'weak' | 'disconnected';
  location: boolean;
}

export default function EmergencyPage() {
  const [emergencyStatus, setEmergencyStatus] = useState<EmergencyStatus>({
    isActive: false,
    level: null,
    countdown: 0,
    canCancel: true
  });
  
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    battery: 85,
    gps: 'excellent',
    network: 'connected',
    location: true
  });

  const [emergencyMode, setEmergencyMode] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [alarmOn, setAlarmOn] = useState(false);
  const [fakeCallActive, setFakeCallActive] = useState(false);
  const [voiceActivated, setVoiceActivated] = useState(false);
  const [testMode, setTestMode] = useState(false);
  
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelPin, setCancelPin] = useState('');
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const holdProgressRef = useRef<NodeJS.Timeout | null>(null);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const emergencyContacts = [
    { name: 'Emergency Services', number: '911', type: 'emergency' },
    { name: 'Tourist Helpline', number: '1-800-HELP', type: 'tourist' },
    { name: 'Embassy', number: '+1-555-0123', type: 'embassy' },
    { name: 'Sarah (Emergency)', number: '+1-555-0101', type: 'contact' },
    { name: 'John (Family)', number: '+1-555-0102', type: 'contact' }
  ];

  const activateEmergency = useCallback((level: 'red' | 'orange' | 'yellow', silent = false) => {
    if (testMode) {
      toast.success(`TEST MODE: ${level.toUpperCase()} alert activated`);
      return;
    }

    setEmergencyStatus({
      isActive: true,
      level,
      countdown: 30,
      canCancel: level !== 'red' || silent
    });

    // Start countdown
    countdownRef.current = setInterval(() => {
      setEmergencyStatus(prev => {
        if (prev.countdown <= 1) {
          // Execute emergency actions
          executeEmergencyActions(level);
          return { ...prev, countdown: 0 };
        }
        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000);

    const levelMessages = {
      red: silent ? 'Silent emergency activated' : 'Full emergency activated',
      orange: 'Help request sent to contacts',
      yellow: 'Check-in request initiated'
    };

    toast.error(levelMessages[level]);
  }, [testMode]);

  const executeEmergencyActions = useCallback((level: 'red' | 'orange' | 'yellow') => {
    const actions = {
      red: ['Police notified', 'All contacts alerted', 'Location broadcasting', 'Emergency services dispatched'],
      orange: ['Contacts notified', 'Location shared', 'Help request sent'],
      yellow: ['Check-in sent', 'Location updated']
    };

    actions[level].forEach((action, index) => {
      setTimeout(() => {
        toast.success(action);
      }, index * 500);
    });

    // Clear countdown
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    // Reset after actions complete
    setTimeout(() => {
      setEmergencyStatus({
        isActive: false,
        level: null,
        countdown: 0,
        canCancel: true
      });
    }, 5000);
  }, []);

  const handlePanicPress = useCallback(() => {
    tapCountRef.current += 1;

    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    tapTimerRef.current = setTimeout(() => {
      if (tapCountRef.current === 2) {
        // Double tap - silent emergency
        activateEmergency('red', true);
      } else if (tapCountRef.current === 1) {
        // Single tap - immediate emergency
        activateEmergency('red');
      }
      tapCountRef.current = 0;
    }, 300);
  }, [activateEmergency]);

  const handlePanicHoldStart = useCallback(() => {
    setIsHolding(true);
    setHoldProgress(0);

    holdProgressRef.current = setInterval(() => {
      setHoldProgress(prev => {
        if (prev >= 100) {
          setIsHolding(false);
          activateEmergency('red');
          return 0;
        }
        return prev + (100 / 30); // 3 seconds = 30 intervals of 100ms
      });
    }, 100);
  }, [activateEmergency]);

  const handlePanicHoldEnd = useCallback(() => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdProgressRef.current) {
      clearInterval(holdProgressRef.current);
      holdProgressRef.current = null;
    }
  }, []);

  const cancelEmergency = useCallback(() => {
    if (cancelPin === '1234') { // Demo PIN
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      
      setEmergencyStatus({
        isActive: false,
        level: null,
        countdown: 0,
        canCancel: true
      });
      
      setShowCancelDialog(false);
      setCancelPin('');
      toast.success('Emergency cancelled');
    } else {
      toast.error('Incorrect PIN');
      setCancelPin('');
    }
  }, [cancelPin]);

  const callContact = useCallback((contact: typeof emergencyContacts[0]) => {
    if (testMode) {
      toast.success(`TEST MODE: Calling ${contact.name}`);
      return;
    }
    
    toast.success(`Calling ${contact.name}...`);
    // In real app, would initiate actual call
  }, [testMode]);

  const toggleFlashlight = useCallback(() => {
    setFlashlightOn(prev => {
      const newState = !prev;
      toast.success(newState ? 'Flashlight ON' : 'Flashlight OFF');
      return newState;
    });
  }, []);

  const toggleAlarm = useCallback(() => {
    setAlarmOn(prev => {
      const newState = !prev;
      toast.success(newState ? 'Alarm ON' : 'Alarm OFF');
      return newState;
    });
  }, []);

  const startFakeCall = useCallback(() => {
    setFakeCallActive(true);
    toast.success('Fake call started');
    
    setTimeout(() => {
      setFakeCallActive(false);
      toast.success('Fake call ended');
    }, 30000);
  }, []);

  // Voice activation effect
  useEffect(() => {
    if (voiceActivated) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.onresult = (event: any) => {
          const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
          if (transcript.includes('help') || transcript.includes('emergency')) {
            activateEmergency('red');
          }
        };
        recognition.start();

        return () => recognition.stop();
      }
    }
  }, [voiceActivated, activateEmergency]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (holdProgressRef.current) clearInterval(holdProgressRef.current);
      if (holdTimer) clearTimeout(holdTimer);
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    };
  }, [holdTimer]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'connected':
        return 'bg-green-500';
      case 'good':
      case 'weak':
        return 'bg-yellow-500';
      case 'poor':
      case 'disconnected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* System Status Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Battery className="h-4 w-4" />
                  <span className="text-sm font-medium">{systemStatus.battery}%</span>
                  <div className={`w-2 h-2 rounded-full ${systemStatus.battery > 20 ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Signal className="h-4 w-4" />
                  <span className="text-sm font-medium capitalize">{systemStatus.gps}</span>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus.gps)}`} />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Wifi className="h-4 w-4" />
                  <span className="text-sm font-medium capitalize">{systemStatus.network}</span>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus.network)}`} />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant={emergencyMode ? "destructive" : "secondary"}>
                  <Shield className="h-3 w-3 mr-1" />
                  {emergencyMode ? 'Emergency Mode' : 'Normal Mode'}
                </Badge>
                
                <Badge variant={testMode ? "outline" : "secondary"}>
                  <TestTube className="h-3 w-3 mr-1" />
                  {testMode ? 'Test Mode' : 'Live Mode'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Active Banner */}
        {emergencyStatus.isActive && (
          <Card className="border-red-500 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                    <span className="text-lg font-semibold text-red-700">
                      {emergencyStatus.level?.toUpperCase()} ALERT ACTIVE
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Timer className="h-5 w-5 text-red-500" />
                    <span className="text-lg font-mono text-red-700">
                      {emergencyStatus.countdown}s
                    </span>
                  </div>
                </div>
                
                {emergencyStatus.canCancel && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowCancelDialog(true)}
                    className="border-red-500 text-red-700 hover:bg-red-100"
                  >
                    Cancel Emergency
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Emergency Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Emergency Control</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Panic Button */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Button
                      size="lg"
                      className={`h-20 w-20 rounded-full text-white font-bold text-lg transition-all duration-200 ${
                        emergencyStatus.isActive 
                          ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                          : 'bg-red-500 hover:bg-red-600 hover:scale-105'
                      }`}
                      onClick={handlePanicPress}
                      onTouchStart={handlePanicHoldStart}
                      onTouchEnd={handlePanicHoldEnd}
                      onMouseDown={handlePanicHoldStart}
                      onMouseUp={handlePanicHoldEnd}
                      onMouseLeave={handlePanicHoldEnd}
                      disabled={emergencyStatus.isActive}
                      aria-label="Emergency panic button - tap once for immediate help, double tap for silent help, hold for 3 seconds"
                    >
                      SOS
                    </Button>
                    
                    {/* Hold progress indicator */}
                    {isHolding && (
                      <div className="absolute inset-0 rounded-full">
                        <svg className="w-20 h-20 transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-red-200"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 36}`}
                            strokeDashoffset={`${2 * Math.PI * 36 * (1 - holdProgress / 100)}`}
                            className="text-white transition-all duration-100"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Tap • Double-tap • Hold (3s)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Immediate • Silent • Countdown
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Emergency Levels */}
                <div className="space-y-3">
                  <h4 className="font-medium">Emergency Levels</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start h-12 border-red-200 hover:bg-red-50"
                      onClick={() => activateEmergency('red')}
                      disabled={emergencyStatus.isActive}
                    >
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3" />
                      <div className="text-left">
                        <div className="font-medium text-red-700">Red Alert - Full Emergency</div>
                        <div className="text-xs text-red-600">Police + Contacts + Location</div>
                      </div>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start h-12 border-orange-200 hover:bg-orange-50"
                      onClick={() => activateEmergency('orange')}
                      disabled={emergencyStatus.isActive}
                    >
                      <div className="w-3 h-3 bg-orange-500 rounded-full mr-3" />
                      <div className="text-left">
                        <div className="font-medium text-orange-700">Orange Alert - Help Needed</div>
                        <div className="text-xs text-orange-600">Contacts + Location Sharing</div>
                      </div>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start h-12 border-yellow-200 hover:bg-yellow-50"
                      onClick={() => activateEmergency('yellow')}
                      disabled={emergencyStatus.isActive}
                    >
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3" />
                      <div className="text-left">
                        <div className="font-medium text-yellow-700">Yellow Alert - Check-in</div>
                        <div className="text-xs text-yellow-600">Simple Check-in</div>
                      </div>
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Emergency Tools */}
                <div className="space-y-3">
                  <h4 className="font-medium">Emergency Tools</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={flashlightOn ? "default" : "outline"}
                      className={`h-12 ${flashlightOn ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
                      onClick={toggleFlashlight}
                    >
                      <Flashlight className="h-4 w-4 mr-2" />
                      Flashlight
                    </Button>
                    
                    <Button
                      variant={alarmOn ? "destructive" : "outline"}
                      className="h-12"
                      onClick={toggleAlarm}
                    >
                      <Siren className="h-4 w-4 mr-2" />
                      Alarm
                    </Button>
                    
                    <Button
                      variant={fakeCallActive ? "default" : "outline"}
                      className="h-12"
                      onClick={startFakeCall}
                      disabled={fakeCallActive}
                    >
                      <PhoneCall className="h-4 w-4 mr-2" />
                      Fake Call
                    </Button>
                    
                    <Button
                      variant={voiceActivated ? "default" : "outline"}
                      className="h-12"
                      onClick={() => setVoiceActivated(!voiceActivated)}
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      Voice SOS
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Safety Controls</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Emergency Mode</p>
                    <p className="text-sm text-muted-foreground">Background monitoring active</p>
                  </div>
                  <Button
                    variant={emergencyMode ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => {
                      setEmergencyMode(!emergencyMode);
                      toast.success(emergencyMode ? 'Emergency mode disabled' : 'Emergency mode enabled');
                    }}
                  >
                    {emergencyMode ? 'Disable' : 'Enable'}
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Test Mode</p>
                    <p className="text-sm text-muted-foreground">Safe practice mode</p>
                  </div>
                  <Button
                    variant={testMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setTestMode(!testMode);
                      toast.success(testMode ? 'Test mode disabled' : 'Test mode enabled');
                    }}
                  >
                    <TestTube className="h-4 w-4 mr-1" />
                    {testMode ? 'Live' : 'Test'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Contacts & Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Emergency Contacts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-between h-12"
                    onClick={() => callContact(contact)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        contact.type === 'emergency' ? 'bg-red-500' :
                        contact.type === 'tourist' ? 'bg-blue-500' :
                        contact.type === 'embassy' ? 'bg-purple-500' :
                        'bg-green-500'
                      }`} />
                      <div className="text-left">
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-xs text-muted-foreground">{contact.number}</div>
                      </div>
                    </div>
                    <Phone className="h-4 w-4" />
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Location & Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">GPS Accuracy</span>
                    <Badge variant="outline" className="text-green-600">
                      ±3 meters
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Update</span>
                    <span className="text-sm text-muted-foreground">2 seconds ago</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sharing Status</span>
                    <Badge variant={systemStatus.location ? "default" : "secondary"}>
                      {systemStatus.location ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Emergency Contacts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Cancel Emergency Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Cancel Emergency</span>
            </DialogTitle>
            <DialogDescription>
              Enter your PIN to cancel the emergency alert. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter PIN"
              value={cancelPin}
              onChange={(e) => setCancelPin(e.target.value)}
              className="text-center text-lg"
              maxLength={4}
              autoComplete="off"
            />
            
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowCancelDialog(false)}>
                <X className="h-4 w-4 mr-2" />
                Keep Active
              </Button>
              <Button variant="destructive" className="flex-1" onClick={cancelEmergency}>
                Cancel Emergency
              </Button>
            </div>
            
            <p className="text-xs text-center text-muted-foreground">
              Demo PIN: 1234
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fake Call Overlay */}
      {fakeCallActive && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center text-white space-y-4">
            <div className="w-20 h-20 rounded-full bg-green-500 mx-auto flex items-center justify-center">
              <Phone className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold">Mom</h3>
            <p className="text-green-400">Incoming call...</p>
            <div className="flex space-x-4 justify-center pt-8">
              <Button
                variant="destructive"
                className="rounded-full w-16 h-16"
                onClick={() => setFakeCallActive(false)}
              >
                <X className="h-6 w-6" />
              </Button>
              <Button
                variant="default"
                className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600"
                onClick={() => setFakeCallActive(false)}
              >
                <Phone className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
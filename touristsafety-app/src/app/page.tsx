"use client";

import { useState } from "react";
import { Navigation } from '@/components/Navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, MapPin, Users, Settings, TrendingUp, Clock, Phone } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [safetyScore] = useState(87);
  const [activeAlerts] = useState(2);
  const [nearbyHelpers] = useState(12);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navigation />
      
      {/* Main Content Area */}
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
              Guardian Angel
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-6">
              Your comprehensive safety companion for secure travel in India. 
              Emergency response, real-time tracking, and AI-powered safety intelligence.
            </p>
            <div className="flex items-center justify-center space-x-4 mb-8">
              <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse" />
                System Online
              </Badge>
              <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <TrendingUp className="h-4 w-4 mr-2" />
                Safety Score: {safetyScore}
              </Badge>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Emergency Access */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-red-50 to-pink-50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <Link href="/emergency">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-lg">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-800">Emergency Panel</CardTitle>
                      <CardDescription className="text-red-600">Instant emergency response</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Access panic button, emergency contacts, and instant alerts
                  </p>
                  <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg">
                    <Phone className="h-4 w-4 mr-2" />
                    Access Emergency
                  </Button>
                </CardContent>
              </Link>
            </Card>

            {/* Location Tracking */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <Link href="/tracking">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-800">Live Tracking</CardTitle>
                      <CardDescription className="text-blue-600">Location sharing & routes</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Share your location, monitor routes, and set safe zones
                  </p>
                  <Button variant="outline" className="w-full border-2 border-blue-300 text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:border-transparent shadow-lg">
                    <MapPin className="h-4 w-4 mr-2" />
                    View Tracking
                  </Button>
                </CardContent>
              </Link>
            </Card>

            {/* Community Safety */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <Link href="/community">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-800">Community Safety</CardTitle>
                      <CardDescription className="text-green-600">{nearbyHelpers} helpers nearby</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Community alerts, safe locations, and verified helpers
                  </p>
                  <Button variant="outline" className="w-full border-2 border-green-300 text-green-600 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-500 hover:text-white hover:border-transparent shadow-lg">
                    <Users className="h-4 w-4 mr-2" />
                    View Community
                  </Button>
                </CardContent>
              </Link>
            </Card>
          </div>

          {/* Status Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Safety Overview */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <span>Safety Overview</span>
                </CardTitle>
                <CardDescription className="text-purple-600">Your current safety status and recent activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl shadow-lg">
                  <div>
                    <p className="font-medium text-white">Safety Score</p>
                    <p className="text-sm text-green-100">Excellent security level</p>
                  </div>
                  <div className="text-3xl font-bold text-white">{safetyScore}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl shadow-md">
                    <div className="text-2xl font-semibold text-orange-600">{activeAlerts}</div>
                    <div className="text-sm text-orange-500">Active Alerts</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl shadow-md">
                    <div className="text-2xl font-semibold text-cyan-600">24/7</div>
                    <div className="text-sm text-cyan-500">Monitoring</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-teal-50 to-cyan-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription className="text-teal-600">Latest safety updates and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl shadow-md">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-sm">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Location shared with family</p>
                    <p className="text-xs text-blue-600">2 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl shadow-md">
                  <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg shadow-sm">
                    <AlertTriangle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Safety alert in area</p>
                    <p className="text-xs text-orange-600">15 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl shadow-md">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg shadow-sm">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Connected to local network</p>
                    <p className="text-xs text-green-600">1 hour ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Settings Access */}
          <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-800">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <span>Quick Settings</span>
              </CardTitle>
              <CardDescription className="text-indigo-600">Customize your Guardian Angel experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" size="sm" asChild className="border-2 border-indigo-200 text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white hover:border-transparent shadow-md">
                  <Link href="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    All Settings
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="border-2 border-pink-200 text-pink-600 hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 hover:text-white hover:border-transparent shadow-md">
                  <Link href="/settings#emergency-contacts">
                    <Phone className="h-4 w-4 mr-2" />
                    Contacts
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="border-2 border-teal-200 text-teal-600 hover:bg-gradient-to-r hover:from-teal-500 hover:to-cyan-500 hover:text-white hover:border-transparent shadow-md">
                  <Link href="/settings#privacy">
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="border-2 border-orange-200 text-orange-600 hover:bg-gradient-to-r hover:from-orange-500 hover:to-yellow-500 hover:text-white hover:border-transparent shadow-md">
                  <Link href="/about">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Help
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
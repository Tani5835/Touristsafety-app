"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Menu, X, ChevronDown, Wifi, Award, Settings, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface NavigationProps {
  currentPath?: string;
}

interface NavigationItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

const navigationItems: NavigationItem[] = [
  { href: '/', label: 'Home' },
  { href: '/emergency', label: 'Emergency' },
  { href: '/tracking', label: 'Tracking' },
  { href: '/community', label: 'Community' },
  { href: '/settings', label: 'Settings' },
  { href: '/about', label: 'About' },
];

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇮🇳', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिंदी' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', nativeName: 'தமிழ்' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', nativeName: 'ಕನ್ನಡ' },
];

export const Navigation: React.FC<NavigationProps> = ({ currentPath }) => {
  const pathname = usePathname();
  const activePath = currentPath || pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [isOnline, setIsOnline] = useState(true);
  const [safetyScore] = useState(87);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    // Add language change logic here
  };

  const isActivePage = (href: string) => {
    if (href === '/') {
      return activePath === '/';
    }
    return activePath.startsWith(href);
  };

  const NavLink: React.FC<{ item: NavigationItem; mobile?: boolean }> = ({ item, mobile = false }) => (
    <Link
      href={item.href}
      className={`
        ${mobile ? 'block px-4 py-3 text-base' : 'px-3 py-2 text-sm'} 
        font-medium transition-colors duration-200 rounded-md
        ${isActivePage(item.href)
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-foreground hover:text-primary hover:bg-accent'
        }
      `}
      onClick={() => mobile && setIsMobileMenuOpen(false)}
      aria-current={isActivePage(item.href) ? 'page' : undefined}
    >
      {item.label}
    </Link>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand Section */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-primary rounded-lg group-hover:scale-105 transition-transform duration-200">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-heading font-bold text-lg text-foreground">Guardian Angel</h1>
              <p className="text-xs text-muted-foreground -mt-1">Tourist Safety</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
            {navigationItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>

          {/* User Controls */}
          <div className="flex items-center space-x-3">
            {/* Status Badges */}
            <div className="hidden md:flex items-center space-x-2">
              <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
                <Wifi className="h-3 w-3" />
                <span className="text-xs">{isOnline ? 'Online' : 'Offline'}</span>
              </Badge>
              
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Award className="h-3 w-3" />
                <span className="text-xs font-medium">{safetyScore}</span>
              </Badge>
            </div>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1" aria-label="Select language">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">{selectedLanguage.flag}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => handleLanguageChange(language)}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <span>{language.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-sm">{language.name}</span>
                      <span className="text-xs text-muted-foreground">{language.nativeName}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick Settings */}
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <Link href="/settings" aria-label="Quick settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader className="text-left">
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="p-1.5 bg-primary rounded-md">
                      <Shield className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span>Guardian Angel</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-1">
                  {/* Mobile Status Badges */}
                  <div className="flex items-center space-x-2 mb-4 px-4">
                    <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
                      <span className="text-xs">{isOnline ? 'Online' : 'Offline'}</span>
                    </Badge>
                    
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Award className="h-3 w-3" />
                      <span className="text-xs">Safety: {safetyScore}</span>
                    </Badge>
                  </div>

                  {/* Mobile Navigation Links */}
                  <nav role="navigation" aria-label="Mobile navigation">
                    {navigationItems.map((item) => (
                      <NavLink key={item.href} item={item} mobile />
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
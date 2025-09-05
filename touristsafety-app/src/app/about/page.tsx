"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, 
  MapPin, 
  Users, 
  Globe, 
  Lock, 
  Clock, 
  Brain, 
  ChevronDown, 
  Phone, 
  Mail, 
  ExternalLink, 
  Download, 
  Star, 
  CheckCircle, 
  AlertTriangle, 
  Heart, 
  Award, 
  Smartphone, 
  Languages, 
  Eye, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';

const Navigation = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <span className="font-heading font-bold text-xl text-foreground">Guardian Angel</span>
      </div>
      <div className="hidden md:flex items-center space-x-6">
        <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
        <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
        <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
        <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
      </div>
      <Button>Download App</Button>
    </div>
  </nav>
);

const CounterAnimation = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <div ref={counterRef} className="text-3xl font-bold text-primary">
      {count.toLocaleString()}{suffix}
    </div>
  );
};

export default function AboutPage() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Message sent successfully! We'll get back to you within 24 hours.");
    setContactForm({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  const features = [
    {
      icon: AlertTriangle,
      title: "Emergency Response",
      description: "Instant emergency alerts with GPS location sharing to emergency contacts and local authorities."
    },
    {
      icon: MapPin,
      title: "Live Location Tracking",
      description: "Real-time location sharing with trusted contacts and family members for enhanced safety."
    },
    {
      icon: Users,
      title: "Community Safety Network",
      description: "Connect with nearby users and local safety communities for mutual assistance and support."
    },
    {
      icon: Languages,
      title: "Multi-Language Support",
      description: "Available in Hindi, English, and 10+ Indian regional languages for accessibility."
    },
    {
      icon: Lock,
      title: "Privacy & Security",
      description: "End-to-end encryption and privacy-first design to protect your personal information."
    },
    {
      icon: Clock,
      title: "24/7 Monitoring",
      description: "Round-the-clock safety monitoring with AI-powered threat detection and response."
    },
    {
      icon: Brain,
      title: "AI Safety Intelligence",
      description: "Smart risk assessment using machine learning to predict and prevent safety incidents."
    },
    {
      icon: Smartphone,
      title: "Offline Functionality",
      description: "Core safety features work even without internet connectivity in remote areas."
    }
  ];

  const stats = [
    { label: "Active Users", value: 150000, suffix: "+" },
    { label: "Lives Protected", value: 500000, suffix: "+" },
    { label: "Emergency Responses", value: 25000, suffix: "+" },
    { label: "Cities Covered", value: 200, suffix: "+" }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Solo Traveler",
      content: "Guardian Angel saved my life when I got lost in the mountains. The emergency response was instant!",
      rating: 5
    },
    {
      name: "Raj Patel",
      role: "Business Traveler",
      content: "I feel so much safer knowing my family can track my location during business trips.",
      rating: 5
    },
    {
      name: "Ananya Das",
      role: "Student",
      content: "The community safety feature helped me find safe accommodation in an unfamiliar city.",
      rating: 5
    }
  ];

  const faqItems = [
    {
      question: "How does Guardian Angel's emergency response work?",
      answer: "When you activate the panic button, Guardian Angel immediately sends your GPS location and emergency alert to your pre-selected emergency contacts, local authorities, and nearby community members. The system works even with poor network connectivity."
    },
    {
      question: "Is my location data secure and private?",
      answer: "Yes, absolutely. We use end-to-end encryption for all location data. Your information is only shared with your explicitly chosen emergency contacts and is never sold to third parties. You have complete control over who can access your location."
    },
    {
      question: "Does the app work without internet connectivity?",
      answer: "Core safety features including emergency alerts and basic location sharing work through SMS when internet is unavailable. The app caches important safety information for offline access."
    },
    {
      question: "Which languages are supported?",
      answer: "Guardian Angel supports Hindi, English, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, and Assamese. We're continuously adding more regional languages."
    },
    {
      question: "How accurate is the AI safety intelligence?",
      answer: "Our AI system analyzes multiple data points including location patterns, time of day, local crime data, and weather conditions to provide safety recommendations with 85%+ accuracy, continuously improving through machine learning."
    },
    {
      question: "Is Guardian Angel free to use?",
      answer: "Basic safety features including emergency alerts and location sharing are completely free. Premium features like advanced AI insights and extended community access are available through affordable subscription plans."
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Arjun Mehta",
      role: "Co-Founder & CEO",
      expertise: "Safety Technology, AI Research"
    },
    {
      name: "Sneha Gupta",
      role: "Co-Founder & CTO",
      expertise: "Mobile Development, Security"
    },
    {
      name: "Vikram Singh",
      role: "Head of Emergency Response",
      expertise: "Crisis Management, Public Safety"
    },
    {
      name: "Dr. Maya Krishnan",
      role: "AI Safety Lead",
      expertise: "Machine Learning, Predictive Analytics"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              Winner - Smart India Hackathon 2024
            </Badge>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Your Digital Safety Companion
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Guardian Angel is India's first AI-powered personal safety app, designed to protect travelers, 
              students, and professionals with real-time emergency response and community-driven safety intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Download className="w-5 h-5 mr-2" />
                Download for Android
              </Button>
              <Button size="lg" variant="outline">
                <ExternalLink className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Statistics */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/5 to-accent">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Impact & Trust</h2>
            <p className="text-lg text-muted-foreground">Real numbers from real people whose lives we've touched</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <CounterAnimation end={stat.value} suffix={stat.suffix} />
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Guardian Angel Works */}
      <section id="how-it-works" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">How Guardian Angel Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple, intuitive process designed for emergency situations when every second counts
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-primary" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">1. Setup & Personalize</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Download the app, add emergency contacts, set your safety preferences, and customize alerts in your preferred language.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">2. Stay Protected</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  AI monitors your safety in real-time, shares location with trusted contacts, and provides intelligent safety recommendations.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">3. Emergency Response</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  In emergencies, tap the panic button for instant alerts to contacts, authorities, and nearby community members for immediate help.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Comprehensive Safety Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to stay safe, connected, and confident wherever you go
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardHeader className="p-0 mb-3">
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground">Real stories from people who trust Guardian Angel with their safety</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Everything you need to know about Guardian Angel</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible>
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-semibold">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground">
              Passionate experts dedicated to making India safer through technology
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center p-6">
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="font-semibold text-primary">{member.role}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-sm text-muted-foreground">{member.expertise}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Get in Touch</h2>
              <p className="text-lg text-muted-foreground">
                Have questions? Need support? We're here to help 24/7
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>+91 1800-GUARDIAN (1800-482-7342)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>support@guardianangel.in</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>Bengaluru, Karnataka, India</span>
                  </div>
                </div>
                <div className="mt-8">
                  <h4 className="font-semibold mb-4">Emergency Support</h4>
                  <p className="text-muted-foreground mb-2">
                    For immediate emergencies, use the panic button in the app or contact local emergency services.
                  </p>
                  <Badge variant="outline" className="border-destructive text-destructive">
                    Emergency Helpline: 112
                  </Badge>
                </div>
              </div>
              <Card className="p-6">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Your Message"
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                    {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Legal and Compliance */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Legal & Compliance</h2>
            <p className="text-lg text-muted-foreground">
              Transparent, compliant, and committed to your privacy
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardHeader className="p-0 mb-3">
                <CardTitle>Privacy Compliant</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground">
                  Fully compliant with India's Personal Data Protection Bill and international privacy standards.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6 text-center">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardHeader className="p-0 mb-3">
                <CardTitle>Government Certified</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground">
                  Certified by Ministry of Electronics & IT under Digital India initiative.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6 text-center">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardHeader className="p-0 mb-3">
                <CardTitle>Social Impact</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground">
                  Committed to making India safer for all, with special focus on women's safety initiatives.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-12">
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" size="sm">Privacy Policy</Button>
              <Button variant="outline" size="sm">Terms of Service</Button>
              <Button variant="outline" size="sm">Data Protection</Button>
              <Button variant="outline" size="sm">Accessibility Statement</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Ready to Stay Safe?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of Indians who trust Guardian Angel for their safety every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Download className="w-5 h-5 mr-2" />
                Download for Android
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Globe className="w-5 h-5 mr-2" />
                Available in 12+ Languages
              </Button>
            </div>
            <p className="text-sm mt-6 opacity-75">
              Free download • No subscription required for basic safety features
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-card border-t">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl">Guardian Angel</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Making India safer, one person at a time.
            </p>
            <p className="text-sm text-muted-foreground">
              © 2024 Guardian Angel Safety Technologies Pvt. Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
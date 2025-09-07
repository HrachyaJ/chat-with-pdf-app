import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  BrainCog,
  CheckCircle,
  Clock,
  FileText,
  Lock,
  MessageSquare,
  Star,
  Users,
  Zap,
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    name: "10x Faster Document Analysis",
    description:
      "Get instant answers from 100+ page documents in seconds, not hours.",
    icon: Zap,
    benefit: "Save 5+ hours per week",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    name: "Smart Memory System",
    description:
      "Remembers your conversation history and document context across sessions.",
    icon: BrainCog,
    benefit: "Never lose important insights",
    gradient: "from-purple-400 to-pink-500",
  },
  {
    name: "Interactive PDF Highlighting",
    description:
      "Automatically highlights relevant sections as you chat for easy reference.",
    icon: FileText,
    benefit: "Find sources instantly",
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    name: "Enterprise-Grade Security",
    description:
      "Your documents are encrypted and never stored permanently on our servers.",
    icon: Lock,
    benefit: "100% data privacy guaranteed",
    gradient: "from-green-400 to-emerald-500",
  },
  {
    name: "Multi-Language Support",
    description: "Works with PDFs in 50+ languages with accurate translations.",
    icon: MessageSquare,
    benefit: "Global document access",
    gradient: "from-indigo-400 to-purple-500",
  },
  {
    name: "Team Collaboration",
    description:
      "Share insights and collaborate on documents with your team members.",
    icon: Users,
    benefit: "Boost team productivity",
    gradient: "from-pink-400 to-rose-500",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Research Director",
    company: "TechCorp",
    content:
      "This tool cut my research time by 80%. I can now analyze multiple research papers in minutes instead of days.",
    rating: 5,
    avatar: "SC",
  },
  {
    name: "Mike Rodriguez",
    role: "Legal Associate",
    company: "Law Firm",
    content:
      "Game-changer for contract review. I can quickly find clauses and get explanations in plain English.",
    rating: 5,
    avatar: "MR",
  },
  {
    name: "Dr. Emily Watson",
    role: "Academic Researcher",
    company: "University",
    content:
      "Perfect for literature reviews. It helps me understand complex papers and find connections I would have missed.",
    rating: 5,
    avatar: "EW",
  },
];

const stats = [
  { value: "50,000+", label: "Documents Processed", icon: FileText },
  { value: "99.9%", label: "Accuracy Rate", icon: TrendingUp },
  { value: "2.3s", label: "Average Response Time", icon: Zap },
  { value: "4.9/5", label: "User Rating", icon: Star },
];

export default function Home() {
  return (
    <main className="flex-1 overflow-y-scroll">
      {/* Hero Section with Modern Gradient */}
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-18 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span className="text-white/90 font-medium">
                  AI-Powered Document Intelligence
                </span>
                <div className="flex items-center gap-1 ml-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 text-yellow-400 fill-current"
                    />
                  ))}
                  <span className="text-white/70 ml-1">4.9</span>
                </div>
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                  Turn Any PDF Into
                  <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                    Your AI Assistant
                  </span>
                </h1>

                <p className="text-lg sm:text-xl lg:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Upload documents and chat naturally. Get instant answers,
                  summaries, and insights that would take hours to find
                  manually.
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: CheckCircle, text: "10+ hours saved weekly" },
                  { icon: ShieldCheck, text: "Bank-level encryption" },
                  { icon: Zap, text: "Instant AI responses" },
                  { icon: Users, text: "10,000+ happy users" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all duration-300"
                  >
                    <item.icon className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-white/90 text-sm font-medium">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg px-8 py-6 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Start Free - Upload PDF
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 font-semibold text-lg px-8 py-6"
                >
                  <Link href="#demo">Watch Demo (2 min)</Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
                  No credit card required
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
                  Setup in 30 seconds
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
                  Cancel anytime
                </span>
              </div>
            </div>

            {/* Right Content - Interactive Demo */}
            <div className="relative lg:pl-8">
              {/* Floating Cards */}
              <div className="hidden lg:block absolute -top-8 -left-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-2xl p-4 max-w-xs z-10 transform rotate-[-5deg] hover:rotate-0 transition-all duration-500 hover:scale-110">
                <div className="flex items-center gap-2 mb-2 text-white">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">AI Response</span>
                </div>
                <p className="text-white/90 text-sm">
                  &quot;The key findings show a 40% improvement in
                  efficiency...&quot;
                </p>
              </div>

              <div className="hidden lg:block absolute -bottom-8 -right-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-2xl p-4 max-w-xs z-10 transform rotate-[5deg] hover:rotate-0 transition-all duration-500 hover:scale-110">
                <div className="flex items-center gap-2 mb-2 text-white">
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-semibold">Your Question</span>
                </div>
                <p className="text-white/90 text-sm">
                  &quot;What are the main conclusions of this research
                  paper?&quot;
                </p>
              </div>

              {/* Main Demo Container */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20"></div>
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/hero-demo.png"
                    alt="Chat with PDF AI Interface"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover rounded-3xl"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-3xl"></div>

                  {/* Overlay Stats */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">
                          AI Processing...
                        </span>
                      </div>
                      <span className="text-xs text-white/70">
                        Response in 2.3s
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Stats Bar */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 py-12 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-6 w-6 text-white/80 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Problem/Solution Section with Modern Cards */}
      <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
              <Clock className="h-4 w-4" />
              The Problem
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              You&apos;re Wasting{" "}
              <span className="text-red-600">15+ Hours Weekly</span> Reading
              PDFs Manually
            </h2>
            <p className="text-lg text-gray-600">
              While your competitors use AI to process documents instantly
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Before Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-red-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Without AI (Painful)
                  </h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Hours reading through lengthy documents",
                    "Can't find specific information quickly",
                    "Forget important details from previous docs",
                    "Struggle with technical language",
                    "Miss critical connections between documents",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="h-6 w-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-xs font-bold">
                          ✕
                        </span>
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* After Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-green-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    With AI (Effortless)
                  </h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Instant answers from any document",
                    "Find specific info in seconds",
                    "AI remembers everything across all docs",
                    "Get explanations in simple language",
                    "Discover hidden insights automatically",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid with Gradient Cards */}
      <div className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to Master Documents
            </h2>
            <p className="text-lg text-gray-600">
              Powerful AI features that save you hours every single day
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500`}
                ></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`h-14 w-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}
                    >
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      {feature.benefit}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials with Modern Design */}
      <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
              <Star className="h-4 w-4 fill-current" />
              Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Loved by 10,000+ Professionals
            </h2>
            <p className="text-lg text-gray-600">
              See why teams choose us for document intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
                    &quot;{testimonial.content}&quot;
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role} • {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative py-24 bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 overflow-hidden">
        <div className="absolute inset-0">
          {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"grid2\" width=\"40\" height=\"40\" patternUnits=\"userSpaceOnUse\"%3E%3Cpath d=\"M 40 0 L 0 0 0 40\" fill=\"none\" stroke=\"white\" stroke-width=\"0.5\" opacity=\"0.1\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100%25\" height=\"100%25\" fill=\"url(%23grid2)\"/%3E%3C/svg%3E')] opacity-20"></div> */}
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-white mb-8">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            Limited Time Offer
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Save 10+ Hours
            <span className="block py-2.5 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Every Single Week?
            </span>
          </h2>

          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands who&apos;ve transformed their document workflow.
            Start free, see results immediately.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              asChild
              size="lg"
              className="group bg-white text-purple-900 hover:bg-gray-100 font-bold text-lg px-10 py-6 shadow-2xl hover:shadow-white/20 transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Start Free Trial Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-white/70 text-sm">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              Setup in 30 seconds
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              Cancel anytime
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

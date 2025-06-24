import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  BrainCogIcon,
  CheckCircleIcon,
  ClockIcon,
  FileTextIcon,
  LockIcon,
  MessageSquareIcon,
  StarIcon,
  UsersIcon,
  ZapIcon
} from "lucide-react"

const features = [
  {
    name: "10x Faster Document Analysis",
    description: "Get instant answers from 100+ page documents in seconds, not hours.",
    icon: ZapIcon,
    benefit: "Save 5+ hours per week"
  },
  {
    name: "Smart Memory System",
    description: "Remembers your conversation history and document context across sessions.",
    icon: BrainCogIcon,
    benefit: "Never lose important insights"
  },
  {
    name: "Interactive PDF Highlighting",
    description: "Automatically highlights relevant sections as you chat for easy reference.",
    icon: FileTextIcon,
    benefit: "Find sources instantly"
  },
  {
    name: "Enterprise-Grade Security",
    description: "Your documents are encrypted and never stored permanently on our servers.",
    icon: LockIcon,
    benefit: "100% data privacy guaranteed"
  },
  {
    name: "Multi-Language Support",
    description: "Works with PDFs in 50+ languages with accurate translations.",
    icon: MessageSquareIcon,
    benefit: "Global document access"
  },
  {
    name: "Team Collaboration",
    description: "Share insights and collaborate on documents with your team members.",
    icon: UsersIcon,
    benefit: "Boost team productivity"
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Research Director",
    company: "TechCorp",
    content: "This tool cut my research time by 80%. I can now analyze multiple research papers in minutes instead of days.",
    rating: 5
  },
  {
    name: "Mike Rodriguez",
    role: "Legal Associate",
    company: "Law Firm",
    content: "Game-changer for contract review. I can quickly find clauses and get explanations in plain English.",
    rating: 5
  },
  {
    name: "Dr. Emily Watson",
    role: "Academic Researcher",
    company: "University",
    content: "Perfect for literature reviews. It helps me understand complex papers and find connections I would have missed.",
    rating: 5
  }
];

const stats = [
  { value: "50,000+", label: "Documents Processed" },
  { value: "99.9%", label: "Accuracy Rate" },
  { value: "2.3s", label: "Average Response Time" },
  { value: "4.9/5", label: "User Rating" }
];

export default function Home() {
  return (
    <main className="flex-1 overflow-scroll bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-indigo-500 rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-56 h-56 sm:w-80 sm:h-80 bg-purple-500 rounded-full opacity-10 translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Social Proof Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-white mb-6 sm:mb-8">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="font-medium">4.9/5 from 10,000+ users</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
                Turn Any PDF Into Your
                <br />
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Personal AI Assistant
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-indigo-100 mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
                Upload your document and chat with it like you&apos;re talking to the author. 
                Get instant answers, summaries, and insights in seconds.
              </p>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10 px-4 sm:px-0">
                <div className="flex items-center gap-3 text-white">
                  <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <span className="text-base sm:text-lg">Save 10+ hours per week</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <span className="text-base sm:text-lg">Works with any PDF</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <span className="text-base sm:text-lg">No credit card needed</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <span className="text-base sm:text-lg">Setup in 30 seconds</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start px-4 sm:px-0">
                <Button asChild size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200">
                  <Link href="/dashboard">
                    🚀 Start Free - Upload Your First PDF
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-indigo-200 text-xs sm:text-sm px-4 sm:px-0">
                <div className="flex items-center gap-2">
                  <LockIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Bank-level security</span>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>10,000+ happy users</span>
                </div>
                <div className="flex items-center gap-2">
                  <ZapIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>99.9% uptime</span>
                </div>
              </div>
            </div>

            {/* Right Content - Demo/Screenshot */}
            <div className="relative px-4 sm:px-0">
              {/* Floating Elements - Hidden on mobile for cleaner look */}
              <div className="hidden md:block absolute -top-4 -left-4 bg-white rounded-lg shadow-xl p-3 lg:p-4 max-w-xs z-10 transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquareIcon className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-900">Live Demo</span>
                </div>
                <p className="text-xs text-gray-600">&quot;What are the key findings in this research paper?&quot;</p>
              </div>
              
              <div className="hidden md:block absolute -bottom-4 -right-4 bg-green-500 text-white rounded-lg shadow-xl p-3 lg:p-4 max-w-xs z-10 transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Answer in 2.3s</span>
                </div>
                <p className="text-xs">&quot;The study shows a 40% improvement in efficiency when using AI-assisted document analysis...&quot;</p>
              </div>

              {/* Main Image Container */}
              <div className="relative bg-white rounded-xl lg:rounded-2xl shadow-2xl overflow-hidden transform hover:rotate-0 transition-transform duration-300 mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/3] relative">
                  <Image
                    src="https://imgur.com/VciRSTI.jpeg"
                    alt="Chat with PDF interface showing AI conversation"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover"
                    priority
                  />
                  
                  {/* Mobile-specific overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:from-black/20"></div>
                  
                  {/* Mobile floating elements as overlay */}
                  <div className="md:hidden absolute inset-x-4 bottom-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquareIcon className="h-3 w-3 text-indigo-600" />
                      <span className="text-xs font-medium text-gray-900">Try it now:</span>
                    </div>
                    <p className="text-xs text-gray-600">&quot;What are the key findings?&quot;</p>
                    <div className="flex items-center gap-2 mt-2 text-green-600">
                      <CheckCircleIcon className="h-3 w-3" />
                      <span className="text-xs font-medium">Instant AI response</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile CTA reminder */}
              <div className="md:hidden mt-6 text-center">
                <p className="text-indigo-200 text-sm">👆 This could be your document</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Stats */}
      <div className="bg-indigo-600 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-xs sm:text-sm text-indigo-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Problem/Solution Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tired of Drowning in PDFs?
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600">
              Most professionals waste <span className="font-bold text-red-600">15+ hours per week</span> reading documents manually. 
              Our AI reads them for you and answers any question instantly.
            </p>
          </div>

          <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
            {/* Before */}
            <div className="rounded-xl sm:rounded-2xl bg-red-50 p-6 sm:p-8 border-2 border-red-200">
              <h3 className="text-lg sm:text-xl font-semibold text-red-800 mb-4">❌ The Old Way (Painful)</h3>
              <ul className="space-y-3 text-red-700 text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-red-500 flex-shrink-0" />
                  <span>Hours spent reading through lengthy documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-red-500 flex-shrink-0" />
                  <span>Can&apos;t find specific information quickly</span>
                </li>
                <li className="flex items-start gap-2">
                  <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-red-500 flex-shrink-0" />
                  <span>Forget important details from previous documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-red-500 flex-shrink-0" />
                  <span>Struggle with complex technical language</span>
                </li>
              </ul>
            </div>

            {/* After */}
            <div className="rounded-xl sm:rounded-2xl bg-green-50 p-6 sm:p-8 border-2 border-green-200">
              <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-4">✅ The New Way (Effortless)</h3>
              <ul className="space-y-3 text-green-700 text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-green-500 flex-shrink-0" />
                  <span>Get instant answers from any document</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-green-500 flex-shrink-0" />
                  <span>Find specific information in seconds</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-green-500 flex-shrink-0" />
                  <span>AI remembers everything across all documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-green-500 flex-shrink-0" />
                  <span>Get explanations in simple, clear language</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Powerful Features
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything You Need to Master Your Documents
            </p>
          </div>

          <div className="mx-auto mt-12 sm:mt-16 grid max-w-7xl grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {feature.benefit}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{feature.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Join Thousands of Happy Users
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600">
              See how professionals are saving hours every week with Chat with PDF
            </p>
          </div>

          <div className="mx-auto mt-12 sm:mt-16 grid max-w-7xl grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm sm:text-base text-gray-900 mb-6">
                  &quot;{testimonial.content}&quot;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-gray-600">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-indigo-600 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Transform How You Work with Documents?
            </h2>
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl leading-7 sm:leading-8 text-indigo-200">
              Join 10,000+ professionals who&apos;ve already revolutionized their document workflow. 
              Start free - no credit card required.
            </p>
            
            <div className="mt-8 sm:mt-10 flex items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                <Link href="/dashboard">
                  Start Free Trial - Upload Your First PDF
                </Link>
              </Button>
            </div>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-indigo-200">
                ⚡ <span className="font-semibold">Setup takes 30 seconds</span> • 
                🔒 <span className="font-semibold">Your data stays private</span> • 
                🎯 <span className="font-semibold">Cancel anytime</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, FileText, Users, Shield, Clock, Award, Star, ChevronRight, Play } from 'lucide-react';
import { Footer } from '@/components/footer';
import { AuthRedirectWrapper } from '@/components/auth-redirect-wrapper';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <AuthRedirectWrapper>
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Legally compliant</span>
                  <span>•</span>
                  <span>Secure</span>
                  <span>•</span>
                  <span>Trusted by 50,000+ families</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Create Your Legal Will Online —{' '}
                  <span className="text-green-600">Instantly</span>
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-lg">
                  A step-by-step guided platform to generate your will with legal 
                  structure, clarity, and peace of mind.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 text-2xl font-bold shadow-lg transition-transform transform hover:scale-105 focus:ring-4 focus:ring-green-300"
                >
                  <Link href="/dashboard/create">Get Started</Link>
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>No credit card. No legal jargon.</span>
                </div>
              </div>

              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>15 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>50,000+ users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Bank-level security</span>
                </div>
              </div>
            </div>

            {/* Right Side - Will Preview */}
            <div className="relative">
              <Card className="bg-white shadow-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                        <span className="text-white text-sm">B</span>
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Last Will & Testament</div>
                        <div className="text-xs text-muted-foreground">Legally binding document</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Validated
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm">
                      I, [Your Name], declare this to be my Last Will and Testament
                    </p>
                    <p className="text-xs text-muted-foreground">
                      I revoke all prior wills and codicils made by me.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      I direct that all my debts and funeral expenses be paid...
                    </p>
                    <p className="text-xs text-green-600 italic">
                      Generated with legal compliance and clarity
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-3 h-3" />
                    <span>Beneficiaries Protected</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Your loved ones will receive clear instructions for asset distribution
                  </p>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="text-xs text-center text-muted-foreground">Signature</div>
                    <div className="text-xs text-center text-muted-foreground">Date: 7/17/2025</div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Floating validation badge */}
              <div className="absolute -top-4 -right-4 bg-green-600 text-white rounded-full p-3">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Trusted by families nationwide • Reviewed by legal experts • Secure and confidential
          </p>
          <div className="flex justify-center items-center gap-8 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Legal Review</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Family Focused</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Create Your Perfect Will</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive platform guides you through each step to ensure a legally sound and crystal-clear legacy document.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "Step-by-Step Builder",
                description: "Guided legal document creation. Clear, simple questions guide you through the process.",
                color: "bg-green-100 text-green-600"
              },
              {
                icon: Users,
                title: "Executor Setup",
                description: "Add and track your trusted list of executor options. Get clarity on who will manage your estate.",
                color: "bg-blue-100 text-blue-600"
              },
              {
                icon: Shield,
                title: "Estate Safeguards",
                description: "Protect your family's future. Your legacy built with robust backup structures.",
                color: "bg-purple-100 text-purple-600"
              },
              {
                icon: FileText,
                title: "Backup Str & Provisions",
                description: "Built with multiple layers that provide security and backup protocols for your family.",
                color: "bg-orange-100 text-orange-600"
              },
              {
                icon: Award,
                title: "State-Specific Design",
                description: "Legally compliant documents. Created according to your state's requirements.",
                color: "bg-red-100 text-red-600"
              },
              {
                icon: Users,
                title: "Witness Process",
                description: "Step by step walkthrough of witnesses and notary requirements for your state.",
                color: "bg-teal-100 text-teal-600"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 px-4 bg-slate-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-2xl font-bold mb-4">
            Join thousands who have already created their wills with our comprehensive platform.
            Start building your legacy today.
          </h3>
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
            <Link href="/dashboard/create">Start Your Will Today</Link>
          </Button>
        </div>
      </section>

      {/* Process Section */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Create Your Will in 6 Simple Steps</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our guided process makes creating a legally valid will straightforward and stress-free.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Personal Information",
                description: "Enter your name, address, and family details to get started.",
                color: "bg-green-600"
              },
              {
                step: "2",
                title: "Choose Executors",
                description: "Select trusted people to manage your estate and carry out your wishes.",
                color: "bg-green-600"
              },
              {
                step: "3",
                title: "Add Beneficiaries",
                description: "Name family members, friends, and organizations you want to benefit.",
                color: "bg-green-600"
              },
              {
                step: "4",
                title: "Distribute Assets",
                description: "Allocate your property, money, and personal belongings.",
                color: "bg-green-600"
              },
              {
                step: "5",
                title: "Special Instructions",
                description: "Add guardians for children and include any special requests.",
                color: "bg-green-600"
              },
              {
                step: "6",
                title: "Review & Sign",
                description: "Finalize your will and complete the legal signing process.",
                color: "bg-green-600"
              }
            ].map((step, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-full ${step.color} text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold`}>
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground mb-6">Ready to secure your family's future?</p>
            <Button asChild size="lg" className="bg-slate-900 hover:bg-slate-800 text-white">
              <Link href="/dashboard/create">Start Your Will Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Professional Documents Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800">Document Preview</Badge>
            <h2 className="text-4xl font-bold mb-4">Professional Will Documents</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how your will looks with our professionally formatted, legally structured document templates
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Document Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Document Controls</CardTitle>
                <CardDescription>Customize your document appearance and view options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Document Theme</h4>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm">Light</Button>
                    <Button variant="outline" size="sm">Dark</Button>
                    <Button variant="outline" size="sm">Sepia</Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">View Mode</h4>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm">Desktop</Button>
                    <Button variant="outline" size="sm">Mobile</Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Legal Compliance</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>All 50 States Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Legal Format Verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Witness Requirements Met</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full">Download PDF</Button>
                  <Button variant="outline" className="w-full">Print Document</Button>
                </div>
              </CardContent>
            </Card>

            {/* Document Preview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Document Preview</CardTitle>
                <CardDescription>Professional formatting with Times New Roman and proper legal spacing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 bg-white text-black min-h-96 space-y-4 font-times">
                  <div className="text-center">
                    <h3 className="text-xl font-bold">LAST WILL AND TESTAMENT</h3>
                    <p className="text-sm mt-2">of Michael Robert Johnson</p>
                  </div>
                  
                  <p className="text-sm">
                    I, Michael Robert Johnson, an alternate Executor.
                  </p>

                  <div className="space-y-3">
                    <h4 className="font-bold text-sm">III. ASSET DISTRIBUTION</h4>
                    
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-4 text-xs border-b pb-1">
                        <span className="font-semibold">Asset</span>
                        <span className="font-semibold">Beneficiary</span>
                        <span className="font-semibold">Percentage</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <span>Primary Residence</span>
                        <span>Sarah Elizabeth Smith</span>
                        <span>100%</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <span>Investment Portfolio</span>
                        <span>Emily Rose Smith</span>
                        <span>60%</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <span>Investment Portfolio</span>
                        <span>Daniel James Smith</span>
                        <span>40%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-sm">IV. GUARDIANSHIP</h4>
                    <p className="text-xs">
                      In the event of my death, I nominate Margaret Anne Johnson as guardian of my minor children, with David William Johnson as an alternate guardian.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-sm">V. SIGNATURES</h4>
                    <p className="text-xs">
                      IN WITNESS WHEREOF, I have hereunto set my hand this _____ day of _______, 2024.
                    </p>
                    
                    <div className="mt-6 space-y-4">
                      <div className="text-xs">John Michael Smith, Testator</div>
                      
                      <p className="text-xs">
                        The foregoing instrument was signed by the Testator in our presence, and by us, at the Testator's request and in the Testator's presence. None have subscribed their names as witnesses:
                      </p>
                      
                      <div className="grid grid-cols-2 gap-8 mt-6">
                        <div className="space-y-4">
                          <div className="border-b border-black text-xs">Witness 1 Signature</div>
                          <div className="border-b border-black text-xs">Print Name</div>
                          <div className="border-b border-black text-xs">Address</div>
                        </div>
                        <div className="space-y-4">
                          <div className="border-b border-black text-xs">Witness 2 Signature</div>
                          <div className="border-b border-black text-xs">Print Name</div>
                          <div className="border-b border-black text-xs">Address</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Auto-Generated Tables</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically formatted tables for assets, executors, and beneficiaries with proper legal structure
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Professional Typography</h3>
                <p className="text-sm text-muted-foreground">
                  Times New Roman font with proper line spacing and margins for legal document standards
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Signature Sections</h3>
                <p className="text-sm text-muted-foreground">
                  Properly formatted signature areas with witness sections meeting legal requirements
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Marquee */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Thousands of Families</h2>
            <p className="text-xl text-muted-foreground">
              Join families across all ages who have secured their legacy with our simple, accessible Will AI.
            </p>
          </div>

          {/* Marquee effect for testimonials */}
          <div className="relative overflow-x-hidden">
            <div
              className="flex gap-6 animate-marquee hover:[animation-play-state:paused] will-change-transform"
            >
              {[
                { name: "Sarah K.", rating: 5, text: "Finally created our will after putting it off for years. So much easier than I expected!" },
                { name: "Robert K.", rating: 5, text: "My grandson helped me and learned a lot about this too. Very user-friendly." },
                { name: "Maria L.", rating: 5, text: "The clear language was explained in plain English. It got complicated in every step I made." },
                { name: "Jennifer L.", rating: 5, text: "Great value creation process with clear and comprehensive. Easy to make changes and ensure everything is correct." },
                { name: "Amit S.", rating: 5, text: "I was able to create a will for my parents in Hindi and English. Very flexible and easy!" },
                { name: "Priya D.", rating: 5, text: "The step-by-step process made it simple. I feel secure about my family's future." },
                { name: "John M.", rating: 5, text: "I never thought making a will could be this easy. Highly recommended!" },
                { name: "Emily R.", rating: 5, text: "The support team answered all my questions. Great experience overall." },
                { name: "Suresh P.", rating: 5, text: "Affordable, fast, and legally sound. I tell all my friends about it." },
                { name: "Linda W.", rating: 5, text: "I finished my will in one sitting. The peace of mind is priceless." },
              ].concat([
                { name: "Sarah K.", rating: 5, text: "Finally created our will after putting it off for years. So much easier than I expected!" },
                { name: "Robert K.", rating: 5, text: "My grandson helped me and learned a lot about this too. Very user-friendly." },
                { name: "Maria L.", rating: 5, text: "The clear language was explained in plain English. It got complicated in every step I made." },
                { name: "Jennifer L.", rating: 5, text: "Great value creation process with clear and comprehensive. Easy to make changes and ensure everything is correct." },
                { name: "Amit S.", rating: 5, text: "I was able to create a will for my parents in Hindi and English. Very flexible and easy!" },
                { name: "Priya D.", rating: 5, text: "The step-by-step process made it simple. I feel secure about my family's future." },
                { name: "John M.", rating: 5, text: "I never thought making a will could be this easy. Highly recommended!" },
                { name: "Emily R.", rating: 5, text: "The support team answered all my questions. Great experience overall." },
                { name: "Suresh P.", rating: 5, text: "Affordable, fast, and legally sound. I tell all my friends about it." },
                { name: "Linda W.", rating: 5, text: "I finished my will in one sitting. The peace of mind is priceless." },
              ])
                .map((testimonial, index) => (
                  <div
                  key={index}
                  className="min-w-[300px] sm:min-w-[340px] max-w-sm w-full flex-shrink-0"
                >
                    <Card className="h-full">
                      <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center h-full">
                        <div className="flex mb-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p
                          className="testimonial-ellipsis text-xs sm:text-sm leading-snug mb-2 italic text-center"
                        >
                          "{testimonial.text}"
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-center">{testimonial.name}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-slate-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4">
            Your Will. Your Legacy. <span className="text-green-400">Done Right.</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Protect your family's future with a legally binding will that you can create 
            in minutes. No lawyers, no appointments, no stress—just peace of mind.
          </p>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: "Bank-Level Security",
                description: "Your data is protected with enterprise-grade encryption"
              },
              {
                title: "Legally Compliant",
                description: "Documents meet all state requirements and legal standards"
              },
              {
                title: "100% Private",
                description: "Your information stays confidential and secure"
              },
              {
                title: "Instant Download",
                description: "Get your completed will immediately after finishing"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 text-xl">
            <Link href="/dashboard/create">Start Creating Your Will</Link>
          </Button>
        </div>
      </section>

      {/* FAQ Preview */}
      <section id="faq" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {/* FAQ Accordion */}
            <div className="space-y-2">
              {[
                {
                  question: "Is this will legally binding?",
                  answer: "Yes, wills created on our platform are legally binding when properly signed and witnessed according to your state's requirements."
                },
                {
                  question: "How long does it take to complete?",
                  answer: "Most users complete their will in 10-20 minutes. The process is step-by-step and you can save your progress at any time."
                },
                {
                  question: "What if I need to make changes later?",
                  answer: "You can log in and update your will at any time. Simply make your changes and download or print the updated document."
                },
                {
                  question: "Is my information secure?",
                  answer: "Absolutely. We use bank-level encryption and never share your data. Your information is private and protected."
                },
                {
                  question: "What happens to my document when I create it?",
                  answer: "Your will is securely stored in your account. You can download, print, or share it whenever you need."
                },
                {
                  question: "Do I need a lawyer to review this?",
                  answer: "Our documents are designed to be legally valid without a lawyer, but you may consult one for extra peace of mind."
                },
                {
                  question: "Can I use this will in any state?",
                  answer: "Yes, our platform supports all 50 U.S. states and adapts to your local legal requirements."
                },
                {
                  question: "What if I have complex assets?",
                  answer: "Our platform covers most common scenarios. For highly complex estates, we recommend consulting an estate attorney."
                },
                {
                  question: "Is this suitable for older users?",
                  answer: "Yes, our interface is designed to be accessible and easy for all ages. Many seniors use our service successfully."
                },
                {
                  question: "How do I print or share my will?",
                  answer: "After completing your will, you can download a PDF or print it directly from your dashboard."
                }
              ].map((faq, index) => (
                <details key={index} className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 group">
                  <summary className="flex items-center justify-between cursor-pointer font-medium text-lg text-foreground group-open:text-green-600 transition-colors">
                    {faq.question}
                    <ChevronRight className="w-5 h-5 ml-2 text-muted-foreground group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="mt-3 text-muted-foreground text-base pl-1">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4 bg-green-50 dark:bg-green-950/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Your Security & Privacy Is Our Priority</h2>
            <p className="text-xl text-muted-foreground">
              Industry-leading security measures protect your sensitive information throughout the entire process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "256-bit SSL Encryption",
                description: "Bank-grade encryption protects your data during transmission",
                icon: Shield
              },
              {
                title: "GDPR Compliant",
                description: "Full compliance with international data protection standards",
                icon: CheckCircle
              },
              {
                title: "SOC 2 Certified",
                description: "Independently audited security controls and procedures",
                icon: Award
              },
              {
                title: "Legal Document Standards",
                description: "Meets or exceeds all federal and state legal requirements",
                icon: FileText
              },
              {
                title: "Zero-Knowledge Security",
                description: "We cannot access your personal will information",
                icon: Shield
              },
              {
                title: "Privacy Protected",
                description: "Your personal data never leaves our secure environment",
                icon: Users
              }
            ].map((feature, index) => (
              <Card key={index} className="border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
    </AuthRedirectWrapper>
  );
}
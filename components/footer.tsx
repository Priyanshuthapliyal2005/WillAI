'use client';

import Link from 'next/link';
import { FileText, Shield, Users, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold">Will Generator</span>
            </div>
            <p className="text-sm text-gray-400">
              Create legally binding wills with professional guidance and security.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>Legal Review</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>Family Focused</span>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimers" className="hover:text-white transition-colors">
                  Legal Disclaimers
                </Link>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-white transition-colors">
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/guide" className="hover:text-white transition-colors">
                  Will Guide
                </Link>
              </li>
              <li>
                <Link href="/estate-planning" className="hover:text-white transition-colors">
                  Estate Planning
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-white transition-colors">
                  Legal Articles
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-slate-700" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-400">
              © 2024 Will Generator. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Professional legal document generation platform
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-gray-500">
            <span>1-855-751-5342</span>
            <span>help@willgenerator.com</span>
            <span>Available Monday-Friday, 9AM-5PM EST</span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-xs text-gray-500 text-center">
          <p>
            Legal Disclaimer: This platform provides tools to create legal documents. 
            While our documents meet standard legal requirements, we recommend consulting 
            with an attorney for complex estates or specific legal questions.
          </p>
        </div>
      </div>
    </footer>
  );
}

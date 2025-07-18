'use client';

import Link from 'next/link';
import { FileText, Shield, Users, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold">Will AI</span>
            </div>
            <p className="text-sm text-gray-400">
              Create your legal will online with AI-powered guidance and security.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact & Social</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="https://linkedin.com/in/priyanshu-thapliyal/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  LinkedIn: linkedin.com/in/priyanshu-thapliyal
                </a>
              </li>
              <li>
                <a href="https://github.com/Priyanshuthapliyal2005" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  GitHub: Priyanshuthapliyal2005
                </a>
              </li>
              <li>
                <a href="https://priyanshuthapliyal.me/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Website: priyanshuthapliyal.me
                </a>
              </li>
              <li>
                <a href="mailto:priyanshuthapliyal2005@gmail.com" className="hover:text-white transition-colors">
                  Email: priyanshuthapliyal2005@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-slate-700" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-400">
              © 2025 Will AI. All rights reserved.
            </p>
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

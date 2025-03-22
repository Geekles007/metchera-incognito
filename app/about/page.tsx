'use client';

import Link from 'next/link';
import { ArrowLeftIcon, ShieldCheckIcon, BeakerIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import GoogleAds from '../../components/GoogleAds';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                Metchera ID Generator
              </Link>
            </div>
            <Link href="/">
              <Button variant="outline" leftIcon={<ArrowLeftIcon className="h-4 w-4" />}>
                Back to Generator
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
            About Metchera ID Generator
          </h1>

          <section className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle>What is Metchera ID Generator?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Metchera ID Generator is a service that creates realistic temporary identities with various details, including:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Full names (first name and surname)</li>
                  <li>Date of birth and age</li>
                  <li>Addresses (street, city, state, zip code, country)</li>
                  <li>Phone numbers</li>
                  <li>Temporary email addresses</li>
                  <li>AI-generated avatars</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Google Ad */}
          <GoogleAds adPosition="content" className="my-8" />

          <section className="mb-12 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex items-start gap-2">
                <ShieldCheckIcon className="h-6 w-6 text-primary flex-shrink-0" />
                <CardTitle>Privacy & Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  All generated identities are temporary and will expire after 7 days. We do not store any personal information about our users, and all generated data is fictional.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-start gap-2">
                <BeakerIcon className="h-6 w-6 text-secondary flex-shrink-0" />
                <CardTitle>Use Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Our service is ideal for developers testing applications, privacy-conscious individuals, creative writers, and anyone who needs temporary identity information.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="mb-12">
            <Card className="border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20">
              <CardHeader className="flex items-start gap-2">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                <CardTitle>Important Notice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  This service is intended for legitimate purposes only, such as:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 dark:text-gray-300">
                  <li>Software testing and development</li>
                  <li>Creative writing and fictional character development</li>
                  <li>Data privacy protection</li>
                  <li>Educational purposes</li>
                </ul>
                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-md border border-red-300 dark:border-red-700">
                  <p className="text-red-600 dark:text-red-400 font-medium">
                    Using generated identities for fraud, deception, or any illegal activities is strictly prohibited and may be subject to legal consequences.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Google Ad */}
          <GoogleAds adPosition="content" className="my-8" />

          <section className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Metchera ID Generator uses advanced algorithms to create realistic but entirely fictional identities:
                </p>
                <ol className="list-decimal pl-5 space-y-3 text-gray-600 dark:text-gray-300">
                  <li>
                    <strong className="text-gray-800 dark:text-white">Identity Generation:</strong> We use sophisticated data models to create realistic names, addresses, and other details that appear authentic but do not belong to real individuals.
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-white">Avatar Creation:</strong> The avatars are generated using AI technology to create realistic-looking profile pictures.
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-white">Temporary Email:</strong> The service provides temporary email addresses that follow common naming conventions but are not connected to actual email services.
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-white">Storage:</strong> Generated identities are stored securely and automatically deleted after 7 days.
                  </li>
                </ol>
              </CardContent>
            </Card>
          </section>

          <div className="flex justify-center">
            <Link href="/">
              <Button size="lg" leftIcon={<ArrowLeftIcon className="h-5 w-5" />}>
                Back to Generator
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} Metchera ID Generator. All rights reserved.
            </p>
            <div className="text-gray-500 dark:text-gray-400 text-sm mt-2 md:mt-0">
              <p className="text-center md:text-right">
                This service is for educational and testing purposes only.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Google Ads - Footer Ad */}
      <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <GoogleAds adPosition="footer" />
      </div>
    </div>
  );
} 
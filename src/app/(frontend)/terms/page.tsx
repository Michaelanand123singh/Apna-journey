import { Metadata } from 'next'
import { FileText, AlertCircle, CheckCircle, Scale, Ban, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Apna Journey',
  description: 'Read our terms and conditions to understand the rules and regulations for using Apna Journey platform for jobs and news.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Terms & Conditions | Apna Journey',
    description: 'Terms and conditions for using Apna Journey platform.',
    url: 'https://apnajourney.com/terms',
  },
  alternates: {
    canonical: 'https://apnajourney.com/terms',
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Scale className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Last Updated: December 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary-600" />
              Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Apna Journey. By accessing and using our website located at <strong>apnajourney.com</strong> ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms, please do not use our Service.
            </p>
          </section>

          {/* Use of Service */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-primary-600" />
              Use of the Service
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">You may use our Service only for lawful purposes and in accordance with these Terms:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Browse and search for job opportunities</li>
              <li>Read and share news articles</li>
              <li>Create an account and post job listings (for employers)</li>
              <li>Submit job applications (for job seekers)</li>
              <li>Share news articles and insights</li>
            </ul>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              User Accounts
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              To access certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Be at least 18 years old to use our services</li>
            </ul>
          </section>

          {/* User Conduct */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <Ban className="w-5 h-5 mr-2 text-red-600" />
              Prohibited Activities
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">You agree NOT to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Post false, misleading, or fraudulent content</li>
              <li>Impersonate any person or entity</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Transmit spam or unsolicited communications</li>
              <li>Use automated systems to scrape data</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Post discriminatory job listings</li>
              <li>Share malicious code or viruses</li>
            </ul>
          </section>

          {/* Content Posted */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Content You Post
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              By posting content on our platform, you grant us a worldwide, non-exclusive, royalty-free license to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Display your content on our website</li>
              <li>Moderate and edit your content as needed</li>
              <li>Remove your content at our discretion</li>
              <li>Use your content for promotional purposes</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              You retain all rights to your content but agree that we may store, reproduce, and display it as necessary to operate the Service.
            </p>
          </section>

          {/* Job Postings */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Job Listings
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              For employers posting jobs:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>You are responsible for the accuracy of job descriptions</li>
              <li>All job listings are subject to approval</li>
              <li>We reserve the right to reject or remove listings</li>
              <li>You must comply with equal employment opportunity laws</li>
              <li>Payment terms apply for premium job postings</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Intellectual Property
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The Service and its original content, features, and functionality are owned by Apna Journey and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our Service.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Third-Party Services
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our Service may contain links to third-party websites or services that we do not own or control. We are not responsible for the content, privacy policies, or practices of any third-party services. You acknowledge and agree that we are not liable for any damages or losses caused by third-party services.
            </p>
          </section>

          {/* Disclaimer */}
          <section className="bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
              Disclaimer of Warranties
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Our Service is provided "as is" and "as available" without any warranties, express or implied:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>We do not guarantee the accuracy of job listings</li>
              <li>We are not responsible for the hiring decisions of employers</li>
              <li>We do not guarantee job placement</li>
              <li>We do not warrant that the Service will be uninterrupted or error-free</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              In no event shall Apna Journey, its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Service. Our total liability shall not exceed the amount you paid us in the past 12 months.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Indemnification
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to defend, indemnify, and hold harmless Apna Journey and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of your use of the Service or violation of these Terms.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Termination
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We may terminate or suspend your account immediately, without prior notice, if you breach these Terms. Upon termination:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Your right to use the Service will cease immediately</li>
              <li>All data associated with your account may be deleted</li>
              <li>You will not be entitled to any refunds</li>
            </ul>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the Service after changes become effective constitutes your acceptance of the new Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Governing Law
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts in Bihar, India.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-primary-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary-600" />
              Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> legal@apnajourney.com</p>
              <p><strong>Address:</strong> Gaya, Bihar, India</p>
              <p><strong>Phone:</strong> +91 9876543210</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}


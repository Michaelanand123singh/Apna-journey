import { Metadata } from 'next'
import { Shield, Lock, Eye, FileText, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | Apna Journey',
  description: 'Read our privacy policy to understand how we collect, use, and protect your personal information on Apna Journey.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Privacy Policy | Apna Journey',
    description: 'Privacy policy for Apna Journey - Your data protection information.',
    url: 'https://apnajourney.com/privacy',
  },
  alternates: {
    canonical: 'https://apnajourney.com/privacy',
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
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
              <Shield className="w-5 h-5 mr-2 text-primary-600" />
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Apna Journey ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong>apnajourney.com</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              By using our service, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-primary-600" />
              Information We Collect
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We collect information that you provide directly to us and information that is collected automatically:
            </p>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Resume and job application details</li>
                  <li>Profile information when you create an account</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Usage Information</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>IP address and browser type</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Click patterns and navigation paths</li>
                  <li>Device information (type, operating system)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-primary-600" />
              How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">We use the collected information for various purposes:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>To provide and maintain our services</li>
              <li>To process job applications and communicate with you</li>
              <li>To send you job alerts and notifications</li>
              <li>To improve our website and user experience</li>
              <li>To analyze usage patterns and trends</li>
              <li>To detect and prevent fraud</li>
              <li>To comply with legal obligations</li>
              <li>To send marketing communications (with your consent)</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary-600" />
              Information Sharing and Disclosure
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Employers:</strong> When you apply for a job, we share your application with the hiring employer</li>
              <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our website</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly consent to sharing</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Your Privacy Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Access your personal information</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your information</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Cookies and Tracking
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Third-Party Links
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read the privacy policies of every website you visit.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-primary-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-primary-600" />
              Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> privacy@apnajourney.com</p>
              <p><strong>Address:</strong> Gaya, Bihar, India</p>
              <p><strong>Phone:</strong> +91 9876543210</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}


'use client'

import { useEffect, useMemo, useState } from 'react'
import { 
  MapPin, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle,
  AlertCircle,
  MessageSquare,
  User,
  Mail as MailIcon,
  FileText,
  Building2,
  Headphones,
  Zap,
  Shield
} from 'lucide-react'

import LoadingButton from '@/components/shared/LoadingButton'
import { useToast } from '@/hooks/useToast'
import StructuredData from '@/components/shared/StructuredData'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
  type: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const { success, error } = useToast()

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry', icon: MessageSquare },
    { value: 'job', label: 'Job Related', icon: Building2 },
    { value: 'news', label: 'News & Content', icon: FileText },
    { value: 'technical', label: 'Technical Support', icon: Headphones },
    { value: 'partnership', label: 'Partnership', icon: Zap },
    { value: 'other', label: 'Other', icon: Shield }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) {
      setSubmitStatus('error')
      setErrorMessage('Please correct the highlighted fields and try again.')
      error('Validation error', 'Please correct the highlighted fields and try again.')
      return
    }
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          type: 'general'
        })
        success('Message sent', 'We will get back to you soon.')
      } else {
        setSubmitStatus('error')
        setErrorMessage(data.message || 'Failed to submit inquiry')
        error('Submission failed', data.message || 'Failed to submit inquiry')
      }
    } catch {
      setSubmitStatus('error')
      setErrorMessage('Network error. Please try again.')
      error('Network error', 'Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const emailValid = useMemo(() => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(formData.email), [formData.email])
  const nameValid = useMemo(() => formData.name.trim().length >= 2, [formData.name])
  const subjectValid = useMemo(() => formData.subject.trim().length >= 4, [formData.subject])
  const messageValid = useMemo(() => formData.message.trim().length >= 10, [formData.message])
  const isFormValid = nameValid && emailValid && subjectValid && messageValid

  useEffect(() => {
    document.title = 'Contact Us | Apna Journey'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get in touch with Apna Journey for support, partnerships, jobs, and news inquiries. We typically respond within 24 hours.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Get in touch with Apna Journey for support, partnerships, jobs, and news inquiries. We typically respond within 24 hours.'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact Apna Journey',
          url: 'https://apnajourney.com/contact',
          mainEntity: {
            '@type': 'Organization',
            name: 'Apna Journey',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                email: 'info@apnajourney.com',
                areaServed: 'IN',
                availableLanguage: ['en', 'hi'],
              },
          },
        }}
      />
      
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium mb-5">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Us
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Get in touch with our team
            </h1>
            <p className="mt-5 text-slate-600 text-lg max-w-2xl">
              Have questions about jobs, news, or our platform? We&apos;re here to help and typically respond within 24 hours.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Contact Information
                </h2>
                <p className="text-slate-600">
                  Reach out through any of these channels. We typically respond within 24 hours.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 p-5 bg-white">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-slate-900 mb-1">Address</div>
                      <div className="text-sm text-slate-600">
                        New Delhi, India
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-5 bg-white">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-slate-900 mb-1">Email</div>
                      <div className="text-sm text-slate-600">
                        info@apnajourney.com
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-5 bg-white">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-slate-900 mb-1">Business Hours</div>
                      <div className="text-sm text-slate-600 leading-relaxed">
                        Mon-Fri: 9 AM - 6 PM<br />
                        Sat: 10 AM - 4 PM<br />
                        Sun: Closed
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-center mb-2">
                  <Zap className="w-5 h-5 text-emerald-700 mr-2" />
                  <div className="text-sm font-semibold text-slate-900">Quick Response</div>
                </div>
                <p className="text-sm text-slate-700">
                  We typically respond to all inquiries within 24 hours. For urgent matters, please email us directly.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Send us a message
                  </h2>
                  <p className="text-slate-600">
                    Fill out the form below and we&apos;ll get back to you as soon as possible.
                  </p>
                </div>

                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-green-800 mb-1">
                        Message sent successfully
                      </div>
                      <p className="text-sm text-green-700">
                        Thank you! Your message has been sent. We&apos;ll get back to you soon.
                      </p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-red-800 mb-1">
                        Error sending message
                      </div>
                      <p className="text-sm text-red-700">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          aria-invalid={!nameValid}
                          aria-describedby="name-help"
                          className={`w-full pl-10 pr-4 py-3 border ${nameValid || !formData.name ? 'border-slate-300' : 'border-red-400'} rounded-lg bg-slate-50 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {!nameValid && formData.name && (
                        <p id="name-help" className="mt-1.5 text-xs text-red-600">Name must be at least 2 characters</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          aria-invalid={!emailValid}
                          aria-describedby="email-help"
                          className={`w-full pl-10 pr-4 py-3 border ${emailValid || !formData.email ? 'border-slate-300' : 'border-red-400'} rounded-lg bg-slate-50 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                          placeholder="Enter your email"
                        />
                      </div>
                      {!emailValid && formData.email && (
                        <p id="email-help" className="mt-1.5 text-xs text-red-600">Enter a valid email address</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-2">
                      Inquiry Type *
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    >
                      {inquiryTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      aria-invalid={!subjectValid}
                      aria-describedby="subject-help"
                      className={`w-full px-4 py-3 border ${subjectValid || !formData.subject ? 'border-slate-300' : 'border-red-400'} rounded-lg bg-slate-50 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                      placeholder="What's this about?"
                    />
                    {!subjectValid && formData.subject && (
                      <p id="subject-help" className="mt-1.5 text-xs text-red-600">Subject must be at least 4 characters</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                      Message *
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        aria-invalid={!messageValid}
                        aria-describedby="message-help"
                        className={`w-full pl-10 pr-4 py-3 border ${messageValid || !formData.message ? 'border-slate-300' : 'border-red-400'} rounded-lg bg-slate-50 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all`}
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>
                    {!messageValid && formData.message && (
                      <p id="message-help" className="mt-1.5 text-xs text-red-600">Message must be at least 10 characters</p>
                    )}
                  </div>

                  <LoadingButton
                    type="submit"
                    loading={isSubmitting}
                    disabled={!isFormValid}
                    variant="primary"
                    size="lg"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 !focus:ring-emerald-500"
                    loadingText="Sending..."
                  >
                    <span className="inline-flex items-center space-x-2">
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </span>
                  </LoadingButton>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

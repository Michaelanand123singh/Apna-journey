'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Briefcase, 
  Building, 
  MapPin, 
  Calendar,
  Mail,
  Phone,
  Plus,
  X,
  CheckCircle
} from 'lucide-react'
import { JOB_CATEGORIES, JOB_TYPES } from '@/lib/constants/categories'
import { BIHAR_LOCATIONS } from '@/lib/constants/locations'
import LoadingButton from '@/components/shared/LoadingButton'
import RichTextEditor from '@/components/shared/RichTextEditor'

export default function PostJobPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    category: '',
    jobType: '',
    location: '',
    salary: '',
    requirements: [''],
    contactEmail: '',
    contactPhone: '',
    expiresAt: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (error) setError('')
  }

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements]
    newRequirements[index] = value
    setFormData(prev => ({ ...prev, requirements: newRequirements }))
  }

  const addRequirement = () => {
    setFormData(prev => ({ ...prev, requirements: [...prev.requirements, ''] }))
  }

  const removeRequirement = (index: number) => {
    if (formData.requirements.length > 1) {
      const newRequirements = formData.requirements.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, requirements: newRequirements }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required'
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters'
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters'
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required'
    } else if (formData.company.trim().length > 50) {
      newErrors.company = 'Company name cannot exceed 50 characters'
    }

    // Strip HTML tags for validation
    const descriptionText = formData.description.replace(/<[^>]*>/g, '').trim()
    
    if (!descriptionText) {
      newErrors.description = 'Job description is required'
    } else if (descriptionText.length < 50) {
      newErrors.description = 'Description must be at least 50 characters (without HTML formatting)'
    } else if (descriptionText.length > 2000) {
      newErrors.description = 'Description cannot exceed 2000 characters (without HTML formatting)'
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    if (!formData.jobType) {
      newErrors.jobType = 'Please select a job type'
    }

    if (!formData.location) {
      newErrors.location = 'Please select a location'
    }

    if (formData.requirements.filter(req => req.trim()).length === 0) {
      newErrors.requirements = 'At least one requirement is needed'
    } else {
      // Check individual requirement lengths
      for (let i = 0; i < formData.requirements.length; i++) {
        if (formData.requirements[i].trim() && formData.requirements[i].length > 200) {
          newErrors[`requirement_${i}`] = 'Each requirement cannot exceed 200 characters'
        }
      }
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email'
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'Contact phone is required'
    } else if (!/^[6-9]\d{9}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = 'Please enter a valid 10-digit phone number'
    }

    if (!formData.expiresAt) {
      newErrors.expiresAt = 'Expiry date is required'
    } else if (new Date(formData.expiresAt) <= new Date()) {
      newErrors.expiresAt = 'Expiry date must be in the future'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          requirements: formData.requirements.filter(req => req.trim())
        })
      })

      const data = await response.json()

      if (data.success) {
        setIsSubmitted(true)
      } else {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setError(data.message || 'Failed to post job')
        }
      }
    } catch (err) {
      setError('Failed to post job. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm max-w-md w-full p-8 text-center">
          <div className="text-green-500 mb-4">
            <CheckCircle className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Posted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your job posting has been submitted and is pending approval. You'll be notified once it's published.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/user/dashboard')}
              className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => {
                setIsSubmitted(false)
                setFormData({
                  title: '',
                  company: '',
                  description: '',
                  category: '',
                  jobType: '',
                  location: '',
                  salary: '',
                  requirements: [''],
                  contactEmail: '',
                  contactPhone: '',
                  expiresAt: ''
                })
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Post Another Job
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Briefcase className="w-8 h-8 text-primary-500" />
            <h1 className="text-2xl font-bold text-gray-800">Post a Job</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        maxLength={100}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.title ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Software Developer"
                      />
                    </div>
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        maxLength={50}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.company ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Tech Solutions Pvt Ltd"
                      />
                    </div>
                    {errors.company && (
                      <p className="mt-1 text-sm text-red-600">{errors.company}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Job Details</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description * <span className="text-xs text-gray-500 font-normal">(Rich text editor with formatting options)</span>
                    </label>
                    <RichTextEditor
                      content={formData.description}
                      onChange={(html) => {
                        setFormData(prev => ({ ...prev, description: html }))
                        if (errors.description) {
                          setErrors(prev => ({ ...prev, description: '' }))
                        }
                      }}
                      placeholder="Describe the job responsibilities, requirements, and what the candidate will be doing..."
                      minHeight="250px"
                      showToolbar={true}
                      userRole="user"
                      folder="apna-journey/jobs"
                    />
                    <div className="flex justify-between items-center mt-2">
                      {errors.description && (
                        <p className="text-sm text-red-600">{errors.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.category ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Category</option>
                        {JOB_CATEGORIES.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Type *
                      </label>
                      <select
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.jobType ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Type</option>
                        {JOB_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {errors.jobType && (
                        <p className="mt-1 text-sm text-red-600">{errors.jobType}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.location ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Location</option>
                        {BIHAR_LOCATIONS.map((location) => (
                          <option key={location.value} value={location.value}>
                            {location.label}
                          </option>
                        ))}
                      </select>
                      {errors.location && (
                        <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary in INR (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400 font-bold text-lg">₹</span>
                      </div>
                      <input
                        type="text"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        maxLength={50}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., ₹25,000 - ₹35,000 per month"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Requirements</h2>
                <div className="space-y-3">
                  {formData.requirements.map((requirement, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={requirement}
                          onChange={(e) => handleRequirementChange(index, e.target.value)}
                          maxLength={200}
                          className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors[`requirement_${index}`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter a requirement..."
                        />
                        {formData.requirements.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRequirement(index)}
                            className="p-2 text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {errors[`requirement_${index}`] && (
                        <p className="text-sm text-red-600">{errors[`requirement_${index}`]}</p>
                      )}
                      <p className={`text-xs ${
                        requirement.length > 180 ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        {requirement.length}/200 characters
                      </p>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="flex items-center text-primary-500 hover:text-primary-600 text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add another requirement
                  </button>
                </div>
                {errors.requirements && (
                  <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>
                )}
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.contactEmail ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="hr@company.com"
                      />
                    </div>
                    {errors.contactEmail && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.contactPhone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="9876543210"
                      />
                    </div>
                    {errors.contactPhone && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Job Expiry</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="expiresAt"
                      value={formData.expiresAt}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.expiresAt ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.expiresAt && (
                    <p className="mt-1 text-sm text-red-600">{errors.expiresAt}</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push('/user/dashboard')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <LoadingButton
                  type="submit"
                  loading={isLoading}
                  loadingText="Posting Job..."
                >
                  Post Job
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

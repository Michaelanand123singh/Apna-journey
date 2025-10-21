'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
  Save,
  Eye
} from 'lucide-react'
import { NEWS_CATEGORIES } from '@/lib/constants/categories'
import LoadingButton from '@/components/shared/LoadingButton'

export default function PostNewsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: '',
    tags: [] as string[],
    language: 'english' as 'english' | 'hindi',
    status: 'pending' as 'draft' | 'pending' | 'published',
    isFeatured: false,
    seoTitle: '',
    seoDescription: ''
  })
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imageUpload, setImageUpload] = useState({
    uploading: false,
    uploaded: false,
    error: '',
    preview: '',
    file: null as File | null
  })

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
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      setImageUpload(prev => ({ ...prev, uploading: true, error: '' }))

      const formData = new FormData()
      formData.append('image', file)
      formData.append('folder', 'apna-journey/news')

      const token = localStorage.getItem('token')
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setFormData(prev => ({ ...prev, featuredImage: data.data.url }))
        setImageUpload({
          uploading: false,
          uploaded: true,
          error: '',
          preview: data.data.url,
          file
        })
      } else {
        setImageUpload(prev => ({
          ...prev,
          uploading: false,
          error: data.message || 'Upload failed'
        }))
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setImageUpload(prev => ({
        ...prev,
        uploading: false,
        error: 'Upload failed. Please try again.'
      }))
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setImageUpload(prev => ({
          ...prev,
          error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.'
        }))
        return
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        setImageUpload(prev => ({
          ...prev,
          error: 'File size too large. Maximum size is 5MB.'
        }))
        return
      }

      handleImageUpload(file)
    }
  }

  const handleUrlUpload = async () => {
    if (!imageUpload.preview) return

    try {
      setImageUpload(prev => ({ ...prev, uploading: true, error: '' }))

      const token = localStorage.getItem('token')
      const response = await fetch('/api/upload/image', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          imageUrl: imageUpload.preview,
          folder: 'apna-journey/news'
        })
      })

      const data = await response.json()

      if (data.success) {
        setFormData(prev => ({ ...prev, featuredImage: data.data.url }))
        setImageUpload(prev => ({
          ...prev,
          uploading: false,
          uploaded: true,
          error: ''
        }))
      } else {
        setImageUpload(prev => ({
          ...prev,
          uploading: false,
          error: data.message || 'Upload failed'
        }))
      }
    } catch (error) {
      console.error('Error uploading from URL:', error)
      setImageUpload(prev => ({
        ...prev,
        uploading: false,
        error: 'Upload failed. Please try again.'
      }))
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.trim().length < 10) {
      newErrors.title = 'Title must be at least 10 characters'
    }
    
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required'
    } else if (formData.excerpt.trim().length < 20) {
      newErrors.excerpt = 'Excerpt must be at least 20 characters'
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    } else if (formData.content.trim().length < 50) {
      newErrors.content = 'Content must be at least 50 characters'
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    
    if (!formData.featuredImage.trim()) {
      newErrors.featuredImage = 'Featured image is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/user/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          router.push('/user/dashboard?tab=news')
        } else {
          if (data.errors) {
            setErrors(data.errors)
          } else {
            setErrors({ submit: data.message || 'Failed to create news article' })
          }
        }
      } else {
        const errorData = await response.json()
        if (errorData.errors) {
          setErrors(errorData.errors)
        } else {
          setErrors({ submit: errorData.message || 'Failed to create news article' })
        }
      }
    } catch (error) {
      console.error('Error creating news article:', error)
      setErrors({ submit: 'Failed to create news article' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Create News Article</h1>
                <p className="text-gray-600">Share news with the community</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>{previewMode ? 'Edit' : 'Preview'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {previewMode ? (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{formData.title || 'Untitled'}</h1>
              {formData.featuredImage && (
                <img
                  src={formData.featuredImage}
                  alt={formData.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              <div className="prose max-w-none">
                <p className="text-lg text-gray-600 mb-6">{formData.excerpt}</p>
                <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, '<br>') }} />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Basic Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      maxLength={200}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.title ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter news title"
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                      <p className="text-xs text-gray-500 ml-auto">{formData.title.length}/200</p>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleChange}
                      maxLength={500}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.excerpt ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Brief description of the news"
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.excerpt && <p className="text-sm text-red-600">{errors.excerpt}</p>}
                      <p className="text-xs text-gray-500 ml-auto">{formData.excerpt.length}/500</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.category ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select category</option>
                      {NEWS_CATEGORIES.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="english">English</option>
                      <option value="hindi">Hindi</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Featured Image</h2>
                
                <div className="space-y-4">
                  {/* Image Upload Options */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                      />
                    </div>

                    {/* URL Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Or paste image URL
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="url"
                          value={imageUpload.preview}
                          onChange={(e) => setImageUpload(prev => ({ ...prev, preview: e.target.value }))}
                          placeholder="https://example.com/image.jpg"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                          type="button"
                          onClick={handleUrlUpload}
                          disabled={!imageUpload.preview || imageUpload.uploading}
                          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {imageUpload.uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {formData.featuredImage && (
                    <div className="relative">
                      <img
                        src={formData.featuredImage}
                        alt="Featured image preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, featuredImage: '' }))
                          setImageUpload(prev => ({ ...prev, preview: '', uploaded: false }))
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {imageUpload.error && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{imageUpload.error}</span>
                    </div>
                  )}

                  {errors.featuredImage && (
                    <p className="text-sm text-red-600">{errors.featuredImage}</p>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Content</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={12}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.content ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Write your news article content here..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
                    <p className="text-xs text-gray-500 ml-auto">{formData.content.length} characters</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Tags</h2>
                
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Add a tag"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Add
                    </button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-primary-600 hover:text-primary-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SEO Settings */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">SEO Settings (Optional)</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      name="seoTitle"
                      value={formData.seoTitle}
                      onChange={handleChange}
                      maxLength={60}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="SEO optimized title"
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.seoTitle.length}/60</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Description
                    </label>
                    <textarea
                      name="seoDescription"
                      value={formData.seoDescription}
                      onChange={handleChange}
                      maxLength={160}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="SEO optimized description"
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.seoDescription.length}/160</p>
                  </div>
                </div>
              </div>

              {/* Publishing Options */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Publishing Options</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                      Mark as featured article
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="draft">Save as Draft</option>
                      <option value="published">Publish Now</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {errors.submit}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <LoadingButton
                  type="submit"
                  loading={loading}
                  loadingText="Creating..."
                  className="px-6 py-2"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {formData.status === 'draft' ? 'Save Draft' : 'Publish Article'}
                </LoadingButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

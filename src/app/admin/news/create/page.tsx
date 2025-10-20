'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Save, 
  Eye, 
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { NEWS_CATEGORIES } from '@/lib/constants/categories'
import LoadingButton from '@/components/shared/LoadingButton'

export default function CreateNewsPage() {
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
    status: 'draft' as 'draft' | 'published',
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
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleImageUpload = async (file: File) => {
    setImageUpload(prev => ({ ...prev, uploading: true, error: '' }))

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('folder', 'apna-journey/news')

      const token = localStorage.getItem('adminToken')
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
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        setImageUpload(prev => ({
          ...prev,
          error: 'File size too large. Maximum size is 5MB.'
        }))
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImageUpload(prev => ({
          ...prev,
          preview: e.target?.result as string,
          file
        }))
      }
      reader.readAsDataURL(file)

      // Upload the file
      handleImageUpload(file)
    }
  }

  const handleImageUrlUpload = async () => {
    if (!formData.featuredImage) return

    setImageUpload(prev => ({ ...prev, uploading: true, error: '' }))

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/upload/image', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          imageUrl: formData.featuredImage,
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
          error: '',
          preview: data.data.url
        }))
      } else {
        setImageUpload(prev => ({
          ...prev,
          uploading: false,
          error: data.message || 'Upload failed'
        }))
      }
    } catch (error) {
      console.error('Error uploading image from URL:', error)
      setImageUpload(prev => ({
        ...prev,
        uploading: false,
        error: 'Upload failed. Please try again.'
      }))
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, featuredImage: '' }))
    setImageUpload({
      uploading: false,
      uploaded: false,
      error: '',
      preview: '',
      file: null
    })
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
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch('/api/admin/news', {
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
          router.push('/admin/news')
        } else {
          if (data.errors) {
            setErrors(data.errors)
          } else {
            setErrors({ submit: data.message || 'Failed to create article' })
          }
        }
      } else {
        const errorData = await response.json()
        if (errorData.errors) {
          setErrors(errorData.errors)
        } else {
          setErrors({ submit: errorData.message || 'Failed to create article' })
        }
      }
    } catch (error) {
      console.error('Error creating article:', error)
      setErrors({ submit: 'Failed to create article' })
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create News Article</h1>
            <p className="text-gray-600 mt-1">Write and publish a new article</p>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setPreviewMode(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !previewMode
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Save className="w-4 h-4 mr-2 inline" />
            Edit
          </button>
          <button
            onClick={() => setPreviewMode(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              previewMode
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Eye className="w-4 h-4 mr-2 inline" />
            Preview
          </button>
        </div>
      </div>

      {previewMode ? (
        <div className="bg-white rounded-lg shadow p-8">
          <article>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{formData.title || 'Article Title'}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
              <span>Category: {formData.category || 'Uncategorized'}</span>
              <span>Language: {formData.language}</span>
              <span>Status: {formData.status}</span>
              {formData.isFeatured && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Featured</span>}
            </div>
            {formData.featuredImage && (
              <img
                src={formData.featuredImage}
                alt={formData.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            <p className="text-xl text-gray-600 mb-6">{formData.excerpt || 'Article excerpt...'}</p>
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, '<br>') }} />
            </div>
            {formData.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter article title (minimum 10 characters)"
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                  <p className={`text-sm ${formData.title.length < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                    {formData.title.length}/200 characters (min: 10)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select category</option>
                  {NEWS_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Featured Article
                </label>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image *
              </label>
              
              {/* Upload Methods */}
              <div className="space-y-4">
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                    disabled={imageUpload.uploading}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`cursor-pointer ${imageUpload.uploading ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <div className="flex flex-col items-center">
                      {imageUpload.uploading ? (
                        <>
                          <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-2" />
                          <p className="text-sm text-gray-600">Uploading...</p>
                        </>
                      ) : imageUpload.uploaded ? (
                        <>
                          <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                          <p className="text-sm text-green-600">Image uploaded successfully!</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            <span className="text-primary-600 font-medium">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP up to 5MB</p>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                {/* OR Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                {/* URL Upload */}
                <div className="space-y-2">
                  <input
                    type="url"
                    name="featuredImage"
                    value={formData.featuredImage}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.featuredImage ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://example.com/image.jpg"
                    disabled={imageUpload.uploading}
                  />
                  {formData.featuredImage && !imageUpload.uploaded && (
                    <button
                      type="button"
                      onClick={handleImageUrlUpload}
                      disabled={imageUpload.uploading}
                      className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {imageUpload.uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload to Cloudinary
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Error Messages */}
                {imageUpload.error && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{imageUpload.error}</span>
                  </div>
                )}
                {errors.featuredImage && <p className="text-red-500 text-sm">{errors.featuredImage}</p>}

                {/* Image Preview */}
                {(imageUpload.preview || formData.featuredImage) && (
                  <div className="relative">
                    <img
                      src={imageUpload.preview || formData.featuredImage}
                      alt="Preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {imageUpload.uploaded && (
                      <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Uploaded
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.excerpt ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brief description of the article (minimum 20 characters)"
              />
              <div className="flex justify-between items-center mt-1">
                {errors.excerpt && <p className="text-red-500 text-sm">{errors.excerpt}</p>}
                <p className={`text-sm ${formData.excerpt.length < 20 ? 'text-red-500' : 'text-gray-500'}`}>
                  {formData.excerpt.length}/500 characters (min: 20)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Content</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Article Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={15}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Write your article content here... (minimum 50 characters)"
              />
              <div className="flex justify-between items-center mt-1">
                {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
                <p className={`text-sm ${formData.content.length < 50 ? 'text-red-500' : 'text-gray-500'}`}>
                  {formData.content.length} characters (min: 50)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
            
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Add
              </button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">SEO Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="SEO optimized title (optional)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.seoTitle.length}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Description
                </label>
                <textarea
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="SEO optimized description (optional)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.seoDescription.length}/160 characters
                </p>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{errors.submit}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Creating..."
            >
              <Save className="w-4 h-4 mr-2" />
              Create Article
            </LoadingButton>
          </div>
        </form>
      )}
    </div>
  )
}

import { z } from 'zod'

// User validation schemas
export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .trim(),
  email: z.string()
    .email('Please enter a valid email address')
    .toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  phone: z.string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number')
    .optional(),
})

export const loginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .toLowerCase(),
  password: z.string()
    .min(1, 'Password is required'),
})

// Job validation schemas
export const createJobSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .trim(),
  company: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(50, 'Company name cannot exceed 50 characters')
    .trim(),
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  category: z.enum(['government', 'private', 'part-time', 'internship', 'work-from-home', 'freelance', 'education', 'healthcare', 'banking', 'it', 'marketing', 'other']),
  jobType: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  location: z.enum(['patna', 'gaya', 'bhagalpur', 'muzaffarpur', 'darbhanga', 'purnia', 'bihar-sharif', 'arrah', 'begusarai', 'katihar', 'munger', 'chapra', 'saharsa', 'sasaram', 'hajipur', 'dehri', 'bettiah', 'motihari', 'buxar', 'kishanganj', 'sitamarhi', 'gopalganj', 'madhubani', 'siwan', 'jehanabad', 'aurangabad', 'nawada', 'jamui', 'lakhisarai', 'sheikhpura', 'banka', 'arwal', 'sheohar', 'kaimur', 'rohtas', 'bhojpur', 'other']),
  salary: z.string()
    .max(50, 'Salary cannot exceed 50 characters')
    .optional(),
  requirements: z.array(z.string().max(200, 'Each requirement cannot exceed 200 characters'))
    .min(1, 'At least one requirement is required'),
  contactEmail: z.string()
    .email('Please enter a valid contact email'),
  contactPhone: z.string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number'),
  expiresAt: z.string()
    .refine((date) => new Date(date) > new Date(), 'Expiry date must be in the future'),
})

export const jobApplicationSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  applicantName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .trim(),
  email: z.string()
    .email('Please enter a valid email address')
    .toLowerCase(),
  phone: z.string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number'),
  resumeUrl: z.string()
    .url('Please enter a valid resume URL'),
  coverLetter: z.string()
    .max(1000, 'Cover letter cannot exceed 1000 characters')
    .optional(),
})

// News validation schemas
export const createNewsSchema = z.object({
  title: z.string()
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
  excerpt: z.string()
    .min(20, 'Excerpt must be at least 20 characters')
    .max(500, 'Excerpt cannot exceed 500 characters'),
  content: z.string()
    .min(50, 'Content must be at least 50 characters'),
  featuredImage: z.string()
    .min(1, 'Featured image is required'),
  category: z.enum(['politics', 'education', 'crime', 'sports', 'business', 'local-events', 'development', 'health', 'entertainment', 'technology', 'environment', 'other']),
  tags: z.array(z.string().max(30, 'Each tag cannot exceed 30 characters'))
    .optional()
    .default([]),
  language: z.enum(['en', 'hi'])
    .default('en'),
  status: z.enum(['draft', 'pending', 'published'])
    .optional()
    .default('pending'),
  isFeatured: z.boolean()
    .default(false),
  seoTitle: z.string()
    .max(60, 'SEO title should not exceed 60 characters')
    .optional(),
  seoDescription: z.string()
    .max(160, 'SEO description should not exceed 160 characters')
    .optional(),
})

// Query validation schemas
export const paginationSchema = z.object({
  page: z.string()
    .regex(/^\d+$/, 'Page must be a number')
    .transform((val) => Number(val))
    .refine((n) => n > 0, 'Page must be greater than 0')
    .default(() => 1)
    .catch(1),
  limit: z.string()
    .regex(/^\d+$/, 'Limit must be a number')
    .transform((val) => Number(val))
    .refine((n) => n > 0 && n <= 100, 'Limit must be between 1 and 100')
    .default(() => 10)
    .catch(10),
})

export const jobFiltersSchema = z.object({
  category: z.string().optional(),
  jobType: z.string().optional(),
  location: z.string().optional(),
  search: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
})

export const newsFiltersSchema = z.object({
  category: z.string().optional(),
  language: z.string().optional(),
  search: z.string().optional(),
  featured: z.string().optional(),
  status: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
})

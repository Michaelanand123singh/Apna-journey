export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export function generateSlug(title: string, existingSlugs: string[] = []): string {
  let baseSlug = slugify(title)
  let slug = baseSlug
  let counter = 1
  
  // Check if slug already exists and make it unique
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }
  
  return slug
}

export function validateSlug(slug: string): boolean {
  // Check if slug contains only lowercase letters, numbers, and hyphens
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugRegex.test(slug) && slug.length > 0 && slug.length <= 100
}

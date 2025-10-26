/**
 * Global Loading Progress Bar Utilities
 * 
 * Use these functions to manually trigger the loading progress bar
 * throughout your application whenever async operations are happening.
 */

/**
 * Triggers the global loading progress bar to start showing
 * Use this before making API calls or async operations
 */
export const triggerLoading = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('loading-start'))
  }
}

/**
 * Triggers the global loading progress bar to complete and hide
 * Use this after your async operations complete
 */
export const stopLoading = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('loading-complete'))
  }
}

/**
 * Wraps an async function with loading states
 * Automatically shows and hides the loading bar
 */
export const withLoadingBar = async <T>(asyncFn: () => Promise<T>): Promise<T> => {
  triggerLoading()
  try {
    const result = await asyncFn()
    return result
  } finally {
    stopLoading()
  }
}

/**
 * Example usage in a component:
 * 
 * const handleSubmit = async (data) => {
 *   await withLoadingBar(async () => {
 *     const response = await fetch('/api/endpoint', {
 *       method: 'POST',
 *       body: JSON.stringify(data)
 *     })
 *     return await response.json()
 *   })
 * }
 * 
 * // Or manual control:
 * 
 * const handleAction = async () => {
 *   triggerLoading()
 *   try {
 *     await someAsyncOperation()
 *   } finally {
 *     stopLoading()
 *   }
 * }
 */


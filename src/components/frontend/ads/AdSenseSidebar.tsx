'use client'

interface AdSenseSidebarProps {
  slot: string
  className?: string
  placeholder?: string
}

export default function AdSenseSidebar({ 
  slot, 
  className = "",
  placeholder = "Advertisement"
}: AdSenseSidebarProps) {
  // In development, show placeholder
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm font-medium ${className}`}>
        <div className="text-center p-4">
          <div className="w-12 h-32 mx-auto mb-2 bg-gray-300 rounded"></div>
          <div>{placeholder}</div>
          <div className="text-xs mt-1">Ad Slot: {slot}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`adsense-sidebar ${className}`}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense client ID
        data-ad-slot={slot}
        data-ad-format="rectangle"
        data-full-width-responsive="true"
      />
    </div>
  )
}



'use client'

import Link from 'next/link'
import Script from 'next/script'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://apnajourney.com'
            },
            ...items.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 2,
                name: item.label,
                ...(item.href && { item: `https://apnajourney.com${item.href}` })
            }))
        ]
    }

    return (
        <>
            <Script
                id="breadcrumb-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
                strategy="beforeInteractive"
            />
            <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
                <ol className="flex items-center flex-wrap gap-2 text-sm">
                    <li>
                        <Link
                            href="/"
                            className="text-slate-600 hover:text-green-600 transition-colors flex items-center"
                            aria-label="Home"
                        >
                            <Home className="w-4 h-4" />
                        </Link>
                    </li>
                    {items.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    className="text-slate-600 hover:text-green-600 transition-colors truncate"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-slate-900 font-medium truncate" aria-current="page">
                                    {item.label}
                                </span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    )
}

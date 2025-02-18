import { cn } from '@/lib/utils'           // Utility function for conditionally joining class names
import { HTMLAttributes } from 'react'      // Type for standard HTML div props

interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
    imgSrc: string                          // The image to display inside the phone screen
    dark?: boolean                          // Flag to choose a phone template with dark edges
}

// The Phone component receives an image source, a possible dark mode, and additional props
const Phone = ({ imgSrc, className, dark = false, ...props }: PhoneProps) => {
    return (
        // A wrapping div that applies combined class names and any extra props
        <div
            className={cn(
                // Basic styling for position, pointer-events, z-index, and overflow
                'relative pointer-events-none z-50 overflow-hidden',
                className
            )}
            {...props}
        >
            {/* Depending on dark prop, choose which phone template (dark edges or white edges) */}
            <img
                src={
                    dark
                        ? '/phone-template-dark-edges.png'
                        : '/phone-template-white-edges.png'
                }
                className='pointer-events-none z-50 select-none'
                alt='phone image'
            />

            {/* A container placed behind the phone template, using negative z-index */}
            <div className='absolute -z-10 inset-0'>
                {/* The image that appears inside the phone screen */}
                <img
                    className='object-cover min-w-full min-h-full'
                    src={imgSrc}
                    alt='overlaying phone image'
                />
            </div>
        </div>
    )
}

export default Phone

/**
 * AsyncImage — non-blocking image component for low-spec devices
 *
 * Features:
 *  • Intersection Observer — starts loading only when near the viewport
 *  • decoding="async" — decodes off the UI thread (no jank)
 *  • Native loading="lazy" — browser-level lazy load fallback
 *  • <picture> + WebP source — serves .webp when available, falls back to original
 *  • Lightweight skeleton placeholder — keeps layout stable while loading
 *  • Error state with friendly fallback UI
 *  • fetchpriority="high" override for above-the-fold critical images
 */

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  type CSSProperties,
  type ImgHTMLAttributes,
} from 'react'
import { cn } from '@/lib/utils'

type FetchPriority = 'auto' | 'high' | 'low'

interface AsyncImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'loading'> {
  src: string
  alt: string
  /** Extra CSS classes for the wrapper <div> */
  wrapperClassName?: string
  /** Extra inline style for the wrapper <div> */
  wrapperStyle?: CSSProperties
  /** Show skeleton while loading (default: true) */
  showSkeleton?: boolean
  /** Root margin for IntersectionObserver — how early to start loading (default: "200px") */
  rootMargin?: string
  /** Override fetch priority for above-the-fold images (default: "auto") */
  fetchPriority?: FetchPriority
  /** Custom placeholder element shown before the image loads */
  placeholder?: React.ReactNode
  /** Aspect ratio CSS value, e.g. "16/9" or "4/3" — prevents layout shift */
  aspectRatio?: string
}

/** Derives the .webp sibling path from any image URL */
function toWebPSrc(src: string): string {
  if (!src) return src
  if (src.startsWith('data:') || src.includes('.webp')) return src
  return src.replace(/\.(png|jpe?g|gif)(\?.*)?$/i, '.webp$2')
}

/** Whether the browser supports the IntersectionObserver API */
const hasIO = typeof IntersectionObserver !== 'undefined'

export const AsyncImage = React.memo(function AsyncImage({
  src,
  alt,
  className,
  wrapperClassName,
  wrapperStyle,
  showSkeleton = true,
  rootMargin = '200px',
  fetchPriority = 'auto',
  placeholder,
  aspectRatio,
  onLoad,
  onError,
  ...rest
}: AsyncImageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [inView, setInView]     = useState(!hasIO)
  const [loaded, setLoaded]     = useState(false)
  const [errored, setErrored]   = useState(false)

  // Trigger load when wrapper enters viewport
  useEffect(() => {
    if (!hasIO || inView) return
    const el = wrapperRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, inView])

  const handleLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setLoaded(true)
      onLoad?.(e)
    },
    [onLoad]
  )

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setErrored(true)
      onError?.(e)
    },
    [onError]
  )

  const webpSrc = toWebPSrc(src)
  const isWebP  = src.includes('.webp') || src.startsWith('data:')

  const wrapStyle: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    ...(aspectRatio ? { aspectRatio } : {}),
    ...wrapperStyle,
  }

  return (
    <div ref={wrapperRef} style={wrapStyle} className={wrapperClassName}>

      {/* Skeleton / placeholder — visible until image loads */}
      {showSkeleton && !loaded && !errored && (
        placeholder ?? (
          <div
            aria-hidden="true"
            className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700"
            style={{ backgroundSize: '200% 100%' }}
          />
        )
      )}

      {/* Error state */}
      {errored && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 text-xs gap-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <span>{alt || 'Image'}</span>
        </div>
      )}

      {/* Actual image — only mounted once in viewport */}
      {inView && !errored && (
        <picture>
          {/* WebP source for browsers that support it */}
          {!isWebP && <source srcSet={webpSrc} type="image/webp" />}

          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            fetchPriority={fetchPriority}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'transition-opacity duration-300',
              loaded ? 'opacity-100' : 'opacity-0',
              className
            )}
            {...rest}
          />
        </picture>
      )}
    </div>
  )
})

/**
 * CriticalImage — for above-the-fold images that should load immediately.
 * Skips IntersectionObserver and uses fetchpriority="high".
 */
export function CriticalImage({ src, alt, className, ...rest }: AsyncImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)
  const webpSrc = toWebPSrc(src)
  const isWebP  = src.includes('.webp') || src.startsWith('data:')

  return (
    <picture>
      {!isWebP && <source srcSet={webpSrc} type="image/webp" />}
      <img
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={cn(
          'transition-opacity duration-200',
          loaded || errored ? 'opacity-100' : 'opacity-0',
          className
        )}
        {...rest}
      />
    </picture>
  )
}

export default AsyncImage

'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  reviews,
  FB_REVIEWS_URL,
  FB_RECOMMEND_PERCENT,
  FB_REVIEW_COUNT,
  type Review,
} from '@/data/reviews'

// How many reviews to surface in the homepage "Wall of Love" (a random
// selection each visit — kept curated so it reads as genuine, not spammy).
const DISPLAY_COUNT = 6

/** Pick `count` random items from a list after mount (SSR-safe: starts stable).
 *  Shuffles once on mount only — `list`/`count` are treated as fixed for the
 *  component's lifetime, so callers can pass a freshly-built array each render
 *  without triggering a re-shuffle loop. */
function useShuffled(list: Review[], count: number) {
  const [items, setItems] = useState<Review[]>(() => list.slice(0, count))
  useEffect(() => {
    setItems([...list].sort(() => Math.random() - 0.5).slice(0, count))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return items
}

function Stars({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <div className="flex gap-0.5" aria-label="5 de 5 estrellas">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`${className} text-amber-400`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.063 9.801c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.518-4.674z" />
        </svg>
      ))}
    </div>
  )
}

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('')
}

function Avatar({ review, size = 48 }: { review: Review; size?: number }) {
  if (review.image) {
    return (
      <Image
        src={review.image}
        alt={review.name}
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="rounded-full object-cover shrink-0"
      />
    )
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-red-100 text-red-700 flex items-center justify-center font-semibold shrink-0"
      aria-hidden="true"
    >
      {initials(review.name)}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <a
      href={FB_REVIEWS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <Avatar review={review} />
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{review.name}</p>
          <div className="flex items-center gap-2">
            <Stars />
            <span className="text-xs text-gray-400">{review.date}</span>
          </div>
        </div>
        <FacebookIcon className="w-5 h-5 ml-auto text-[#1877F2] shrink-0" />
      </div>
      <p className="text-gray-600 leading-relaxed flex-1">{review.text}</p>
      <span className="mt-4 text-sm font-medium text-red-600 group-hover:text-red-700 inline-flex items-center gap-1">
        Ver en Facebook
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </span>
    </a>
  )
}

/** Compact pill for the hero: stars + "100% recomendado · 14 reseñas en Facebook". */
export function ReviewsBadge({ className = '' }: { className?: string }) {
  return (
    <a
      href={FB_REVIEWS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-full pl-3 pr-4 py-2 hover:border-gray-300 hover:shadow transition-all ${className}`}
    >
      <FacebookIcon className="w-4 h-4 text-[#1877F2] shrink-0" />
      <Stars />
      <span className="text-sm font-medium text-gray-700">
        {FB_RECOMMEND_PERCENT}% recomendado · {FB_REVIEW_COUNT} reseñas
      </span>
    </a>
  )
}

/** Compact proof block for the property sidebar, near the contact CTA. */
export function ReviewsCompact() {
  // Prefer short reviews so the block stays compact next to the CTA.
  const short = reviews.filter((r) => r.text.length <= 90)
  const picks = useShuffled(short.length >= 2 ? short : reviews, 2)

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6">
      <a
        href={FB_REVIEWS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 mb-4 group"
      >
        <FacebookIcon className="w-5 h-5 text-[#1877F2] shrink-0" />
        <div>
          <div className="flex items-center gap-1.5">
            <Stars className="w-3.5 h-3.5" />
            <span className="text-sm font-bold text-gray-900">{FB_RECOMMEND_PERCENT}% recomendado</span>
          </div>
          <span className="text-xs text-gray-500 group-hover:text-red-600 transition-colors">
            {FB_REVIEW_COUNT} reseñas en Facebook
          </span>
        </div>
      </a>

      <div className="space-y-3">
        {picks.map((r) => (
          <div key={r.name} className="flex items-start gap-2.5">
            <Avatar review={r} size={32} />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900">{r.name}</p>
              <p className="text-xs text-gray-600 leading-snug">{r.text}</p>
            </div>
          </div>
        ))}
      </div>

      <a
        href={FB_REVIEWS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
      >
        Ver todas las reseñas
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
    </div>
  )
}

/** Homepage "Wall of Love" — a curated, randomized selection of reviews. */
export default function ReviewsWidget() {
  const items = useShuffled(reviews, DISPLAY_COUNT)

  if (reviews.length === 0) return null

  return (
    <section id="resenas" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Clientes satisfechos que confiaron en nosotros para encontrar su propiedad ideal</h2>
          <a
            href={FB_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <Stars />
            <span className="font-medium">
              {FB_RECOMMEND_PERCENT}% recomendado · {FB_REVIEW_COUNT} reseñas en Facebook
            </span>
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {items.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </div>
      </div>
    </section>
  )
}

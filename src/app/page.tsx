'use client'

import { useState, useMemo, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, Property } from '@/data/properties'
import ReviewsWidget, { ReviewsBadge } from '@/components/ReviewsWidget'

type FilterType = 'all' | 'sale' | 'rent' | 'land' | 'business';
type HeroMode = 'default' | 'rent' | 'sale';

interface FeaturedProperty {
  id: string;
  title: string;
  price?: number;
  rentPrice?: number;
  image: string | null;
  neighborhood: string;
  type: string;
}

const ITEMS_PER_PAGE = 12;

type HeroItem = { id: string; image: string | null; title: string; price?: number };
type HeroDisplay = { main: HeroItem; secondary: [HeroItem, HeroItem] } | null;

function HomeContent() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [heroMode, setHeroMode] = useState<HeroMode>('default')
  const [featuredRent, setFeaturedRent] = useState<FeaturedProperty[]>([])
  const [featuredSale, setFeaturedSale] = useState<FeaturedProperty[]>([])
  const [bedroomFilter, setBedroomFilter] = useState<string>('all')
  const [bathroomFilter, setBathroomFilter] = useState<string>('all')
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none')
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Detect URL params and set filter/heroMode
  useEffect(() => {
    const hasRenta = searchParams.has('renta')
    const hasVenta = searchParams.has('venta')

    if (hasRenta) {
      setFilter('rent')
      setHeroMode('rent')
      // Auto-scroll to properties section
      setTimeout(() => {
        document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else if (hasVenta) {
      setFilter('sale')
      setHeroMode('sale')
      // Auto-scroll to properties section
      setTimeout(() => {
        document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      setHeroMode('default')
    }
  }, [searchParams])

  // Fetch featured properties
  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/featured')
        const data = await res.json()
        if (data.rent) setFeaturedRent(data.rent)
        if (data.sale) setFeaturedSale(data.sale)
      } catch (error) {
        console.error('Error fetching featured:', error)
      }
    }
    fetchFeatured()
  }, [])

  // Fetch properties from API
  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch('/api/properties?available=true')
        const data = await res.json()
        if (data.properties) {
          setProperties(data.properties)
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [])

  // Extract unique neighborhoods from properties
  const neighborhoods = useMemo(() => {
    const uniqueNeighborhoods = [...new Set(properties.filter(p => p.available).map(p => p.neighborhood))]
    return uniqueNeighborhoods.sort((a, b) => a.localeCompare(b, 'es'))
  }, [properties])

  // Extract unique bedroom counts
  const bedroomOptions = useMemo(() => {
    const beds = properties.filter(p => p.available && p.bedrooms).map(p => p.bedrooms!)
    return [...new Set(beds)].sort((a, b) => a - b)
  }, [properties])

  // Extract unique bathroom counts
  const bathroomOptions = useMemo(() => {
    const baths = properties.filter(p => p.available && p.bathrooms).map(p => p.bathrooms!)
    return [...new Set(baths)].sort((a, b) => a - b)
  }, [properties])

  const filteredProperties = useMemo(() => {
    let filtered = properties.filter(p => {
      if (!p.available) return false

      // Type filter
      if (filter === 'sale' && p.type !== 'sale' && p.type !== 'both') return false
      if (filter === 'rent' && p.type !== 'rent' && p.type !== 'both') return false
      if (filter === 'land' && p.category !== 'land') return false
      if (filter === 'business' && !p.isBusinessProperty) return false

      // Bedroom filter
      if (bedroomFilter !== 'all') {
        const minBeds = parseInt(bedroomFilter)
        if (!p.bedrooms || p.bedrooms < minBeds) return false
      }

      // Bathroom filter
      if (bathroomFilter !== 'all') {
        const minBaths = parseFloat(bathroomFilter)
        if (!p.bathrooms || p.bathrooms < minBaths) return false
      }

      // Location filter
      if (locationFilter !== 'all' && p.neighborhood !== locationFilter) return false

      // Price filter
      const propertyPrice = p.price || p.rentPrice || 0
      if (minPrice) {
        const min = parseInt(minPrice)
        if (propertyPrice < min) return false
      }
      if (maxPrice) {
        const max = parseInt(maxPrice)
        if (propertyPrice > max) return false
      }

      return true
    })

    // Sort by price
    if (sortOrder !== 'none') {
      filtered = [...filtered].sort((a, b) => {
        const priceA = a.price || a.rentPrice || 0
        const priceB = b.price || b.rentPrice || 0
        return sortOrder === 'asc' ? priceA - priceB : priceB - priceA
      })
    }

    // Prioritize featured properties based on current filter
    let relevantFeaturedIds: string[] = []
    if (filter === 'rent') {
      relevantFeaturedIds = featuredRent.map(f => f.id)
    } else if (filter === 'sale') {
      relevantFeaturedIds = featuredSale.map(f => f.id)
    } else {
      // For 'all' or other filters, include all featured
      relevantFeaturedIds = [...featuredSale.map(f => f.id), ...featuredRent.map(f => f.id)]
    }

    if (relevantFeaturedIds.length > 0) {
      const featuredSet = new Set(relevantFeaturedIds)
      const featured = filtered.filter(p => featuredSet.has(p.id))
      const nonFeatured = filtered.filter(p => !featuredSet.has(p.id))
      // Preserve the order of featured based on admin selection
      const orderedFeatured = relevantFeaturedIds
        .map(id => featured.find(p => p.id === id))
        .filter(Boolean) as Property[]
      filtered = [...orderedFeatured, ...nonFeatured]
    }

    return filtered
  }, [properties, filter, bedroomFilter, bathroomFilter, locationFilter, minPrice, maxPrice, sortOrder, featuredRent, featuredSale])

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE)
  }, [filter, bedroomFilter, bathroomFilter, locationFilter, minPrice, maxPrice, sortOrder])

  // Infinite scroll observer
  const hasMore = visibleCount < filteredProperties.length

  useEffect(() => {
    if (!hasMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => prev + ITEMS_PER_PAGE)
        }
      },
      { root: null, rootMargin: '200px', threshold: 0 }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
      observer.disconnect()
    }
  }, [hasMore, loading, visibleCount])

  const getCategoryLabel = (category: Property['category']) => {
    switch (category) {
      case 'house': return 'Casa'
      case 'apartment': return 'Departamento'
      case 'land': return 'Terreno'
      case 'commercial': return 'Comercial'
      case 'warehouse': return 'Bodega'
      default: return 'Propiedad'
    }
  }

  // Get featured properties for hero section
  const featuredProperties = useMemo(() => {
    return properties.filter(p => p.featured && p.available).slice(0, 3)
  }, [properties])

  // Compute hero display data based on mode and featured properties
  const heroDisplay: HeroDisplay = useMemo(() => {
    // Helper to format property for hero display
    const formatHero = (p: FeaturedProperty | Property, isRent = false): HeroItem => {
      const image = 'image' in p ? p.image : (p.images?.[0] || null)
      return {
        id: p.id,
        image,
        title: p.title,
        price: isRent ? p.rentPrice : p.price
      }
    }

    // Helper to get random properties of a type with images and prices
    const getRandomByType = (type: 'rent' | 'sale', count: number) => {
      const filtered = properties.filter(p => {
        if (!p.available || !p.images?.[0]) return false
        if (type === 'rent') return (p.type === 'rent' || p.type === 'both') && p.rentPrice
        return (p.type === 'sale' || p.type === 'both') && p.price
      })
      return [...filtered].sort(() => Math.random() - 0.5).slice(0, count)
    }

    if (heroMode === 'rent') {
      if (featuredRent.length >= 3) {
        const [first, second, third] = featuredRent
        return {
          main: formatHero(first, true),
          secondary: [formatHero(second, true), formatHero(third, true)]
        }
      }
      const randomRent = getRandomByType('rent', 3)
      if (randomRent.length >= 3) {
        return {
          main: formatHero(randomRent[0], true),
          secondary: [formatHero(randomRent[1], true), formatHero(randomRent[2], true)]
        }
      }
    }

    if (heroMode === 'sale') {
      if (featuredSale.length >= 3) {
        const [first, second, third] = featuredSale
        return {
          main: formatHero(first, false),
          secondary: [formatHero(second, false), formatHero(third, false)]
        }
      }
      const randomSale = getRandomByType('sale', 3)
      if (randomSale.length >= 3) {
        return {
          main: formatHero(randomSale[0], false),
          secondary: [formatHero(randomSale[1], false), formatHero(randomSale[2], false)]
        }
      }
    }

    // Default mode: mix featured properties, fill with random if needed
    const allFeatured = [...featuredSale, ...featuredRent]

    if (allFeatured.length >= 3) {
      const shuffled = [...allFeatured].sort(() => Math.random() - 0.5).slice(0, 3)
      return {
        main: formatHero(shuffled[0], shuffled[0]?.type === 'rent'),
        secondary: [
          formatHero(shuffled[1], shuffled[1]?.type === 'rent'),
          formatHero(shuffled[2], shuffled[2]?.type === 'rent')
        ]
      }
    } else if (allFeatured.length > 0) {
      const needed = 3 - allFeatured.length
      const existingIds = new Set(allFeatured.map(f => f.id))
      const randomFill = properties
        .filter(p => p.available && p.images?.[0] && !existingIds.has(p.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, needed)
      const combined = [...allFeatured, ...randomFill]
      if (combined.length >= 3) {
        return {
          main: formatHero(combined[0], combined[0]?.type === 'rent'),
          secondary: [
            formatHero(combined[1] as FeaturedProperty | Property, (combined[1] as FeaturedProperty | Property)?.type === 'rent'),
            formatHero(combined[2] as FeaturedProperty | Property, (combined[2] as FeaturedProperty | Property)?.type === 'rent')
          ]
        }
      }
    }

    // Try any 3 properties with images
    const withImages = properties.filter(p => p.available && p.images?.[0])
    if (withImages.length >= 3) {
      const shuffled = [...withImages].sort(() => Math.random() - 0.5).slice(0, 3)
      return {
        main: formatHero(shuffled[0], shuffled[0].type === 'rent'),
        secondary: [
          formatHero(shuffled[1], shuffled[1].type === 'rent'),
          formatHero(shuffled[2], shuffled[2].type === 'rent')
        ]
      }
    }

    // No properties available - return null
    return null
  }, [heroMode, featuredRent, featuredSale, properties])

  // Stats
  const stats = useMemo(() => ({
    forSale: properties.filter(p => p.type === 'sale' || p.type === 'both').length,
    forRent: properties.filter(p => p.type === 'rent' || p.type === 'both').length,
    land: properties.filter(p => p.category === 'land').length
  }), [properties])

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2">
              <img src="/favicon.png" alt="Prisma" className="w-10 h-10" />
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-lg leading-tight">Prisma</span>
                <span className="text-[10px] text-gray-500 tracking-wider uppercase">Real Estate</span>
              </div>
            </Link>

            <a
              href="#propiedades"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Ver Propiedades
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section - Split Layout */}
      <section className="relative pt-20 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-8 lg:py-12">
            {/* Left - Content */}
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                {loading ? '...' : properties.filter(p => p.available).length} propiedades disponibles
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.1]">
                Propiedades en<br />
                <span className="text-red-600 text-3xl sm:text-4xl lg:text-5xl">Nayarit, Jalisco y Sinaloa</span>
              </h1>

              <p className="text-lg text-gray-600 mb-6 max-w-lg mx-auto lg:mx-0">
                Casas, departamentos, terrenos y locales comerciales en venta y renta.
              </p>

              <div className="mb-8 flex justify-center lg:justify-start">
                <ReviewsBadge />
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-12">
                <a
                  href="#propiedades"
                  className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
                >
                  Ver Propiedades
                </a>
              </div>

              {/* Quick Stats */}
              <div className="flex justify-center lg:justify-start gap-8 pt-8 border-t border-stone-200">
                <div>
                  <div className="text-3xl font-bold text-gray-900">{loading ? '-' : stats.forSale}</div>
                  <div className="text-sm text-gray-500">En Venta</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{loading ? '-' : stats.forRent}</div>
                  <div className="text-sm text-gray-500">En Renta</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{loading ? '-' : stats.land}</div>
                  <div className="text-sm text-gray-500">Terrenos</div>
                </div>
              </div>
            </div>

            {/* Right - Image Grid */}
            <div className="order-1 lg:order-2">
              {!heroDisplay ? (
                <div className="flex items-center justify-center h-[300px] lg:h-[500px] bg-stone-200 rounded-2xl">
                  <div className="text-center text-stone-400">
                    <img src="/favicon.png" alt="Prisma" className="w-16 h-16 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">Agrega propiedades para verlas aquí</p>
                  </div>
                </div>
              ) : (<>
              {/* Mobile: Single featured image with aspect ratio */}
              <div className="sm:hidden">
                <Link href={`/propiedad/${heroDisplay.main.id}`} className="block relative aspect-[16/10] rounded-2xl overflow-hidden group">
                  {heroDisplay.main.image && <Image
                    src={heroDisplay.main.image}
                    alt={heroDisplay.main.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority
                  />}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <span className="text-sm font-semibold text-gray-900">
                      {heroDisplay.main.title} - {heroDisplay.main.price ? formatPrice(heroDisplay.main.price) : ''}
                      {heroMode === 'rent' && heroDisplay.main.price ? '/mes' : ''}
                    </span>
                  </div>
                </Link>
              </div>
              {/* Desktop: Grid layout */}
              <div className="hidden sm:grid grid-cols-12 grid-rows-2 gap-3 h-[400px] lg:h-[500px]">
                {/* Main large image - takes 8 columns, 2 rows */}
                <Link href={`/propiedad/${heroDisplay.main.id}`} className="col-span-8 row-span-2 relative rounded-2xl overflow-hidden group">
                  {heroDisplay.main.image && <Image
                    src={heroDisplay.main.image}
                    alt={heroDisplay.main.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority
                  />}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <span className="text-sm font-semibold text-gray-900">
                      {heroDisplay.main.title} - {heroDisplay.main.price ? formatPrice(heroDisplay.main.price) : ''}
                      {heroMode === 'rent' && heroDisplay.main.price ? '/mes' : ''}
                    </span>
                  </div>
                </Link>
                {/* Top right image */}
                <Link href={`/propiedad/${heroDisplay.secondary[0].id}`} className="col-span-4 relative rounded-2xl overflow-hidden group">
                  {heroDisplay.secondary[0].image && <Image
                    src={heroDisplay.secondary[0].image}
                    alt={heroDisplay.secondary[0].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded">
                    <span className="text-xs font-semibold text-gray-900">
                      {heroDisplay.secondary[0].title}
                      {heroDisplay.secondary[0].price ? ` - ${formatPrice(heroDisplay.secondary[0].price)}` : ''}
                    </span>
                  </div>
                </Link>
                {/* Bottom right image */}
                <Link href={`/propiedad/${heroDisplay.secondary[1].id}`} className="col-span-4 relative rounded-2xl overflow-hidden group">
                  {heroDisplay.secondary[1].image && <Image
                    src={heroDisplay.secondary[1].image}
                    alt={heroDisplay.secondary[1].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded">
                    <span className="text-xs font-semibold text-gray-900">
                      {heroDisplay.secondary[1].title}
                      {heroDisplay.secondary[1].price ? ` - ${formatPrice(heroDisplay.secondary[1].price)}` : ''}
                    </span>
                  </div>
                </Link>
              </div>
              </>)}
            </div>
          </div>
        </div>
      </section>

      {/* All Properties Section */}
      <section id="propiedades" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Propiedades</h2>
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {[
              { key: 'all', label: 'Todas' },
              { key: 'sale', label: 'En Venta' },
              { key: 'rent', label: 'En Renta' },
              { key: 'land', label: 'Terrenos' },
              { key: 'business', label: 'Comercial' }
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key as FilterType)}
                className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                  filter === f.key
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Advanced Filters Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-10 max-w-3xl mx-auto">
            <div className="flex flex-wrap justify-center items-center gap-3">
              <span className="text-gray-500 text-sm font-medium">Filtrar por:</span>

              {/* Location Filter */}
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Todas las zonas</option>
                {neighborhoods.map((neighborhood) => (
                  <option key={neighborhood} value={neighborhood}>
                    {neighborhood}
                  </option>
                ))}
              </select>

              {/* Bedrooms Filter */}
              <select
                value={bedroomFilter}
                onChange={(e) => setBedroomFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Recámaras</option>
                {bedroomOptions.map((beds) => (
                  <option key={beds} value={beds}>
                    {beds}+ recámaras
                  </option>
                ))}
              </select>

              {/* Bathrooms Filter */}
              <select
                value={bathroomFilter}
                onChange={(e) => setBathroomFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Baños</option>
                {bathroomOptions.map((baths) => (
                  <option key={baths} value={baths}>
                    {baths}+ baños
                  </option>
                ))}
              </select>

              {/* Price Range */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Precio min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-28 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Precio max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-28 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Sort Order */}
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'none' | 'asc' | 'desc')}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="none">Ordenar</option>
                <option value="asc">Precio: menor a mayor</option>
                <option value="desc">Precio: mayor a menor</option>
              </select>

              {/* Clear Filters */}
              {(bedroomFilter !== 'all' || bathroomFilter !== 'all' || locationFilter !== 'all' || minPrice || maxPrice || sortOrder !== 'none') && (
                <button
                  onClick={() => { setBedroomFilter('all'); setBathroomFilter('all'); setLocationFilter('all'); setMinPrice(''); setMaxPrice(''); setSortOrder('none'); }}
                  className="px-3 py-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Limpiar
                </button>
              )}
            </div>

            {/* Results count */}
            <div className="text-center text-gray-400 text-sm mt-3 pt-3 border-t border-gray-100">
              {loading ? 'Cargando...' : `${filteredProperties.length} ${filteredProperties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando propiedades...</p>
            </div>
          ) : (
            <>
              {/* Properties Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {filteredProperties.slice(0, visibleCount).map((property) => (
                  <Link
                    key={property.id}
                    href={`/propiedad/${property.id}`}
                    className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    {/* Image or Video */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {property.images && property.images[0] ? (
                        <Image
                          src={property.images[0]}
                          alt={property.title}
                          fill
                          className="object-cover"
                        />
                      ) : property.video ? (
                        <video
                          src={property.video}
                          muted
                          loop
                          autoPlay
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-4xl">🏠</span>
                        </div>
                      )}
                      {/* Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          property.type === 'sale' ? 'bg-green-500 text-white' :
                          property.type === 'rent' ? 'bg-blue-500 text-white' :
                          'bg-purple-500 text-white'
                        }`}>
                          {property.type === 'sale' ? 'Venta' : property.type === 'rent' ? 'Renta' : 'Venta/Renta'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                          {property.title}
                        </h3>
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {getCategoryLabel(property.category)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mb-3">
                        {property.neighborhood}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="font-bold text-lg text-gray-900">
                          {property.price ? formatPrice(property.price) :
                           property.rentPrice ? `${formatPrice(property.rentPrice)}/mes` :
                           property.pricePerSqm ? `${formatPrice(property.pricePerSqm)}/m²` : ''}
                        </div>

                        {(property.bedrooms || property.bathrooms) && (
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            {property.bedrooms && <span>{property.bedrooms} rec</span>}
                            {property.bathrooms && <span>{property.bathrooms} ba</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Load More Trigger */}
              {hasMore && (
                <div ref={loadMoreRef} className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
              )}

              {/* Show count */}
              {filteredProperties.length > 0 && (
                <div className="text-center text-gray-500 text-sm mt-6">
                  Mostrando {Math.min(visibleCount, filteredProperties.length)} de {filteredProperties.length} propiedades
                </div>
              )}

              {filteredProperties.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🏠</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay propiedades disponibles</h3>
                  <p className="text-gray-600">Intenta con otro filtro</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Customer Reviews */}
      <ReviewsWidget />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <img src="/favicon.png" alt="Prisma" className="w-10 h-10" />
                <div className="flex flex-col">
                  <span className="font-bold text-lg leading-tight">Prisma</span>
                  <span className="text-[10px] text-gray-400 tracking-wider uppercase">Real Estate</span>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Propiedades en venta y renta en Nayarit, Jalisco y Sinaloa.
              </p>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/GioRomerolo" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.instagram.com/gioprisma" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://www.tiktok.com/@mary.jane.flower1" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Enlaces</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#propiedades" className="hover:text-white transition-colors">Propiedades</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link>
                </li>
                <li>
                  <Link href="/privacidad" className="hover:text-white transition-colors">Aviso de Privacidad</Link>
                </li>
                <li className="flex items-center gap-2 pt-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Nayarit, Jalisco y Sinaloa
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2026 Prisma Real Estate. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

    </main>
  )
}

// Wrap with Suspense for useSearchParams
export default function Home() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
      </main>
    }>
      <HomeContent />
    </Suspense>
  )
}

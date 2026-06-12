'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { Property, formatPrice } from '@/data/properties'
import { ReviewsCompact } from '@/components/ReviewsWidget'

const WHATSAPP_NUMBER = '523317138888'

function getWhatsAppUrl(property: Property) {
  const text = encodeURIComponent(
    `Hola, me interesa la propiedad: ${property.title} - https://goprismamx.com/propiedad/${property.id}`
  )
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
}

export default function PropertyDetail() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [allProperties, setAllProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [selectedImage, setSelectedImage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deactivating, setDeactivating] = useState(false)
  const [deactivated, setDeactivated] = useState(false)
  const [featuredForSimilar, setFeaturedForSimilar] = useState<{ rentIds: string[]; saleIds: string[] }>({ rentIds: [], saleIds: [] })

  const adminPass = searchParams.get('pass')
  const isAdmin = adminPass === 'qqww1234'

  const handleDeactivate = async () => {
    if (!property || deactivating) return
    setDeactivating(true)
    try {
      const res = await fetch(`/api/properties/${property.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-pass': adminPass || '' },
        body: JSON.stringify({ available: false })
      })
      if (res.ok) setDeactivated(true)
    } catch (err) {
      console.error('Failed to deactivate:', err)
    } finally {
      setDeactivating(false)
    }
  }

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/featured')
        const data = await res.json()
        const rentIds = (data.rent || []).map((p: { id: string }) => p.id)
        const saleIds = (data.sale || []).map((p: { id: string }) => p.id)
        setFeaturedForSimilar({ rentIds, saleIds })
      } catch (error) {
        console.error('Error fetching featured:', error)
      }
    }
    fetchFeatured()
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const [propertyRes, allPropertiesRes] = await Promise.all([
          fetch(`/api/properties/${params.id}`),
          fetch('/api/properties')
        ])

        if (!propertyRes.ok) { setError(true); return }

        const propertyData = await propertyRes.json()
        const allPropertiesData = await allPropertiesRes.json()

        setProperty(propertyData.property)
        setAllProperties(allPropertiesData.properties || [])
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) fetchData()
  }, [params.id])

  const relatedProperties = useMemo(() => {
    if (!property) return []

    let featuredIds: string[] = []
    if (property.type === 'rent' || property.type === 'both') featuredIds = [...featuredIds, ...featuredForSimilar.rentIds]
    if (property.type === 'sale' || property.type === 'both') featuredIds = [...featuredIds, ...featuredForSimilar.saleIds]

    const validFeaturedIds = [...new Set(featuredIds)].filter(id => id !== property.id)
    const featuredSimilarId = validFeaturedIds.length > 0
      ? validFeaturedIds[Math.floor(Math.random() * validFeaturedIds.length)]
      : null
    const featuredSimilarProp = featuredSimilarId
      ? allProperties.find(p => p.id === featuredSimilarId && p.available !== false)
      : null

    const currentPrice = property.type === 'rent' ? property.rentPrice : property.price
    const priceRange = 1000000

    const matchesType = (p: Property) => {
      if (property.type === 'rent') return p.type === 'rent' || p.type === 'both'
      if (property.type === 'sale') return p.type === 'sale' || p.type === 'both'
      return true
    }
    const getPrice = (p: Property) => property.type === 'rent' ? p.rentPrice : p.price

    const sameTypeProperties = allProperties.filter(p =>
      p.id !== property.id && p.id !== featuredSimilarId && p.available !== false && matchesType(p)
    )

    const similarInNeighborhood = sameTypeProperties.filter(p => {
      if (p.neighborhood !== property.neighborhood) return false
      if (!currentPrice) return true
      const pPrice = getPrice(p)
      return pPrice ? Math.abs(pPrice - currentPrice) <= priceRange : false
    })

    const sameNeighborhood = sameTypeProperties.filter(p =>
      p.neighborhood === property.neighborhood && !similarInNeighborhood.includes(p)
    )

    const similarPrice = sameTypeProperties.filter(p => {
      if (similarInNeighborhood.includes(p) || sameNeighborhood.includes(p)) return false
      if (!currentPrice) return false
      const pPrice = getPrice(p)
      return pPrice ? Math.abs(pPrice - currentPrice) <= priceRange : false
    })

    const randomSameType = sameTypeProperties.filter(p =>
      !similarInNeighborhood.includes(p) && !sameNeighborhood.includes(p) && !similarPrice.includes(p)
    ).sort(() => Math.random() - 0.5)

    const allSimilar = [...similarInNeighborhood, ...sameNeighborhood, ...similarPrice, ...randomSameType]
    const slotsNeeded = featuredSimilarProp ? 2 : 3

    if (featuredSimilarProp) return [featuredSimilarProp, ...allSimilar.slice(0, slotsNeeded)]
    return allSimilar.slice(0, slotsNeeded)
  }, [property, featuredForSimilar, allProperties])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando propiedad...</p>
        </div>
      </main>
    )
  }

  if (error || !property) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Propiedad no encontrada</h1>
          <p className="text-gray-600 mb-6">La propiedad que buscas no existe o ya no está disponible.</p>
          <Link href="/" className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors">
            Ver todas las propiedades
          </Link>
        </div>
      </main>
    )
  }

  const getCategoryLabel = (category: typeof property.category) => {
    switch (category) {
      case 'house': return 'Casa'
      case 'apartment': return 'Departamento'
      case 'land': return 'Terreno'
      case 'commercial': return 'Comercial'
      case 'warehouse': return 'Bodega'
      default: return 'Propiedad'
    }
  }

  const whatsappUrl = getWhatsAppUrl(property)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Admin Deactivate Banner */}
      {isAdmin && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white py-3 px-4 z-[60] flex items-center justify-center gap-4">
          {deactivated ? (
            <span className="font-semibold">Propiedad desactivada exitosamente</span>
          ) : (
            <>
              <span className="font-medium">Modo Admin:</span>
              <button onClick={handleDeactivate} disabled={deactivating}
                className="bg-white text-red-600 font-bold py-2 px-6 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors">
                {deactivating ? 'Desactivando...' : 'Marcar como No Disponible'}
              </button>
            </>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className={`fixed ${isAdmin ? 'top-[52px]' : 'top-0'} left-0 right-0 bg-white/95 backdrop-blur-xl z-50 border-b border-gray-100`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2">
              <img src="/favicon.png" alt="Prisma" className="w-10 h-10" />
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-lg leading-tight">Prisma</span>
                <span className="text-[10px] text-gray-500 tracking-wider uppercase">Real Estate</span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="hidden md:flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Todas las propiedades
              </Link>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contactar
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className={`${isAdmin ? 'pt-[148px]' : 'pt-24'} pb-4 bg-white border-b border-gray-100`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-red-600 transition-colors">Inicio</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/#propiedades" className="hover:text-red-600 transition-colors">Propiedades</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">{property.title}</span>
          </nav>
        </div>
      </div>

      {/* Property Header */}
      <section className="py-4 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 sm:gap-4 text-center md:text-left">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold ${
                  property.type === 'sale' ? 'bg-green-100 text-green-700' :
                  property.type === 'rent' ? 'bg-blue-100 text-blue-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {property.type === 'sale' ? 'En Venta' : property.type === 'rent' ? 'En Renta' : 'Venta/Renta'}
                </span>
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-700">
                  {getCategoryLabel(property.category)}
                </span>
                {property.isBusinessProperty && (
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold bg-amber-100 text-amber-700">Comercial</span>
                )}
              </div>
              <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 break-words">{property.title}</h1>
              <p className="text-gray-600 text-sm sm:text-base flex items-center justify-center md:justify-start gap-1 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{property.location}, {property.city}</span>
              </p>
            </div>
            <div className="text-center md:text-right flex-shrink-0">
              {property.price && (
                <>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600">{formatPrice(property.price)}</div>
                  {property.avaluoPrice && (
                    <div className="mt-1 sm:mt-2 text-xs sm:text-sm">
                      <div className="text-gray-500">Avaluo: <span className="line-through">{formatPrice(property.avaluoPrice)}</span></div>
                      <div className="text-green-600 font-semibold">Ahorro: {formatPrice(property.avaluoPrice - property.price)}</div>
                    </div>
                  )}
                </>
              )}
              {property.rentPrice && (
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">{formatPrice(property.rentPrice)}<span className="text-sm sm:text-lg font-normal text-gray-500">/mes</span></div>
              )}
              {property.pricePerSqm && !property.price && !property.rentPrice && (
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600">{formatPrice(property.pricePerSqm)}<span className="text-sm sm:text-lg font-normal text-gray-500">/m²</span></div>
              )}
              {property.type === 'both' && (
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Venta: {formatPrice(property.price!)} | Renta: {formatPrice(property.rentPrice!)}/mes</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="py-4 sm:py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Gallery */}
              {property.images.length > 0 ? (
                <>
                  <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group bg-gray-200" onClick={() => setIsModalOpen(true)}>
                    <Image src={property.images[selectedImage]} alt={property.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 66vw" priority />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-4 shadow-lg">
                        <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm">{selectedImage + 1} / {property.images.length}</div>
                  </div>
                  {property.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory">
                      {property.images.map((img, index) => (
                        <button key={index} onClick={() => setSelectedImage(index)}
                          className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden transition-all snap-start ${selectedImage === index ? 'ring-2 sm:ring-3 ring-red-500 ring-offset-2' : 'opacity-70 hover:opacity-100'}`}>
                          <Image src={img} alt={`Vista ${index + 1}`} fill className="object-cover" sizes="(max-width: 640px) 64px, 80px" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : property.video ? (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200">
                  <video src={property.video} controls autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ) : (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 flex items-center justify-center">
                  <span className="text-6xl">🏠</span>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                {property.bedrooms && (<div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center shadow-sm"><div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🛏️</div><div className="text-xl sm:text-2xl font-bold text-gray-900">{property.bedrooms}</div><div className="text-xs sm:text-sm text-gray-500">Recamaras</div></div>)}
                {property.bathrooms && (<div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center shadow-sm"><div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🚿</div><div className="text-xl sm:text-2xl font-bold text-gray-900">{property.bathrooms}</div><div className="text-xs sm:text-sm text-gray-500">Banos</div></div>)}
                {property.lotSize && (<div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center shadow-sm"><div className="text-2xl sm:text-3xl mb-1 sm:mb-2">📐</div><div className="text-base sm:text-xl font-bold text-gray-900">{property.lotSize}</div><div className="text-xs sm:text-sm text-gray-500">Terreno</div></div>)}
                {property.area && (<div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center shadow-sm"><div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🏗️</div><div className="text-base sm:text-xl font-bold text-gray-900">{property.area}</div><div className="text-xs sm:text-sm text-gray-500">Construccion</div></div>)}
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Descripcion</h2>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-lg">{property.description}</p>
              </div>

              {/* Features */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-6">Caracteristicas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Ubicacion</h2>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{property.neighborhood}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{property.location}</p>
                    <p className="text-gray-600 text-sm sm:text-base">{property.city}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-4">
                {/* WhatsApp Contact Card */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">¿Te interesa esta propiedad?</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">Contactanos directamente por WhatsApp para mas informacion.</p>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Contactar por WhatsApp
                  </a>
                </div>

                {/* Social Proof */}
                <ReviewsCompact />

                {/* Summary Card */}
                <div className="hidden lg:block bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
                  <h3 className="font-bold text-xl mb-6">Resumen</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="text-gray-300">Tipo</span>
                      <span className="font-semibold">{getCategoryLabel(property.category)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="text-gray-300">Operacion</span>
                      <span className="font-semibold">{property.type === 'sale' ? 'Venta' : property.type === 'rent' ? 'Renta' : 'Venta/Renta'}</span>
                    </div>
                    {property.lotSize && (<div className="flex justify-between items-center py-3 border-b border-gray-700"><span className="text-gray-300">Terreno</span><span className="font-semibold">{property.lotSize}</span></div>)}
                    {property.bedrooms && (<div className="flex justify-between items-center py-3 border-b border-gray-700"><span className="text-gray-300">Recamaras</span><span className="font-semibold">{property.bedrooms}</span></div>)}
                    {property.bathrooms && (<div className="flex justify-between items-center py-3 border-b border-gray-700"><span className="text-gray-300">Banos</span><span className="font-semibold">{property.bathrooms}</span></div>)}
                    <div className="pt-4">
                      <div className="text-gray-300 mb-2">Precio</div>
                      {property.price && (<div className="text-3xl font-bold text-red-400">{formatPrice(property.price)}</div>)}
                      {property.rentPrice && (<div className="text-2xl font-bold text-blue-400">{formatPrice(property.rentPrice)}/mes</div>)}
                      {property.pricePerSqm && !property.price && !property.rentPrice && (<div className="text-2xl font-bold text-green-400">{formatPrice(property.pricePerSqm)}/m²</div>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Properties */}
      {relatedProperties.length > 0 && (
        <section className="py-6 sm:py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">Propiedades Similares</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
              {relatedProperties.map((prop) => (
                <Link key={prop.id} href={`/propiedad/${prop.id}`}
                  className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {prop.images[0] ? (
                      <Image src={prop.images[0]} alt={prop.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" />
                    ) : prop.video ? (
                      <video src={prop.video} muted loop autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center"><span className="text-3xl sm:text-4xl">🏠</span></div>
                    )}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                      <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-bold ${prop.type === 'sale' ? 'bg-green-500 text-white' : prop.type === 'rent' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'}`}>
                        {prop.type === 'sale' ? 'Venta' : prop.type === 'rent' ? 'Renta' : 'Venta/Renta'}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 sm:p-5">
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-0.5 sm:mb-1 group-hover:text-red-600 transition-colors line-clamp-1">{prop.title}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3">{prop.neighborhood}</p>
                    <div className="text-lg sm:text-xl font-bold text-red-600">
                      {prop.price ? formatPrice(prop.price) : prop.rentPrice ? `${formatPrice(prop.rentPrice)}/mes` : prop.pricePerSqm ? `${formatPrice(prop.pricePerSqm)}/m²` : ''}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-8 sm:py-12 bg-gradient-to-br from-red-600 to-red-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">¿Te interesa esta propiedad?</h2>
          <p className="text-base sm:text-xl text-red-100 mb-6 sm:mb-8">Contactanos ahora</p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
            className="bg-white text-red-700 font-bold py-3 px-6 sm:py-4 sm:px-10 rounded-xl sm:rounded-2xl transition-all hover:shadow-2xl hover:-translate-y-1 inline-flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contactar Ahora
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 sm:mb-6">
            <img src="/favicon.png" alt="Prisma" className="w-9 h-9 sm:w-10 sm:h-10" />
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg leading-tight">Prisma</span>
              <span className="text-[9px] sm:text-[10px] text-gray-400 tracking-wider uppercase">Real Estate</span>
            </div>
          </Link>
          <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">Propiedades en Nayarit, Jalisco y Sinaloa</p>
          <p className="text-gray-500 text-xs sm:text-sm">&copy; 2026 Prisma Real Estate. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-16 sm:h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 transition-all z-40 flex items-center justify-center hover:scale-110">
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Image Modal */}
      {isModalOpen && property.images.length > 0 && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center" onClick={() => setIsModalOpen(false)}>
          <button className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/50 rounded-full p-2 z-10" onClick={() => setIsModalOpen(false)}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/50 rounded-full p-3 z-10"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev === 0 ? property.images.length - 1 : prev - 1) }}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4" onClick={(e) => e.stopPropagation()}>
            <Image src={property.images[selectedImage]} alt={property.title} fill className="object-contain" />
          </div>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/50 rounded-full p-3 z-10"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev === property.images.length - 1 ? 0 : prev + 1) }}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg">{selectedImage + 1} / {property.images.length}</div>
        </div>
      )}
    </main>
  )
}

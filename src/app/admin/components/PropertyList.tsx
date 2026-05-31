'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Property, formatPrice } from '@/data/properties'
import Tooltip from './Tooltip'
import ImageUploader from './ImageUploader'

const ITEMS_PER_PAGE = 20

const tips = {
  title: 'El nombre del anuncio. Corto y descriptivo. Ej: "Casa en Colonia Centro"',
  type: '¿Se vende, se renta, o ambas? Esto determina en qué sección aparece.',
  category: 'Tipo de inmueble: casa, departamento, terreno, local comercial o bodega.',
  salePrice: 'Precio en pesos mexicanos. Solo números, sin comas. Ej: 3500000',
  rentPrice: 'Precio de renta por mes en pesos. Solo números. Ej: 15000',
  neighborhood: 'Colonia o fraccionamiento donde se encuentra la propiedad.',
  bedrooms: 'Número de recámaras. Usa decimales para estudios: 2.5',
  bathrooms: 'Número de baños. Usa .5 para medio baño.',
  area: 'Metros cuadrados construidos. Ej: "276 m²"',
  description: 'Descripción detallada de la propiedad.',
  images: 'La primera foto es la imagen principal. Puedes reordenar y agregar más.',
}

interface FeaturedSettings {
  rentFeatured: string[];
  saleFeatured: string[];
  rentFeaturedSimilar: string | null;
  saleFeaturedSimilar: string | null;
}

interface PropertyListProps {
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  featuredSettings: FeaturedSettings;
  setFeaturedSettings: React.Dispatch<React.SetStateAction<FeaturedSettings>>;
  activeTab: string;
}

export default function PropertyList({
  properties,
  setProperties,
  featuredSettings,
  setFeaturedSettings,
  activeTab
}: PropertyListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [editForm, setEditForm] = useState<Partial<Property>>({})
  const [savingEdit, setSavingEdit] = useState(false)
  const [savingFeatured, setSavingFeatured] = useState(false)

  useEffect(() => { setCurrentPage(1) }, [searchQuery, activeTab])

  const uniqueProperties = properties.filter((p, index, self) =>
    index === self.findIndex(prop => prop.id === p.id)
  )

  const filteredProperties = uniqueProperties.filter(p => {
    const isDeactivatedTab = activeTab === 'deactivated'
    const matchesAvailability = isDeactivatedTab ? p.available === false : p.available !== false
    const matchesSearch = searchQuery === '' ? true :
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.neighborhood?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesAvailability && matchesSearch
  })

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE)
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const propertyStats = {
    total: uniqueProperties.filter(p => p.available !== false).length,
  }

  function isFeatured(propertyId: string) {
    return featuredSettings.rentFeatured.includes(propertyId) || featuredSettings.saleFeatured.includes(propertyId)
  }

  function canBeFeatured(property: Property) {
    if (isFeatured(property.id)) return true
    const isRent = property.type === 'rent' || property.type === 'both'
    const isSale = property.type === 'sale' || property.type === 'both'
    return (isSale && featuredSettings.saleFeatured.length < 3) || (isRent && featuredSettings.rentFeatured.length < 3)
  }

  async function toggleFeatured(property: Property) {
    const isRent = property.type === 'rent' || property.type === 'both'
    const isSale = property.type === 'sale' || property.type === 'both'
    const inRent = featuredSettings.rentFeatured.includes(property.id)
    const inSale = featuredSettings.saleFeatured.includes(property.id)

    let newSettings = { ...featuredSettings }
    if (inRent || inSale) {
      newSettings = {
        ...newSettings,
        rentFeatured: newSettings.rentFeatured.filter(id => id !== property.id),
        saleFeatured: newSettings.saleFeatured.filter(id => id !== property.id)
      }
    } else {
      if (isSale && featuredSettings.saleFeatured.length < 3) {
        newSettings = { ...newSettings, saleFeatured: [...newSettings.saleFeatured, property.id] }
      } else if (isRent && featuredSettings.rentFeatured.length < 3) {
        newSettings = { ...newSettings, rentFeatured: [...newSettings.rentFeatured, property.id] }
      }
    }

    setFeaturedSettings(newSettings)
    setSavingFeatured(true)
    try {
      await fetch('/api/admin/featured', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      })
    } catch (error) { console.error('Error:', error) }
    finally { setSavingFeatured(false) }
  }

  async function toggleAvailability(id: string, currentAvailable: boolean) {
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !currentAvailable })
      })
      if (res.ok) {
        setProperties(prev => prev.map(p => p.id === id ? { ...p, available: !currentAvailable } : p))
      }
    } catch (error) { console.error('Error:', error) }
  }

  async function deleteProperty(id: string) {
    if (!confirm('¿Eliminar esta propiedad permanentemente?')) return
    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' })
      if (res.ok) setProperties(prev => prev.filter(p => p.id !== id))
    } catch (error) { console.error('Error:', error) }
  }

  function openEditModal(property: Property) {
    setEditingProperty(property)
    setEditForm({
      title: property.title,
      description: property.description,
      price: property.price,
      rentPrice: property.rentPrice,
      neighborhood: property.neighborhood,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      type: property.type,
      category: property.category,
      images: property.images ? [...property.images] : []
    })
  }

  async function saveEdit() {
    if (!editingProperty) return
    setSavingEdit(true)
    try {
      const res = await fetch(`/api/properties/${editingProperty.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      if (res.ok) {
        setProperties(prev => prev.map(p =>
          p.id === editingProperty.id ? { ...p, ...editForm } : p
        ))
        setEditingProperty(null)
      }
    } catch (error) { console.error('Error:', error) }
    finally { setSavingEdit(false) }
  }

  return (
    <div className="space-y-4">
      {/* Deactivated banner */}
      {activeTab === 'deactivated' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-red-800">Propiedades Desactivadas</h3>
            <p className="text-sm text-red-600">Estas propiedades están ocultas al público. Haz clic en el ojo para reactivar.</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por título, colonia o ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Stats pill */}
      {activeTab !== 'deactivated' && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-900 text-white shadow-lg">
            Todas
            <span className="px-1.5 py-0.5 rounded-md text-xs bg-white/20">{propertyStats.total}</span>
          </div>
        </div>
      )}

      {/* Properties Grid */}
      <div className="grid gap-3">
        {paginatedProperties.map((property) => (
          <div
            key={property.id}
            className={`bg-white rounded-xl border overflow-hidden flex ${
              activeTab === 'deactivated'
                ? 'border-red-200 bg-red-50/30'
                : !property.available
                  ? 'opacity-50 border-gray-100'
                  : isFeatured(property.id)
                    ? 'border-yellow-300 ring-1 ring-yellow-200'
                    : 'border-gray-100'
            }`}
          >
            {/* Thumbnail */}
            <div className="relative w-24 h-24 flex-shrink-0">
              {property.images?.[0] ? (
                <Image src={property.images[0]} alt="" fill className="object-cover" sizes="96px" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              )}
              {isFeatured(property.id) && (
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-yellow-400 text-yellow-900 text-[10px] font-bold">
                  DESTACADA
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900 text-sm truncate">{property.title}</h3>
                <p className="text-xs text-gray-400 truncate">{property.neighborhood}</p>
                <p className="text-sm font-bold text-blue-600 mt-1">
                  {property.price ? formatPrice(property.price) :
                   property.rentPrice ? `${formatPrice(property.rentPrice)}/mes` : '-'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleFeatured(property)}
                  disabled={!canBeFeatured(property) || savingFeatured}
                  className={`p-2 rounded-lg transition-colors ${
                    isFeatured(property.id)
                      ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50'
                      : canBeFeatured(property)
                      ? 'text-gray-300 hover:text-yellow-500 hover:bg-yellow-50'
                      : 'text-gray-200 cursor-not-allowed'
                  }`}
                  title={isFeatured(property.id) ? 'Quitar de destacadas' : canBeFeatured(property) ? 'Agregar a destacadas' : 'Espacios llenos'}
                >
                  <svg className="w-4 h-4" fill={isFeatured(property.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
                <button onClick={() => openEditModal(property)} className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Editar">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <Link href={`/propiedad/${property.id}`} target="_blank" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg" title="Ver en sitio">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
                <button
                  onClick={() => toggleAvailability(property.id, property.available)}
                  className={`p-2 rounded-lg ${property.available ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50' : 'text-green-500 hover:text-green-600 hover:bg-green-50'}`}
                  title={property.available ? 'Desactivar' : 'Reactivar'}
                >
                  {property.available ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                <button onClick={() => deleteProperty(property.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {paginatedProperties.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No se encontraron propiedades
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg text-sm bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-500">{currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg text-sm bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-gray-900">Editar Propiedad</h2>
              <button onClick={() => setEditingProperty(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Título <Tooltip text={tips.title} /></label>
                <input
                  type="text"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Tipo <Tooltip text={tips.type} /></label>
                  <select
                    value={editForm.type || 'sale'}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value as 'sale' | 'rent' | 'both' })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="sale">Venta</option>
                    <option value="rent">Renta</option>
                    <option value="both">Venta y Renta</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Categoría <Tooltip text={tips.category} /></label>
                  <select
                    value={editForm.category || 'house'}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value as 'house' | 'apartment' | 'land' | 'commercial' | 'warehouse' })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="house">Casa</option>
                    <option value="apartment">Departamento</option>
                    <option value="land">Terreno</option>
                    <option value="commercial">Comercial</option>
                    <option value="warehouse">Bodega</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Precio de Venta <Tooltip text={tips.salePrice} /></label>
                  <input
                    type="number"
                    value={editForm.price || ''}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Renta Mensual <Tooltip text={tips.rentPrice} /></label>
                  <input
                    type="number"
                    value={editForm.rentPrice || ''}
                    onChange={(e) => setEditForm({ ...editForm, rentPrice: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Colonia <Tooltip text={tips.neighborhood} /></label>
                <input
                  type="text"
                  value={editForm.neighborhood || ''}
                  onChange={(e) => setEditForm({ ...editForm, neighborhood: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Recámaras <Tooltip text={tips.bedrooms} /></label>
                  <input
                    type="number"
                    step="0.5"
                    value={editForm.bedrooms || ''}
                    onChange={(e) => setEditForm({ ...editForm, bedrooms: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Baños <Tooltip text={tips.bathrooms} /></label>
                  <input
                    type="number"
                    step="0.5"
                    value={editForm.bathrooms || ''}
                    onChange={(e) => setEditForm({ ...editForm, bathrooms: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Superficie <Tooltip text={tips.area} /></label>
                  <input
                    type="text"
                    value={editForm.area || ''}
                    onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="150 m²"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Descripción <Tooltip text={tips.description} /></label>
                <textarea
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Images with uploader */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">Imágenes <Tooltip text={tips.images} /></label>
                <ImageUploader
                  images={editForm.images || []}
                  onChange={(newImages) => setEditForm({ ...editForm, images: newImages })}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 bg-white">
              <button onClick={() => setEditingProperty(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
                Cancelar
              </button>
              <button
                onClick={saveEdit}
                disabled={savingEdit}
                className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-all"
              >
                {savingEdit ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import Tooltip from './Tooltip'
import ImageUploader from './ImageUploader'

const tips = {
  title: 'El nombre del anuncio. Corto y descriptivo. Ej: "Casa en Colonia Centro"',
  id: 'Identificador único para la URL. Se genera del título. Solo letras, números y guiones.',
  type: '¿Se vende, se renta, o ambas? Esto determina en qué sección aparece.',
  category: 'Tipo de inmueble: casa, departamento, terreno, local comercial o bodega.',
  salePrice: 'Precio en pesos mexicanos. Solo números, sin comas. Ej: 3500000',
  rentPrice: 'Precio de renta por mes en pesos. Solo números. Ej: 15000',
  avaluoPrice: 'Valor del avalúo oficial. Si el precio de venta es menor, se resalta como oferta.',
  neighborhood: 'Colonia o fraccionamiento. Ej: "Col. Centro" o "Fracc. Los Sauces"',
  location: 'Dirección o referencia. Ej: "Calle Mina 336B, entre Oaxaca y Mazatlán"',
  city: 'Por defecto "Tepic, Nayarit". Cambia solo si es otra ciudad.',
  bedrooms: 'Número de recámaras. Usa decimales para estudios: 2.5',
  bathrooms: 'Número de baños. Usa .5 para medio baño. Ej: 2.5 = 2 completos + 1 medio',
  area: 'Metros cuadrados construidos. Escribe con unidad. Ej: "276 m²"',
  lotSize: 'Metros cuadrados totales del terreno. Ej: "245 m²"',
  features: 'Agrega una por una. Ej: "Cochera 2 autos", "Cocina equipada", "Calentador solar"',
  images: 'La primera foto es la imagen principal del anuncio. Puedes reordenar.',
  video: 'URL de YouTube o TikTok con video de la propiedad (opcional).',
  coordinates: 'Lat/lng para el mapa. Clic derecho en Google Maps → "¿Qué hay aquí?" para obtenerlas.',
  isBusinessProperty: 'Marca si es local, oficina o negocio que genera ingresos.',
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

interface AddPropertyFormProps {
  onPropertyCreated: () => void
}

export default function AddPropertyForm({ onPropertyCreated }: AddPropertyFormProps) {
  const [title, setTitle] = useState('')
  const [id, setId] = useState('')
  const [idManual, setIdManual] = useState(false)
  const [type, setType] = useState<'sale' | 'rent' | 'both'>('sale')
  const [category, setCategory] = useState<'house' | 'apartment' | 'land' | 'commercial' | 'warehouse'>('house')
  const [neighborhood, setNeighborhood] = useState('')
  const [location, setLocation] = useState('')
  const [city, setCity] = useState('Tepic, Nayarit')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [price, setPrice] = useState('')
  const [rentPrice, setRentPrice] = useState('')
  const [avaluoPrice, setAvaluoPrice] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [area, setArea] = useState('')
  const [lotSize, setLotSize] = useState('')
  const [description, setDescription] = useState('')
  const [features, setFeatures] = useState<string[]>([''])
  const [images, setImages] = useState<string[]>([])
  const [video, setVideo] = useState('')
  const [isBusinessProperty, setIsBusinessProperty] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!idManual) setId(generateSlug(val))
  }

  function handleIdChange(val: string) {
    setIdManual(true)
    setId(val.replace(/[^a-z0-9-]/g, ''))
  }

  function addFeature() {
    setFeatures([...features, ''])
  }

  function updateFeature(index: number, value: string) {
    const updated = [...features]
    updated[index] = value
    setFeatures(updated)
  }

  function removeFeature(index: number) {
    setFeatures(features.filter((_, i) => i !== index))
  }

  function resetForm() {
    setTitle('')
    setId('')
    setIdManual(false)
    setType('sale')
    setCategory('house')
    setNeighborhood('')
    setLocation('')
    setCity('Tepic, Nayarit')
    setLat('')
    setLng('')
    setPrice('')
    setRentPrice('')
    setAvaluoPrice('')
    setBedrooms('')
    setBathrooms('')
    setArea('')
    setLotSize('')
    setDescription('')
    setFeatures([''])
    setImages([])
    setVideo('')
    setIsBusinessProperty(false)
    setError(null)
    setSuccess(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!title.trim()) { setError('El título es obligatorio'); return }
    if (!id.trim()) { setError('El ID es obligatorio'); return }
    if (!neighborhood.trim()) { setError('La colonia es obligatoria'); return }

    setCreating(true)

    const property = {
      id: id.trim(),
      title: title.trim(),
      description: description.trim(),
      type,
      category,
      location: location.trim(),
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      ...(lat && lng ? { coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) } } : {}),
      ...(price ? { price: parseInt(price) } : {}),
      ...(rentPrice ? { rentPrice: parseInt(rentPrice) } : {}),
      ...(avaluoPrice ? { avaluoPrice: parseInt(avaluoPrice) } : {}),
      ...(bedrooms ? { bedrooms: parseFloat(bedrooms) } : {}),
      ...(bathrooms ? { bathrooms: parseFloat(bathrooms) } : {}),
      ...(area ? { area: area.trim() } : {}),
      ...(lotSize ? { lotSize: lotSize.trim() } : {}),
      features: features.filter(f => f.trim()),
      images,
      ...(video ? { video: video.trim() } : {}),
      featured: false,
      available: true,
      isBusinessProperty,
    }

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Error al crear la propiedad')
        return
      }

      setSuccess(true)
      onPropertyCreated()
    } catch {
      setError('Error de conexión')
    } finally {
      setCreating(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Propiedad creada</h2>
        <p className="text-gray-500 mb-6">Se publicó correctamente en el sitio.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={resetForm} className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
            Agregar otra
          </button>
          <a href={`/propiedad/${id}`} target="_blank" className="px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50">
            Ver propiedad
          </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Section 1: Información Básica */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Información Básica</h2>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            Título <span className="text-red-400 ml-0.5">*</span> <Tooltip text={tips.title} />
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Ej: Casa en Colonia Centro"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            ID (URL) <Tooltip text={tips.id} />
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">/propiedad/</span>
            <input
              type="text"
              value={id}
              onChange={(e) => handleIdChange(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              Tipo <span className="text-red-400 ml-0.5">*</span> <Tooltip text={tips.type} />
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'sale' | 'rent' | 'both')}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sale">Venta</option>
              <option value="rent">Renta</option>
              <option value="both">Venta y Renta</option>
            </select>
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              Categoría <span className="text-red-400 ml-0.5">*</span> <Tooltip text={tips.category} />
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as 'house' | 'apartment' | 'land' | 'commercial' | 'warehouse')}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="house">Casa</option>
              <option value="apartment">Departamento</option>
              <option value="land">Terreno</option>
              <option value="commercial">Comercial</option>
              <option value="warehouse">Bodega</option>
            </select>
          </div>
        </div>
      </section>

      {/* Section 2: Ubicación */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Ubicación</h2>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            Colonia <span className="text-red-400 ml-0.5">*</span> <Tooltip text={tips.neighborhood} />
          </label>
          <input
            type="text"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            placeholder="Ej: Col. Centro"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            Dirección <Tooltip text={tips.location} />
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ej: Calle Mina 336B, entre Oaxaca y Mazatlán"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            Ciudad <Tooltip text={tips.city} />
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            Coordenadas <Tooltip text={tips.coordinates} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="Latitud: 21.5041"
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="Longitud: -104.8946"
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Section 3: Precios */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Precios</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              Precio de Venta <Tooltip text={tips.salePrice} />
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="3500000"
                className="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              Renta Mensual <Tooltip text={tips.rentPrice} />
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                value={rentPrice}
                onChange={(e) => setRentPrice(e.target.value)}
                placeholder="15000"
                className="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="w-1/2">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            Precio de Avalúo <Tooltip text={tips.avaluoPrice} />
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              value={avaluoPrice}
              onChange={(e) => setAvaluoPrice(e.target.value)}
              placeholder="4000000"
              className="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Section 4: Detalles */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Detalles</h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              Recámaras <Tooltip text={tips.bedrooms} />
            </label>
            <input
              type="number"
              step="0.5"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              placeholder="3"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              Baños <Tooltip text={tips.bathrooms} />
            </label>
            <input
              type="number"
              step="0.5"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              placeholder="2"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              Superficie <Tooltip text={tips.area} />
            </label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder='276 m²'
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              Terreno <Tooltip text={tips.lotSize} />
            </label>
            <input
              type="text"
              value={lotSize}
              onChange={(e) => setLotSize(e.target.value)}
              placeholder='245 m²'
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer pb-2">
              <input
                type="checkbox"
                checked={isBusinessProperty}
                onChange={(e) => setIsBusinessProperty(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Propiedad comercial</span>
              <Tooltip text={tips.isBusinessProperty} />
            </label>
          </div>
        </div>
      </section>

      {/* Section 5: Descripción */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Descripción</h2>
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            Descripción <Tooltip text={tips.title} />
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe la propiedad: ubicación, características especiales, estado, amenidades cercanas..."
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </section>

      {/* Section 6: Características */}
      <section className="space-y-4">
        <h2 className="flex items-center text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
          Características <Tooltip text={tips.features} />
        </h2>
        <div className="space-y-2">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={f}
                onChange={(e) => updateFeature(i, e.target.value)}
                placeholder="Ej: 3 Recámaras amplias"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {features.length > 1 && (
                <button type="button" onClick={() => removeFeature(i)} className="p-2 text-red-400 hover:text-red-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Agregar característica
          </button>
        </div>
      </section>

      {/* Section 7: Imágenes */}
      <section className="space-y-4">
        <h2 className="flex items-center text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
          Imágenes <Tooltip text={tips.images} />
        </h2>
        <ImageUploader images={images} onChange={setImages} />
      </section>

      {/* Section 8: Video */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Video (Opcional)</h2>
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            URL del video <Tooltip text={tips.video} />
          </label>
          <input
            type="url"
            value={video}
            onChange={(e) => setVideo(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </section>

      {/* Submit */}
      <div className="pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={creating}
          className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {creating ? 'Creando...' : 'Crear propiedad'}
        </button>
      </div>
    </form>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Property } from '@/data/properties'
import PropertyList from './components/PropertyList'
import SettingsPanel from './components/SettingsPanel'
import AddPropertyForm from './components/AddPropertyForm'

type TabType = 'properties' | 'destacadas' | 'deactivated' | 'agregar';

interface FeaturedSettings {
  rentFeatured: string[];
  saleFeatured: string[];
  rentFeaturedSimilar: string | null;
  saleFeaturedSimilar: string | null;
}

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState<Property[]>([])
  const [activeTab, setActiveTab] = useState<TabType>('properties')

  const [featuredSettings, setFeaturedSettings] = useState<FeaturedSettings>({
    rentFeatured: [],
    saleFeatured: [],
    rentFeaturedSimilar: null,
    saleFeaturedSimilar: null
  })

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/featured')
        if (res.ok) {
          setIsLoggedIn(true)
          const data = await res.json()
          setFeaturedSettings(data)
        }
      } catch { /* Not logged in */ }
      finally { setLoading(false) }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      fetchProperties()
      fetchFeaturedSettings()
    }
  }, [isLoggedIn])

  async function fetchProperties() {
    try {
      const res = await fetch('/api/properties')
      const data = await res.json()
      if (data.properties) setProperties(data.properties)
    } catch (error) { console.error('Error:', error) }
  }

  async function fetchFeaturedSettings() {
    try {
      const res = await fetch('/api/admin/featured')
      if (res.ok) {
        const data = await res.json()
        setFeaturedSettings(data)
      }
    } catch (error) { console.error('Error:', error) }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      if (res.ok) {
        setIsLoggedIn(true)
      } else {
        setLoginError('Contraseña incorrecta')
      }
    } catch { setLoginError('Error al iniciar sesión') }
  }

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    setIsLoggedIn(false)
    setProperties([])
  }

  const propertyStats = {
    total: properties.filter((p, i, self) => i === self.findIndex(prop => prop.id === p.id) && p.available !== false).length,
    deactivated: properties.filter((p, i, self) => i === self.findIndex(prop => prop.id === p.id) && p.available === false).length
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
      </main>
    )
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <img src="/favicon.png" alt="Prisma" className="w-10 h-10" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Administración</h1>
            <p className="text-gray-400 text-sm mt-1">Prisma Real Estate</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-center"
              placeholder="Contraseña"
            />
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
            <button type="submit" className="w-full bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-all">
              Iniciar sesión
            </button>
          </form>

          <Link href="/" className="block text-center text-gray-400 hover:text-gray-600 text-sm mt-6">
            Volver al sitio
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/favicon.png" alt="Prisma" className="w-10 h-10" />
            </Link>
            <h1 className="font-semibold text-gray-900">Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
              <button
                onClick={() => setActiveTab('properties')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'properties'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Propiedades ({propertyStats.total})
              </button>
              <button
                onClick={() => setActiveTab('agregar')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'agregar'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-green-700 bg-green-50 hover:bg-green-100'
                }`}
              >
                + Agregar
              </button>
              <button
                onClick={() => setActiveTab('destacadas')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'destacadas'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Destacadas
              </button>
              {propertyStats.deactivated > 0 && (
                <button
                  onClick={() => setActiveTab('deactivated')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'deactivated'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  Desactivadas ({propertyStats.deactivated})
                </button>
              )}
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 p-2" title="Cerrar sesión">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {(activeTab === 'properties' || activeTab === 'deactivated') && (
          <PropertyList
            properties={properties}
            setProperties={setProperties}
            featuredSettings={featuredSettings}
            setFeaturedSettings={setFeaturedSettings}
            activeTab={activeTab}
          />
        )}

        {activeTab === 'destacadas' && (
          <SettingsPanel
            featuredSettings={featuredSettings}
            setFeaturedSettings={setFeaturedSettings}
            properties={properties}
          />
        )}

        {activeTab === 'agregar' && (
          <AddPropertyForm onPropertyCreated={() => { fetchProperties(); setActiveTab('properties') }} />
        )}
      </div>
    </main>
  )
}

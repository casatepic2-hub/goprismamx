'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Property } from '@/data/properties'
import PropertyList from './components/PropertyList'
import SettingsPanel from './components/SettingsPanel'

type TabType = 'properties' | 'settings' | 'deactivated';

interface Settings {
  saleDeleteWeeks: number;
  rentDeleteWeeks: number;
  enabled: boolean;
}

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
  const [settings, setSettings] = useState<Settings>({ saleDeleteWeeks: 8, rentDeleteWeeks: 3, enabled: true })
  const [activeTab, setActiveTab] = useState<TabType>('properties')

  // Featured properties state
  const [featuredSettings, setFeaturedSettings] = useState<FeaturedSettings>({
    rentFeatured: [],
    saleFeatured: [],
    rentFeaturedSimilar: null,
    saleFeaturedSimilar: null
  })

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/settings')
        if (res.ok) {
          setIsLoggedIn(true)
          const data = await res.json()
          if (data.settings) setSettings(data.settings)
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
    } catch (error) { console.error('Error fetching properties:', error) }
  }

  async function fetchFeaturedSettings() {
    try {
      const res = await fetch('/api/admin/featured')
      if (res.ok) {
        const data = await res.json()
        setFeaturedSettings(data)
      }
    } catch (error) { console.error('Error fetching featured settings:', error) }
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
        const settingsRes = await fetch('/api/admin/settings')
        if (settingsRes.ok) {
          const data = await settingsRes.json()
          if (data.settings) setSettings(data.settings)
        }
      } else {
        setLoginError('Incorrect password')
      }
    } catch { setLoginError('Login error') }
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
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent" />
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
            <h1 className="text-xl font-bold text-gray-900">Admin</h1>
            <p className="text-gray-400 text-sm mt-1">Prisma Real Estate</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all text-center"
              placeholder="Password"
            />
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
            <button type="submit" className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium py-3 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 transition-all">
              Login
            </button>
          </form>

          <Link href="/" className="block text-center text-gray-400 hover:text-gray-600 text-sm mt-6">
            Back to site
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
            <h1 className="font-semibold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Tab Pills */}
            <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
              <button
                onClick={() => setActiveTab('properties')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                  activeTab === 'properties'
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                }`}
              >
                Properties ({propertyStats.total})
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'settings' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Settings
              </button>
              {propertyStats.deactivated > 0 && (
                <button
                  onClick={() => setActiveTab('deactivated')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'deactivated'
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  Deactivated ({propertyStats.deactivated})
                </button>
              )}
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Properties Tab (also used for Deactivated tab) */}
        {(activeTab === 'properties' || activeTab === 'deactivated') && (
          <PropertyList
            properties={properties}
            setProperties={setProperties}
            featuredSettings={featuredSettings}
            setFeaturedSettings={setFeaturedSettings}
            activeTab={activeTab}
          />
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <SettingsPanel
            settings={settings}
            setSettings={setSettings}
            featuredSettings={featuredSettings}
            setFeaturedSettings={setFeaturedSettings}
            properties={properties}
          />
        )}
      </div>
    </main>
  )
}

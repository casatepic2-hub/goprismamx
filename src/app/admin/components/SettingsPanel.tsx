'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Property, formatPrice } from '@/data/properties'

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

interface SettingsPanelProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  featuredSettings: FeaturedSettings;
  setFeaturedSettings: React.Dispatch<React.SetStateAction<FeaturedSettings>>;
  properties: Property[];
}

export default function SettingsPanel({
  settings,
  setSettings,
  featuredSettings,
  setFeaturedSettings,
  properties
}: SettingsPanelProps) {
  const [savingSettings, setSavingSettings] = useState(false)
  const [savingFeatured, setSavingFeatured] = useState(false)

  function getPropertyById(id: string) {
    return properties.find(p => p.id === id)
  }

  async function saveSettings() {
    setSavingSettings(true)
    try {
      await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
    } catch (error) { console.error('Error:', error) }
    finally { setSavingSettings(false) }
  }

  async function saveFeaturedSettings() {
    setSavingFeatured(true)
    try {
      await fetch('/api/admin/featured', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(featuredSettings)
      })
    } catch (error) { console.error('Error saving featured settings:', error) }
    finally { setSavingFeatured(false) }
  }

  async function removeFromFeatured(type: 'rent' | 'sale', propertyId: string) {
    let newSettings = { ...featuredSettings }
    if (type === 'rent') {
      newSettings = { ...newSettings, rentFeatured: newSettings.rentFeatured.filter(id => id !== propertyId) }
    } else {
      newSettings = { ...newSettings, saleFeatured: newSettings.saleFeatured.filter(id => id !== propertyId) }
    }

    setFeaturedSettings(newSettings)

    try {
      await fetch('/api/admin/featured', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      })
    } catch (error) {
      console.error('Error saving featured settings:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Auto-Delete Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">Auto-Delete Settings</h2>
            <p className="text-sm text-gray-400">Automatically remove old listings after specified weeks.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sale</span>
            <input
              type="number"
              min="1"
              max="52"
              value={settings.saleDeleteWeeks}
              onChange={(e) => setSettings({ ...settings, saleDeleteWeeks: parseInt(e.target.value) || 8 })}
              className="w-16 px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-center"
            />
            <span className="text-sm text-gray-400">weeks</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Rent</span>
            <input
              type="number"
              min="1"
              max="52"
              value={settings.rentDeleteWeeks}
              onChange={(e) => setSettings({ ...settings, rentDeleteWeeks: parseInt(e.target.value) || 3 })}
              className="w-16 px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-center"
            />
            <span className="text-sm text-gray-400">weeks</span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary-600"
            />
            <span className="text-sm text-gray-500">Enabled</span>
          </label>
          <button
            onClick={saveSettings}
            disabled={savingSettings}
            className="ml-auto px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {savingSettings ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Featured Properties Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-gray-900">Featured Properties</h2>
            <p className="text-sm text-gray-400">Appear first in search and hero section. Add from Properties tab.</p>
          </div>
          <button
            onClick={saveFeaturedSettings}
            disabled={savingFeatured}
            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {savingFeatured ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Sale Featured */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">For Sale ({featuredSettings.saleFeatured.length}/3)</h3>
            <div className="space-y-2">
              {featuredSettings.saleFeatured.length === 0 ? (
                <p className="text-gray-400 text-sm py-4 text-center border-2 border-dashed border-gray-200 rounded-lg">No properties selected</p>
              ) : featuredSettings.saleFeatured.map((id) => {
                const prop = getPropertyById(id)
                return (
                  <div key={id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                    <div className="w-12 h-12 relative rounded overflow-hidden flex-shrink-0">
                      {prop?.images?.[0] ? (
                        <Image src={prop.images[0]} alt="" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{prop?.title || id}</p>
                      <p className="text-xs text-gray-400">{prop?.price ? formatPrice(prop.price) : 'No price'}</p>
                    </div>
                    <button
                      onClick={() => removeFromFeatured('sale', id)}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Rent Featured */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">For Rent ({featuredSettings.rentFeatured.length}/3)</h3>
            <div className="space-y-2">
              {featuredSettings.rentFeatured.length === 0 ? (
                <p className="text-gray-400 text-sm py-4 text-center border-2 border-dashed border-gray-200 rounded-lg">No properties selected</p>
              ) : featuredSettings.rentFeatured.map((id) => {
                const prop = getPropertyById(id)
                return (
                  <div key={id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                    <div className="w-12 h-12 relative rounded overflow-hidden flex-shrink-0">
                      {prop?.images?.[0] ? (
                        <Image src={prop.images[0]} alt="" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{prop?.title || id}</p>
                      <p className="text-xs text-gray-400">{prop?.rentPrice ? `${formatPrice(prop.rentPrice)}/mo` : 'No price'}</p>
                    </div>
                    <button
                      onClick={() => removeFromFeatured('rent', id)}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Featured Similar Section */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Featured Similar (shown in similar properties section)</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sale Similar */}
            <div>
              <p className="text-xs text-gray-400 mb-2">For sale properties</p>
              {featuredSettings.saleFeaturedSimilar ? (
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                  <div className="w-12 h-12 relative rounded overflow-hidden flex-shrink-0">
                    {getPropertyById(featuredSettings.saleFeaturedSimilar)?.images?.[0] ? (
                      <Image src={getPropertyById(featuredSettings.saleFeaturedSimilar)!.images![0]} alt="" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{getPropertyById(featuredSettings.saleFeaturedSimilar)?.title || featuredSettings.saleFeaturedSimilar}</p>
                  </div>
                  <button
                    onClick={() => setFeaturedSettings(prev => ({ ...prev, saleFeaturedSimilar: null }))}
                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <p className="text-gray-400 text-sm py-3 text-center border-2 border-dashed border-gray-200 rounded-lg">Not selected</p>
              )}
            </div>

            {/* Rent Similar */}
            <div>
              <p className="text-xs text-gray-400 mb-2">For rent properties</p>
              {featuredSettings.rentFeaturedSimilar ? (
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                  <div className="w-12 h-12 relative rounded overflow-hidden flex-shrink-0">
                    {getPropertyById(featuredSettings.rentFeaturedSimilar)?.images?.[0] ? (
                      <Image src={getPropertyById(featuredSettings.rentFeaturedSimilar)!.images![0]} alt="" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{getPropertyById(featuredSettings.rentFeaturedSimilar)?.title || featuredSettings.rentFeaturedSimilar}</p>
                  </div>
                  <button
                    onClick={() => setFeaturedSettings(prev => ({ ...prev, rentFeaturedSimilar: null }))}
                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <p className="text-gray-400 text-sm py-3 text-center border-2 border-dashed border-gray-200 rounded-lg">Not selected</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

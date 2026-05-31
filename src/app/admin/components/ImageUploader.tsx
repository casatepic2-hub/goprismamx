'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface ImageUploaderProps {
  images: string[]
  onChange: (urls: string[]) => void
}

async function resizeImage(file: File, maxWidth: number): Promise<Blob> {
  return new Promise((resolve) => {
    const img = document.createElement('img')
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      if (img.width <= maxWidth) {
        resolve(file)
        return
      }
      const canvas = document.createElement('canvas')
      const ratio = maxWidth / img.width
      canvas.width = maxWidth
      canvas.height = img.height * ratio
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => resolve(blob || file),
        file.type === 'image/png' ? 'image/png' : 'image/jpeg',
        0.85
      )
    }
    img.src = url
  })
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | File[]) {
    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      for (const file of Array.from(files)) {
        const resized = await resizeImage(file, 1600)
        formData.append('files', resized, file.name)
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Error al subir')
        return
      }

      const { urls } = await res.json()
      onChange([...images, ...urls])
    } catch {
      setError('Error de conexión al subir imágenes')
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files)
    }
  }

  function moveImage(index: number, direction: -1 | 1) {
    const newImages = [...images]
    const target = index + direction
    if (target < 0 || target >= newImages.length) return
    ;[newImages[index], newImages[target]] = [newImages[target], newImages[index]]
    onChange(newImages)
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index))
  }

  function setAsMain(index: number) {
    if (index === 0) return
    const newImages = [...images]
    const [moved] = newImages.splice(index, 1)
    newImages.unshift(moved)
    onChange(newImages)
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm font-medium">Subiendo...</span>
          </div>
        ) : (
          <>
            <svg className="w-8 h-8 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-500">Arrastra imágenes aquí o haz clic para seleccionar</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG o WebP. Máx 4MB por imagen.</p>
          </>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Image grid */}
      {images.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-2">La primera imagen es la foto principal del anuncio.</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {images.map((url, i) => (
              <div key={url} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                <Image src={url} alt={`Foto ${i + 1}`} fill className="object-cover" sizes="120px" />

                {/* Main badge */}
                {i === 0 && (
                  <span className="absolute top-1 left-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Principal
                  </span>
                )}

                {/* Controls overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); moveImage(i, -1) }}
                      className="w-6 h-6 bg-white rounded text-gray-700 flex items-center justify-center text-xs"
                    >
                      &larr;
                    </button>
                  )}
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setAsMain(i) }}
                      className="w-6 h-6 bg-blue-500 rounded text-white flex items-center justify-center text-[10px]"
                      title="Hacer principal"
                    >
                      &#9733;
                    </button>
                  )}
                  {i < images.length - 1 && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); moveImage(i, 1) }}
                      className="w-6 h-6 bg-white rounded text-gray-700 flex items-center justify-center text-xs"
                    >
                      &rarr;
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(i) }}
                    className="w-6 h-6 bg-red-500 rounded text-white flex items-center justify-center text-xs"
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

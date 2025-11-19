'use client';

import { useEffect, useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string) => void;
  currentImageUrl?: string;
  onRemove?: () => void;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

/**
 * Cloudinary Upload Widget Component
 *
 * Features:
 * - One-click image upload
 * - Auto-resize to 400x400px with face detection
 * - Preview uploaded image
 * - Remove image option
 *
 * Setup Required:
 * 1. Sign up at cloudinary.com (free)
 * 2. Create upload preset named 'barber_profiles' (unsigned mode)
 * 3. Replace 'YOUR_CLOUD_NAME' below with your actual cloud name
 */
export function CloudinaryUpload({
  onUploadSuccess,
  currentImageUrl,
  onRemove
}: CloudinaryUploadProps) {
  const cloudinaryRef = useRef<any>(null);
  const widgetRef = useRef<any>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Cloudinary upload widget script
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    // Initialize Cloudinary widget once script is loaded
    if (isScriptLoaded && typeof window !== 'undefined' && window.cloudinary) {
      cloudinaryRef.current = window.cloudinary;

      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          // Cloudinary cloud name
          cloudName: 'dwd0nsluj',

          // Upload preset must be created in Cloudinary Dashboard
          // Settings → Upload → Upload presets → Add upload preset
          // Name: barber_profiles, Signing mode: Unsigned
          uploadPreset: 'barber_profiles',

          sources: ['local', 'camera', 'url'], // Allow upload from computer, camera, or URL
          multiple: false, // Only allow single file upload
          maxFiles: 1,
          maxFileSize: 5000000, // 5MB limit
          clientAllowedFormats: ['jpg', 'png', 'jpeg', 'webp'], // Only image formats
          folder: 'trimminflow/barbers', // Organize uploads in folders

          // Auto-transformation: resize to 400x400px, crop to face
          transformation: [
            {
              width: 400,
              height: 400,
              crop: 'fill',
              gravity: 'face' // Smart crop focusing on face
            }
          ],

          // Customize widget appearance
          styles: {
            palette: {
              window: '#1f2937',
              windowBorder: '#f59e0b',
              tabIcon: '#f59e0b',
              menuIcons: '#9ca3af',
              textDark: '#f3f4f6',
              textLight: '#ffffff',
              link: '#f59e0b',
              action: '#f59e0b',
              inactiveTabIcon: '#6b7280',
              error: '#ef4444',
              inProgress: '#f59e0b',
              complete: '#10b981',
              sourceBg: '#111827'
            },
            fonts: {
              default: null,
              "'Inter', sans-serif": {
                url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
                active: true
              }
            }
          }
        },
        (error: any, result: any) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            alert(`Upload failed: ${error.message || 'Unknown error'}`);
            return;
          }

          if (result && result.event === 'success') {
            console.log('Upload Success:', result.info);
            // Return the secure URL of uploaded image
            onUploadSuccess(result.info.secure_url);
          }
        }
      );
    }
  }, [isScriptLoaded, onUploadSuccess]);

  const openWidget = () => {
    if (!widgetRef.current) {
      alert('Cloudinary widget not loaded yet. Please wait a moment and try again.');
      return;
    }
    widgetRef.current.open();
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Profile Image
      </label>

      {currentImageUrl && (
        <div className="relative w-24 h-24 mb-2 group">
          <img
            src={currentImageUrl}
            alt="Current profile"
            className="w-full h-full rounded-full object-cover border-2 border-yellow-400/30"
          />
          {onRemove && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={openWidget}
        disabled={!isScriptLoaded}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          isScriptLoaded
            ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
            : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
        }`}
      >
        <Upload className="w-4 h-4" />
        {isScriptLoaded
          ? (currentImageUrl ? 'Change Image' : 'Upload Image')
          : 'Loading widget...'
        }
      </button>

      <p className="text-xs text-gray-500">
        Max 5MB • JPG, PNG, WebP • Auto-resized to 400x400px
      </p>

      {!isScriptLoaded && (
        <p className="text-xs text-yellow-400">
          ⏳ Loading Cloudinary upload widget...
        </p>
      )}
    </div>
  );
}

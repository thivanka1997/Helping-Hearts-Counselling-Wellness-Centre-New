'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  /** Cloudinary sub-folder: 'courses' | 'blogs' | 'events' | 'gallery' | 'lecturers' */
  folder: string;
  /** Called with the Cloudinary secure_url once upload succeeds */
  onUpload: (url: string) => void;
  /** Pre-fill preview with an existing image when editing */
  currentImage?: string;
  /** Label shown above the upload area */
  label?: string;
}

export default function ImageUpload({
  folder,
  onUpload,
  currentImage,
  label = 'Upload Image',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(currentImage || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.success) {
        onUpload(data.url); // Bubble Cloudinary URL up to parent form
      } else {
        setError(data.error || 'Upload failed');
        setPreview(currentImage || '');
      }
    } catch {
      setError('Network error. Please try again.');
      setPreview(currentImage || '');
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl); // Clean up object URL
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontWeight: 600, fontSize: '14px' }}>{label}</label>

      {/* Preview */}
      {preview && (
        <div>
          <img
            src={preview}
            alt="Image preview"
            style={{
              maxWidth: '200px',
              maxHeight: '150px',
              objectFit: 'cover',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
            }}
          />
        </div>
      )}

      {/* Upload button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '6px',
          border: '1px dashed #94a3b8',
          background: uploading ? '#f1f5f9' : '#fff',
          cursor: uploading ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          width: 'fit-content',
        }}
      >
        {uploading ? '⏳ Uploading...' : preview ? '🔄 Change Image' : '📁 Choose Image'}
      </button>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Status messages */}
      {uploading && (
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
          Uploading to Cloudinary...
        </p>
      )}
      {error && (
        <p style={{ fontSize: '13px', color: '#ef4444', margin: 0 }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}

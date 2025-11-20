# 📸 Cloudinary Integration Guide for TrimminFlow

## ☁️ What is Cloudinary?

Cloudinary is a cloud-based image and video management service that provides:
- **Free Storage** (25GB) - Thousands of images
- **Free Bandwidth** (25GB/month) - Perfect for startups
- **CDN Delivery** - Fast loading worldwide
- **Image Transformations** - Resize, crop, optimize automatically
- **No Credit Card Required** to start

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Free Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up with your email (or Google/GitHub)
3. Verify your email
4. You'll see your **Dashboard** with:
   - **Cloud Name** (e.g., `dtrimminflow`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcd1234efgh5678`)

### Step 2: Get Your Credentials

On the Cloudinary Dashboard, copy these 3 values:

```
Cloud Name: dtrimminflow
API Key: 123456789012345
API Secret: abcd1234efgh5678
```

---

## 💻 Frontend Integration (React/Next.js)

### Option 1: **Upload Widget** (Easiest - Recommended for MVP)

This option uses Cloudinary's pre-built upload widget - no backend code needed!

#### 1. Add Cloudinary Script

Add to `trimminflowf/src/app/layout.tsx` (in the `<head>`):

```tsx
<Script
  src="https://upload-widget.cloudinary.com/global/all.js"
  strategy="beforeInteractive"
/>
```

#### 2. Create Upload Component

Create `trimminflowf/src/components/ui/CloudinaryUpload.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string) => void;
  currentImageUrl?: string;
}

export function CloudinaryUpload({ onUploadSuccess, currentImageUrl }: CloudinaryUploadProps) {
  const cloudinaryRef = useRef<any>();
  const widgetRef = useRef<any>();

  useEffect(() => {
    // Initialize Cloudinary widget
    if (typeof window !== 'undefined' && (window as any).cloudinary) {
      cloudinaryRef.current = (window as any).cloudinary;

      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          cloudName: 'YOUR_CLOUD_NAME', // Replace with your cloud name
          uploadPreset: 'barber_profiles', // We'll create this in Step 3
          sources: ['local', 'camera', 'url'],
          multiple: false,
          maxFiles: 1,
          maxFileSize: 5000000, // 5MB
          clientAllowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
          folder: 'trimminflow/barbers',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' }
          ],
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            console.log('Upload Success:', result.info);
            onUploadSuccess(result.info.secure_url);
          }
          if (error) {
            console.error('Upload Error:', error);
          }
        }
      );
    }
  }, [onUploadSuccess]);

  const openWidget = () => {
    widgetRef.current?.open();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Profile Image
      </label>

      {currentImageUrl && (
        <div className="relative w-24 h-24 mb-2">
          <img
            src={currentImageUrl}
            alt="Current profile"
            className="w-full h-full rounded-full object-cover border-2 border-yellow-400/30"
          />
        </div>
      )}

      <button
        type="button"
        onClick={openWidget}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
      >
        <Upload className="w-4 h-4" />
        {currentImageUrl ? 'Change Image' : 'Upload Image'}
      </button>

      <p className="text-xs text-gray-500">
        Max 5MB • JPG, PNG, WebP • Auto-resized to 400x400px
      </p>
    </div>
  );
}
```

#### 3. Create Upload Preset in Cloudinary

1. Go to **Settings** → **Upload** in Cloudinary Dashboard
2. Scroll to **Upload presets**
3. Click **Add upload preset**
4. Configure:
   - **Preset name**: `barber_profiles`
   - **Signing mode**: `Unsigned` (important!)
   - **Folder**: `trimminflow/barbers`
   - **Allowed formats**: `jpg, png, jpeg, webp`
   - **Transformations**: Add transformation
     - **Width**: 400
     - **Height**: 400
     - **Crop**: Fill
     - **Gravity**: Face
5. Click **Save**

#### 4. Update BarberForm Component

Update `trimminflowf/src/components/barbers/BarberForm.tsx`:

```tsx
import { CloudinaryUpload } from '@/components/ui/CloudinaryUpload';
import { useForm } from 'react-hook-form';

export function BarberForm({ onSubmit, onCancel, initialData, isLoading = false }: BarberFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateBarberFormData | UpdateBarberFormData>({
    // ... existing config
  });

  const profileImageUrl = watch('profileImageUrl');

  const handleImageUpload = (url: string) => {
    setValue('profileImageUrl', url, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* ... existing fields ... */}

      {/* Replace the manual URL input with: */}
      <CloudinaryUpload
        onUploadSuccess={handleImageUpload}
        currentImageUrl={profileImageUrl}
      />

      {/* ... rest of form ... */}
    </form>
  );
}
```

---

### Option 2: **Manual URL Input** (Current Implementation)

Users paste image URLs from any source:
- Cloudinary (upload manually to Cloudinary Dashboard)
- Imgur
- ImgBB
- Any public image URL

**Already implemented!** ✅ The form has a URL input field.

---

## 🔧 Backend Integration (Optional - For Server-Side Uploads)

If you want to handle uploads on the backend (more control), follow these steps:

### 1. Add Cloudinary SDK to Spring Boot

Add to `build.gradle`:

```gradle
dependencies {
    // Existing dependencies...
    implementation 'com.cloudinary:cloudinary-http44:1.36.0'
}
```

### 2. Add Cloudinary Config

Update `application.properties`:

```properties
# Cloudinary Configuration
cloudinary.cloud-name=YOUR_CLOUD_NAME
cloudinary.api-key=YOUR_API_KEY
cloudinary.api-secret=YOUR_API_SECRET
```

### 3. Create Cloudinary Service

Create `demo/src/main/java/com/trimminflow/demo/service/CloudinaryService.java`:

```java
package com.trimminflow.demo.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
        @Value("${cloudinary.cloud-name}") String cloudName,
        @Value("${cloudinary.api-key}") String apiKey,
        @Value("${cloudinary.api-secret}") String apiSecret
    ) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
            "cloud_name", cloudName,
            "api_key", apiKey,
            "api_secret", apiSecret,
            "secure", true
        ));
    }

    public String uploadImage(MultipartFile file, String folder) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(
            file.getBytes(),
            ObjectUtils.asMap(
                "folder", "trimminflow/" + folder,
                "transformation", new com.cloudinary.Transformation()
                    .width(400)
                    .height(400)
                    .crop("fill")
                    .gravity("face")
            )
        );

        return (String) uploadResult.get("secure_url");
    }

    public void deleteImage(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
```

### 4. Create Upload Endpoint

Create `demo/src/main/java/com/trimminflow/demo/controller/ImageUploadController.java`:

```java
package com.trimminflow.demo.controller;

import com.trimminflow.demo.service.CloudinaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/images")
public class ImageUploadController {

    private final CloudinaryService cloudinaryService;

    public ImageUploadController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping("/upload/barber")
    public ResponseEntity<Map<String, String>> uploadBarberImage(
        @RequestParam("file") MultipartFile file
    ) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "File must be an image"));
            }

            // Validate file size (5MB max)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body(Map.of("error", "File size must be less than 5MB"));
            }

            String imageUrl = cloudinaryService.uploadImage(file, "barbers");
            return ResponseEntity.ok(Map.of("url", imageUrl));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
```

---

## 🎯 Recommended Approach for Startup

**For MVP/Testing**: Use **Option 1 (Upload Widget)**
- ✅ No backend code needed
- ✅ Works immediately
- ✅ Fully featured (crop, transform, etc.)
- ✅ Free forever (25GB limit)

**For Production**: Add **Option 2 (Backend Upload)** later when you need:
- Server-side validation
- More upload control
- Image moderation
- Custom workflows

---

## 💰 Pricing (After Free Tier)

| Plan | Storage | Bandwidth | Price |
|------|---------|-----------|-------|
| **Free** | 25 GB | 25 GB/month | **$0** |
| Plus | 140 GB | 140 GB/month | $99/month |
| Advanced | 420 GB | 420 GB/month | $249/month |

For a barbershop SaaS with 100 barbershops × 5 barbers = 500 images (~2GB), you'll stay free for a **long time**!

---

## 🔒 Security Best Practices

1. **Never expose API Secret** in frontend code
2. Use **unsigned upload presets** for client-side uploads
3. Add **folder restrictions** in upload preset
4. Enable **file size limits** (5MB recommended)
5. Restrict **file types** to images only

---

## 📚 Additional Resources

- [Cloudinary Upload Widget Docs](https://cloudinary.com/documentation/upload_widget)
- [Next.js Integration Guide](https://cloudinary.com/documentation/nextjs_integration)
- [Spring Boot Integration](https://cloudinary.com/documentation/java_integration)

---

## 🐛 Troubleshooting

### "Upload widget not loading"
- Check browser console for errors
- Verify the widget script is loaded in `layout.tsx`
- Make sure `cloudName` is correct

### "Invalid upload preset"
- Verify preset name matches exactly: `barber_profiles`
- Check preset is set to **unsigned**
- Wait a few minutes after creating preset

### "Upload failed"
- Check file size (max 5MB)
- Verify file type is jpg/png/webp
- Check browser console for error details

---

## ✅ Testing Your Setup

1. Start your frontend: `npm run dev`
2. Go to Barbers management page
3. Click "Add Barber"
4. Click "Upload Image" button
5. Select an image
6. Image should upload and URL should populate automatically
7. Save the barber
8. Profile image should display in the barber card

---

**Need help?** Check Cloudinary's excellent [support docs](https://support.cloudinary.com/) or community forum!

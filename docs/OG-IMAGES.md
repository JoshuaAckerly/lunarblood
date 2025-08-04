# Open Graph Image Guidelines

## Recommended Dimensions

### Primary OG Image
- **Dimensions**: 1200 x 630 pixels
- **Aspect Ratio**: 1.91:1
- **Format**: JPG or PNG
- **Max Size**: < 8MB
- **Location**: `/public/images/og-image.jpg`

### Product Images
- **Dimensions**: 1200 x 1200 pixels (square)
- **Aspect Ratio**: 1:1
- **Format**: WebP, JPG, or PNG
- **Location**: `/public/images/products/`

### Album/Music Images
- **Dimensions**: 1200 x 1200 pixels (square)
- **Aspect Ratio**: 1:1
- **Format**: WebP, JPG, or PNG
- **Location**: `/public/images/albums/`

### Venue Images
- **Dimensions**: 1200 x 630 pixels
- **Aspect Ratio**: 1.91:1
- **Format**: WebP, JPG, or PNG
- **Location**: `/public/images/venues/`

## Design Best Practices

### Content Guidelines
1. Include band logo prominently
2. Use high contrast for text readability
3. Keep text large and legible (minimum 24px)
4. Avoid placing important content near edges (safe zone: 40px padding)
5. Use brand colors consistently

### Text Overlay
- **Maximum text**: 3-4 words or one short sentence
- **Font size**: 48-72px for headlines
- **Font**: Use brand fonts (Instrument Sans)
- **Color**: High contrast with background

### Branding
- Include "Lunar Blood" text or logo
- Use dark, moody aesthetic matching brand
- Consider gradient overlays for depth

## Image Checklist

Before uploading OG images:
- [ ] Correct dimensions (1200x630 or 1200x1200)
- [ ] File size optimized (< 500KB ideally)
- [ ] High quality, not pixelated
- [ ] Text is readable at small sizes
- [ ] Tested on Facebook Debugger
- [ ] Tested on Twitter Card Validator
- [ ] Alt text prepared for accessibility

## Platform-Specific Requirements

### Facebook/Open Graph
- Minimum: 600 x 315 pixels
- Recommended: 1200 x 630 pixels
- Displays in feeds, shares, etc.

### Twitter Cards
- Summary Card: 1:1 ratio (minimum 144x144)
- Summary Large Image: 2:1 ratio (minimum 300x157)
- Use summary_large_image for best results

### LinkedIn
- 1200 x 627 pixels
- Supports same format as Facebook

### Pinterest
- Minimum: 600 pixels wide
- Tall images (2:3 or 1:2.1) perform better
- Consider creating Pinterest-specific images

## File Naming Convention

```
og-[type]-[descriptor].jpg

Examples:
- og-home.jpg (homepage)
- og-album-shadows-echoes.jpg
- og-tour-2024.jpg
- og-product-tshirt.jpg
- og-venue-underground.jpg
```

## Dynamic OG Images (Future Enhancement)

Consider implementing:
1. **Cloudinary or imgix**: For dynamic image generation
2. **Vercel OG**: Serverless OG image generation
3. **Canvas API**: Generate images on-the-fly with PHP
4. **Automated templating**: Create OG images for new products/shows automatically

### Example Dynamic Image URL
```
https://og.lunarblood.com/generate
  ?title=Product%20Name
  &price=25.00
  &image=product.jpg
```

## Testing Tools

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Open Graph Check](https://opengraphcheck.com/)

## Image Optimization

### Tools
- **TinyPNG/TinyJPG**: Compress without quality loss
- **Squoosh**: Google's image compression tool
- **ImageOptim**: Mac desktop app
- **Photoshop**: Export for web

### Optimization Settings
```
Quality: 80-85% for JPG
Format: Progressive JPEG
Remove EXIF data
Convert to WebP when possible
```

## Current Images Needed

To complete SEO implementation, create these images:

1. ✅ Homepage OG image (general band image)
2. ⏳ Album covers for each release
3. ⏳ Product photos for merch items
4. ⏳ Venue photos for each location
5. ⏳ Tour announcement graphics
6. ⏳ Social media template for shares

---

**Note**: All images should be stored in the public directory and referenced with absolute URLs in the Seo component for reliable social media preview generation.

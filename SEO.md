# SEO Optimization Guide for Lunar Blood

## Overview
This document outlines the SEO optimizations implemented for the Lunar Blood website to improve search engine visibility, social media sharing, and overall discoverability.

## 1. Meta Tags & Open Graph

### Implemented Components
- **Seo Component** (`resources/js/components/Seo.tsx`): Reusable React component for managing all SEO meta tags
  - Primary meta tags (title, description, keywords)
  - Open Graph tags (Facebook, LinkedIn)
  - Twitter Card tags
  - Canonical URLs
  - Robots directives
  - Structured data (JSON-LD)

### Pages with SEO Meta Tags
All pages now include comprehensive meta tags:
- ✅ Home (`/`) - MusicGroup schema
- ✅ Listen (`/listen`) - MusicAlbum schema
- ✅ Tour (`/tour`) - MusicEvent schema
- ✅ Venues (`/venues`) - General
- ✅ Venue Detail (`/venues/{id}`) - MusicVenue schema
- ✅ Shop (`/shop`) - General
- ✅ Product (`/shop/{id}`) - Product schema

### Usage Example
```tsx
import Seo from "@/components/Seo";

<Seo
    title="Page Title"
    description="Page description for search engines"
    keywords="keyword1, keyword2, keyword3"
    ogType="website"
    canonical="https://lunarblood.graveyardjokes.com/page"
    structuredData={schemaObject}
/>
```

## 2. Structured Data (Schema.org)

### Implemented Schemas

#### MusicGroup (Homepage)
```json
{
  "@type": "MusicGroup",
  "name": "Lunar Blood",
  "genre": ["Heavy Metal", "Doom Metal", "Dark Rock", "Atmospheric Metal"],
  "sameAs": ["spotify", "bandcamp", "instagram"]
}
```

#### MusicAlbum (Listen Page)
```json
{
  "@type": "MusicAlbum",
  "name": "Album Name",
  "byArtist": { "@type": "MusicGroup", "name": "Lunar Blood" }
}
```

#### MusicEvent (Tour Page)
```json
{
  "@type": "MusicEvent",
  "name": "Lunar Blood Tour 2024",
  "performer": { "@type": "MusicGroup", "name": "Lunar Blood" },
  "offers": { "@type": "Offer", "availability": "InStock" }
}
```

#### Product (Shop Items)
```json
{
  "@type": "Product",
  "name": "Product Name",
  "brand": { "@type": "Brand", "name": "Lunar Blood" },
  "offers": { "@type": "Offer", "price": "25.00", "priceCurrency": "USD" }
}
```

#### MusicVenue (Venue Details)
```json
{
  "@type": "MusicVenue",
  "name": "Venue Name",
  "address": { "@type": "PostalAddress" },
  "maximumAttendeeCapacity": 500
}
```

## 3. Dynamic XML Sitemap

### Implementation
- **Controller**: `app/Http/Controllers/SitemapController.php`
- **View**: `resources/views/sitemap.blade.php`
- **Route**: `/sitemap.xml`

### Features
- Automatically generates sitemap from database
- Includes all static pages
- Includes all venues from database
- Includes all products from database
- Proper lastmod dates from database timestamps
- Priority and changefreq optimization

### Sitemap Structure
```xml
<urlset>
  <url>
    <loc>https://lunarblood.graveyardjokes.com/</loc>
    <lastmod>2024-12-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Dynamic content from database -->
</urlset>
```

## 4. Robots.txt Optimization

Enhanced `public/robots.txt`:
```
User-agent: *
Disallow: /admin
Disallow: /dashboard
Disallow: /checkout
Disallow: /order-success
Disallow: /test-*
Allow: /

User-agent: Googlebot
Crawl-delay: 0

Sitemap: https://lunarblood.graveyardjokes.com/sitemap.xml
```

## 5. Best Practices Implemented

### Title Tags
- Format: "Page Title - Lunar Blood"
- Unique for each page
- Under 60 characters for optimal display

### Meta Descriptions
- Unique and descriptive for each page
- 150-160 characters for optimal display
- Includes relevant keywords naturally

### Keywords
- Researched and relevant to music/band industry
- Include genre-specific terms
- Location-based keywords for venues

### Canonical URLs
- Prevent duplicate content issues
- Set for all pages
- Use absolute URLs

### Mobile Optimization
- Viewport meta tag configured
- Theme color for mobile browsers
- Touch icons for iOS devices

### Social Media Optimization
- Open Graph images (1200x630px recommended)
- Twitter Card support
- Music-specific Open Graph types

## 6. Performance Considerations

### Image Optimization
- Use WebP format for images
- Implement lazy loading
- Set proper alt tags for accessibility and SEO

### Page Speed
- Minimize render-blocking resources
- Use CDN for static assets (configured via VITE_ASSET_URL)
- Implement caching strategies

## 7. Ongoing Maintenance

### Regular Tasks
1. **Update Sitemap**: Automatically updates when content changes
2. **Monitor Search Console**: Check for crawl errors and indexing issues
3. **Review Keywords**: Adjust based on search performance
4. **Update Meta Descriptions**: Keep fresh and relevant
5. **Check Structured Data**: Use Google's Rich Results Test

### Tools to Use
- Google Search Console
- Google Analytics
- Schema.org Validator
- Open Graph Debugger (Facebook)
- Twitter Card Validator

## 8. Future Enhancements

### Recommended Additions
- [ ] Add breadcrumb navigation with schema markup
- [ ] Implement AMP pages for mobile
- [ ] Add hreflang tags for international targeting
- [ ] Create blog/news section for fresh content
- [ ] Implement video schema for music videos
- [ ] Add FAQ schema for common questions
- [ ] Create artist/band member pages with Person schema
- [ ] Implement local SEO for venue pages
- [ ] Add review/rating schema for products
- [ ] Create press/media kit page

### Content Strategy
- Regular blog posts about tours, music, behind-the-scenes
- Video content with proper video schema
- User-generated content (reviews, photos)
- Email newsletter integration
- Social media content calendar

## 9. Monitoring & Analytics

### Key Metrics to Track
- Organic search traffic
- Page rankings for target keywords
- Click-through rates (CTR) from search results
- Bounce rate and time on page
- Conversion rates (ticket sales, merch purchases)
- Social media engagement from shared links

### Search Console Insights
- Index coverage
- Mobile usability
- Core Web Vitals
- Rich results status
- Manual actions (if any)

## 10. Technical SEO Checklist

- ✅ XML Sitemap generated and submitted
- ✅ Robots.txt configured
- ✅ Meta tags on all pages
- ✅ Structured data implemented
- ✅ Canonical URLs set
- ✅ Mobile-friendly design
- ✅ HTTPS enabled (verify in production)
- ✅ 404 error pages customized
- ✅ URL structure optimized
- ✅ Internal linking strategy

## 11. Local SEO (for Venues)

### Venue Page Optimization
- Include full address with schema markup
- Add map integration (Google Maps embed)
- Show distance/directions
- Include phone number with click-to-call
- Add operating hours
- Link to venue's own website

## 12. Support & Resources

### Documentation Links
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards)
- [Google Search Central](https://developers.google.com/search)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

---

**Last Updated**: December 15, 2025
**Maintained By**: Development Team

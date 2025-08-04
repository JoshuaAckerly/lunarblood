# SEO Quick Reference - Lunar Blood

## ✅ Completed Optimizations

### 1. Reusable SEO Component
**File**: `resources/js/components/Seo.tsx`

Manages all SEO tags in one place:
- Meta tags (title, description, keywords)
- Open Graph (Facebook, LinkedIn)
- Twitter Cards
- Canonical URLs
- Structured Data (Schema.org)

### 2. All Pages Updated with SEO

| Page | Route | Schema Type | Status |
|------|-------|-------------|---------|
| Home | `/` | MusicGroup | ✅ |
| Listen | `/listen` | MusicAlbum | ✅ |
| Tour | `/tour` | MusicEvent | ✅ |
| Venues | `/venues` | - | ✅ |
| Venue Detail | `/venues/{id}` | MusicVenue | ✅ |
| Shop | `/shop` | - | ✅ |
| Product | `/shop/{id}` | Product | ✅ |

### 3. Dynamic XML Sitemap
**Route**: `/sitemap.xml`
**Controller**: `app/Http/Controllers/SitemapController.php`

Automatically includes:
- All static pages
- All venues from database
- All products from database
- Proper timestamps and priorities

### 4. Robots.txt Optimized
**File**: `public/robots.txt`

Features:
- Disallows admin/checkout pages
- Allows all public pages
- Includes sitemap reference
- Crawl delay settings for bots

### 5. Enhanced HTML Head
**File**: `resources/views/app.blade.php`

Added:
- Theme color meta tag
- Format detection
- Favicon variants (ICO, SVG, Apple)

## 🚀 How to Use

### Adding SEO to a New Page

```tsx
import Seo from "@/components/Seo";

function NewPage() {
    return (
        <Main>
            <Seo
                title="Page Title"
                description="Brief page description (150-160 chars)"
                keywords="keyword1, keyword2, keyword3"
                ogType="website"
                canonical="https://lunarblood.graveyardjokes.com/page"
            />
            {/* Page content */}
        </Main>
    );
}
```

### Adding Structured Data

```tsx
const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Product Name",
    "price": "25.00"
};

<Seo
    title="Product Name"
    structuredData={structuredData}
/>
```

## 📊 Testing & Validation

### Test the Sitemap
```bash
# Visit in browser
https://lunarblood.graveyardjokes.com/sitemap.xml
```

### Validate Structured Data
1. Visit [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Enter page URL
3. Check for errors

### Test Social Sharing
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: https://www.linkedin.com/post-inspector/

## 🔍 Search Console Setup

### 1. Submit Sitemap
1. Go to Google Search Console
2. Navigate to Sitemaps
3. Submit: `https://lunarblood.graveyardjokes.com/sitemap.xml`

### 2. Monitor Performance
- Check indexing status weekly
- Review search queries
- Monitor click-through rates
- Fix any crawl errors

## 📝 Content Guidelines

### Title Tags (Under 60 chars)
✅ "Dark Heavy Atmospheric Metal Band - Lunar Blood"
❌ "Welcome to Lunar Blood Official Website Home Page"

### Meta Descriptions (150-160 chars)
✅ "Experience Lunar Blood's dark, atmospheric metal. Stream our music, check tour dates, and shop official merch. Heavy riffs. Haunting melodies."
❌ "Lunar Blood website"

### Keywords (Natural & Relevant)
✅ "doom metal, atmospheric metal, dark rock, heavy metal band"
❌ "best music, good band, amazing songs"

## 🎯 Priority Keywords

### Primary
- Lunar Blood
- Dark metal band
- Atmospheric metal
- Doom metal

### Secondary
- Heavy metal music
- Dark rock band
- Metal concerts
- Band merchandise

### Location-Based
- [City] metal shows
- [Venue name] concerts
- Seattle heavy metal

## 🔄 Maintenance Tasks

### Weekly
- [ ] Check Search Console for errors
- [ ] Monitor organic traffic in Analytics
- [ ] Review new content for SEO

### Monthly
- [ ] Update meta descriptions if needed
- [ ] Check structured data validity
- [ ] Review keyword performance
- [ ] Update sitemap if major changes

### Quarterly
- [ ] Audit all page titles/descriptions
- [ ] Review and update keywords
- [ ] Analyze competitor SEO
- [ ] Update structured data schemas

## 🛠️ Troubleshooting

### Sitemap Not Updating
```bash
# Clear Laravel cache
php artisan cache:clear
php artisan config:clear
```

### Schema Errors
- Use [Schema.org Validator](https://validator.schema.org/)
- Check JSON syntax
- Verify required properties

### Meta Tags Not Showing
- Check browser cache (hard refresh: Ctrl+F5)
- Verify Seo component is imported
- Check Inertia props are passing correctly

## 📚 Documentation

- **Full SEO Guide**: `SEO.md`
- **OG Image Guidelines**: `docs/OG-IMAGES.md`
- **Schema.org Docs**: https://schema.org/

## 🎨 Assets Needed

### Images to Create
1. Homepage OG image (1200x630px)
2. Product photos (1200x1200px)
3. Venue photos (1200x630px)
4. Album covers (1200x1200px)
5. Tour graphics (1200x630px)

### Recommended Locations
```
public/
  images/
    og-image.jpg          (homepage)
    albums/               (album covers)
    products/            (merch photos)
    venues/              (venue photos)
    og/                  (page-specific OG images)
```

## 💡 Tips & Best Practices

1. **Write for Humans First**: SEO tags should sound natural
2. **Be Specific**: "Seattle Doom Metal Band" > "Metal Band"
3. **Update Regularly**: Keep content fresh
4. **Mobile-First**: Ensure mobile experience is excellent
5. **Speed Matters**: Optimize images and code
6. **Internal Linking**: Link related pages together
7. **Unique Content**: Every page needs unique title/description
8. **Track Everything**: Use Analytics to measure success

## 🆘 Need Help?

- Check `SEO.md` for detailed explanations
- Review component code in `Seo.tsx`
- Test with validation tools above
- Ask in development channel

---

**Quick Win**: The most impactful SEO change you can make is ensuring every page has a unique, descriptive title and meta description!

import React from 'react';
import { Head } from '@inertiajs/react';

interface SeoProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogType?: 'website' | 'music.song' | 'music.album' | 'music.playlist' | 'product' | 'article';
    ogImage?: string;
    ogUrl?: string;
    twitterCard?: 'summary' | 'summary_large_image' | 'player';
    canonical?: string;
    noindex?: boolean;
    structuredData?: object;
}

const Seo: React.FC<SeoProps> = ({
    title,
    description = 'Lunar Blood - Dark. Mood. Heavy. Experience haunting melodies, heavy riffs, and immersive atmospheres.',
    keywords = 'Lunar Blood, dark music, heavy metal, doom metal, atmospheric metal, dark rock, band, music',
    ogType = 'website',
    ogImage = 'https://lunarblood.graveyardjokes.com/images/og-image.jpg',
    ogUrl,
    twitterCard = 'summary_large_image',
    canonical,
    noindex = false,
    structuredData
}) => {
    const siteUrl = 'https://lunarblood.graveyardjokes.com';
    const siteName = 'Lunar Blood';
    const fullTitle = title ? `${title} - ${siteName}` : siteName;
    const currentUrl = ogUrl || (typeof window !== 'undefined' ? window.location.href : siteUrl);

    return (
        <Head>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            
            {/* Canonical URL */}
            {canonical && <link rel="canonical" href={canonical} />}
            
            {/* Robots */}
            {noindex && <meta name="robots" content="noindex, nofollow" />}
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content={siteName} />
            
            {/* Twitter */}
            <meta property="twitter:card" content={twitterCard} />
            <meta property="twitter:url" content={currentUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={ogImage} />
            
            {/* Music-specific meta tags for band/artists */}
            {ogType.startsWith('music') && (
                <>
                    <meta property="music:musician" content={siteUrl} />
                    <meta property="og:audio:type" content="audio/vnd.facebook.bridge" />
                </>
            )}
            
            {/* Structured Data */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Head>
    );
};

export default Seo;

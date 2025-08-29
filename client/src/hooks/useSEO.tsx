import { useEffect } from 'react';

interface SEOProps {
    title: string;
    description: string;
    keywords: string;
    canonical?: string;
    image?: string;
}

export const useSEO = ({ title, description, keywords, canonical, image }: SEOProps) => {
    useEffect(() => {
        // Update document title
        document.title = title;

        // Helper function to update or create meta tags
        const updateMetaTag = (name: string, content: string, property?: boolean) => {
            const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
            let element = document.querySelector(selector) as HTMLMetaElement;

            if (element) {
                element.content = content;
            } else {
                element = document.createElement('meta');
                if (property) {
                    element.setAttribute('property', name);
                } else {
                    element.setAttribute('name', name);
                }
                element.content = content;
                document.head.appendChild(element);
            }
        };

        // Update meta tags
        updateMetaTag('description', description);
        updateMetaTag('keywords', keywords);

        // Open Graph tags
        updateMetaTag('og:title', title, true);
        updateMetaTag('og:description', description, true);
        updateMetaTag('og:type', 'website', true);

        // Twitter Card tags
        updateMetaTag('twitter:card', 'summary_large_image');
        updateMetaTag('twitter:title', title);
        updateMetaTag('twitter:description', description);

        // Update canonical link
        if (canonical) {
            let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
            if (canonicalLink) {
                canonicalLink.href = `https://wealthnomic.com${canonical}`;
            } else {
                canonicalLink = document.createElement('link');
                canonicalLink.rel = 'canonical';
                canonicalLink.href = `https://wealthnomic.com${canonical}`;
                document.head.appendChild(canonicalLink);
            }
        }

        // Update image meta tags
        if (image) {
            updateMetaTag('og:image', `https://wealthnomic.com${image}`, true);
            updateMetaTag('twitter:image', `https://wealthnomic.com${image}`);
        }

        // Add structured data
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": title,
            "description": description,
            "url": canonical ? `https://wealthnomic.com${canonical}` : 'https://wealthnomic.com',
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
            },
            "provider": {
                "@type": "Organization",
                "name": "Wealthnomic"
            }
        };

        let structuredDataScript = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement | null;
        if (structuredDataScript) {
            structuredDataScript.textContent = JSON.stringify(structuredData);
        } else {
            structuredDataScript = document.createElement('script') as HTMLScriptElement;
            structuredDataScript.type = 'application/ld+json';
            structuredDataScript.textContent = JSON.stringify(structuredData);
            document.head.appendChild(structuredDataScript);
        }

    }, [title, description, keywords, canonical, image]);
};
import React from "react";

const SITE_URL = "https://tranhuyland.vn";
const SITE_NAME = "Trần Huy Land";
const LOGO_URL = `${SITE_URL}/icon.png`;
const PHONE = "0905778852";

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL,
        width: 512,
        height: 512,
      },
      image: LOGO_URL,
      telephone: PHONE,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Hải Châu",
        addressLocality: "Đà Nẵng",
        addressRegion: "Đà Nẵng",
        postalCode: "550000",
        addressCountry: "VN",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "vi-VN",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      /* SearchAction uses client-side filtering; URL-based search is not available */
    },
    {
      "@type": "RealEstateAgent",
      "@id": `${SITE_URL}/#realestateagent`,
      name: SITE_NAME,
      image: LOGO_URL,
      url: SITE_URL,
      telephone: PHONE,
      priceRange: "$$",
      parentOrganization: { "@id": `${SITE_URL}/#organization` },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Hải Châu",
        addressLocality: "Đà Nẵng",
        addressRegion: "Đà Nẵng",
        postalCode: "550000",
        addressCountry: "VN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 16.0544,
        longitude: 108.2022,
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "07:30",
        closes: "21:30",
      },
    },
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

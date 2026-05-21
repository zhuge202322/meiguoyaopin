"use client";

import { useEffect } from "react";
import Script from "next/script";
import { weightLossHtml } from "./content";

export default function WeightLossClient() {
  useEffect(() => {
    // Bricks scripts rely on DOMContentLoaded. In Next.js, this event has already fired.
    // We dispatch it manually to trigger Bricks initialization for things like Accordions.
    const timer = setTimeout(() => {
      window.document.dispatchEvent(new Event("DOMContentLoaded", {
        bubbles: true,
        cancelable: true
      }));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <link rel="stylesheet" href="/css/frontend-layer.min.css" />
      <link rel="stylesheet" href="/css/weight-loss-fonts.css" />
      <link rel="stylesheet" href="/css/font-awesome-6-layer.min.css" />
      <link rel="stylesheet" href="/css/ionicons-layer.min.css" />
      <link rel="stylesheet" href="/css/style-manager.min.css" />
      <link rel="stylesheet" href="/css/animate-layer.min.css" />
      <link rel="stylesheet" href="/css/weight-loss-inline.css" />
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 767px) {
          img[src*="d9a2270a"] {
            display: none !important;
          }
          img[src*="optimized-myfastrx"], img[src*="hipaa"] {
            object-fit: contain !important;
            height: auto !important;
            width: 100px !important;
          }
          .v67h63an {
            display: inline-block !important;
            width: auto !important;
            margin: 0 10px !important;
          }
          #brxe-tqdhzj {
            text-align: center;
          }
        }
      `}} />

      <div 
        dangerouslySetInnerHTML={{ __html: weightLossHtml }} 
        className="bricks-is-frontend wp-embed-responsive"
      />
      
      {/* Bricks Configuration */}
      <Script id="bricks-data" strategy="beforeInteractive">
        {`var bricksData = {"debug":"","locale":"en_US","ajaxUrl":"/wp-admin/admin-ajax.php","restApiUrl":"/wp-json/bricks/v1/","nonce":"b41f938881","formNonce":"e36a69fe93","wpRestNonce":"79d5451f64","postId":"1856","recaptchaIds":[],"animatedTypingInstances":[],"videoInstances":[],"splideInstances":[],"tocbotInstances":[],"swiperInstances":[],"queryLoopInstances":[],"interactions":[],"filterInstances":[],"isotopeInstances":[],"activeFiltersCountInstances":[],"googleMapInstances":[],"leafletMapInstances":[],"choicesInstances":[],"facebookAppId":"","headerPosition":"top","offsetLazyLoad":"300","baseUrl":"/weight-loss/","useQueryFilter":"","pageFilters":[],"language":"","wpmlUrlFormat":"","multilangPlugin":"","i18n":{"closeMobileMenu":"Close mobile menu","firstSlide":"Go to first slide","hidePassword":"Hide password","lastSlide":"Go to last slide","locationContent":"Location content","locationSubtitle":"Location subtitle","locationTitle":"Location title","nextSlide":"Next slide","noLocationsFound":"No locations found","openAccordion":"Open accordion","openMobileMenu":"Open mobile menu","pause":"Pause autoplay","play":"Start autoplay","prevSlide":"Previous slide","remove":"Remove","showPassword":"Show password","slideX":"Go to slide %s","splide":{"carousel":"carousel","select":"Select a slide to show","slide":"slide","slideLabel":"%1$s of %2$s"},"swiper":{"paginationBulletMessage":"Go to slide {{index}}","slideLabelMessage":"{{index}} / {{slidesLength}}"}},"selectedFilters":[],"filterNiceNames":[],"bricksGoogleMarkerScript":"https://www.myfastrx.com/wp-content/themes/bricks/assets/js/libs/bricks-google-marker.min.js?v=2.3.4","infoboxScript":"https://www.myfastrx.com/wp-content/themes/bricks/assets/js/libs/infobox.min.js?v=2.3.4","markerClustererScript":"https://www.myfastrx.com/wp-content/themes/bricks/assets/js/libs/markerclusterer.min.js?v=2.3.4","mainQueryId":"","activeSearchTemplate":"0","defaultMode":"light"};`}
      </Script>
      <Script src="/js/bricks.min.js" strategy="afterInteractive" />
      <Script src="/js/frontend.min.js" strategy="afterInteractive" />
    </>
  );
}
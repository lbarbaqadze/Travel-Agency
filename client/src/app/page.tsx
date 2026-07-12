import Navbar from "@/components/layout/Navbar";
import { Hero, FlightSearchPanel, PopularDestinations, UniversalHero,
  ProductShowcaseSection
 } from "@/components/home";
import Footer from "@/components/layout/Footer";
import OrganizationJsonLd from "@/components/seo/TourJsonLd";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: 'Home',
  path: '/',
});

export default function Home() {
  return (
    <>
      <OrganizationJsonLd />
      <Navbar />
      <main>
        <Hero />
        <FlightSearchPanel />
        <PopularDestinations />
        <UniversalHero />
        <ProductShowcaseSection />
      </main>
      <Footer />
    </>
  );
}

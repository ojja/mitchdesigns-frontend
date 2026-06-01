import type { Metadata } from "next";
import { Hero } from "./_components/Hero";
import { TrustedBrands } from "./_components/TrustedBrands";
import { MeetSection, type MeetFeature } from "./_components/MeetSection";
import { UserIcon } from "@/components/icons/UserIcon";
import { ShoppingBagIcon } from "@/components/icons/ShoppingBagIcon";
import { BarChartIcon } from "@/components/icons/BarChartIcon";
import { BuildingIcon } from "@/components/icons/BuildingIcon";
import { MapPinIcon } from "@/components/icons/MapPinIcon";
import { ScooterIcon } from "@/components/icons/ScooterIcon";
import { MoreAbout, type MoreAboutFeature } from "./_components/MoreAbout";
import { DatabaseIcon } from "@/components/icons/DatabaseIcon";
import { TrendingUpIcon } from "@/components/icons/TrendingUpIcon";
import { ChallengeSection } from "./_components/ChallengeSection";
import { Journey } from "./_components/Journey";
import { DeliveryOperations } from "./_components/DeliveryOperations";
import { Pricing } from "./_components/Pricing";
import { SinceFrom } from "./_components/SinceFrom";
import { ReadyToOwn } from "./_components/ReadyToOwn";

export const metadata: Metadata = {
  title: "Orderbase — Case Study",
  description: "How we built and launched Orderbase.",
};

const moreAboutFeatures: MoreAboutFeature[] = [
  { icon: <ShoppingBagIcon size={24} />, description: "Deliver a custom-branded journey that retains customers." },
  { icon: <DatabaseIcon size={24} />, description: "Capture insights and contact info to drive marketing campaigns." },
  { icon: <MapPinIcon size={24} />, description: "Manage inventory and fulfillment across your physical footprint." },
  { icon: <TrendingUpIcon size={24} />, description: "Build a resilient digital infrastructure that grows with you." },
];

const meetFeatures: MeetFeature[] = [
  {
    icon: <UserIcon size={20} />,
    title: "Customer Data",
    description: "Keep your guest data. Build loyalty profiles, track behavior, and trigger targeted promotions.",
  },
  {
    icon: <ShoppingBagIcon size={20} />,
    title: "Online Storefront",
    description: "Launch a branded ordering experience. No marketplace fees, no middlemen — your store, your rules.",
  },
  {
    icon: <ScooterIcon size={20} />,
    title: "Delivery Management",
    description: "Manage in-house or third-party drivers from one screen. Real-time tracking included.",
  },
  {
    icon: <BuildingIcon size={20} />,
    title: "Multi-branch Support",
    description: "Run every branch from a single dashboard. Menus, orders, and staff all in one place.",
  },
  {
    icon: <BarChartIcon size={20} />,
    title: "Sales Analytics",
    description: "Know what's selling, when, and to whom. Make decisions backed by real order data.",
  },
  {
    icon: <MapPinIcon size={20} />,
    title: "Zone-based Pricing",
    description: "Set delivery fees and availability by delivery zone. Serve more areas without losing margin.",
  },
];

export default function OrderbasePage() {
  return (
    <main className="min-h-dvh">
      <Hero
        title="The Operating System for"
        titleHighlight="Food e-Commerce"
        description="Built for restaurants, bakeries & multi-branch F&B brands in Egypt. Sell direct, fulfill smarter, own your customers."
        primaryCtaLabel="Contact Sales"
        primaryCtaHref="#"
        secondaryCtaLabel="See How It Works"
        secondaryCtaHref="#"
      />
      {/* eslint-disable @next/next/no-img-element */}
      <TrustedBrands
        brands={[
          { name: "Almaza", logo: <img src="/images/client-logos/Almaza.png" alt="Almaza" className="max-h-12 w-auto object-contain mix-blend-exclusion" /> },
          { name: "Joula", logo: <img src="/images/client-logos/Joula.png" alt="Joula" className="max-h-12 w-auto object-contain mix-blend-exclusion" /> },
          { name: "Abu Auf", logo: <img src="/images/client-logos/abu-auf.png" alt="Abu Auf" className="max-h-12 w-auto object-contain mix-blend-exclusion" /> },
          { name: "Lychee", logo: <img src="/images/client-logos/lychee.png" alt="Lychee" className="max-h-12 w-auto object-contain mix-blend-exclusion" /> },
          { name: "Gobill", logo: <img src="/images/client-logos/gobill.png" alt="Gobill" className="max-h-12 w-auto object-contain mix-blend-exclusion" /> },
        ]}
      />
      <MeetSection features={meetFeatures} />
      <ChallengeSection
        features={[
          { title: "Scattered Operations", description: "Order management is fragmented across different sales channels." },
          { title: "Inventory Sync Issues", description: "Inventory items are hard to manage due to variations from one branch to another." },
          { title: "High Expectations", description: "Customers anticipate quick checkout processes and efficient order tracking." },
          { title: "Not Built for F&B", description: "Basic eCommerce solutions do not solve the unique needs of food operations." },
        ]}
      />
      <MoreAbout
        features={moreAboutFeatures}
      />
      <Journey />
      <DeliveryOperations />
      <Pricing />
      <SinceFrom />
      <ReadyToOwn />
    </main>
  );
}

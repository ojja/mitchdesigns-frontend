import { ScooterIcon } from "@/components/icons/ScooterIcon";
import { RouteIcon } from "@/components/icons/RouteIcon";
import { AppWindowIcon } from "@/components/icons/AppWindowIcon";
import { MapPinIcon } from "@/components/icons/MapPinIcon";

interface DeliveryCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const leftCards: DeliveryCard[] = [
  {
    icon: <ScooterIcon size={24} />,
    title: "Friendly to couriers",
    description: "A simple, straightforward interface that any courier can pick up and use instantly.",
  },
  {
    icon: <RouteIcon size={24} />,
    title: "Full control on couriers",
    description: "Manage dispatching, routing, and fleet performance centrally and efficiently.",
  },
];

const rightCards: DeliveryCard[] = [
  {
    icon: <AppWindowIcon size={24} />,
    title: "One integrated platform",
    description: "Sync orders from kitchen to customer without using any other third-party apps.",
  },
  {
    icon: <MapPinIcon size={24} />,
    title: "Full monitoring on delivery process",
    description: "Track live locations, status updates, and delivery times so much easier with our system.",
  },
];

export function DeliveryOperations() {
  return (
    <section className="bg-black py-20">
      <div className="mx-auto max-w-[var(--container-max)] px-[3.75rem] flex flex-col items-center gap-10">

        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-hero-3 font-bold text-white text-balance leading-[1.1]">
            Delivery Operations, Fully Connected
          </h2>
          <p className="text-xl text-white text-balance">
            Give your couriers the tools to deliver faster, smarter, and with full operational control.
          </p>
        </div>

        {/* 3-col layout */}
        <div className="flex items-center gap-10 w-full">

          {/* Left cards */}
          <div className="flex flex-col gap-5 w-[437px] shrink-0">
            {leftCards.map((card, i) => (
              <DeliveryCard key={i} {...card} />
            ))}
          </div>

          {/* Center illustration */}
          <div className="flex-1 self-stretch min-h-[480px] rounded-card bg-space-grey flex items-center justify-center">
            <span className="text-sm text-white/20">Illustration</span>
          </div>

          {/* Right cards */}
          <div className="flex flex-col gap-5 w-[437px] shrink-0">
            {rightCards.map((card, i) => (
              <DeliveryCard key={i} {...card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DeliveryCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col gap-10 rounded-[16px] bg-space-grey px-4 py-6 min-h-[210px]">
      <div className="w-12 h-12 rounded-[8px] bg-orderbase-red flex items-center justify-center text-white">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-xl font-medium text-white">{title}</p>
        <p className="text-base text-grey-200 text-balance">{description}</p>
      </div>
    </div>
  );
}

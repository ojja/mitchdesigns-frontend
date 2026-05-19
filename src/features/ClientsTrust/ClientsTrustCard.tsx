import Image from "next/image";

type ClientsTrustCardProps = {
  image?: string | null;
  title: string;
  body: string;
};

export function ClientsTrustCard({ image, title, body }: ClientsTrustCardProps) {
  return (
    <article className="flex w-[330px] shrink-0 flex-col gap-6 rounded-card-md bg-card p-4">
      <div className="relative aspect-[298/200] overflow-hidden rounded-card-md bg-space-grey">
        {image && <Image src={image} alt={title} fill className="object-cover" />}
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-hero-5 font-bold text-fg leading-[110%]">{title}</h3>
        <p className="text-base text-fg-muted leading-[125%] text-balance">{body}</p>
      </div>
    </article>
  );
}

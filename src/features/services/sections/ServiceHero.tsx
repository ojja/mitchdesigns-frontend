"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { fadeUp, stagger } from "@/lib/motion";
import type { ServiceHeroProps } from "@/lib/cms/types";
import { RichText } from "@/components/ui/RichText";

export function ServiceHero({
  title,
  subTitle,
  description,
  image,
  imageAlt,
  cta,
  reverseLayout = false,
}: ServiceHeroProps) {
  return (
    <Section className="pt-32 pb-16 md:pb-24">
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        animate="visible"
        className={`flex flex-col gap-12 md:flex-row md:items-center ${reverseLayout ? "md:flex-row-reverse" : ""}`}
      >
        <div className="flex-1 space-y-6">
          {subTitle && (
            <motion.p
              variants={fadeUp}
              className="text-sm font-medium uppercase tracking-[0.18em] text-fg-muted"
            >
              {subTitle}
            </motion.p>
          )}
          <motion.h1
            variants={fadeUp}
            className="text-hero-3 font-bold md:text-hero-2"
          >
            {title}
          </motion.h1>
          <motion.div variants={fadeUp}>
            <RichText content={description} className="max-w-xl text-lg text-fg-muted" />
          </motion.div>
          {cta && (
            <motion.div variants={fadeUp}>
              <Button asChild size="lg">
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            </motion.div>
          )}
        </div>
        <motion.div
          variants={fadeUp}
          className="relative min-h-72 flex-1 overflow-hidden rounded-card md:min-h-112"
        >
          {image && (
            <Image
              src={image}
              alt={imageAlt ?? ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          )}
        </motion.div>
      </motion.div>
    </Section>
  );
}

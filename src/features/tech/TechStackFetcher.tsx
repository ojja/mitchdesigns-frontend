import { getTechStack } from "@/lib/cms";
import { fixtureTechStack } from "@/lib/cms/fixtures";
import { TechStack } from "./TechStack";

type Props = {
  title: React.ReactNode;
  description?: string;
};

export async function TechStackFetcher({ title, description }: Props) {
  let items;
  try {
    const data = await getTechStack();
    items = data && data.length ? data : fixtureTechStack;
  } catch {
    items = fixtureTechStack;
  }

  if (!items.length) return null;

  return <TechStack items={items} title={title} description={description} />;
}

import CareerLandscape from "./pages/CareerLandscape";
import DeepDive from "./pages/DeepDive";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;

  if (view === "deep-dive") {
    return <DeepDive />;
  }

  return <CareerLandscape />;
}



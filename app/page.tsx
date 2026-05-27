import CareerLandscape from "./pages/CareerLandscape";
import DeepDive from "./pages/DeepDive";
import Onboarding from "./pages/Onboarding";
import UserProfile from "./pages/UserProfile";
import LivingPortfolio from "./pages/LivingPortfolio";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;

  if (view === "deep-dive") return <DeepDive />;
  if (view === "career-landscape") return <CareerLandscape />;
  if (view === "profile") return <UserProfile />;
  if (view === "living-portfolio") return <LivingPortfolio />;

  return <Onboarding />;
}
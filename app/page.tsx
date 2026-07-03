import LandingPage from "./pages/LandingPage";
import CareerLandscape from "./pages/CareerLandscape";
import DeepDive from "./pages/DeepDive";
import CareerPathSimulator from "@/features/career-path-simulator/CareerPathSimulator";
import Onboarding from "./pages/Onboarding";
import UserProfile from "./pages/UserProfile";
import LivingPortfolio from "./pages/LivingPortfolio";
import LifeChapterDesigner from "./pages/LifeChapterDesigner";
import AICareerCoach from "./pages/AICareerCoach";
import JobApplicationPage from "./pages/jobapplication";
import ApplicationSubmitted from "./pages/ApplicationSubmitted";
import MyApplications from "./pages/MyApplications";
import TrackApplication from "./pages/TrackApplication";
import SignInPage from "./pages/SignInPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import EmployerOnboarding from "./pages/EmployerOnboarding";
import CompanyProfile from "./pages/CompanyProfile";
import BrowseDirectory from "./pages/BrowseDirectory";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;

  if (view === "onboarding") return <Onboarding />;
  if (view === "employer-onboarding") return <EmployerOnboarding />;
  if (view === "deep-dive") return <DeepDive />;
  if (view === "career-path-simulator") return <CareerPathSimulator />;
  if (view === "career-landscape") return <CareerLandscape />;
  if (view === "profile") return <UserProfile />;
  if (view === "living-portfolio") return <LivingPortfolio />;
  if (view === "life-chapter-designer") return <LifeChapterDesigner />;
  if (view === "ai-career-coach") return <AICareerCoach />;
  if (view === "jobapplication") return <JobApplicationPage />;
  if (view === "application-submitted") return <ApplicationSubmitted />;
  if (view === "my-applications") return <MyApplications />;
  if (view === "track-application") return <TrackApplication />;
  if (view === "company-profile") return <CompanyProfile />;
  if (view === "browse-university") return <BrowseDirectory kind="university" />;
  if (view === "browse-employer") return <BrowseDirectory kind="employer" />;
  if (view === "login") return <SignInPage />;
  if (view === "forgot-password") return <ForgotPasswordPage />;

  return <LandingPage />;
}

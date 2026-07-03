import TalentReadiness from "../TalentReadiness";

export default async function UniversityTalentPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;

  return <TalentReadiness view={view} />;
}

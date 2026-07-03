export const projects = [
  {
    slug: "microsoft",
    company: "Microsoft",
    title: "AI Dashboard Challenge",
    description: "Build an interactive dashboard using real business data to uncover insights and support decision-making.",
    longDescription:
      "Students will work with Microsoft's product team to design and build an interactive analytics dashboard on real, anonymized business data. The team will define key metrics, build visualizations, and present a working prototype plus a short business case for how the dashboard supports faster decision-making. Mentors from Microsoft will run two check-in sessions during the project.",
    duration: "12 weeks",
    slots: 24,
    support: "RM 5,000",
    status: "Open",
    days: "15 days left",
    postedOn: "18 June 2026",
    deadline: "17 July 2026",
    requirementsDoc: "/documents/ai-dashboard-challenge-requirements.pdf",
    tags: ["AI / Data Analytics", "Dashboard"],
    logo: "microsoft",
  },
  {
    slug: "shopee",
    company: "Shopee",
    title: "E-commerce Analytics Project",
    description: "Analyze customer behavior and sales data to propose strategies for improving conversion and retention.",
    longDescription:
      "This project asks students to analyze anonymized customer behaviour and sales data from Shopee to identify drop-off points in the purchase funnel. The team will propose data-backed strategies to improve conversion and retention, and present findings to Shopee's regional analytics team at the end of the engagement.",
    duration: "10 weeks",
    slots: 30,
    support: "RM 4,000",
    status: "Open",
    days: "7 days left",
    postedOn: "20 June 2026",
    deadline: "9 July 2026",
    tags: ["Data Analytics", "Business Intelligence"],
    logo: "shopee",
  },
  {
    slug: "maybank",
    company: "Maybank",
    title: "Customer Insights Dashboard",
    description: "Develop a customer segmentation dashboard to support personalized marketing campaigns.",
    longDescription:
      "Students will build a customer segmentation dashboard using anonymized transaction data, grouping customers by behaviour and value to support Maybank's personalized marketing campaigns. Deliverables include the dashboard, a segmentation methodology writeup, and campaign recommendations for two priority segments.",
    duration: "8 weeks",
    slots: 18,
    support: "RM 3,000",
    status: "Open",
    days: "9 days left",
    postedOn: "15 June 2026",
    deadline: "11 July 2026",
    tags: ["Data Visualization", "Customer Analytics"],
    logo: "maybank",
  },
  {
    slug: "petronas",
    company: "Petronas",
    title: "Sustainability Data Analysis",
    description: "Explore and visualize sustainability data to identify trends and recommend improvements.",
    longDescription:
      "The assigned team is exploring Petronas' sustainability and emissions datasets to identify trends across facilities and recommend concrete improvements. Midway check-ins with the sustainability office keep the analysis aligned with real reporting needs, with a final findings deck due at project close.",
    duration: "12 weeks",
    slots: 20,
    support: "RM 4,500",
    status: "In Progress",
    days: "Ongoing",
    postedOn: "1 May 2026",
    deadline: null,
    tags: ["ESG", "Data Analysis"],
    logo: "petronas",
  },
  {
    slug: "grab",
    company: "Grab",
    title: "Mobility Trends Forecasting",
    description: "Build a predictive model to forecast ride demand and optimize driver allocation.",
    longDescription:
      "The team is building a predictive model that forecasts ride demand across zones and time windows, then translating that into driver allocation recommendations. Grab's ops analytics team supplies anonymized historical demand data and reviews the model's outputs at each milestone.",
    duration: "10 weeks",
    slots: 16,
    support: "RM 4,000",
    status: "In Progress",
    days: "Ongoing",
    postedOn: "10 May 2026",
    deadline: null,
    tags: ["Machine Learning", "Predictive Analytics"],
    logo: "grab",
  },
  {
    slug: "airasia",
    company: "AirAsia",
    title: "Flight Data Optimization",
    description: "Analyzed flight delay and route data to recommend scheduling improvements that reduced average delays.",
    longDescription:
      "The team analyzed two years of flight delay and route data to identify the biggest drivers of scheduling inefficiency. Their final recommendations, focused on turnaround buffers on high-traffic routes, were adopted into AirAsia's scheduling review process.",
    duration: "10 weeks",
    slots: 14,
    support: "RM 3,500",
    status: "Completed",
    days: "Completed Mar 2025",
    postedOn: "1 Jan 2026",
    deadline: null,
    tags: ["Data Analytics", "Operations"],
    logo: "airasia",
  },
  {
    slug: "sunway",
    company: "Sunway",
    title: "Retail Footfall Analysis",
    description: "Studied mall footfall patterns to recommend tenant mix and promotion timing improvements.",
    longDescription:
      "This project aimed to study mall footfall patterns to recommend tenant mix and promotion timing improvements. Applications closed without a student team being matched before the intake deadline passed.",
    duration: "8 weeks",
    slots: 12,
    support: "RM 2,800",
    status: "Closed",
    days: "Applications closed",
    postedOn: "1 Feb 2026",
    deadline: null,
    tags: ["Retail Analytics", "Consumer Behaviour"],
    logo: "sunway",
  },
];

export const statusTone: Record<string, string> = {
  Open: "bg-[#e1f7eb] text-[#16a34a]",
  "In Progress": "bg-[#e8f2ff] text-[#2563eb]",
  Completed: "bg-[#f3efff] text-[#6733f4]",
  Closed: "bg-[#f4f4f8] text-[#65718d]",
};

export function ProjectLogo({ type }: { type: string }) {
  if (type === "microsoft") {
    return (
      <div className="grid h-9 w-9 shrink-0 grid-cols-2 gap-0.5">
        <span className="bg-[#f25022]" />
        <span className="bg-[#7fba00]" />
        <span className="bg-[#00a4ef]" />
        <span className="bg-[#ffb900]" />
      </div>
    );
  }
  if (type === "shopee") return <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff4d16] text-xl font-black text-white">S</div>;
  if (type === "maybank") return <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-black bg-[#ffd400] text-[10px] font-black">MAY</div>;
  if (type === "petronas") return <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#00a99d] text-sm font-black text-[#00a99d]">P</div>;
  if (type === "grab") return <div className="flex h-10 w-10 shrink-0 items-center justify-center text-lg font-black text-[#16a34a]">Grab</div>;
  if (type === "airasia") return <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff0000] text-[10px] font-black text-white">AA</div>;
  return <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#f7941d] text-[10px] font-black text-[#f7941d]">SUN</div>;
}

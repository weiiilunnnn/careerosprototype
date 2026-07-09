export const courseLevels = ["Level 1", "Level 2", "Level 3"] as const;
export type CourseLevel = (typeof courseLevels)[number];

export type Course = {
  slug: string;
  name: string;
  levels: Record<CourseLevel, string[]>;
};

export type Faculty = {
  slug: string;
  name: string;
  students: string;
  lecturers: string;
  readiness: string;
  courses: Course[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function makeCourse(name: string, levels?: Partial<Record<CourseLevel, string[]>>): Course {
  return {
    slug: slugify(name),
    name,
    levels: {
      "Level 1": levels?.["Level 1"] ?? [],
      "Level 2": levels?.["Level 2"] ?? [],
      "Level 3": levels?.["Level 3"] ?? [],
    },
  };
}

export const initialFaculties: Faculty[] = [
  {
    slug: "school-of-computing",
    name: "School of Computing",
    students: "4,230 students",
    lecturers: "32 lecturers",
    readiness: "91%",
    courses: [
      makeCourse("Data Analytics", {
        "Level 1": ["Intro to Programming", "Statistics Foundations", "Database Systems"],
        "Level 2": ["Data Visualization", "SQL for Analytics", "Applied Statistics"],
        "Level 3": ["Machine Learning", "Business Intelligence Capstone", "Big Data Systems"],
      }),
      makeCourse("Software Engineering", {
        "Level 1": ["Intro to Programming", "Discrete Mathematics", "Object-Oriented Design"],
        "Level 2": ["Software Architecture", "Web Development", "Databases"],
        "Level 3": ["Cloud Computing", "DevOps Practices", "Capstone Project"],
      }),
      makeCourse("Cybersecurity", {
        "Level 1": ["Networking Fundamentals", "Intro to Programming", "Operating Systems"],
        "Level 2": ["Network Security", "Cryptography", "Systems Administration"],
        "Level 3": ["Penetration Testing", "Incident Response", "Security Capstone"],
      }),
    ],
  },
  {
    slug: "business-school",
    name: "Business School",
    students: "5,840 students",
    lecturers: "54 lecturers",
    readiness: "88%",
    courses: [
      makeCourse("Business Analytics", {
        "Level 1": ["Principles of Management", "Business Statistics", "Microeconomics"],
        "Level 2": ["Data-Driven Decision Making", "Power BI for Business", "Operations Management"],
        "Level 3": ["Predictive Analytics", "Strategic Analytics Capstone", "Business Intelligence"],
      }),
      makeCourse("Marketing", {
        "Level 1": ["Principles of Marketing", "Consumer Behaviour", "Business Communication"],
        "Level 2": ["Digital Marketing", "Brand Management", "Market Research"],
        "Level 3": ["Marketing Analytics", "Campaign Strategy Capstone", "Growth Marketing"],
      }),
    ],
  },
  {
    slug: "engineering",
    name: "Engineering",
    students: "3,120 students",
    lecturers: "41 lecturers",
    readiness: "86%",
    courses: [
      makeCourse("Mechanical Engineering", {
        "Level 1": ["Engineering Mathematics", "Statics", "Materials Science"],
        "Level 2": ["Thermodynamics", "Fluid Mechanics", "Machine Design"],
        "Level 3": ["Robotics", "Manufacturing Systems", "Design Capstone"],
      }),
      makeCourse("Electrical Engineering", {
        "Level 1": ["Circuit Analysis", "Engineering Mathematics", "Digital Logic"],
        "Level 2": ["Signals and Systems", "Power Systems", "Embedded Systems"],
        "Level 3": ["Control Systems", "IoT Systems", "Design Capstone"],
      }),
    ],
  },
  {
    slug: "medicine",
    name: "Medicine",
    students: "2,740 students",
    lecturers: "48 lecturers",
    readiness: "79%",
    courses: [
      makeCourse("Biomedical Science", {
        "Level 1": ["Human Anatomy", "Biochemistry", "Physiology"],
        "Level 2": ["Pathology", "Pharmacology", "Immunology"],
        "Level 3": ["Clinical Diagnostics", "Research Methods", "Capstone Project"],
      }),
    ],
  },
];

// ---------------------------------------------------------------------------
// All portfolio content lives in this one file.
// The 3D gallery and the plain view are both generated from it, so editing
// text here updates the whole site. Anything marked TODO is waiting on
// details from the resume.
// ---------------------------------------------------------------------------

export const content = {
  name: "Aidan Campbell",
  title: "Historian · Digital Humanities · Research & Data",
  tagline:
    "An interdisciplinary UC Berkeley History graduate bringing source-verification rigor to collections, data, and AI evaluation work.",
  location: "Sacramento, CA",

  // Path to a resume PDF in /assets. Leave empty to hide the resume button.
  resumeUrl: "",

  contact: {
    email: "aidanpcamp0113@berkeley.edu",
    linkedin: "https://www.linkedin.com/in/aidanpcampbell01/",
    github: "",
  },

  // Each section becomes a room in the gallery and a section in the plain view.
  // Each item becomes a framed exhibit. Optional `image` (path in /assets)
  // replaces the generated artwork inside the frame.
  sections: [
    {
      id: "about",
      label: "About",
      accent: "#b85c38",
      items: [
        {
          title: "Every research trail starts with a source",
          subtitle: "Interdisciplinary scholar · Sacramento, CA",
          summary:
            "I'm a historian and digital humanist from UC Berkeley. My work has taken me from cataloging specimens at the Museum of Vertebrate Zoology to evaluating AI model outputs, always with the same care for verified sources, accurate records, and clear communication.",
          details: [
            "B.A. in History with a minor in Digital Humanities from UC Berkeley",
            "Interested in collections management, museum administration, data and records work, and AI evaluation",
            "Volunteer with Blue Line Arts in Roseville, CA",
          ],
          tags: ["Research", "Collections", "Data", "AI evaluation"],
        },
        {
          title: "Primary strengths",
          subtitle: "What I bring to a team",
          summary:
            "Independent research, data visualization across many platforms, archival and cataloging rigor, and collaboration within and across teams.",
          details: [
            "Cross-referencing authorities and separating documented fact from inference",
            "Translating technical or research findings into clear recommendations for varied audiences",
            "Archival and cataloging rigor",
            "Project management and inter- and intra-team collaboration",
          ],
          tags: ["Source verification", "Data viz", "Cataloging", "Communication"],
        },
      ],
    },
    {
      id: "experience",
      label: "Experience",
      accent: "#2f6f73",
      items: [
        {
          title: "Project Lighthouse",
          subtitle: "Fellow · 2026 – Present",
          summary:
            "Design prompts and evaluation rubrics that test how AI models handle tasks requiring the accurate use of personal financial information.",
          details: [
            "Designed realistic professional prompts and evaluation rubrics assessing how AI models handle tasks that require the accurate use of personal financial information.",
            "Evaluated AI-generated outputs against those rubrics, applying rigorous verification standards to judge accuracy and appropriate handling of sensitive personal data.",
            "Contributed to a research initiative on AI model performance in personal-finance contexts, an area closely tied to consumer data-privacy considerations.",
          ],
          tags: ["AI evaluation", "Rubric design", "Data privacy"],
        },
        {
          title: "Project Ohm",
          subtitle: "AI Annotator · March 2026 – July 2026",
          summary:
            "Reviewed AI model outputs for accuracy and relevance, catching errors before they reached training data.",
          details: [
            "Reviewed AI model outputs for accuracy and relevance, applying a verification-first standard to distinguish correct results from errors before they reached training data.",
            "Categorized and organized image and text data in support of consistent data-quality and governance standards.",
            "Communicated structured feedback on annotation techniques, translating technical findings into actionable process improvements for the broader team.",
          ],
          tags: ["Annotation", "Data quality", "Data governance"],
        },
        {
          title: "Museum of Vertebrate Zoology",
          subtitle: "Research Apprentice · Berkeley, CA · Aug 2024 – May 2025",
          summary:
            "Cataloged specimens and metadata, verifying and cross-referencing records for research and educational use.",
          details: [
            "Cataloged specimens and metadata, verifying and cross-referencing records to maintain data accuracy and integrity for research and educational use.",
            "Developed educational materials that translated research findings for public and academic audiences.",
            "Coordinated inventory of supplies and resources for streamlined exhibit preparation.",
            "Helped create and publish a commemoration of the ascension of director O.P. Pearson.",
          ],
          tags: ["Cataloging", "Metadata", "Collections", "Exhibits"],
        },
        {
          title: "Hobby Lobby",
          subtitle: "Lead Stockman / Assistant Lead of Crafts · Roseville, CA · Mar 2020 – Jun 2023",
          summary:
            "Hands-on experience with large-retailer operations, inventory management, shipment logistics, and merchandising.",
          details: [
            "Gained firsthand experience with large-retailer operations, including inventory management, shipment logistics, and merchandising, in a high-volume retail environment.",
            "Collaborated with team members to maintain inventory levels and accuracy, ensuring product availability for customers.",
            "Exercised independent judgment and problem-solving in day-to-day store operations and merchandising decisions.",
          ],
          tags: ["Inventory", "Logistics", "Leadership"],
        },
        {
          title: "Blue Line Arts",
          subtitle: "Volunteer · Roseville, CA · July 2025 – Present",
          summary: "Volunteer with Blue Line Arts, a community arts organization in Roseville.",
          details: [],
          tags: ["Arts", "Community"],
        },
      ],
    },
    {
      id: "projects",
      label: "Research & Projects",
      accent: "#3d4f8f",
      items: [
        {
          title: "The Magnetism of Modern Tourism",
          subtitle: "UC Berkeley Digital Humanities",
          summary:
            "An interactive ArcGIS StoryMap exploring the cultural, infrastructural, and emotional factors behind the world's most visited cities.",
          details: [
            "Independently designed and produced an interactive ArcGIS StoryMap exploring the cultural, infrastructural, and emotional factors behind the world's most visited cities.",
            "Created maps, infographics, sentiment analyses, and interactive visual stories with ArcGIS, Datawrapper, Canva, Voyant, Infogram, and Kepler.gl.",
            "Ran text and sentiment analysis with Voyant Tools on global travel reviews to find recurring emotional and linguistic patterns in perceptions of major destinations.",
            "Applied data cleaning and visualization coding in Python and JavaScript environments (via Kepler.gl and ArcGIS Online) to process large-scale tourism and mobility data.",
          ],
          tags: ["ArcGIS StoryMap", "Sentiment analysis", "Kepler.gl", "Python"],
          link: "",
        },
        {
          title: "Real Reels",
          subtitle: "Independent project",
          summary:
            "A digital archive tracing the evolution of the global film industry from its inception to the present day.",
          details: [
            "Designed and developed a comprehensive digital archive tracing the evolution of the global film industry from its inception to the present day.",
            "Researched key milestones, including technological innovations such as sound integration, color film, and digital cinematography.",
            "Curated and annotated materials on major cinematic movements, from silent-era expressionism to contemporary independent and streaming-era productions.",
            "Used digital visualization and archival tools to organize metadata, improve navigation, and highlight patterns in cinematic evolution.",
          ],
          tags: ["Digital archive", "Curation", "Metadata"],
          link: "",
        },
        {
          title: "Institutionalizing Insurrection Suppression(s)",
          subtitle: "Honors thesis · UC Berkeley History",
          summary:
            "Independent research analyzing institutional and legal responses to civil unrest against marginalized groups in the Caribbean.",
          details: [
            "Independent research analyzing institutional and legal responses to civil unrest, requiring careful verification and cross-referencing of primary source records.",
          ],
          tags: ["Primary sources", "Historical research"],
          link: "",
        },
      ],
    },
    {
      id: "skills",
      label: "Education & Skills",
      accent: "#7a5c2e",
      items: [
        {
          title: "University of California, Berkeley",
          subtitle: "B.A. History, May 2025 · Minor in Digital Humanities, Aug 2025",
          summary: "History major with a 3.83 GPA and a Digital Humanities minor with a 4.0 GPA.",
          details: [
            "B.A. in History · GPA 3.83",
            "Minor in Digital Humanities · GPA 4.0",
            "Honors thesis: “Institutionalizing Insurrection Suppression(s)”",
          ],
          tags: ["History", "Digital Humanities"],
        },
        {
          title: "Skills & tools",
          subtitle: "Research, data and communication",
          summary:
            "Research and source verification, AI output review and data governance, data and statistical analysis, and digital storytelling.",
          details: [
            "Research & Source Verification · AI Output Review & Data Governance · Data Analysis · Statistical Analysis",
            "Research Methodology · Written & Public Communication · Project Management · Information Systems",
            "Digital Storytelling · Collaboration · Inventory Management · Preservation Techniques",
            "Tools: ArcGIS, Datawrapper, Canva, Voyant, Infogram, Kepler.gl, Python, JavaScript",
          ],
          tags: ["Python", "ArcGIS", "Voyant", "Datawrapper", "Kepler.gl"],
        },
        {
          title: "Awards & honors",
          subtitle: "Academic recognition",
          summary: "President's Honor Roll (Spring 2020, Spring 2021) and Dean's List (Fall 2020).",
          details: ["President's Honor Roll · Spring 2020, Spring 2021", "Dean's List · Fall 2020"],
          tags: [],
        },
      ],
    },
  ],
};

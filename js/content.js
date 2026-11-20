// ---------------------------------------------------------------------------
// All portfolio content lives in this one file.
// The 3D gallery and the plain view are both generated from it, so editing
// text here updates the whole site. Anything marked TODO is waiting on
// details from the resume.
// ---------------------------------------------------------------------------

export const content = {
  name: "Aidan Campbell",
  title: "Historian · Digital Humanities · Collections & Data",
  tagline:
    "UC Berkeley History graduate seeking roles in collections management, museum administration, and data and records work.",
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
          subtitle: "Sacramento, CA",
          summary:
            "I'm an interdisciplinary historian and digital humanist from UC Berkeley. My work has taken me from cataloging zoological specimens at the Museum of Vertebrate Zoology to annotating and evaluating AI model outputs, always with the same care for accurate records and clear context.",
          details: [
            "Looking for roles in collections management, museum administration, and data and records work.",
            "Volunteer with Blue Line Arts in Roseville, CA.",
          ],
          tags: ["Collections", "Archives", "Data", "Research"],
        },
        {
          title: "Primary strengths",
          subtitle: "What I bring to a team",
          summary:
            "Independent research, data visualization across many tools, archival and cataloging rigor, and collaboration within and across teams.",
          details: [
            "Independent research",
            "Data visualization across a variety of tools and platforms",
            "Archival and cataloging rigor",
            "Inter- and intra-team collaboration",
          ],
          tags: ["Research", "Data viz", "Cataloging", "Collaboration"],
        },
      ],
    },
    {
      id: "experience",
      label: "Experience",
      accent: "#2f6f73",
      items: [
        {
          title: "Museum of Vertebrate Zoology",
          subtitle: "UC Berkeley · TODO: role title and dates",
          summary:
            "Cataloged zoological specimens and their metadata, and helped create and publish a commemoration of the ascension of director O.P. Pearson.",
          details: [
            "Cataloged specimens and associated metadata",
            "Helped create and publish a commemoration of director O.P. Pearson",
          ],
          tags: ["Cataloging", "Metadata", "Collections"],
        },
        {
          title: "Project Ohm",
          subtitle: "TODO: role title and dates",
          summary: "Annotate and evaluate AI model outputs.",
          details: [],
          tags: ["AI evaluation", "Annotation"],
        },
        {
          title: "Blue Line Arts",
          subtitle: "Volunteer · Roseville, CA",
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
          title: "Honors thesis",
          subtitle: "UC Berkeley · History",
          summary:
            "An honors thesis on institutional power and the suppression of insurrections against marginalized groups in the Caribbean.",
          details: [],
          tags: ["Historical research", "Caribbean history"],
          link: "",
        },
        {
          title: "O.P. Pearson commemoration",
          subtitle: "Museum of Vertebrate Zoology",
          summary:
            "Helped create and publish a commemoration marking the ascension of director O.P. Pearson.",
          details: [],
          tags: ["Archives", "Publishing"],
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
          subtitle: "B.A. History · Digital Humanities · 3.83 GPA",
          summary:
            "Bachelor of Arts in History with a focus in Digital Humanities, including an honors thesis in Caribbean history.",
          details: [],
          tags: ["History", "Digital Humanities"],
        },
        {
          title: "Tools",
          subtitle: "Research, mapping and visualization",
          summary: "Comfortable across mapping, text analysis, programming, and charting tools.",
          details: [],
          tags: ["ArcGIS", "Python", "Voyant", "Datawrapper"],
        },
      ],
    },
  ],
};

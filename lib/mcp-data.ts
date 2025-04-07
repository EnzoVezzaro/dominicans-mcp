import type { MCP } from "./types"

export const mcpList: MCP[] = [
  {
    id: "legal-advisor",
    name: "Legal Advisor MCP",
    description: "Provides information about Dominican legal procedures and general legal guidance.",
    type: "Legal Information",
    status: "online",
    tags: ["legal", "information", "procedures"],
    connectionDetails: {
      type: "sse",
      url: "https://api.example.com/mcp/legal-advisor",
    },
    sampleQuestions: [
      "What documents do I need for a business registration?",
      "How long does divorce process take?",
      "What are the requirements for a work permit?",
    ],
    mockResponses: [
      {
        keywords: ["business", "registration", "register"],
        response:
          "To register a business in the Dominican Republic, you'll need:\n\n1. A certificate of name availability from ONAPI\n2. Articles of incorporation\n3. Copies of shareholders' IDs\n4. Tax registration (RNC)\n5. Commercial registration at the Chamber of Commerce\n\nThe process typically takes 2-3 weeks and costs vary depending on the type of business entity.",
      },
      {
        keywords: ["divorce", "marriage"],
        response:
          "In the Dominican Republic, divorce proceedings typically take 3-6 months depending on whether it's contested or uncontested. For an uncontested divorce, both parties must agree on all terms. Required documents include marriage certificate, ID documents, and a formal divorce petition filed through an attorney. The process involves several court appearances and legal fees typically range from RD$15,000 to RD$50,000 depending on complexity.",
      },
      {
        keywords: ["work permit", "employment", "visa"],
        response:
          "For a work permit in the Dominican Republic, you'll need:\n\n1. Valid passport\n2. Employment contract with a Dominican company\n3. Birth certificate (apostilled)\n4. Police clearance from your country of origin\n5. Medical certificate\n6. Photos\n7. Application form from the Ministry of Labor\n\nThe process takes approximately 2-3 months and your employer typically sponsors the application.",
      },
    ],
  },
  {
    id: "tax-consultant",
    name: "Tax Consultant MCP",
    description: "Provides information about Dominican tax regulations, filing procedures, and general guidance.",
    type: "Tax Information",
    status: "online",
    tags: ["tax", "finance", "regulations"],
    connectionDetails: {
      type: "sse",
      url: "https://api.example.com/mcp/tax-consultant",
    },
    sampleQuestions: [
      "When is the deadline for income tax filing?",
      "What is the current VAT rate?",
      "How do I register for a tax ID (RNC)?",
    ],
    mockResponses: [
      {
        keywords: ["deadline", "income tax", "filing"],
        response:
          "In the Dominican Republic, the deadline for filing personal income tax returns is March 31st of each year for the previous fiscal year. For businesses, the deadline depends on their fiscal year-end, but is typically 120 days after the close of their fiscal year. Late filing penalties start at RD$10,371 plus interest on any unpaid taxes.",
      },
      {
        keywords: ["vat", "itbis", "rate"],
        response:
          "The standard VAT rate (known as ITBIS - Impuesto sobre Transferencias de Bienes Industrializados y Servicios) in the Dominican Republic is currently 18%. However, some basic necessities have a reduced rate of 16%, and certain items like educational materials, basic food items, and medicines are exempt from VAT.",
      },
      {
        keywords: ["rnc", "tax id", "register"],
        response:
          "To register for a Tax ID (RNC - Registro Nacional del Contribuyente) in the Dominican Republic:\n\n1. Visit the DGII office or their website (dgii.gov.do)\n2. Complete form RC-01\n3. Provide identification documents (passport or cédula)\n4. For businesses, include incorporation documents\n5. Provide proof of address\n\nThe process typically takes 5-7 business days, and there is no fee for registration.",
      },
    ],
  },
  {
    id: "immigration-advisor",
    name: "Immigration Advisor MCP",
    description: "Provides information about Dominican immigration procedures, visas, and residency requirements.",
    type: "Immigration Information",
    status: "online",
    tags: ["immigration", "visa", "residency"],
    connectionDetails: {
      type: "stdio",
      command: "node",
      args: ["immigration-mcp-server.js"],
    },
    sampleQuestions: [
      "How do I apply for permanent residency?",
      "What visa do I need for a 3-month stay?",
      "What are the requirements for citizenship?",
    ],
    mockResponses: [
      {
        keywords: ["permanent", "residency", "residence"],
        response:
          "To apply for permanent residency in the Dominican Republic:\n\n1. First obtain temporary residency and maintain it for 5 years\n2. Submit application to the DGM (Dirección General de Migración)\n3. Required documents include: passport, birth certificate, police clearance, medical certificate, proof of income, and photos\n4. The process takes approximately 3-6 months\n5. Fees are approximately US$450\n\nYou'll need to demonstrate financial solvency and maintain a clean criminal record during your temporary residency period.",
      },
      {
        keywords: ["visa", "tourist", "3-month", "stay"],
        response:
          "For a 3-month stay in the Dominican Republic, most visitors need a tourist card/visa which can be purchased upon arrival for US$10. Citizens of many countries including the US, Canada, UK, and EU countries can enter with just this tourist card.\n\nIf you plan to stay exactly 3 months, this is sufficient. For longer stays, you would need to either extend your tourist visa (possible for one additional 60-day period) or apply for temporary residency depending on your purpose of stay.",
      },
      {
        keywords: ["citizenship", "naturalization"],
        response:
          "Requirements for Dominican citizenship through naturalization:\n\n1. Legal residency for at least 2 years (if married to a Dominican citizen) or 10 years (standard naturalization)\n2. Knowledge of Spanish language, Dominican history and culture\n3. No criminal record\n4. Proof of income or means of support\n5. Renunciation of previous citizenship (though dual citizenship is recognized in practice)\n\nThe application is submitted to the Ministry of Interior and Police, and the process typically takes 1-2 years to complete.",
      },
    ],
  },
  {
    id: "business-consultant",
    name: "Business Consultant MCP",
    description: "Provides information about starting and operating businesses in the Dominican Republic.",
    type: "Business Information",
    status: "online",
    tags: ["business", "entrepreneurship", "regulations"],
    connectionDetails: {
      type: "sse",
      url: "https://api.example.com/mcp/business-consultant",
    },
    sampleQuestions: [
      "What are the steps to start an LLC?",
      "What business incentives are available?",
      "How do I register a trademark?",
    ],
    mockResponses: [
      {
        keywords: ["llc", "srl", "start"],
        response:
          "To start an LLC (SRL - Sociedad de Responsabilidad Limitada) in the Dominican Republic:\n\n1. Reserve company name at ONAPI\n2. Prepare articles of incorporation with a lawyer\n3. Deposit minimum capital (RD$100,000) in a bank\n4. Register with the Mercantile Registry at the Chamber of Commerce\n5. Obtain Tax ID (RNC) from DGII\n6. Register employees with TSS (social security)\n\nThe process typically takes 3-4 weeks and costs approximately RD$25,000-35,000 in government and legal fees.",
      },
      {
        keywords: ["incentives", "tax breaks", "benefits"],
        response:
          "The Dominican Republic offers several business incentives:\n\n1. Law 8-90 for Free Trade Zones: 100% exemption from income tax, customs duties, and other taxes\n2. Law 158-01 for Tourism Development: tax exemptions for tourism projects in certain regions\n3. Law 57-07 for Renewable Energy: tax incentives for renewable energy projects\n4. Film Industry Incentives: 25% tax credit on eligible expenses\n5. Special Border Development Zone incentives\n\nEach program has specific eligibility requirements and application procedures through the corresponding government agency.",
      },
      {
        keywords: ["trademark", "register", "intellectual property"],
        response:
          "To register a trademark in the Dominican Republic:\n\n1. Conduct a trademark search at ONAPI (National Office of Industrial Property)\n2. File application with ONAPI including:\n   - Completed application form\n   - Graphic representation of the trademark\n   - List of products/services to be covered\n   - Payment of fees (approximately RD$5,000-8,000)\n3. Wait for examination (3-4 months)\n4. If approved, publication in the Official Gazette\n5. If no opposition, certificate is issued\n\nTotal process takes approximately 6-8 months. Trademarks are valid for 10 years and renewable.",
      },
    ],
  },
  {
    id: "property-advisor",
    name: "Property Advisor MCP",
    description:
      "Provides information about real estate laws, property transactions, and regulations in the Dominican Republic.",
    type: "Real Estate Information",
    status: "maintenance",
    tags: ["real estate", "property", "transactions"],
    connectionDetails: {
      type: "sse",
      url: "https://api.example.com/mcp/property-advisor",
    },
    sampleQuestions: [
      "What is the process for buying property?",
      "Do foreigners have restrictions on property ownership?",
      "What taxes apply to property sales?",
    ],
    mockResponses: [
      {
        keywords: ["buying", "purchase", "property"],
        response:
          "The process for buying property in the Dominican Republic:\n\n1. Due diligence: title search at the Title Registry Office\n2. Sign a Promise of Sale agreement (with 10-30% deposit)\n3. Obtain a tax ID number (if foreign buyer)\n4. Final purchase agreement signed before a notary\n5. Pay transfer taxes (3% of property value)\n6. Register the property at the Title Registry Office\n\nThe entire process typically takes 30-60 days. It's highly recommended to work with a reputable attorney specialized in real estate transactions.",
      },
      {
        keywords: ["foreigners", "restrictions", "ownership"],
        response:
          "Foreigners have essentially the same rights as Dominicans when it comes to property ownership in the Dominican Republic, with a few exceptions:\n\n1. Foreigners cannot own property in border areas without special permission\n2. There are some restrictions on beachfront properties (first 60 meters from high tide line)\n\nForeigners can purchase property with just their passport, and there are no restrictions on repatriation of profits from real estate investments. Many foreigners establish Dominican corporations to hold property, which can provide additional legal protections and potential tax benefits.",
      },
      {
        keywords: ["taxes", "property sales", "real estate tax"],
        response:
          "Taxes applicable to property sales in the Dominican Republic:\n\n1. Transfer Tax: 3% of the property value\n2. Capital Gains Tax: 27% on profits (for individuals)\n3. Annual Property Tax (IPI): 1% on properties valued over RD$8.5 million\n\nAdditionally, there may be notary fees (0.25-0.5%), legal fees (1-2%), and title registration fees. When selling, there's also a 1% withholding tax that can later be credited against capital gains tax. Foreign investors should consult with a tax professional as international tax treaties may affect their overall tax situation.",
      },
    ],
  },
  {
    id: "labor-advisor",
    name: "Labor Advisor MCP",
    description: "Provides information about Dominican labor laws, employee rights, and employment regulations.",
    type: "Labor Information",
    status: "offline",
    tags: ["labor", "employment", "workers rights"],
    connectionDetails: {
      type: "stdio",
      command: "node",
      args: ["labor-mcp-server.js"],
    },
    sampleQuestions: [
      "What are the minimum wage requirements?",
      "How much severance pay is required?",
      "What are the legal working hours?",
    ],
    mockResponses: [
      {
        keywords: ["minimum wage", "salary"],
        response:
          "Minimum wage in the Dominican Republic varies by sector and company size:\n\n1. Large companies (installations/capital over RD$4 million): RD$21,000/month\n2. Medium companies (installations/capital RD$2-4 million): RD$19,250/month\n3. Small companies (installations/capital under RD$2 million): RD$12,900/month\n\nSpecial rates apply to free trade zones (approximately RD$11,900/month) and the agricultural sector. Minimum wages are typically reviewed every two years by the National Salary Committee.",
      },
      {
        keywords: ["severance", "termination", "firing"],
        response:
          "Severance pay (prestaciones laborales) in the Dominican Republic for unjustified dismissal:\n\n1. Pre-notice (preaviso): 7-28 days of salary depending on tenure\n2. Severance (cesantía):\n   - 14 days' salary for 3-6 months of service\n   - 14 days' salary per year for 6 months-5 years\n   - 21 days' salary per year for over 5 years\n3. Unused vacation time\n4. Proportional Christmas bonus (1/12 of annual salary per month worked)\n5. Profit sharing if applicable\n\nNo severance is required for justified dismissal (serious misconduct) or resignation, though other benefits like vacation and Christmas bonus are still payable.",
      },
      {
        keywords: ["working hours", "overtime", "workday"],
        response:
          "Legal working hours in the Dominican Republic:\n\n1. Standard workweek: 44 hours\n2. Daytime work (7am-9pm): 8 hours/day\n3. Night work (9pm-7am): 7 hours/day\n4. Mixed schedule: 7.5 hours/day\n\nOvertime must be paid at 135% of regular rate for the first 68 hours of overtime per month, and 200% thereafter. Sunday work is paid at 200% unless it's part of the regular schedule.\n\nEmployees are entitled to 36 hours of uninterrupted rest each week. Managers, supervisors, and certain positions may be exempt from overtime regulations.",
      },
    ],
  },
]


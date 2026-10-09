export const translations = {
  en: {
    nav: {
      brandSub: 'INTELLIGENCE',
      brandMain: 'SALES',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Platform', href: '#platform' },
        { label: 'Follow-Up Engine', href: '#follow-up' },
        { label: 'AI Agents', href: '#ai-agents' },
        { label: 'Analytics', href: '#analytics' },
      ],
      partnerCta: 'Become a Partner',
      login: 'Sign In',
    },
    hero: {
      eyebrow: 'Powered by Intelligence Agency',
      tagline: 'The Commercial Operating System of Modern Business',
      headingBefore: 'AI-Powered ',
      headingHighlight: 'B2B Sales & CRM',
      headingAfter: ' Platform',
      description: 'Turn every sales opportunity into an organized, measurable, and intelligent process. Centralize leads, automate dormant follow-ups, accelerate quotations, and orchestrate 7 specialized sales AI agents.',
      ctaPrimary: 'Explore Commercial OS',
      ctaSecondary: 'Request Early Access',
      chips: {
        velocity: '+42% Pipeline Velocity',
        agents: '7 Coordinated AI Agents',
        followUp: 'Zero Forgotten Follow-Ups',
        accuracy: '99.4% Data Accuracy'
      },
      stats: [
        // { value: '2.8M+ MAD', label: 'Active Pipeline Managed' },
        { value: '7 Days', label: 'Inactivity Alert Threshold' },
        { value: '100%', label: 'Human-in-the-Loop Governance' },
        { value: '4 Pillars', label: 'Unified in Intelligence ERP' }
      ]
    },
    about: {
      eyebrow: 'About Intelligence Agency',
      title: 'We build the operational and commercial brain of enterprises',
      description: 'Intelligence Agency delivers deeply integrated SaaS solutions engineered to eliminate fragmentation, empower teams with governed AI, and give leadership complete operational clarity.',
      ecosystemLabel: 'The Intelligence Agency Ecosystem',
      ecosystem: [
        {
          id: 'sales',
          name: 'Intelligence Sales',
          tag: 'Commercial Operating System',
          description: 'B2B CRM, pipeline management, automated follow-up engine, and sales AI agents.',
          active: true,
          color: 'from-brand-600 to-brand-400'
        },
        {
          id: 'logistique',
          name: 'Intelligence Logistique',
          tag: 'Supply & Transport OS',
          description: 'WMS, inventory, multi-depot tracking, fleet routing, and supply chain automation.',
          active: false,
          color: 'from-blue-600 to-indigo-500'
        },
        {
          id: 'finance',
          name: 'Intelligence Finance',
          tag: 'Treasury & Ledger OS',
          description: 'Invoicing, cash-flow forecasting, payment reconciliations, and compliance.',
          active: false,
          color: 'from-emerald-600 to-teal-500'
        },
        {
          id: 'rh',
          name: 'Intelligence RH',
          tag: 'Human Capital OS',
          description: 'Talent management, organizational planning, commissions, and payroll.',
          active: false,
          color: 'from-violet-600 to-purple-500'
        },
        {
          id: 'erp',
          name: 'Intelligence ERP',
          tag: 'Unified Business Core',
          description: 'Connecting Sales, Finance, Logistique, and RH into one company-wide intelligence layer.',
          active: false,
          isHub: true,
          color: 'from-amber-600 to-orange-500'
        }
      ]
    },
    challenge: {
      eyebrow: 'The B2B Sales Dilemma',
      title: 'Sales information is scattered. Opportunities are forgotten.',
      description: 'When critical client conversations are dispersed across email threads, WhatsApp messages, spreadsheets, and personal notebooks, revenue leaks silently.',
      problems: [
        {
          title: 'Fragmented Customer Records',
          desc: 'Data scattered across personal phones, WhatsApp, inboxes, and paper notes.'
        },
        {
          title: 'Forgotten & Stalled Follow-Ups',
          desc: 'High-value deals go cold after initial meetings because no alert was triggered.'
        },
        {
          title: 'Management Pipeline Blindness',
          desc: 'Executives cannot answer the fundamental question: "What is truly happening with our sales?"'
        },
        {
          title: 'Manual Quotation & Handover Delays',
          desc: 'Days wasted generating quotes and manually re-entering sales data into logistics and finance.'
        }
      ],
      resultTitle: 'The Business Impact',
      results: [
        { label: 'Lost Revenue', desc: 'Up to 24% of pipeline dies due to delayed follow-up' },
        { label: 'Rep Burnout', desc: 'Over 60% of sales time spent on administrative data entry' },
        { label: 'Friction at Fulfillment', desc: 'Logistics and finance learn of won deals too late' },
        { label: 'Lost Client Equity', desc: 'Customer history leaves when a sales representative departs' }
      ]
    },
    vision: {
      eyebrow: 'Our Vision',
      title: 'From Static Contact Database to Commercial Operating System',
      description: 'Intelligence Sales moves beyond basic CRM record-keeping into a living, proactive platform connecting sales execution, autonomous intelligence, and downstream fulfillment.',
      coreTitle: 'COMMERCIAL OS CORE',
      nodes: [
        'Leads & Channels',
        'Opportunity Pipeline',
        'Quotations & CPQ',
        'Follow-Up Engine',
        'Activities & Meetings',
        'Sales AI Agents',
        'Executive Analytics'
      ]
    },
    modules: {
      eyebrow: 'Core Platform Modules',
      title: 'Every phase of the commercial cycle, unified',
      description: 'Engineered specifically for B2B cycles: Lead → Qualification → Discovery → Proposal → Negotiation → Closed Won → Fulfillment.',
      items: [
        {
          id: 'crm',
          title: 'Core CRM & Lead Capture',
          desc: 'Multi-source lead ingestion with instant deduplication and company intelligence.',
          features: ['Website & form inbound leads', 'WhatsApp & phone call logs', 'Automated data enrichment', 'Account & multi-contact hierarchies']
        },
        {
          id: 'pipeline',
          title: 'Visual Pipeline & Deals',
          desc: 'Real-time Kanban and list boards with probability weighting and stage aging.',
          features: ['Customizable pipeline stages', 'Weighted deal valuation', 'Stalled deal highlighting', 'Multi-currency support']
        },
        {
          id: 'followup',
          title: 'Follow-Up Engine',
          desc: 'Automated inactivity monitoring that guarantees no prospect slips through the cracks.',
          features: ['7-day inactivity triggers', 'AI re-engagement suggestions', 'Automated task delegation', 'Salesperson notifications']
        },
        {
          id: 'quotes',
          title: 'Quotations & Sales Orders',
          desc: 'Convert won opportunities into formal quotations and trigger downstream ERP handoffs.',
          features: ['Instant quote generator', 'Discount approval gates', 'Direct push to Intelligence Finance', 'Automatic logistics order creation']
        }
      ]
    },
    followUpFlow: {
      eyebrow: 'Zero Revenue Leakage',
      title: 'How the Follow-Up Engine rescues inactive deals',
      description: 'Intelligence Sales actively safeguards your pipeline with governed, human-approved automation.',
      steps: [
        { num: '01', title: 'Inactivity Detection', text: 'Platform detects 7 days without logged call, meeting, or email on an active opportunity.' },
        { num: '02', title: 'Contextual AI Analysis', text: 'Follow-Up Agent analyzes deal history, stakeholder role, and objections discussed.' },
        { num: '03', title: 'Draft Recommendation', text: 'Agent prepares a tailored follow-up message and creates a high-priority task.' },
        { num: '04', title: 'Human Approval Gate', text: 'Sales rep reviews, adjusts, and approves the outreach with a single click.' },
        { num: '05', title: 'Logged & Measured', text: 'Communication is dispatched and logged; pipeline velocity analytics update instantly.' }
      ]
    },
    aiAgents: {
      eyebrow: 'Multi-Agent Intelligence',
      title: '7 Specialized Sales AI Agents working as one coordinated brain',
      description: 'Each agent is trained on a dedicated sales discipline, orchestrated centrally under strict human supervision.',
      orchestratorTitle: 'SALES ORCHESTRATOR',
      orchestratorDesc: 'Coordinates data flow, assigns agent priorities, and enforces approval boundaries.',
      agents: [
        {
          id: 'assistant',
          name: 'Sales Assistant Agent',
          category: 'Rep Copilot',
          mission: 'Prepares pre-meeting executive briefs, summarizes call transcripts, and suggests next deal moves.'
        },
        {
          id: 'lead',
          name: 'Lead Intelligence Agent',
          category: 'Qualification',
          mission: 'Evaluates ICP fit, enriches company firmographics, and scores intent without hallucinatory claims.'
        },
        {
          id: 'data',
          name: 'CRM Data Agent',
          category: 'Hygiene & Cleanse',
          mission: 'Deduplicates contacts, normalizes job titles, updates outdated emails, and verifies company records.'
        },
        {
          id: 'followup',
          name: 'Follow-Up Agent',
          category: 'Dormancy Engine',
          mission: 'Monitors deal velocity, spots neglected accounts, and crafts personalized re-engagement touchpoints.'
        },
        {
          id: 'analytics',
          name: 'Sales Analytics Agent',
          category: 'Pipeline Diagnostics',
          mission: 'Identifies conversion bottlenecks, analyzes win/loss reasons, and forecasts realistic quarterly revenue.'
        },
        {
          id: 'document',
          name: 'Document Agent',
          category: 'Content Extraction',
          mission: 'Parses RFPs, extracts product requirements from client PDFs, and populates quotation line items.'
        },
        {
          id: 'automation',
          name: 'Automation Agent',
          category: 'Workflow Execution',
          mission: 'Dispatches approved tasks, triggers onboarding sequences, and creates sales orders upon winning.'
        }
      ]
    },
    governance: {
      eyebrow: 'Enterprise Governance & Security',
      title: 'Powerful AI automation with uncompromising human control',
      description: 'Intelligence Sales is built for multi-tenant enterprise deployment where data privacy, access controls, and accountability are non-negotiable.',
      pillars: [
        {
          title: 'Human-in-the-Loop Gate',
          desc: 'No AI agent can send external client emails or modify financial figures without explicit salesperson approval.'
        },
        {
          title: 'Strict Multi-Tenancy & Isolation',
          desc: 'Isolated tenant data partitions ensure that organizational commercial intelligence remains private and encrypted.'
        },
        {
          title: 'Granular Role-Based Access (RBAC)',
          desc: 'Precise permissions for Super Admin, Sales Manager, Sales Rep, Marketing, and Executive Management.'
        },
        {
          title: 'Comprehensive Audit Logs',
          desc: 'Every system change, deal stage progression, and AI recommendation is recorded in immutable audit logs.'
        }
      ]
    },
    architecture: {
      eyebrow: 'Technology Architecture',
      title: 'Engineered for high concurrency, real-time sync, and enterprise scale',
      description: 'Built on a proven, robust decoupled stack combining modern reactive frontends with enterprise backends.',
      layers: [
        {
          tier: 'Client Experience Layer',
          tech: 'React 19 · Tailwind CSS v4 · Framer Motion',
          details: 'Sub-millisecond interactive pipeline, responsive dark/light UI, and native mobile accessibility.'
        },
        {
          tier: 'Business Logic & REST API',
          tech: 'Laravel REST API · PostgreSQL Database',
          details: 'Enterprise RBAC, multi-tenant tenancy, webhooks, transaction security, and audit logging.'
        },
        {
          tier: 'Autonomous AI & Document Microservice',
          tech: 'Python AI Layer · Multi-Agent Orchestration',
          details: 'Specialized LLM agents, document parsing pipelines, and real-time predictive analytics.'
        }
      ]
    },
    analytics: {
      eyebrow: 'Executive Intelligence',
      title: 'Answer the question: "What is happening with our sales?"',
      description: 'Real-time visibility into quota pacing, pipeline conversion funnels, and representative performance.',
      metrics: [
        // { label: 'Total Active Pipeline', value: 'X,XX MAD', change: '+18.4% vs last mo' },
        { label: 'Lead-to-Opportunity', value: '42.6%', change: '+6.1% conversion' },
        { label: 'Opportunity-to-Won', value: '31.8%', change: '+3.9% win rate' },
        { label: 'Average Deal Velocity', value: '19.4 Days', change: '-4.2 days faster' }
      ],
      funnel: [
        { stage: '1. New Leads', count: '1,420 leads', value: '12.4M MAD', width: '100%' },
        { stage: '2. Qualification', count: '605 qualified', value: '7.8M MAD', width: '78%' },
        { stage: '3. Discovery & Demo', count: '310 in progress', value: '4.9M MAD', width: '56%' },
        { stage: '4. Proposal Sent', count: '185 active', value: '3.4M MAD', width: '40%' },
        { stage: '5. Negotiation', count: '74 closing', value: '1.8M MAD', width: '28%' },
        { stage: '6. Closed Won', count: '52 closed', value: '1.2M MAD', width: '18%' }
      ]
    },
    differentiation: {
      eyebrow: 'Competitive Evolution',
      title: 'The progression of modern sales software',
      description: 'Most CRMs merely log the past. Intelligence Sales drives the future.',
      steps: [
        { stage: 'Traditional CRM', desc: 'Static database of contacts, high data entry burden.' },
        { stage: 'Smart CRM', desc: 'Basic email tracking and automatic lead capture.' },
        { stage: 'AI CRM', desc: 'Superficial chat sidebar added on top of legacy architecture.' },
        { stage: 'Automated Platform', desc: 'Workflow triggers for repetitive tasks.' },
        { stage: 'Commercial OS', desc: 'Intelligence Sales: Unified data, 7 orchestrated agents, follow-up engine, and cross-ERP connectivity.', active: true }
      ]
    },
    targetCustomers: {
      eyebrow: 'Target Customers',
      title: 'Engineered for B2B commercial teams with structured sales cycles',
      segments: [
        {
          title: 'Growing Small Businesses',
          scope: '1 – 15 Team Members',
          desc: 'Need a streamlined, intuitive CRM that eliminates spreadsheets and guarantees immediate follow-up.'
        },
        {
          title: 'Scaling Mid-Market SMEs',
          scope: '15 – 250 Team Members',
          desc: 'Require multi-rep quotas, territory management, automated quotations, and deep pipeline conversion reporting.'
        },
        {
          title: 'Large B2B Enterprises',
          scope: '250+ Team Members',
          desc: 'Demand multi-team permissions, ERP & logistics integration, strict RBAC, and dedicated audit governance.'
        },
        {
          title: 'Commercial & Sales Agencies',
          scope: 'Multi-Client Agencies',
          desc: 'Managing distinct commercial pipelines for multiple accounts with unified executive oversight.'
        }
      ]
    },
    roadmap: {
      eyebrow: 'Product Roadmap',
      title: 'A disciplined trajectory from MVP to company-wide ERP integration',
      phases: [
        {
          phase: 'V1 (MVP)',
          timeline: 'Current Foundation',
          scope: 'Core CRM + Pipeline + Dashboard',
          details: ['Authentication & multi-tenancy', 'Companies & contacts management', 'Lead capture & Kanban pipeline', 'Activity tracking & basic KPIs']
        },
        {
          phase: 'V1.5',
          timeline: 'Months 2 – 4',
          scope: 'Quotations + Orders + Follow-Up Engine',
          details: ['CPQ Quotations & sales orders', 'Document attachment & storage', 'Email & calendar integration', '7-day inactivity automations']
        },
        {
          phase: 'V2',
          timeline: 'Months 5 – 8',
          scope: '7 AI Agents + Document AI',
          details: ['Sales Assistant copilot', 'Document extraction for RFPs', 'Predictive lead scoring', 'AI analytics agent']
        },
        {
          phase: 'V3 & V4',
          timeline: 'Months 9 – 16',
          scope: 'Intelligence ERP Ecosystem',
          details: ['Direct link to Intelligence Finance', 'Direct link to Intelligence Logistique', 'Direct link to Intelligence RH', 'Full Intelligence ERP synthesis']
        }
      ]
    },
    partnership: {
      eyebrow: 'Strategic Partnership',
      title: 'Partner with Intelligence Agency',
      description: 'We are selecting innovative B2B companies, industry experts, and sales organizations to participate in our early access program and strategic pilot deployments.',
      benefits: [
        'Early pilot deployment with custom pipeline workflows',
        'Direct input into AI Agent tuning and feature prioritization',
        'Seamless integration with your existing commercial tools',
        'Dedicated onboarding and executive engineering support'
      ],
      quote: 'Built by enterprise software architects to become the commercial operating system of your business.',
      cta: 'Request Early Access'
    },
    ambition: {
      eyebrow: 'Our Trajectory',
      titleBefore: 'Becoming the leading ',
      titleHighlight: 'Commercial Operating System',
      journey: ['Morocco', 'North Africa', 'UK', 'Europe'],
      cta: 'Join the Movement',
      footerRights: '© {year} Intelligence Agency. All rights reserved.',
      footerTag: 'Intelligence ERP · Intelligence Sales · Intelligence Logistique · Intelligence Finance · Intelligence RH'
    }
  },
  fr: {
    nav: {
      brandSub: 'INTELLIGENCE',
      brandMain: 'SALES',
      links: [
        { label: 'À propos', href: '#about' },
        { label: 'Plateforme', href: '#platform' },
        { label: 'Moteur de Relance', href: '#follow-up' },
        { label: 'Agents IA', href: '#ai-agents' },
        { label: 'Analytique', href: '#analytics' },
      ],
      partnerCta: 'Devenir Partenaire',
      login: 'Connexion',
    },
    hero: {
      eyebrow: 'Propulsé par Intelligence Agency',
      tagline: 'Le Système d\'Exploitation Commercial des Entreprises Modernes',
      headingBefore: 'Plateforme B2B de ',
      headingHighlight: 'Gestion des Ventes & CRM',
      headingAfter: ' Propulsée par l\'IA',
      description: 'Transformez chaque opportunité commerciale en un processus structuré, mesurable et intelligent. Centralisez vos prospects, automatisez les relances oubliées, accélérez vos devis et orchestrez 7 agents IA spécialisés.',
      ctaPrimary: 'Découvrir la Plateforme',
      ctaSecondary: 'Demander un Accès Pilote',
      chips: {
        velocity: '+42 % Vélocité du Pipeline',
        agents: '7 Agents IA Coordonnés',
        followUp: 'Zéro Relance Oubliée',
        accuracy: '99,4 % Précision des Données'
      },
      stats: [
        // { value: '2,8M MAD+', label: 'Pipeline Actif Piloté' },
        { value: '7 Jours', label: 'Seuil d\'Alerte d\'Inactivité' },
        { value: '100 %', label: 'Contrôle Humain Garanti' },
        { value: '4 Piliers', label: 'Unifiés dans Intelligence ERP' }
      ]
    },
    about: {
      eyebrow: 'À Propos d\'Intelligence Agency',
      title: 'Nous concevons le cerveau opérationnel et commercial des entreprises',
      description: 'Intelligence Agency développe des plateformes SaaS interconnectées conçues pour éliminer les silos d\'information, libérer les équipes des tâches administratives et offrir aux dirigeants une visibilité sans faille.',
      ecosystemLabel: 'L\'Écosystème Intelligence Agency',
      ecosystem: [
        {
          id: 'sales',
          name: 'Intelligence Sales',
          tag: 'Système d\'Exploitation Commercial',
          description: 'CRM B2B, gestion du pipeline, moteur de relance automatisé et agents IA commerciaux.',
          active: true,
          color: 'from-brand-600 to-brand-400'
        },
        {
          id: 'logistique',
          name: 'Intelligence Logistique',
          tag: 'OS Approvisionnement & Transport',
          description: 'WMS, gestion des stocks multi-entrepôts, tour de contrôle et logistique prédictive.',
          active: false,
          color: 'from-blue-600 to-indigo-500'
        },
        {
          id: 'finance',
          name: 'Intelligence Finance',
          tag: 'OS Trésorerie & Comptabilité',
          description: 'Facturation, prévision des flux de trésorerie, rapprochements bancaires et conformité.',
          active: false,
          color: 'from-emerald-600 to-teal-500'
        },
        {
          id: 'rh',
          name: 'Intelligence RH',
          tag: 'OS Capital Humain',
          description: 'Gestion des talents, structure organisationnelle, commissions de vente et paie.',
          active: false,
          color: 'from-violet-600 to-purple-500'
        },
        {
          id: 'erp',
          name: 'Intelligence ERP',
          tag: 'Noyau Unifié d\'Entreprise',
          description: 'Connecte Ventes, Finance, Logistique et RH au sein d\'une intelligence globale d\'entreprise.',
          active: false,
          isHub: true,
          color: 'from-amber-600 to-orange-500'
        }
      ]
    },
    challenge: {
      eyebrow: 'Le Défi Commercial B2B',
      title: 'L\'information commerciale est dispersée. Les opportunités tombent dans l\'oubli.',
      description: 'Lorsque les données clients sont éparpillées entre WhatsApp, les boîtes mail individuelles, les tableurs et les carnets, le chiffre d\'affaires s\'évapore en silence.',
      problems: [
        {
          title: 'Données Clients Fragmentées',
          desc: 'Informations dispersées entre téléphones personnels, conversations WhatsApp et notes papier.'
        },
        {
          title: 'Relances Oubliées & Affaires au Point Mort',
          desc: 'Des opportunités majeures refroidissent après la première réunion faute de rappels proactifs.'
        },
        {
          title: 'Direction Aveugle sur le Pipeline',
          desc: 'La direction ne peut répondre précisément à la question : "Que se passe-t-il vraiment avec nos ventes ?"'
        },
        {
          title: 'Lenteur des Devis et de la Transmission',
          desc: 'Des jours perdus à formaliser des devis et ressaisir manuellement les commandes vers la logistique et la finance.'
        }
      ],
      resultTitle: 'L\'Impact sur l\'Entreprise',
      results: [
        { label: 'Perte de Chiffre d\'Affaires', desc: 'Jusqu\'à 24 % des opportunités meurent faute de relance à temps' },
        { label: 'Épuisement des Équipes', desc: 'Plus de 60 % du temps d\'un commercial est gaspillé en saisie administrative' },
        { label: 'Friction avec les Opérations', desc: 'La logistique et la finance apprennent les ventes gagnées trop tard' },
        { label: 'Perte du Capital Client', desc: 'L\'historique relationnel disparaît lorsqu\'un commercial quitte l\'entreprise' }
      ]
    },
    vision: {
      eyebrow: 'Notre Vision',
      title: 'D\'une Base de Contacts Statique vers le Système d\'Exploitation Commercial',
      description: 'Intelligence Sales dépasse le simple enregistrement CRM pour devenir une plateforme vivante et proactive reliant l\'exécution commerciale, l\'IA autonome et l\'exécution opérationnelle.',
      coreTitle: 'CŒUR COMMERCIAL OS',
      nodes: [
        'Prospects & Canaux',
        'Pipeline d\'Opportunités',
        'Devis & Bons de Commande',
        'Moteur de Relance',
        'Activités & Rendez-vous',
        'Agents IA Commerciaux',
        'Analytique de Direction'
      ]
    },
    modules: {
      eyebrow: 'Modules Principaux',
      title: 'Chaque étape du cycle commercial, unifiée',
      description: 'Conçu spécifiquement pour le cycle B2B : Prospect → Qualification → Découverte → Proposition → Négociation → Gagné → Exécution.',
      items: [
        {
          id: 'crm',
          title: 'CRM Central & Capture des Prospects',
          desc: 'Ingestion multi-sources avec déduplication instantanée et enrichissement automatique.',
          features: ['Formulaires web et demandes entrantes', 'Historique WhatsApp et appels', 'Enrichissement des données d\'entreprise', 'Gestion des contacts et décideurs']
        },
        {
          id: 'pipeline',
          title: 'Pipeline Visuel & Affaires',
          desc: 'Vues Kanban et listes dynamiques avec pondération des probabilités et alertes d\'ancienneté.',
          features: ['Étapes de pipeline personnalisables', 'Valorisation pondérée des opportunités', 'Détection visuelle des affaires ralenties', 'Prise en charge multi-devises']
        },
        {
          id: 'followup',
          title: 'Moteur de Relance Automatisé',
          desc: 'Surveillance proactive de l\'inactivité pour garantir qu\'aucun prospect ne soit délaissé.',
          features: ['Déclencheur d\'inactivité à 7 jours', 'Suggestions IA de messages de relance', 'Attribution automatique des tâches', 'Notifications aux commerciaux']
        },
        {
          id: 'quotes',
          title: 'Devis & Commandes de Vente',
          desc: 'Générez des devis professionnels et déclenchez automatiquement les flux ERP en aval.',
          features: ['Générateur de devis instantané', 'Gestion des validations de remises', 'Transmission directe vers Intelligence Finance', 'Création automatique des ordres logistiques']
        }
      ]
    },
    followUpFlow: {
      eyebrow: 'Zéro Fuite de Revenus',
      title: 'Comment le Moteur de Relance sauve vos opportunités endormies',
      description: 'Intelligence Sales protège activement votre chiffre d\'affaires grâce à une automatisation sous contrôle humain.',
      steps: [
        { num: '01', title: 'Détection d\'Inactivité', text: 'La plateforme repère 7 jours consécutifs sans appel, réunion ou e-mail enregistré sur une affaire active.' },
        { num: '02', title: 'Analyse Contextuelle par l\'IA', text: 'L\'Agent de Relance examine l\'historique, le profil du prospect et les derniers points abordés.' },
        { num: '03', title: 'Proposition Personnalisée', text: 'L\'agent rédige un brouillon de message d\'approche et planifie une tâche prioritaire.' },
        { num: '04', title: 'Validation Humaine en 1 Clic', text: 'Le commercial relit, adapte si nécessaire et valide l\'envoi en un seul clic.' },
        { num: '05', title: 'Enregistrement & Mesure', text: 'Le message est expédié, tracé dans le CRM et les métriques de vélocité sont actualisées.' }
      ]
    },
    aiAgents: {
      eyebrow: 'Intelligence Multi-Agents',
      title: '7 Agents IA Spécialisés collaborant comme un cerveau commercial unique',
      description: 'Chaque agent est dédié à une fonction précise du métier commercial, sous la supervision permanente de l\'équipe humaine.',
      orchestratorTitle: 'ORCHESTRATEUR COMMERCIAL',
      orchestratorDesc: 'Coordonne les flux d\'information, priorise les requêtes et garantit le respect des permissions.',
      agents: [
        {
          id: 'assistant',
          name: 'Agent Assistant Commercial',
          category: 'Copilote Commercial',
          mission: 'Prépare les fiches de cadrage avant réunion, synthétise les comptes-rendus et suggère les prochaines actions.'
        },
        {
          id: 'lead',
          name: 'Agent Intelligence Prospects',
          category: 'Qualification',
          mission: 'Évalue l\'adéquation avec la cible idéale, enrichit les données de l\'entreprise et score l\'intention d\'achat.'
        },
        {
          id: 'data',
          name: 'Agent Données CRM',
          category: 'Qualité des Données',
          mission: 'Élimine les doublons, standardise les fonctions, actualise les coordonnées et nettoie la base commerciale.'
        },
        {
          id: 'followup',
          name: 'Agent de Relance',
          category: 'Anti-Dormance',
          mission: 'Surveille le rythme du pipeline, identifie les comptes délaissés et formule des propositions de relance adaptées.'
        },
        {
          id: 'analytics',
          name: 'Agent Analytique des Ventes',
          category: 'Diagnostics du Pipeline',
          mission: 'Détecte les points de friction, analyse les causes de perte et établit des prévisions réalistes de clôture.'
        },
        {
          id: 'document',
          name: 'Agent Documents & Devis',
          category: 'Extraction de Contenu',
          mission: 'Analyse les cahiers des charges et appels d\'offres PDF pour pré-remplir les lignes de devis.'
        },
        {
          id: 'automation',
          name: 'Agent d\'Automatisation',
          category: 'Exécution des Flux',
          mission: 'Attribue les tâches validées, active les séquences d\'accueil et transmet les bons de commande signés.'
        }
      ]
    },
    governance: {
      eyebrow: 'Gouvernance & Sécurité Entreprise',
      title: 'Une automatisation IA puissante sous contrôle humain strict',
      description: 'Intelligence Sales est conçu pour le déploiement B2B multi-entreprises où la confidentialité et la responsabilité sont indispensables.',
      pillars: [
        {
          title: 'Contrôle Humain Obligatoire',
          desc: 'Aucun agent IA ne peut envoyer d\'e-mail externe ou modifier des montants financiers sans validation explicite.'
        },
        {
          title: 'Multi-Tenant & Cloisonnement Total',
          desc: 'Séparation hermétique des données pour garantir que le patrimoine commercial de l\'entreprise reste confidentiel.'
        },
        {
          title: 'Gestion des Droits Avancée (RBAC)',
          desc: 'Permissions fines par rôle : Super Administrateur, Directeur Commercial, Commercial, Marketing et Direction.'
        },
        {
          title: 'Journal d\'Audit Inaltérable',
          desc: 'Chaque action, passage d\'étape d\'opportunité et recommandation d\'agent est consignée dans un journal d\'audit.'
        }
      ]
    },
    architecture: {
      eyebrow: 'Architecture Technique',
      title: 'Conçue pour la réactivité en temps réel et l\'échelle entreprise',
      description: 'Un socle découplé combinant la réactivité des interfaces modernes avec la robustesse des systèmes d\'entreprise.',
      layers: [
        {
          tier: 'Couche Expérience Client',
          tech: 'React 19 · Tailwind CSS v4 · Framer Motion',
          details: 'Pipeline interactif ultra-fluide, interface sombre/claire et compatibilité mobile native.'
        },
        {
          tier: 'Logique Métier & API REST',
          tech: 'API REST Laravel · Base PostgreSQL',
          details: 'Sécurité multi-tenant, gestion des rôles, webhooks, intégrité transactionnelle et journaux d\'audit.'
        },
        {
          tier: 'Microservice IA & Documents',
          tech: 'Couche IA Python · Orchestration Multi-Agents',
          details: 'Agents LLM spécialisés, chaîne de traitement de documents et modèles d\'analytique prédictive.'
        }
      ]
    },
    analytics: {
      eyebrow: 'Intelligence de Direction',
      title: 'Répondez enfin à la question : "Que se passe-t-il avec nos ventes ?"',
      description: 'Visibilité instantanée sur la réalisation des objectifs, les taux de conversion et les performances individuelles.',
      metrics: [
        // { label: 'Pipeline Total Actif', value: '3,4M MAD', change: '+18,4 % vs mois dernier' },
        { label: 'Prospects vers Opportunités', value: '42,6 %', change: '+6,1 % conversion' },
        { label: 'Opportunités vers Gagnées', value: '31,8 %', change: '+3,9 % taux de succès' },
        { label: 'Vélocité Moyenne de Clôture', value: '19,4 Jours', change: '-4,2 jours gagnés' }
      ],
      funnel: [
        { stage: '1. Nouveaux Prospects', count: '1 420 leads', value: '12,4M MAD', width: '100%' },
        { stage: '2. Qualifiés', count: '605 qualifiés', value: '7,8M MAD', width: '78%' },
        { stage: '3. Découverte & Démo', count: '310 en cours', value: '4,9M MAD', width: '56%' },
        { stage: '4. Proposition Envoyée', count: '185 actifs', value: '3,4M MAD', width: '40%' },
        { stage: '5. Négociation', count: '74 en clôture', value: '1,8M MAD', width: '28%' },
        { stage: '6. Affaires Gagnées', count: '52 gagnées', value: '1,2M MAD', width: '18%' }
      ]
    },
    differentiation: {
      eyebrow: 'Évolution Concurrentielle',
      title: 'La trajectoire des outils de vente modernes',
      description: 'Les CRM traditionnels archivent le passé. Intelligence Sales pilote l\'avenir.',
      steps: [
        { stage: 'CRM Traditionnel', desc: 'Simple carnet d\'adresses numérique, lourde charge de saisie.' },
        { stage: 'Smart CRM', desc: 'Suivi basique des e-mails et capture automatique des formulaires.' },
        { stage: 'CRM avec IA Greffée', desc: 'Barre de chat superficielle ajoutée sur une architecture vieillissante.' },
        { stage: 'Plateforme d\'Automatisation', desc: 'Règles statiques de déclenchement de tâches répétitives.' },
        { stage: 'Commercial OS', desc: 'Intelligence Sales : Données unifiées, 7 agents coordonnés, moteur anti-oubli et intégration ERP.', active: true }
      ]
    },
    targetCustomers: {
      eyebrow: 'Clients Cibles',
      title: 'Conçu pour les organisations B2B avec des cycles de vente structurés',
      segments: [
        {
          title: 'Petites Entreprises en Croissance',
          scope: '1 à 15 Collaborateurs',
          desc: 'Besoin d\'un CRM limpide qui supprime les tableurs et garantit des relances sans délai.'
        },
        {
          title: 'PME en Forte Croissance',
          scope: '15 à 250 Collaborateurs',
          desc: 'Exigent des objectifs par commercial, la gestion des territoires, des devis rapides et des analyses de conversion.'
        },
        {
          title: 'Grandes Entreprises B2B',
          scope: '250+ Collaborateurs',
          desc: 'Nécessitent des droits complexes, une intégration ERP et logistique, et une gouvernance d\'audit stricte.'
        },
        {
          title: 'Agences Commerciales & Régies',
          scope: 'Multi-Clients & Mandats',
          desc: 'Pilotage simultané de plusieurs pipelines clients avec une consolidation exécutive unifiée.'
        }
      ]
    },
    roadmap: {
      eyebrow: 'Feuille de Route Produit',
      title: 'Une trajectoire méthodique du MVP vers l\'unification ERP',
      phases: [
        {
          phase: 'V1 (MVP)',
          timeline: 'Socle Actuel',
          scope: 'CRM Central + Pipeline + Tableau de Bord',
          details: ['Authentification et architecture multi-tenant', 'Gestion des entreprises et contacts', 'Capture des prospects et pipeline Kanban', 'Suivi des activités et indicateurs clés']
        },
        {
          phase: 'V1.5',
          timeline: 'Mois 2 à 4',
          scope: 'Devis + Commandes + Moteur de Relance',
          details: ['Générateur de devis et bons de commande', 'Gestion des pièces jointes et contrats', 'Synchronisation e-mails et agendas', 'Automatisation des relances à 7 jours']
        },
        {
          phase: 'V2',
          timeline: 'Mois 5 à 8',
          scope: '7 Agents IA + IA Documentaire',
          details: ['Copilote Assistant Commercial', 'Extraction des cahiers des charges', 'Scoring prédictif des opportunités', 'Agent d\'analytique décisionnelle']
        },
        {
          phase: 'V3 & V4',
          timeline: 'Mois 9 à 16',
          scope: 'Écosystème Intelligence ERP',
          details: ['Liaison directe avec Intelligence Finance', 'Liaison directe avec Intelligence Logistique', 'Liaison directe avec Intelligence RH', 'Synthèse complète Intelligence ERP']
        }
      ]
    },
    partnership: {
      eyebrow: 'Partenariat Stratégique',
      title: 'Collaborez avec Intelligence Agency',
      description: 'Nous sélectionnons des entreprises B2B novatrices, des experts sectoriels et des directions commerciales pour rejoindre notre programme pilote d\'accès anticipé.',
      benefits: [
        'Déploiement pilote avec adaptation à vos cycles de vente spécifiques',
        'Influence directe sur le calibrage des Agents IA et les priorités produit',
        'Connexion fluide avec vos outils commerciaux existants',
        'Accompagnement dédié par nos ingénieurs et experts métier'
      ],
      quote: 'Conçu par des architectes de logiciels d\'entreprise pour devenir le système d\'exploitation commercial de votre organisation.',
      cta: 'Demander un Accès Anticipé'
    },
    ambition: {
      eyebrow: 'Notre Ambition',
      titleBefore: 'Devenir le premier ',
      titleHighlight: 'Système d\'Exploitation Commercial',
      journey: ['Maroc', 'Afrique du Nord', 'UK', 'Europe'],
      cta: 'Rejoindre la Dynamique',
      footerRights: '© {year} Intelligence Agency. Tous droits réservés.',
      footerTag: 'Intelligence ERP · Intelligence Sales · Intelligence Logistique · Intelligence Finance · Intelligence RH'
    }
  },
  ar: {
    nav: {
      brandSub: 'INTELLIGENCE',
      brandMain: 'SALES',
      links: [
        { label: 'عن المنصة', href: '#about' },
        { label: 'الوحدات', href: '#platform' },
        { label: 'محرك المتابعة', href: '#follow-up' },
        { label: 'وكلاء الذكاء الاصطناعي', href: '#ai-agents' },
        { label: 'التحليلات', href: '#analytics' },
      ],
      partnerCta: 'كن شريكاً معنا',
      login: 'تسجيل الدخول',
    },
    hero: {
      eyebrow: 'مدعوم من Intelligence Agency',
      tagline: 'نظام التشغيل التجاري للشركات والمؤسسات الحديثة',
      headingBefore: 'منصة B2B لإدارة ',
      headingHighlight: 'المبيعات وعلاقات العملاء (CRM)',
      headingAfter: ' مدعومة بالذكاء الاصطناعي',
      description: 'حوّل كل فرصة تجارية إلى مسار منظّم، قابل للقياس وذكي. مركزيّة العملاء المحتملين، أتمتة المتابعات المنسية، تسريع إعداد عروض الأسعار، وتنسيق 7 وكلاء ذكاء اصطناعي متخصصين.',
      ctaPrimary: 'استكشف نظام التشغيل التجاري',
      ctaSecondary: 'طلب الوصول المبكر',
      chips: {
        velocity: '+42% سرعة إغلاق الصفقات',
        agents: '7 وكلاء ذكاء اصطناعي متناسقين',
        followUp: 'صفر متابعات منسية',
        accuracy: '99.4% دقة البيانات التجارية'
      },
      stats: [
        // { value: '+2.8M درهم', label: 'صفقات نشطة تحت الإدارة' },
        { value: '7 أيام', label: 'حد تنبيه خمول الفرص' },
        { value: '100%', label: 'إشراف وتحكم بشري مضمون' },
        { value: '4 ركائز', label: 'موحدة في Intelligence ERP' }
      ]
    },
    about: {
      eyebrow: 'عن Intelligence Agency',
      title: 'نبني العقل التشغيلي والتجاري للمؤسسات المعاصرة',
      description: 'تقدم Intelligence Agency حلول برمجيات سحابية (SaaS) متكاملة ومترابطة بعمق، صُممت لإلغاء تشتت البيانات، تمكين فرق العمل بأتمتة ذكية موثوقة، ومنح الإدارة التنفيذية رؤية شاملة.',
      ecosystemLabel: 'منظومة منتجات Intelligence Agency',
      ecosystem: [
        {
          id: 'sales',
          name: 'Intelligence Sales',
          tag: 'نظام التشغيل التجاري',
          description: 'إدارة علاقات العملاء B2B، مسارات الصفقات، محرك المتابعة التلقائي، ووكلاء مبيعات أذكياء.',
          active: true,
          color: 'from-brand-600 to-brand-400'
        },
        {
          id: 'logistique',
          name: 'Intelligence Logistique',
          tag: 'نظام إدارة الإمداد والنقل',
          description: 'إدارة المستودعات (WMS)، تتبع المخزون متعدد المواقع، وتوجيه أساطيل التوصيل الذكي.',
          active: false,
          color: 'from-blue-600 to-indigo-500'
        },
        {
          id: 'finance',
          name: 'Intelligence Finance',
          tag: 'نظام الخزينة والمحاسبة',
          description: 'الفوترة التلقائية، التنبؤ بالتدفقات النقدية، المطابقات البنكية، والامتثال المالي.',
          active: false,
          color: 'from-emerald-600 to-teal-500'
        },
        {
          id: 'rh',
          name: 'Intelligence RH',
          tag: 'نظام رأس المال البشري',
          description: 'إدارة الكفاءات والمواهب، الهياكل الإدارية، عمولات فرق المبيعات، ومسيرات الرواتب.',
          active: false,
          color: 'from-violet-600 to-purple-500'
        },
        {
          id: 'erp',
          name: 'Intelligence ERP',
          tag: 'النواة المؤسسية الموحدة',
          description: 'ربط المبيعات، المالية، اللوجستيك والموارد البشرية في منصة قيادية واحدة على مستوى الشركة.',
          active: false,
          isHub: true,
          color: 'from-amber-600 to-orange-500'
        }
      ]
    },
    challenge: {
      eyebrow: 'معضلة مبيعات الشركات B2B',
      title: 'البيانات التجارية مبعثرة.. والفرص تضيع في صمت',
      description: 'عندما تتوزع المحادثات الحاسمة مع العملاء بين رسائل الواتساب، علب البريد الشخصية، جداول الإكسيل والمفكرات الورقية، تتسرب الإيرادات دون أن تشعر الإدارة.',
      problems: [
        {
          title: 'سجلات عملاء متفرقة',
          desc: 'بيانات مشتتة بين الهواتف الشخصية للمناديب، مجموعات الواتساب، وملاحظات فردية غير موثقة.'
        },
        {
          title: 'متابعات منسية وصفقات متجمدة',
          desc: 'تبرد الصفقات ذات القيمة العالية بعد الاجتماع الأول مباشرة لغياب التذكير والتصعيد التلقائي.'
        },
        {
          title: 'غياب الرؤية للإدارة التنفيذية',
          desc: 'عجز الإدارة عن الإجابة الدقيقة على السؤال الحاسم: "ما الذي يحدث فعلياً في مبيعاتنا اليوم؟"'
        },
        {
          title: 'بطء تسليم العروض وإعادة الإدخال',
          desc: 'أيام تضيع في تجهيز عروض الأسعار يدوياً وإعادة إدخال الصفقات الرابحة في أنظمة المستودعات والمالية.'
        }
      ],
      resultTitle: 'التكلفة على نمو الشركة',
      results: [
        { label: 'خسارة إيرادات مؤكدة', desc: 'تضيع حتى 24% من صفقات المسار نتيجة التأخر في المتابعة المناسبة' },
        { label: 'استنزاف طاقة المبيعات', desc: 'أكثر من 60% من وقت المندوب يُهدر في الإدخال اليدوي للأوراق' },
        { label: 'احتكاك مع سلاسل الإمداد', desc: 'تصل معلومات الصفقات الرابحة إلى اللوجستيك والمالية متأخرة' },
        { label: 'ضياع العلاقات مع العميل', desc: 'يغادر تاريخ العلاقات التجارية للمؤسسة بمجرد استقالة المندوب' }
      ]
    },
    vision: {
      eyebrow: 'رؤيتنا الاستراتيجية',
      title: 'من قاعدة بيانات جهات اتصال جامدة إلى نظام تشغيل تجاري نشط',
      description: 'تتجاوز Intelligence Sales مفهوم الـ CRM التقليدي المقتصر على الأرشفة لتكون منصة استباقية تربط تنفيذ المبيعات، الذكاء الاصطناعي المستقل، والتنفيذ العملياتي للطلبات.',
      coreTitle: 'نواة نظام التشغيل التجاري',
      nodes: [
        'العملاء وقنوات الجذب',
        'مسار الصفقات والفرص',
        'عروض الأسعار والطلبات',
        'محرك المتابعة الذكي',
        'الأنشطة والاجتماعات',
        'وكلاء الذكاء الاصطناعي',
        'التحليلات القيادية'
      ]
    },
    modules: {
      eyebrow: 'وحدات المنصة الأساسية',
      title: 'إدارة متكاملة لكل مرحلة في الدورة التجارية',
      description: 'مبنية خصيصاً لمسارات مبيعات الشركات B2B: جذب العميل ← التأهيل ← الاستكشاف ← تقديم العرض ← التفاوض ← الفوز بالصفقة ← التنفيذ.',
      items: [
        {
          id: 'crm',
          title: 'إدارة العملاء والتقاط الفرص',
          desc: 'التقاط متعدد المصادر مع منع فوري للتكرار وإثراء فوري لبيانات الشركات والمسؤولين.',
          features: ['استقبال عملاء الموقع والنماذج', 'مزامنة سجلات الواتساب والمكالمات', 'إثراء آلي لبيانات المنشآت', 'هيكلية الحسابات وصنّاع القرار']
        },
        {
          id: 'pipeline',
          title: 'مسار الصفقات المرئي (Kanban)',
          desc: 'لوحات تفاعلية فورية مع احتساب احتمالية الإغلاق وتنبيهات ركود المراحل.',
          features: ['مراحل مسار قابلة للتخصيص الكامل', 'تقييم مالي مرجح للصفقات', 'إبراز فوري للصفقات المتوقفة', 'دعم العملات المتعددة']
        },
        {
          id: 'followup',
          title: 'محرك المتابعة الاستباقي',
          desc: 'مراقبة دائمة للخمول تضمن عدم نسيان أي عميل أو صفقة في أي وقت.',
          features: ['تنبيه خمول بعد 7 أيام', 'اقتراحات ذكاء اصطناعي لإعادة التواصل', 'إسناد آلي للمهام ذات الأولوية', 'إشعارات مباشرة لفريق المبيعات']
        },
        {
          id: 'quotes',
          title: 'عروض الأسعار وأوامر البيع',
          desc: 'تحويل الفرص الرابحة فوراً إلى عروض أسعار وأوامر بيع موجهة لأنظمة الإمداد والمالية.',
          features: ['إنشاء عروض أسعار سريعة بنقرة', 'بوابات اعتماد نسب الخصم', 'ترحيل مباشر إلى Intelligence Finance', 'توليد تلقائي لأوامر التوصيل للوجستيك']
        }
      ]
    },
    followUpFlow: {
      eyebrow: 'صفر تسريب للإيرادات',
      title: 'كيف ينقذ محرك المتابعة الصفقات المهددة بالضياع؟',
      description: 'تحمي Intelligence Sales مبيعاتك بنشاط وأمان عبر أتمتة خاضعة بالكامل للموافقة البشرية.',
      steps: [
        { num: '01', title: 'كشف الخمول التلقائي', text: 'ترصد المنصة مرور 7 أيام دون تسجيل مكالمة، اجتماع أو إيميل في صفقة نشطة.' },
        { num: '02', title: 'تحليل السياق بالذكاء الاصطناعي', text: 'يدرس وكيل المتابعة مسار الصفقة، طبيعة العميل، والاعتراضات السابقة.' },
        { num: '03', title: 'صياغة رسالة المتابعة', text: 'يقوم الوكيل بتجهيز مسودة رسالة شخصية دقيقة وتحديد موعد إنجاز المهمة.' },
        { num: '04', title: 'بوابة الموافقة البشرية', text: 'يراجع مسؤول المبيعات المسودة، يعدّلها إن رغب، ويعتمد الإرسال بنقرة واحدة.' },
        { num: '05', title: 'التوثيق وقياس الأثر', text: 'يتم الإرسال والتوثيق فوراً في النظام وتحديث مؤشرات سرعة إغلاق الصفقات.' }
      ]
    },
    aiAgents: {
      eyebrow: 'ذكاء متعدد الوكلاء',
      title: '7 وكلاء ذكاء اصطناعي متخصصين يعملون كفريق مبيعات متكامل',
      description: 'تم تدريب كل وكيل على تخصص بيعي دقيق، ويتم تنسيقهم مركزياً تحت إشراف وتحكم بشري مستمر.',
      orchestratorTitle: 'المنسّق التجاري العام (Orchestrator)',
      orchestratorDesc: 'تنسيق تدفق البيانات، ترتيب أولويات المهام، وضمان تطبيق شروط الأمان والصلاحيات.',
      agents: [
        {
          id: 'assistant',
          name: 'وكيل المساعد التجاري',
          category: 'المساعد اليومي للمندوب',
          mission: 'إعداد ملخصات تمهيدية قبل الاجتماعات، تلخيص المكالمات، واقتراح الخطوات التالية للصفقة.'
        },
        {
          id: 'lead',
          name: 'وكيل تأهيل العملاء المحتملين',
          category: 'تأهيل وتقييم الفرص',
          mission: 'تقييم مدى ملاءمة العميل، استخراج بيانات الشركات، وتحديد درجة الجدية دون ادعاءات غير مدعومة.'
        },
        {
          id: 'data',
          name: 'وكيل جودة بيانات CRM',
          category: 'تنقية وصحة البيانات',
          mission: 'إزالة التكرار، توحيد المسميات الوظيفية، تحديث العناوين المنتهية، وفحص سجلات الشركات.'
        },
        {
          id: 'followup',
          name: 'وكيل المتابعة والإنعاش',
          category: 'مكافحة ركود الصفقات',
          mission: 'مراقبة وتيرة المسار التجاري، رصد الحسابات المهملة، وصياغة مقترحات إعادة التواصل المناسبة.'
        },
        {
          id: 'analytics',
          name: 'وكيل تحليلات وتشخيص المبيعات',
          category: 'تشخيص أداء المسار',
          mission: 'تحديد نقاط الاختناق في المسار، تحليل أسباب خسارة الصفقات، وبناء توقعات واقعية للإيرادات.'
        },
        {
          id: 'document',
          name: 'وكيل الوثائق والمستندات',
          category: 'استخراج وثائق PDF والمناقصات',
          mission: 'تحليل دفاتر الشروط والمناقصات، واستخراج متطلبات المنتجات لتعبئة بنود عروض الأسعار.'
        },
        {
          id: 'automation',
          name: 'وكيل الأتمتة التشغيلية',
          category: 'تنفيذ تدفقات العمل',
          mission: 'إسناد المهام المعتمدة، تفعيل خطط استقبال العملاء الجدد، وتمرير أوامر البيع عند الفوز.'
        }
      ]
    },
    governance: {
      eyebrow: 'الحوكمة والأمان المؤسسي',
      title: 'أتمتة فائقة بالذكاء الاصطناعي تحت سيطرة وإشراف بشري كامل',
      description: 'صُممت Intelligence Sales للشركات والمؤسسات الكبرى حيث الخصوصية وحماية أسرار الأعمال أمر غير قابل للمساومة.',
      pillars: [
        {
          title: 'بوابة الإشراف البشري الإلزامي',
          desc: 'لا يستطيع أي وكيل ذكاء اصطناعي إرسال بريد خارجي للعميل أو تعديل مبالغ مالية دون موافقة بشرية صريحة.'
        },
        {
          title: 'عزل تام للبيانات (Multi-Tenancy)',
          desc: 'تشفير وعزل مشدد بين بيانات المؤسسات المختلفة لضمان بقاء الأسرار التجارية محمية بنسبة 100%.'
        },
        {
          title: 'صلاحيات دقيقة بحسب الدور (RBAC)',
          desc: 'مستويات صلاحيات مفصلة للمدير العام، مدير المبيعات، مسؤولي الحسابات، التسويق، والإدارة التنفيذية.'
        },
        {
          title: 'سجلات تتبع وتدقيق غير قابلة للتعديل',
          desc: 'توثيق تاريخي لكل تعديل على الصفقات، تغير المراحل، وتوصيات الذكاء الاصطناعي في سجل تدقيق محمي.'
        }
      ]
    },
    architecture: {
      eyebrow: 'الهيكلية التقنية المعتمدة',
      title: 'مبنية للتزامن الفوري، الكفاءة العالية، وقابلية التوسع للمؤسسات',
      description: 'بنية معمارية مفصولة ومثبتة تجمع بين سرعة الواجهات التفاعلية الحديثة وقوة الأنظمة المؤسسية الخلفية.',
      layers: [
        {
          tier: 'طبقة تجربة المستخدم (Client Layer)',
          tech: 'React 19 · Tailwind CSS v4 · Framer Motion',
          details: 'تفاعل فوري في أجزاء من الثانية لمسارات المبيعات، دعم كامل للوضع الفاتح والداكن وواجهات الهواتف.'
        },
        {
          tier: 'منطق الأعمال وخادم البيانات (REST API)',
          tech: 'Laravel REST API · PostgreSQL Multi-Tenant',
          details: 'أمان الحوكمة، عزل المؤسسات، خطافات الويب (Webhooks)، وضمان سلامة العمليات التجارية.'
        },
        {
          tier: 'خدمات الذكاء الاصطناعي والوثائق (Microservice)',
          tech: 'Python AI Layer · Multi-Agent Orchestration',
          details: 'نماذج لغوية متخصصة، محركات استخراج نصوص الوثائق، وتوقعات تحليلية في الوقت الفعلي.'
        }
      ]
    },
    analytics: {
      eyebrow: 'الذكاء والتحليل التنفيذي',
      title: 'إجابة واضحة على السؤال الإداري: "ما الذي يحدث في مبيعاتنا؟"',
      description: 'رؤية لحظية ومباشرة لمعدلات تحقيق الأهداف، ونسب تحويل الصفقات، وسرعة دوران الإيرادات.',
      metrics: [
        // { label: 'إجمالي قيمة الصفقات النشطة', value: '3.4M درهم', change: '+18.4% مقارنة بالشهر السابق' },
        { label: 'نسبة تحويل العملاء لفرص', value: '42.6%', change: '+6.1% تحسن في التأهيل' },
        { label: 'نسبة إغلاق الصفقات الرابحة', value: '31.8%', change: '+3.9% معدل الفوز' },
        { label: 'متوسط دورة إغلاق الصفقة', value: '19.4 يوماً', change: '-4.2 أيام أسرع' }
      ],
      funnel: [
        { stage: '1. عملاء محتملون جدد', count: '1,420 عميل', value: '12.4M درهم', width: '100%' },
        { stage: '2. صفقات مؤهلة', count: '605 مؤهل', value: '7.8M درهم', width: '78%' },
        { stage: '3. جلسات الاستكشاف والعرض', count: '310 قيد العرض', value: '4.9M درهم', width: '56%' },
        { stage: '4. تم إرسال عروض الأسعار', count: '185 عرض نشط', value: '3.4M درهم', width: '40%' },
        { stage: '5. مرحلة التفاوض النهائي', count: '74 قيد الإغلاق', value: '1.8M درهم', width: '28%' },
        { stage: '6. صفقات رابحة ومغلقة', count: '52 صفقة رابحة', value: '1.2M درهم', width: '18%' }
      ]
    },
    differentiation: {
      eyebrow: 'الميزة التنافسية',
      title: 'المسار التطوري لبرمجيات المبيعات الحديثة',
      description: 'معظم أنظمة الـ CRM تسجل ما حدث في الماضي فقط.. بينما تقود Intelligence Sales نمو المستقبل.',
      steps: [
        { stage: 'CRM التقليدي', desc: 'مجرد دفتر عناوين رقمي، وعبء إدخال بيانات يدوي ثقيل على المندوبين.' },
        { stage: 'Smart CRM', desc: 'تتبع أساسي لرسائل البريد والتقاط بسيط لنماذج المواقع.' },
        { stage: 'CRM مع شات ذكاء اصطناعي', desc: 'شريط محادثة سطحي مضاف فوق بنية برمجية قديمة دون تكامل عملياتي.' },
        { stage: 'منصة أتمتة بسيطة', desc: 'قواعد تشغيل ثابتة لمهام روتينية محدودة.' },
        { stage: 'نظام تشغيل تجاري كامل', desc: 'Intelligence Sales: بيانات موحدة، 7 وكلاء منسقين، محرك منع النسيان، وتكامل مع الـ ERP.', active: true }
      ]
    },
    targetCustomers: {
      eyebrow: 'العملاء المستهدفون',
      title: 'صُممت للمؤسسات التي تعتمد دورات بيعية منظمة ومتعددة المراحل',
      segments: [
        {
          title: 'الشركات الناشئة والصغيرة',
          scope: '1 إلى 15 عضواً في الفريق',
          desc: 'تحتاج إلى نظام بديهي ومرتب يستبدل الإكسيل ويضمن متابعة فورية لكافة الاستفسارات.'
        },
        {
          title: 'الشركات المتوسطة سريعة النمو',
          scope: '15 إلى 250 عضواً في الفريق',
          desc: 'تتطلب تحديد مستهدفات لكل مندوب، إدارة المناطق الجغرافية، عروض أسعار سريعة، وتحليلات تحويل دقيقة.'
        },
        {
          title: 'المؤسسات والشركات الكبرى B2B',
          scope: '250+ موظف ومندوب',
          desc: 'تحتاج لصلاحيات متقدمة، ربط وثيق مع المخازن والمالية، وحوكمة أمان وتدقيق صارمة.'
        },
        {
          title: 'وكالات وشركات المبيعات التجارية',
          scope: 'إدارة عملاء ومشاريع متعددة',
          desc: 'إدارة مسارات مبيعات مستقلة لعدة عملاء مع لوحة تحكم موحدة للإدارة التنفيذية.'
        }
      ]
    },
    roadmap: {
      eyebrow: 'خارطة طريق المنتج',
      title: 'مسار منهجي مدروس من إطلاق النسخة الأولى إلى التكامل التام مع ERP',
      phases: [
        {
          phase: 'V1 (MVP)',
          timeline: 'الأساس الحالي',
          scope: 'CRM أساسي + مسار الصفقات + لوحة القيادة',
          details: ['المصادقة والأمان متعدد المؤسسات', 'إدارة الشركات وجهات الاتصال', 'التقاط الفرص ومسار الصفقات المرئي', 'تتبع الأنشطة والمؤشرات الأساسية']
        },
        {
          phase: 'V1.5',
          timeline: 'الأشهر 2 إلى 4',
          scope: 'عروض الأسعار + الطلبات + محرك المتابعة',
          details: ['توليد عروض الأسعار وأوامر البيع', 'إدارة المستندات والمرفقات التعاقدية', 'مزامنة البريد والتقويم', 'أتمتة تنبيهات خمول الـ 7 أيام']
        },
        {
          phase: 'V2',
          timeline: 'الأشهر 5 إلى 8',
          scope: '7 وكلاء ذكاء اصطناعي + معالجة الوثائق',
          details: ['المساعد التجاري التمهيدي للمندوب', 'استخراج بنود دفاتر الشروط والمناقصات', 'تقييم ذكي وتنبؤي لفرص الشراء', 'وكيل التحليلات الاستراتيجية للمسار']
        },
        {
          phase: 'V3 و V4',
          timeline: 'الأشهر 9 إلى 16',
          scope: 'منظومة Intelligence ERP الكاملة',
          details: ['تكامل مباشر مع Intelligence Finance', 'تكامل مباشر مع Intelligence Logistique', 'تكامل مباشر مع Intelligence RH', 'الربط الشامل تحت مظلة Intelligence ERP']
        }
      ]
    },
    partnership: {
      eyebrow: 'فرصة الشراكة الاستراتيجية',
      title: 'شارك في بناء المستقبل مع Intelligence Agency',
      description: 'نختار بعناية مؤسسات B2B رائدة، خبراء في قطاع المبيعات، ومجموعات تجارية للانضمام لبرنامج الوصول المبكر والتشغيل التجريبي الاستراتيجي.',
      benefits: [
        'نشر تجريبي مبكر ومكيف بالكامل مع دورات المبيعات الخاصة بكم',
        'مشاركة مباشرة في توجيه وتدريب وكلاء الذكاء الاصطناعي وتحديد الأولويات',
        'ربط سلس وسريع مع أدواتكم التجارية ومصادر بياناتكم الحالية',
        'دعم فني واستشاري مخصص من مهندسي وخبراء المنصة'
      ],
      quote: 'صُممت بواسطة مهندسي برمجيات مؤسسية لتكون العقل التجاري ونظام التشغيل المعتمد لشركتك.',
      cta: 'طلب الوصول المبكر والشراكة'
    },
    ambition: {
      eyebrow: 'طموحنا التوسعي',
      titleBefore: 'أن نكون المنصة الرائدة في ',
      titleHighlight: 'أنظمة التشغيل التجارية B2B',
      journey: ['المغرب', 'شمال إفريقيا', 'المملكة المتحدة (UK)', 'أوروبا'],
      cta: 'انضم إلى الرؤية',
      footerRights: '© {year} Intelligence Agency. جميع الحقوق محفوظة.',
      footerTag: 'Intelligence ERP · Intelligence Sales · Intelligence Logistique · Intelligence Finance · Intelligence RH'
    }
  }
}

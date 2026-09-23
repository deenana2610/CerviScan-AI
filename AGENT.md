# AGENT.md — CerviScan-AI Engineering & Clinical AI Invariants

> **System Identity**: CerviScan-AI is a mission-critical, enterprise-grade AI-powered Cervical Cancer Screening & Clinical Decision Support System (CDSS) Dashboard.  
> **Repository Target**: `c:\Users\Lenovo\Desktop\CerviScan-AI`  
> **Audience**: Autonomous AI Agents (Claude, Cursor, GitHub Copilot, Gemini CLI) and Senior Full-Stack / Medical AI Engineers.

---

## 1. Executive Summary & Clinical Mission

CerviScan-AI exists to accelerate the **World Health Organization (WHO) 90-70-90 Cervical Cancer Elimination Target** and support the **Ministry of Health Malaysia (MOH/KKM)** national screening initiatives. It provides gynaecologists, oncologists, and district clinic medical officers with an intelligent colposcopic workstation featuring automated lesion risk stratification, acetowhite epithelium segmentation, Swede score computation, and structured histopathological reporting.

### Core Medical Tenet: "Doctor-in-the-Loop" Invariant
1. **Never Autonomous Diagnosis**: CerviScan-AI is strictly a **Class B/C Clinical Decision Support System (CDSS)** under Medical Device Authority (MDA) guidelines and IEC 62304 standards.
2. **Specialist Oversight Mandatory**: AI predictions (`confidenceScore`, `severity`, `swedeScore`, bounding boxes) are diagnostic hypotheses. Every clinical outcome, punch biopsy requisition, or discharge requires explicit, authenticated specialist sign-off.
3. **Non-Destructive Overrides**: Specialists must retain the ability to override, downgrade, or dispute any AI finding. Overrides are recorded in the tamper-evident audit trail with mandatory clinical justifications.

---

## 2. Technical Stack & Architectural Invariants

### 2.1 Technology Matrix
| Layer | Technology | Version / Spec | Invariants & Rules |
| :--- | :--- | :--- | :--- |
| **Runtime / Tooling** | Node.js / Bun | Node >= 20.x, Bun | Use standard ESM module semantics (`"type": "module"`). |
| **Frontend Core** | React | `^19.0.1` | Strictly use React 19 functional components and hooks. No legacy class components. No deprecated lifecycles. |
| **Build System** | Vite | `^8.3.0` | Ultra-fast HMR via `@vitejs/plugin-react` and `@tailwindcss/vite`. |
| **Styling** | Tailwind CSS | `^4.3.3` | **Tailwind v4 CSS-first configuration**. Do NOT create legacy `tailwind.config.js`. Use `@theme` directives in `src/index.css`. |
| **EHR Data Grid** | TanStack Table | `^8.20.6` | Client-side and server-side sorting, pagination, multi-attribute filtering, and column pinning. |
| **Data Visualization** | Recharts | `^3.10.1` | High-fidelity ROC curves, Swede histology correlations, and epidemiological volume distribution. |
| **Icons & Design** | Lucide React | `^0.546.0` | Uniform 16px/20px stroke icons. No raw SVGs when standard Lucide icons exist. |
| **Medical AI Model** | Google Gemini Vision | `@google/genai ^2.4.0` | Gemini 2.0 / 1.5 Pro multimodal vision for cervicographic lesion segmentation and Swede scoring. |
| **Database (Target)** | Supabase / PostgreSQL | Postgres 15+ | Multi-tenant RLS (Row-Level Security), UUIDv4 primary keys, AES-256 encrypted fields. |
| **Deployment** | Vercel SPA | Edge Rewrites | Clean single-page application routing via `vercel.json` rewrite rule to `/index.html`. |

### 2.2 Strict Architectural Rules for Agents
- **TypeScript Strictness**: Zero `any` policy. All entities must adhere to types defined in [src/types/patient.ts](file:///c:/Users/Lenovo/Desktop/CerviScan-AI/src/types/patient.ts). If an unknown type arises, create an explicit interface or union type.
- **Path Aliasing**: The project configures `@` pointing to the project root (`.` in `vite.config.ts`). Prefer clear relative paths within `src/` (e.g., `../../types/patient`) or `@/src/...` to maintain tooling compatibility.
- **Tailwind v4 Invariant**: Do NOT introduce PostCSS or `tailwind.config.js` files unless instructed. Tailwind v4 works directly through `@tailwindcss/vite` in [vite.config.ts](file:///c:/Users/Lenovo/Desktop/CerviScan-AI/vite.config.ts) and CSS imports in [src/index.css](file:///c:/Users/Lenovo/Desktop/CerviScan-AI/src/index.css).

---

## 3. Clinical Data Governance, Privacy & Security Rules

### 3.1 PII & PHI De-Identification (PDPA 2010 & HIPAA)
Any agent modifying UI views or exporting data must enforce **Privacy Mode** invariants:
1. **Malaysian MyKad IC Masking**: The Malaysian National Registration Identity Card (NRIC) follows `YYMMDD-PB-###G`. When Privacy Mode is enabled (`privacyMode === true`), ICs must be masked using [maskIC()](file:///c:/Users/Lenovo/Desktop/CerviScan-AI/src/lib/utils.ts#L35-L49) (e.g., `880315-10-5432` -> `8803**-**-5432`).
2. **Patient Full Name Masking**: Patient names must be masked using [maskName()](file:///c:/Users/Lenovo/Desktop/CerviScan-AI/src/lib/utils.ts#L20-L29) (e.g., `Nurul Aisyah binti Razak` -> `N**** A***** b**** R****`).
3. **No Unencrypted PHI in Network Logs**: Patient identifiers, phone numbers, and email addresses must never be serialized into unencrypted client-side console logs or query parameters.
4. **Zero Client-Side API Keys**: Never hardcode `GEMINI_API_KEY`, Supabase `service_role` keys, or secret tokens into client source code. API keys must only be loaded via Vite environment variables (`import.meta.env.VITE_*`) or processed through backend proxy edge functions.

### 3.2 Immutable Audit Trail Requirement
Every clinical action that impacts patient diagnosis, risk categorization, or data privacy must produce an `AuditLogEntry`:
```typescript
interface AuditLogEntry {
  id: string; // e.g. "LOG-1727065000000"
  timestamp: string; // ISO or localized MYT ("en-MY", Asia/Kuala_Lumpur)
  doctorName: string; // Doctor performing the sign-off
  patientId: string; // Patient record reference (e.g. "PAT-2026-8841")
  patientName: string; // Patient name (masked if Privacy Mode active)
  action: 'VALIDATION_CONFIRMED' | 'DIAGNOSIS_OVERRIDDEN' | 'BIOPSY_ORDERED' | 'REPORT_EXPORTED' | 'PRIVACY_MODE_TOGGLED';
  details: string; // Clinical justification and summary of change
  previousStatus?: string;
  newStatus?: string;
}
```
**Agent Rule**: When adding features that alter clinical status, always append to the `auditLogs` state array or database table simultaneously.

---

## 4. UI/UX & Clinical Workspace Design System

CerviScan-AI operates in bright clinical suites and low-light colposcopy examination rooms. The UI follows an **enterprise healthcare design system**:

### 4.1 Color Palette & Semantics
- **Backgrounds**: Deep clinical slate (`bg-slate-900`, `bg-slate-950`) for image viewer workspaces to maximize visual contrast; clean neutral slate (`bg-slate-50`, `bg-white`) for tabular records and dashboards.
- **Primary Brand / Action**: Cyan / Teal (`from-cyan-500 to-teal-600`, `text-cyan-400`, `border-cyan-500/30`).
- **Clinical Severity Semantics**:
  - `HIGH_RISK` / `HSIL / CIN2+`: Rose / Crimson (`bg-rose-50`, `text-rose-700`, `border-rose-200`, `badge: bg-rose-500`).
  - `MODERATE_RISK` / `LSIL / CIN1`: Amber / Warning (`bg-amber-50`, `text-amber-700`, `border-amber-200`, `badge: bg-amber-500`).
  - `LOW_RISK` / `NILM / Normal`: Emerald / Teal (`bg-emerald-50`, `text-emerald-700`, `border-emerald-200`, `badge: bg-emerald-500`).
  - `PENDING`: Sky / Slate (`bg-sky-50`, `text-sky-700`, `border-sky-200`).

### 4.2 Colposcopy Workspace Interactions
When editing [ScanViewerWorkspace.tsx](file:///c:/Users/Lenovo/Desktop/CerviScan-AI/src/components/viewer/ScanViewerWorkspace.tsx):
1. **Interactive View Modes**: Maintain support for:
   - `overlay`: Original cervicography image + SVG lesion bounding box overlay + heatmap translucency slider (0-100%).
   - `original`: Raw optical colposcopy photograph without annotations.
   - `heatmap_only`: AI activation density map.
   - `split`: Side-by-side comparative inspection.
2. **Optical Filter Emulation**: Support clinical optical filters:
   - `white_light`: Standard broadband illumination.
   - `green_filter` (Red-Free): Enhances vascular contrast to detect coarse punctation and atypical mosaicism.
   - `lugol_iodine` (Schiller Test): Highlights glycogen-depleted precancerous epithelium (iodine-negative mustard yellow vs. normal mahogany brown).
3. **Canvas / SVG Bounding Boxes**: Bounding box coordinates must be stored as normalized percentages (`0% - 100%`) across `x`, `y`, `width`, `height` so they remain responsive across mobile, tablet, and 4K surgical monitors.

---

## 5. Domain Terminology & Clinical Acronym Glossary

Ensure precise usage of terminology in code comments, types, and UI strings:

| Term / Acronym | Definition & Medical Context |
| :--- | :--- |
| **SCJ** | **Squamocolumnar Junction**: The physiological boundary between squamous and columnar epithelium where >90% of precancerous cervical neoplasia arises. |
| **TZ** | **Transformation Zone**: Dynamic area of metaplasia. Graded as **Type 1** (completely ectocervical), **Type 2** (endocervical component fully visible), or **Type 3** (endocervical component cannot be visualized). |
| **Swede Score** | Modern 10-point colposcopic scoring system evaluating: (1) Acetowhiteness, (2) Margins/Surface, (3) Vessels, (4) Lesion Size, and (5) Iodine Staining. A score $\ge 5$ indicates high suspicion of CIN2+; score $\ge 8$ has near 100% specificity. |
| **CIN** | **Cervical Intraepithelial Neoplasia**: Precursor lesions classified into CIN1 (mild dysplasia), CIN2 (moderate dysplasia), and CIN3 (severe dysplasia / carcinoma in situ). |
| **SIL** | **Squamous Intraepithelial Lesion** (Bethesda System): **LSIL** (Low-Grade) corresponds to CIN1; **HSIL** (High-Grade) corresponds to CIN2/CIN3. |
| **NILM** | **Negative for Intraepithelial Lesion or Malignancy** (Normal cytology). |
| **LEEP / LLETZ** | **Loop Electrosurgical Excision Procedure** / Large Loop Excision of the Transformation Zone: Curative surgical excision of abnormal cervical tissue. |
| **HPV 16 / 18** | High-risk oncogenic Human Papillomavirus genotypes responsible for over 70% of invasive cervical carcinoma cases globally. |

---

## 6. Development Workflow & Git Standards

### 6.1 Branch Naming Conventions
- Feature development: `feat/viewer-swede-score-calculator`
- Bug fixes: `fix/patient-table-pagination-overflow`
- Documentation & FYP: `docs/system-architecture-spec`
- Refactoring: `refactor/tanstack-column-definitions`
- Performance tuning: `perf/canvas-heatmap-render`

### 6.2 Conventional Commits Format
Every commit message must follow the Conventional Commits specification:
```text
<type>(<scope>): <short imperative summary>

[optional body explaining clinical or architectural reasoning]

[optional footer: BREAKING CHANGE or closes issue]
```
*Examples:*
- `feat(viewer): add green-filter red-free colposcopy shader`
- `fix(privacy): ensure MyKad IC masking applies during PDF export`
- `docs(fyp): update Supabase DDL schema with RLS policies`

### 6.3 Pre-Push Quality Checklist
Before completing any task or pushing to origin:
1. `npm run lint` (runs `tsc --noEmit`) — Zero type errors allowed.
2. `npm run build` (runs `vite build`) — Production bundle must build cleanly with no broken imports or missing assets.
3. Verify Privacy Mode toggle works in both Table and Viewer views.
4. Verify responsive design on mobile (375px), tablet (768px), and desktop (1280px+).

---

## 7. AI Agent Operational Boundaries

### Permitted Autonomous Actions
- Adding typed utility functions in `src/lib/utils.ts`.
- Creating reusable UI components conforming to Tailwind v4 and Lucide React.
- Expanding mock data in `src/lib/mock-data.ts` to test edge cases (e.g. pregnant patients, postmenopausal stenosis, rare HPV strains).
- Updating documentation, architecture blueprints, and test suites.

### Restricted Actions (Require Architect / User Confirmation)
- Modifying core dependencies in `package.json` (e.g., swapping React 19 for React 18 or removing Tailwind v4).
- Removing or bypassing Privacy Mode PII masking logic.
- Disabling TypeScript strict mode in `tsconfig.json`.
- Introducing destructive database operations without migration scripts and rollback plans.

---

*Document Certified for CerviScan-AI Engineering Team • Version 1.0.0 • Maintained under MOH/KKM Clinical Informatics Guidelines*

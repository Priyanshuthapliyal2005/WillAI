# WillAI - Will Creation Flow

A comprehensive 7-step wizard system for creating legally structured will documents with professional formatting and multi-language support.

---

## Overview

The Will Creation Flow orchestrates the complete user journey from initial landing page interaction to final document generation and download. The system handles data persistence, validation, and document generation through a structured multi-step process.

---

## Architecture

### Core Components
- **WillFormWizard** (`components/will-form-wizard.tsx`): Main orchestrator managing navigation, data persistence, and form state across all steps.
- **Step Routing** (`app/dashboard/[step]/page.tsx`): Dynamic route handler with authentication and step validation.
- **Will Preview** (`components/will-preview.tsx`): Final document viewing with PDF generation, printing, and translation capabilities.

### 7-Step Process
1. **Testator Information** – Personal details and contact information
2. **Beneficiaries** – People/organizations who will inherit assets
3. **Assets** – Bank accounts, insurance, stocks, property, and valuables
4. **Executors** – Estate managers and alternates
5. **Witnesses** – Legal witnesses for document signing
6. **Review** – Final review and document generation trigger
7. **Preview** – Document viewing with download/print/share options

---

## Key Features

### Data Persistence
- Automatic saving as users progress through steps
- Three save strategies: save-and-continue, save-only, and save-for-generation

### Document Generation
- Template-based HTML generation for English documents
- AI-powered translation for 13+ languages
- Professional legal formatting with proper document structure

### Multi-language Support
Languages supported include: Spanish, French, German, Italian, Portuguese, Dutch, Russian, Chinese, Japanese, Korean, Arabic, and Hindi (via AI translation services).

---

## Getting Started

### Entry Points
- Users can start the will creation process from multiple entry points on the landing page. The system automatically handles authentication and redirects to the appropriate step.

### Creating a New Will
1. Navigate to `/dashboard/create` to create a new will record.
2. Redirects to step 1 with the new will ID.
3. Progress through the 7-step wizard with automatic data persistence.

---

## API Endpoints
- `POST /api/saveUserInput` – Saves form data at each step
- `POST /api/generateWill` – Generates will document from collected data
- `GET /api/will/[willId]` – Retrieves existing will data

---

## Error Handling
The system implements comprehensive error handling including:
- Save operation failures with user feedback
- Document generation errors with fallback options
- AI translation service failures with English fallback

---

## Document Output
Generated wills include:
- Legal declaration and revocation clauses
- Comprehensive beneficiary tables
- Detailed asset distributions (movable, physical, immovable)
- Executor and witness information
- Professional formatting suitable for legal use

---

## Notes
The Will Creation Flow is tightly integrated with the Will Generation Service for document creation and uses React Query for efficient data fetching and caching. The system supports both new will creation and editing of existing wills, with proper step validation and user authentication throughout the process.

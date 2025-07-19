# WillAI - AI-Powered Will Generation Platform

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748)](https://www.prisma.io/)

## Table of Contents
- [Why WillAI Was Made](#why-willai-was-made)
- [What WillAI Can Do](#what-willai-can-do)
- [Problems WillAI Solves](#problems-willai-solves)
- [How It Works](#how-it-works)
- [Architecture Overview](#architecture-overview)
- [Design Patterns](#design-patterns-implementation)
- [Technology Stack](#technology-stack-deep-dive)
- [Database Schema](#database-schema-details)
- [Security Implementation](#security-implementation)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Contributing](#contributing-guidelines)
- [License](#license)

## Why WillAI Was Made

WillAI was created to democratize access to legal will creation by providing an intuitive, step-by-step platform that guides users through the complex process of creating legally structured will documents. The platform addresses the common barriers people face when creating wills: legal complexity, high costs, and language barriers.

## What WillAI Can Do

### Core Features
- **Step-by-Step Will Builder**: Guided legal document creation with clear, simple questions
- **Comprehensive Asset Management**: Handle bank accounts, insurance policies, stocks, mutual funds, jewelry, and immovable assets
- **Multilingual Support**: Generate wills in multiple languages using AI translation
- **Executor and Witness Management**: Complete setup for will execution requirements
- **Auto-Save Functionality**: Incremental saving throughout the creation process
- **PDF Generation**: Professional document output with print capabilities
- **Secure Deletion**: OTP-based secure will deletion system

### 7-Step Will Creation Process
1. **Testator Information**: Personal details and contact information
2. **Beneficiaries**: Define who inherits your assets
3. **Assets**: Catalog property, accounts, and valuables
4. **Executors**: Select estate managers and alternates
5. **Witnesses**: Add legal witnesses for document signing
6. **Review**: Final review and document generation
7. **Preview**: Document viewing, download, and sharing

## Problems WillAI Solves

1. **Legal Complexity**: Simplifies will creation with guided workflows and professional formatting
2. **Cost Barriers**: Provides accessible will generation tools without expensive legal fees
3. **Language Accessibility**: Supports multiple languages for diverse user bases
4. **Document Management**: Centralized platform for managing will drafts and revisions
5. **Legal Compliance**: Ensures proper structure and witness requirements
6. **Asset Organization**: Systematic approach to cataloging all types of assets

## How It Works

### User Journey Flow

```mermaid
flowchart TD
    Landing["Landing Page"] --> Auth["Authentication"]
    Auth --> Dashboard["Dashboard"]
    Dashboard --> Create["Create New Will"]
    Create --> Step1["Step 1: Testator Info"]
    
    Step1 --> Step2["Step 2: Beneficiaries"]
    Step2 --> Step3["Step 3: Assets"]
    Step3 --> Step4["Step 4: Executors"]
    Step4 --> Step5["Step 5: Witnesses"]
    Step5 --> Step6["Step 6: Review"]
    Step6 --> Generate["Generate Will"]
    Generate --> Step7["Step 7: Preview"]
    
    Step7 --> Download["Download PDF"]
    Step7 --> Print["Print Document"]
    Step7 --> Translate["AI Translation"]
```

## Architecture Overview

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI["Next.js React Components"]
        WillWizard["WillFormWizard"]
        WillPreview["WillPreview"]
        WillDocument["WillDocument"]
    end
    
    subgraph "API Layer"
        SaveAPI["/api/saveUserInput"]
        GenAPI["/api/generateWill"]
        WillAPI["/api/wills/[willId]"]
        DeleteAPI["/api/deleteWill"]
    end
    
    subgraph "Business Logic"
        WillGenerator["generateWillHTML()"]
        GeminiService["AI Translation Service"]
        AuthService["NextAuth Authentication"]
        OTPService["OTP Generation/Validation"]
    end
    
    subgraph "Data Layer"
        Prisma["Prisma ORM"]
        PostgreSQL[("PostgreSQL Database")]
    end
    
    UI --> SaveAPI
    UI --> GenAPI
    UI --> WillAPI
    UI --> DeleteAPI
    
    SaveAPI --> Prisma
    GenAPI --> WillGenerator
    GenAPI --> GeminiService
    WillAPI --> Prisma
    DeleteAPI --> OTPService
    
    WillGenerator --> Prisma
    GeminiService --> Prisma
    AuthService --> Prisma
    OTPService --> Prisma
    Prisma --> PostgreSQL
```

### Architecture Components

#### Frontend Layer Components

**WillFormWizard**
- Central orchestrator for the 7-step will creation process
- Manages navigation, data persistence, and form state
- Integrates with React Query for server state management

**WillPreview**
- Document preview component with real-time translation capabilities
- Handles PDF generation, printing, and sharing functionality
- Manages language selection and AI-powered translation

**WillDocument**
- HTML rendering component for displaying generated will documents
- Uses secure HTML rendering for document display
- Handles document formatting and styling

#### API Layer Endpoints

**Generate Will Endpoint** (`/api/generateWill`)
- Handles document generation from form data
- Implements language routing for English templates vs AI translation
- Comprehensive error handling with specific error codes

**Save User Input Endpoint** (`/api/saveUserInput`)
- Incremental saving with upsert operations
- Session validation and user authorization
- Handles complex data relationships between entities

**Will-Specific Operations** (`/api/wills/[willId]`)
- CRUD operations for individual will records
- Ownership verification before data modifications
- Comprehensive data fetching with related entities

#### Business Logic Layer

**HTML Generation Engine**
- Template-based HTML generation with utility functions
- Currency formatting in Indian Rupee format
- Structured document sections with legal formatting

**Data Access Layer**
- Global singleton pattern for Prisma client instantiation
- Development environment optimization with global caching
- PostgreSQL database provider configuration

## Design Patterns Implementation

### 1. **Repository Pattern**
- Prisma ORM acts as the data access layer abstraction
- Clean separation between business logic and database operations
- Consistent error handling across all data operations

### 2. **Factory Pattern**
- `generateWillHTML()` function acts as a document factory
- Creates different document sections based on input data structure
- Standardized output format regardless of input variations

### 3. **Strategy Pattern**
- Language-specific generation strategies (English template vs AI translation)
- Different asset handling strategies for various asset types
- Error handling strategies based on error types

### 4. **Observer Pattern**
- React Query for state management and cache invalidation
- Real-time updates across components when data changes
- Mutation observers for form state synchronization

### 5. **Command Pattern**
- API route handlers as command objects
- Encapsulated request processing with validation and error handling
- Transaction-based operations for data consistency

### 6. **Singleton Pattern**
- Prisma client instantiation
- Global state management for authentication sessions
- Single instance of query client for React Query

## Technology Stack Deep Dive

### Frontend Technologies

**Next.js 14 with App Router**
- Server-side rendering for SEO optimization
- API routes for backend functionality
- File-based routing system with dynamic routes
- Built-in optimization for images and fonts

**React with TypeScript**
- Type safety for component props and state management
- Interface definitions for data structures
- Enhanced developer experience with IntelliSense

**TanStack Query (React Query)**
- Server state management with caching
- Optimistic updates and background refetching
- Mutation handling for data modifications

**Tailwind CSS**
- Utility-first CSS framework
- Responsive design capabilities
- Custom component styling

### Backend Technologies

**NextAuth.js**
- Authentication provider integration
- Session management with JWT tokens
- OAuth provider support (Google, GitHub, etc.)

**Prisma ORM**
- Type-safe database client generation
- Database schema management and migrations
- Query optimization and connection pooling

**PostgreSQL**
- Relational database with ACID compliance
- JSON support for complex data structures
- Full-text search capabilities

### AI Integration

**Google Gemini API**
- Large language model for document translation
- Context-aware translation maintaining legal terminology
- Rate limiting and error handling implementation

## Database Schema Details

### Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Will : "creates"
    User ||--o{ Account : "has"
    User ||--o{ Session : "has"
    
    Will ||--o| Testator : "has"
    Will ||--o{ Beneficiary : "includes"
    Will ||--o{ BankAccount : "contains"
    Will ||--o{ InsurancePolicy : "contains"
    Will ||--o{ Stock : "contains"
    Will ||--o{ MutualFund : "contains"
    Will ||--o{ Jewellery : "contains"
    Will ||--o{ ImmovableAsset : "contains"
    Will ||--o{ Executor : "appoints"
    Will ||--o{ Witness : "requires"
    Will ||--o| DeleteOTP : "secures"
    
    User {
        string id PK
        string email UK
        string name
        datetime createdAt
        datetime updatedAt
    }
    
    Will {
        string id PK
        string userId FK
        string title
        enum status
        int currentStep
        datetime createdAt
        datetime updatedAt
        string generatedHtml
        datetime generatedAt
        string guardianName
        string guardianRelation
        string guardianAddress
        string guardianPhone
        string specialInstructions
        boolean liabilityCleared
    }
    
    Testator {
        string id PK
        string willId FK
        string fullName
        int age
        string occupation
        string address
        string idNumber
    }
    
    Beneficiary {
        string id PK
        string willId FK
        string name
        string relation
        string idNumber
        string address
        int age
        float percentage
    }
    
    BankAccount {
        string id PK
        string willId FK
        string bankName
        string accountNumber
        string accountType
        string branch
        string beneficiaryId
        string sharePercentage
    }
    
    InsurancePolicy {
        string id PK
        string willId FK
        string policyNumber
        string company
        string policyType
        float sumAssured
        string beneficiaryId
        string sharePercentage
    }
    
    Executor {
        string id PK
        string willId FK
        string name
        string relation
        string address
        string phone
        string email
        boolean isPrimary
    }
    
    Witness {
        string id PK
        string willId FK
        string name
        string address
        string phone
        string occupation
        string idNumber
    }
    
    DeleteOTP {
        string id PK
        string willId FK
        string otp
        datetime expiresAt
        boolean used
    }
```

## Security Implementation

### Authentication & Authorization
- Session-based authentication with NextAuth.js
- User-specific data access controls
- Resource ownership verification before operations
- JWT token validation for API requests

### Data Protection
- OTP-based secure deletion mechanism with time expiration
- Input validation and sanitization on all endpoints
- SQL injection prevention through Prisma ORM
- Password hashing for secure credential storage

### Error Handling
- Structured error responses with specific error codes
- Comprehensive logging for debugging without exposing sensitive information
- Graceful degradation for AI service failures
- Rate limiting on API endpoints

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database (local or cloud)
- Google Gemini API key (for multilingual support)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Priyanshuthapliyal2005/WillAI.git
   cd WillAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/willai_db"
   
   # NextAuth
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Gemini AI API
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # (Optional) Seed database
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Deployment

#### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## API Documentation

### Authentication Endpoints
- `GET /api/auth/session` - Get current user session
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out user

### Will Management Endpoints
- `GET /api/wills` - Get user's wills
- `POST /api/wills` - Create new will
- `GET /api/wills/[willId]` - Get specific will
- `PUT /api/wills/[willId]` - Update will
- `DELETE /api/wills/[willId]` - Delete will (requires OTP)

### Will Generation Endpoints
- `POST /api/saveUserInput` - Save will form data
- `POST /api/generateWill` - Generate will HTML
- `POST /api/generateOTP` - Generate deletion OTP
- `POST /api/verifyOTP` - Verify deletion OTP

### Translation Endpoint
- `POST /api/translate` - Translate will to different languages

## Contributing Guidelines

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write or update tests
5. Ensure code passes linting (`npm run lint`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Standards
- Use TypeScript for type safety
- Follow ESLint configuration
- Write meaningful commit messages
- Add JSDoc comments for functions
- Include unit tests for new features

### Testing
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Roadmap

### Version 2.0 (Planned)
- [ ] Multi-language UI support
- [ ] Digital signatures integration
- [ ] Legal review marketplace
- [ ] Mobile application
- [ ] Advanced asset types (crypto, NFTs)
- [ ] Collaborative will editing
- [ ] Legal compliance checking

### Version 1.1 (In Progress)
- [ ] Email notifications
- [ ] Will templates library
- [ ] Improved PDF styling
- [ ] Backup and restore functionality

## Support

### Documentation
- [API Reference](./docs/api.md)
- [Database Schema](./docs/schema.md)
- [Deployment Guide](./docs/deployment.md)

### Community
- [GitHub Discussions](https://github.com/Priyanshuthapliyal2005/WillAI/discussions)
- [Issues and Bug Reports](https://github.com/Priyanshuthapliyal2005/WillAI/issues)

### Contact
- Email: support@willai.com
- LinkedIn: [Priyanshu Thapliyal](https://linkedin.com/in/priyanshuthapliyal)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- NextAuth.js team for authentication solutions
- Prisma team for the excellent ORM
- Google for Gemini AI API
- Vercel for hosting and deployment platform
- All contributors who have helped shape this project

---

**Disclaimer**: WillAI provides tools to create will documents but is not a substitute for professional legal advice. Always consult with a qualified attorney for legal matters regarding estate planning and will creation.

 # AI Assistance Log — Cosmic Watch

This document outlines how AI tools were used during the development of Cosmic Watch. AI was used as a productivity and research assistant; all architectural decisions, implementation logic, and final validations were carried out independently.

## Project Planning

AI was used during the early planning stage to help structure the overall direction of the project. It assisted in:

- Refining the project idea into a practical full-stack application
- Breaking the system into clear layers (Frontend, Backend, Database, External API)
- Suggesting a scalable folder structure
- Identifying features suitable for a hackathon timeline
- Organizing documentation in a professional format

The final scope, feature prioritization, and architecture were decided manually after evaluating technical feasibility and time constraints.

## Risk Level Parameters & Calculations

AI was consulted to better understand how asteroid data could be translated into simplified risk insights. It helped in:

- Identifying meaningful parameters (diameter, velocity, miss distance, hazard flag)
- Suggesting possible weighting strategies
- Reviewing the clarity of threshold categories (Low, Moderate, High)
- Checking for logical inconsistencies in scoring design

The actual risk scoring logic was:

- Designed and tuned manually
- Implemented directly in backend code
- Tested against sample data for stability and interpretability

AI provided guidance, but the final formula and classification system were independently defined and validated.

## Determining Development Standards

AI was used to cross-check industry best practices and confirm implementation standards, including:

- Secure authentication practices (bcrypt hashing, JWT handling)
- RESTful API design conventions
- Folder organization for Next.js and Express
- Database schema structuring
- Error-handling patterns
- Documentation formatting standards

All suggested practices were reviewed before implementation. No architectural decision was adopted without understanding its purpose and impact.

## Debugging & Error Resolution

AI acted as a debugging assistant during development. It helped by:

- Interpreting error messages
- Suggesting likely causes for runtime failures
- Assisting with CORS configuration troubleshooting
- Identifying authentication token issues
- Helping resolve Docker setup conflicts
- Clarifying TypeScript typing errors

Each issue was:

- Investigated manually
- Tested after applying fixes
- Validated for long-term stability

AI suggestions were treated as guidance, not final authority.

## Deployment Guidance

AI provided general guidance on deployment strategy and environment setup. It assisted in:

- Structuring Docker and `docker-compose` configuration
- Explaining container networking between frontend, backend, and database
- Identifying environment variable best practices
- Suggesting production build commands
- Reviewing common deployment pitfalls

The final deployment configuration was:

- Manually written and adjusted
- Tested locally using containerized services
- Verified for correct service communication

AI was used to improve clarity and reduce setup friction, while full deployment validation was performed independently.

## Responsible Use Statement

AI was used as a development assistant to:

- Improve planning clarity
- Validate logical reasoning
- Support debugging
- Strengthen documentation quality
- Guide deployment setup

All implementation, configuration, and architectural decisions were made with full understanding of the system.
Cosmic Watch represents deliberate engineering work supported by AI-assisted productivity, not automated code generation.
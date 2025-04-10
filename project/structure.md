# Project Structure

```
.
├── .env                 # Environment variables (e.g., database URL, API keys)
├── .gitignore           # Specifies intentionally untracked files that Git should ignore
├── README.md            # Project overview
├── bun.lock             # Bun lockfile
├── index.ts             # Main application entry point
├── node_modules/        # Project dependencies
├── package.json         # Node.js project metadata and dependencies
├── prisma/
│   └── schema.prisma    # Prisma schema definition (database models)
├── project/             # Project documentation
│   ├── history.md       # Changelog of modifications
│   ├── structure.md     # Description of file and folder structure
│   ├── tech.md          # List of technologies used
│   └── requests.md      # Record of user requests and AI responses
└── tsconfig.json        # TypeScript configuration
```

## Functionality

*   **prisma/schema.prisma**: Defines the database schema using Prisma.
*   **index.ts**: The starting point for the application.
*   **project/**: Contains documentation related to the project's history, structure, technology stack, and user interactions.

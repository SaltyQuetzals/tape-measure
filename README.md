# Tape Measure
- A proof-of-concept for an operations dashboard.

## Resources Used
- [Cursor](https://www.cursor.com/) for:
    - code review (reducing repetition, small refactors)
    - syntactical questions around Tailscale styling
    - Auto-generating scaffolding for Next.js route handling
    - Database seeding script
- [shadcn](https://ui.shadcn.com/) for:
    - [Initial dashboard scaffolding](https://ui.shadcn.com/blocks#dashboard-01)
- [Recharts](https://recharts.org/en-US) for

## Running Locally
1. This project requires `pnpm` to run properly. You can install it [here](https://pnpm.io/installation).
2. Once `pnpm` is installed, you'll need to go ahead and acquire the `conversations` directory. The directory structure should look like this:
```
tape-measure/
    // ... other files/folders
    src/
        // ...
    conversations/
        calls/
            // ...
        texts/
            // ...
```
3. Go ahead and run `pnpm install` to install all dependencies
4. Once dependencies are installed, you'll need to run some functions to populate the database:
    1. `npm run db:push` will push schema changes to a local SQLite database that will live in the root directory of the project.
        1. When asked for confirmation, say yes.
    2. `npm run db:seed` will populate the newly-created database with the data in the `conversations` directory. **If for whatever reason you need to re-create the database, delete the SQLite file, and run these two steps again.**
5. Run `npm run dev` to actually start the development server. It should boot up!
6. Navigate to http://127.0.0.1:3000/dashboard to view the operations dashboard.

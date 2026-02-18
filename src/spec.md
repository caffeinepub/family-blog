# Specification

## Summary
**Goal:** Create a simple family blog with Internet Identity sign-in, persistent post CRUD, and a cohesive themed UI with generated branding images.

**Planned changes:**
- Add Internet Identity sign-in/out and display signed-in principal; disable create/edit when signed out.
- Implement a single Motoko backend actor with stable-storage persistence for posts (id, title, content, author principal, createdAt, updatedAt) and CRUD APIs.
- Enforce authorization so only the original author can update/delete their posts; return clear success/error results for invalid ids/unauthorized actions.
- Build blog UI pages: posts feed (newest first), post detail, and post editor (create/edit) using React Query for fetching, caching, and invalidation after mutations.
- Apply a consistent creative visual theme (non blue/purple primary palette) across all pages/components, responsive on mobile/desktop.
- Add and reference generated static branding assets from `frontend/public/assets/generated` and render them in the header/landing area without layout shift.

**User-visible outcome:** Family members can sign in with Internet Identity, browse posts, view details, and (when signed in) create posts; authors can edit/delete their own posts, with a cohesive themed UI and visible blog branding.

# Specification

## Summary
**Goal:** Make a photo mandatory for every blog post across backend validation and frontend editor/display.

**Planned changes:**
- Update the backend Post data model to include required photo bytes and photo content type, and update Candid/TS bindings accordingly.
- Enforce backend validation so create/update reject requests when the photo is missing or empty, without changing existing authorization rules.
- Update the post editor (create and edit) UI to require a photo, show clear English validation errors, and preview the selected image before saving.
- Update the posts feed cards and post detail page to render the post photo, with a safe fallback UI if an older/unexpected post lacks a photo.

**User-visible outcome:** Users must add a photo to publish or update a post, and readers will see a photo displayed on post cards and post detail pages.

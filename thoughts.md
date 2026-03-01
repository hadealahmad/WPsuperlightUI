# Project Thoughts: Superlight Shadcn-style WP Wrapper

## Core Vision
Build a minimalist, high-performance, RTL-first headless WordPress frontend using only Vanilla JS, CSS, and HTML. The design should mimic the Shadcn UI aesthetic: clean typography, subtle borders, and a sophisticated color palette.

## Key Features
- **Zero Dependencies**: Pure Vanilla JS, no React, no Tailwind (recreating styles from scratch).
- **RTL Native**: Designed with Arabic/Hebrew support from the ground up using logical CSS properties.
- **WordPress Integration**: Dynamic content fetching via fetch API.
- **Client-Side Routing**: Simple hash-based router for single-page feel on GitHub Pages.
- **SEO Ready**: Semantic HTML5 structure.

## Technical Choices
1. **Styling**: 
    - Use CSS Variables for the "Shadcn" theme (background, foreground, primary, border, etc.).
    - System fonts with Inter fallback.
    - Tailwind-like utility classes (atomic CSS) but manually defined to keep the file size tiny.
2. **State Management**:
    - Browser `History API` or `Location.hash`.
    - Simple `postStore` to avoid re-fetching posts when navigating back to archive.
3. **Template System**:
    - JavaScript template literals for rendering.
    - `innerHTML` or `createElement` approach for performance.
4. **WP API Strategy**:
    - Use `_embed` to get featured images and author data in one request.
    - Handle pagination for archive pages.
    - Support Custom Post Types (CPT) via endpoint configuration.

## Proposed Public API for Testing
- hadealahmad (`https://hadealahmad.com/wp-json/wp/v2/posts`)
- WP-Org News or a dedicated Dev site.

## Advanced Features Strategy
### 1. Minimal "No Images" Mode
- Purpose: Extremely fast loading, text-focused, high information density.
- Implementation: A global UI toggle (saved in localStorage).
- Archive View: Cards will show category-specific icons instead of featured images.
- Single View: Images remain visible to maintain content integrity.

### 2. Taxonomy & Custom Post Types (CPT)
- URL Structure:
  - `#/post/ID`: Single post.
  - `#/category/ID`: Category archive.
  - `#/tag/ID`: Tag archive.
  - `#/type/CPT_SLUG`: Custom post type list.
- Fetch Logic: Update `fetchPosts` to accept an options object `{ category, tag, type, page }`.
- Navigation: Add a simple sidebar or dropdown to switch categories.

## Next Steps
1. [x] Add "Minimal Mode" toggle to the header.
2. [x] Refactor `app.js` router for advanced path parsing.
3. [x] Update `renderArchive` for the two visual modes.
4. [x] Implement dynamic category navigation.
5. [ ] Optimize image sizing for single post pages.
6. [ ] Add a search functionality using the `?search=` WP-API parameter.

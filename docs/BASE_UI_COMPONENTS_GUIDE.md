# Base UI Components Guide

## Overview

Base UI Components adalah reusable components yang dirancang untuk memastikan konsistensi visual dan UX di seluruh aplikasi. Semua components menggunakan **semantic Tailwind tokens** untuk support light/dark mode otomatis.

## Components

### 1. PageHeader

Decorative header section untuk top of pages.

```typescript
import { PageHeader } from "@/app/shared/components/base/page-base";

export function MyPage() {
  return (
    <PageHeader
      subtitle="✨ Browse & Discover"
      title="Find Your Content"
      description="Search through thousands of titles"
    >
      <SearchForm />
    </PageHeader>
  );
}
```

**Props:**

- `title`: Main heading (ReactNode)
- `subtitle`: Small label above title (string)
- `description`: Subheading text (string)
- `children`: Content inside (SearchForm, filters, etc.)
- `className`: Additional Tailwind classes

**Features:**

- ✨ Gradient decorative background (light: subtle, dark: vibrant)
- 📱 Fully responsive
- 🌓 Auto light/dark mode
- ♿ Semantic HTML (h1)

---

### 2. EmptyState

Display when no content found.

```typescript
import { EmptyState } from "@/app/shared/components/base/page-base";
import { SearchIcon } from "lucide-react";

export function NoResults() {
  return (
    <EmptyState
      icon={
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
          <div className="relative bg-primary/10 p-6 rounded-full">
            <SearchIcon className="h-12 w-12 text-primary" />
          </div>
        </div>
      }
      title="No Results Found"
      description="Try searching with different keywords or filters"
      action={
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="...">Try Again</button>
          <button className="...">Browse</button>
        </div>
      }
    />
  );
}
```

**Props:**

- `icon`: ReactNode (usually icon with decorative background)
- `title`: Main message
- `description`: Helpful text
- `action`: Action buttons/links

---

### 3. ResultsInfo

Display metadata about current results (count, page info, etc).

```typescript
import { ResultsInfo } from "@/app/shared/components/base/page-base";

export function SearchResultsHeader() {
  return (
    <ResultsInfo
      title="Search Results"
      subtitle={
        <>
          Found <span className="font-semibold text-foreground">234</span> results for{" "}
          <span className="font-semibold text-primary">"action"</span>
        </>
      }
      stats={
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-1">
            Showing
          </p>
          <p className="text-foreground font-semibold">1–20 of 234</p>
        </div>
      }
    />
  );
}
```

**Props:**

- `title`: Main title
- `subtitle`: Descriptive text (can include counts, keywords, etc.)
- `stats`: Right-side info (page numbers, counts, etc.)

---

### 4. SuggestionsSection

Display suggestions as pills/tags.

```typescript
import { SuggestionsSection } from "@/app/shared/components/base/page-base";
import { Flame, Clock } from "lucide-react";

export function SearchSuggestions() {
  return (
    <>
      {/* Trending */}
      <SuggestionsSection
        variant="trending"
        title="Trending Now"
        icon={<Flame className="h-4 w-4" />}
        items={[
          { id: "1", label: "Action", onSelect: () => search("Action") },
          { id: "2", label: "Drama", onSelect: () => search("Drama") },
          { id: "3", label: "Thriller", onSelect: () => search("Thriller") },
        ]}
      />

      {/* Recent */}
      <SuggestionsSection
        variant="recent"
        title="Recent Searches"
        icon={<Clock className="h-4 w-4" />}
        items={[
          { id: "1", label: "Inception", onSelect: () => search("Inception") },
          { id: "2", label: "Avatar", onSelect: () => search("Avatar") },
        ]}
      />
    </>
  );
}
```

**Props:**

- `variant`: "trending" | "recent" | "default"
- `title`: Section title
- `icon`: Optional icon (displayed with colored background)
- `items`: Array of `{ id, label, onSelect }`

**Variants Styling:**

- **trending**: Orange-themed (light: orange-100, dark: orange-600/30)
- **recent**: Blue-themed (light: blue-50, dark: blue-600/10)
- **default**: Primary-themed (using design tokens)

---

## Semantic Color Tokens

All base components use semantic tokens for automatic light/dark support:

### Text Colors

```tailwind
text-foreground          # Primary text (black light / white dark)
text-muted-foreground    # Secondary text (gray light / zinc-400 dark)
text-primary             # Accent/interactive (blue-600 light / blue-400 dark)
text-secondary           # Secondary accent
text-destructive         # Error/danger text
```

### Background Colors

```tailwind
bg-background    # Page/main background
bg-card          # Card/section background
bg-accent        # Soft accent (for hover states)
bg-primary       # Strong accent/buttons
bg-destructive   # Error/danger backgrounds
```

### Border Colors

```tailwind
border-border    # Subtle dividers (gray-200 light / white/10 dark)
border-primary   # Accent borders (blue-200 light / blue-400 dark)
border-input     # Input borders
```

### Usage Pattern

Always use dark: prefix for dark mode:

```typescript
// ✅ Good
className = "bg-card dark:bg-zinc-900";
className = "text-foreground dark:text-white";
className = "border-border dark:border-white/10";

// ❌ Avoid
className = "bg-white dark:bg-black"; // Hardcoded colors
className = "text-gray-800"; // No dark mode
```

---

## Creating New Pages

### Template: Search/Filter Page

```typescript
"use client";

import { PageHeader, EmptyState, ResultsInfo, SuggestionsSection } from "@/app/shared/components/base/page-base";
import MainLayout from "@/app/shared/components/layout/main-layout";
import { SearchIcon } from "lucide-react";

export default function GenrePage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <PageHeader
          subtitle="🎬 Browse & Filter"
          title="Movie Genres"
          description="Explore movies by category"
        >
          {/* Optional: Filters/Search here */}
        </PageHeader>

        {/* Content */}
        {!hasResults ? (
          <EmptyState
            icon={...}
            title="No movies found"
            description="Try different filters"
            action={...}
          />
        ) : (
          <>
            <ResultsInfo
              title="Results"
              subtitle="..."
              stats={...}
            />
            {/* MovieGrid here */}
          </>
        )}

        {/* Suggestions */}
        <SuggestionsSection variant="default" title="..." items={[...]} />
      </div>
    </MainLayout>
  );
}
```

---

## Customization

### Override Styles

Use `className` prop to extend:

```typescript
<PageHeader
  title="Custom Title"
  className="mb-12"  // Add extra margin
/>
```

### Custom Icon Styling

Define icon styling separately:

```typescript
<EmptyState
  icon={
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-red-600/20 rounded-full blur-2xl" />
      <div className="relative bg-red-100 dark:bg-red-600/30 p-6 rounded-full">
        <AlertIcon className="h-12 w-12 text-red-600 dark:text-red-400" />
      </div>
    </div>
  }
  title="Error"
/>
```

---

## Accessibility

All components include:

- ✅ Semantic HTML
- ✅ Proper heading hierarchy (h1, h2, etc.)
- ✅ WCAG AA color contrast
- ✅ Keyboard navigation
- ✅ Screen reader friendly

---

## Examples by Page Type

### Genre Page

- PageHeader + optional genre filters
- ResultsInfo showing genre name + count
- MovieGrid with pagination
- SuggestionsSection with related genres

### Movie Detail Page

- PageHeader with movie title + hero image
- Movie metadata (cast, rating, etc.)
- Related movies section
- Reviews/comments section

### Watch History

- PageHeader with "Your Watches"
- ResultsInfo showing total watches
- MovieGrid with continuation points
- SuggestionsSection with "Continue Watching"

### User Profile

- PageHeader with user info
- ProfileStats component
- Tabs: Favorites, Watch List, History
- Similar structure as search page

---

## Testing

Component uses:

- ✅ Tailwind CSS (no external CSS)
- ✅ Semantic HTML
- ✅ React 18+
- ✅ TypeScript

No additional dependencies needed beyond existing stack.

---

## Migration Guide

### From Old Hardcoded Colors

```typescript
// Before
className = "bg-white dark:bg-black text-white dark:text-white";

// After
className = "bg-background text-foreground";
```

### From Old Search Page

```typescript
// Before: SearchPageHeader as standalone
<SearchPageHeader />

// After: Use PageHeader
<PageHeader
  subtitle="✨ Search & Discover"
  title={...}
  description={...}
>
  <SearchForm />
</PageHeader>
```

---

## API Reference

See inline JSDoc comments in `page-base.tsx` for detailed prop documentation.

Quick reference:

```typescript
// PageHeader
(title, subtitle, description, children, className);

// EmptyState
(icon, title, description, action, className);

// ResultsInfo
(title, subtitle, stats, className);

// SuggestionsSection
(title, icon, items, variant, className);
```

---

**Last Updated**: June 4, 2026  
**Version**: 1.0  
**Status**: Ready for use

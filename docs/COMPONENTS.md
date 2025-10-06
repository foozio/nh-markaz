# Components Documentation

## Overview

Markaz uses a component-based architecture with reusable UI components built on Radix UI primitives and styled with Tailwind CSS.

## Component Categories

### Layout Components

#### `MainHeader`
**Location:** `src/components/layout/main-header.tsx`

Main navigation header with authentication state and navigation links.

**Props:**
- None (uses hooks for state)

**Features:**
- Responsive navigation
- User avatar dropdown
- Authentication-aware navigation
- Mobile-friendly design

#### `AuthProvider`
**Location:** `src/components/layout/auth-provider.tsx`

Provides authentication context throughout the app.

**Props:**
```tsx
interface AuthProviderProps {
  children: React.ReactNode;
}
```

**Context Value:**
```tsx
interface AuthContextType {
  user: User | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}
```

#### `CacheProvider`
**Location:** `src/components/providers/cache-provider.tsx`

Provides caching context for Quran and Hadith data.

### Quran Components

#### `QuranBrowser`
**Location:** `src/components/quran/quran-browser.tsx`

Main Quran browsing interface with surah selection and verse display.

**Props:**
```tsx
interface QuranBrowserProps {
  initialSurahNumber?: number;
}
```

**Features:**
- Surah navigation
- Verse bookmarking
- Note integration
- AI summary generation
- Responsive layout

#### `SurahView`
**Location:** `src/components/quran/surah-view.tsx`

Displays verses for a selected surah with interaction capabilities.

**Props:**
```tsx
interface SurahViewProps {
  surah: Surah | null;
  isLoading: boolean;
  onAddToNotes: (verse: Ayah) => void;
  onAddSummaryToNotes: (summary: string, verse: Ayah) => void;
  onToggleBookmark: (surahNumber: number, verseNumber: number, surahName: string, verseText: string) => void;
  isVerseBookmarked: (surahNumber: number, verseNumber: number) => boolean;
  verseRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}
```

#### `RightSidebar`
**Location:** `src/components/quran/right-sidebar.tsx`

Sidebar for notes, bookmarks, and additional Quran features.

**Props:**
```tsx
interface RightSidebarProps {
  surah: Surah | null;
  notes: string;
  onNotesChange: (notes: string) => void;
  bookmarks: Bookmark[];
  onNavigateToVerse: (bookmark: Bookmark) => void;
  onSaveNotes: () => Promise<void>;
  isSavingNotes: boolean;
  isLoadingNotes: boolean;
}
```

### Hadith Components

#### `HadithReader`
**Location:** `src/components/hadith/hadith-reader.tsx`

Main hadith reading interface with pagination and interaction.

**Props:**
```tsx
interface HadithReaderProps {
  collectionId: string;
  collectionName: string;
  hadiths: HadithEntry[];
}
```

**Features:**
- Paginated hadith display
- Bookmarking system
- Note integration
- AI summary generation

#### `HadithItem`
**Location:** `src/components/hadith/hadith-item.tsx`

Individual hadith display component.

**Props:**
```tsx
interface HadithItemProps {
  hadith: HadithEntry;
  collectionName: string;
  range: string;
  isBookmarked: boolean;
  onToggleBookmark: (hadith: HadithEntry) => void;
  onAddToNotes: (hadith: HadithEntry) => void;
  onAddSummaryToNotes: (summary: string, hadith: HadithEntry) => void;
}
```

#### `HadithSidebar`
**Location:** `src/components/hadith/hadith-sidebar.tsx`

Sidebar for hadith notes and bookmarks.

**Props:**
```tsx
interface HadithSidebarProps {
  collectionName: string;
  notes: string;
  onNotesChange: (notes: string) => void;
  bookmarks: HadithBookmark[];
  onNavigateToHadith: (bookmark: HadithBookmark) => void;
  onSaveNotes: () => Promise<void>;
  isSavingNotes: boolean;
  isLoadingNotes: boolean;
  isAuthenticated: boolean;
}
```

### Search Components

#### `QuranSearch`
**Location:** `src/components/search/quran-search.tsx`

Quran search interface with results display.

**Props:**
```tsx
interface QuranSearchProps {
  onVerseSelect?: (surahNumber: number, verseNumber: number) => void;
  className?: string;
}
```

**Features:**
- Real-time search
- Arabic and translation search
- Result highlighting
- Pagination

#### `HadithSearch`
**Location:** `src/components/search/hadith-search.tsx`

Hadith search interface.

**Props:**
```tsx
interface HadithSearchProps {
  onHadithSelect?: (collectionId: string, hadithNumber: number) => void;
  className?: string;
}
```

#### `SearchInput`
**Location:** `src/components/search/search-input.tsx`

Reusable search input component with suggestions.

**Props:**
```tsx
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
}
```

#### `SearchResults`
**Location:** `src/components/search/search-results.tsx`

Search results display with pagination.

**Props:**
```tsx
interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onResultClick: (result: SearchResult) => void;
  searchQuery: string;
}
```

### UI Components

Markaz uses shadcn/ui components built on Radix UI:

#### `Button`
**Location:** `src/components/ui/button.tsx`

Customizable button component with variants.

**Variants:**
- `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`

#### `Card`
**Location:** `src/components/ui/card.tsx`

Card container component.

**Sub-components:**
- `CardHeader`, `CardContent`, `CardFooter`, `CardTitle`, `CardDescription`

#### `Input`
**Location:** `src/components/ui/input.tsx`

Text input component.

#### `Tabs`
**Location:** `src/components/ui/tabs.tsx`

Tab navigation component.

#### `Dialog`
**Location:** `src/components/ui/dialog.tsx`

Modal dialog component.

#### `Toast`
**Location:** `src/components/ui/toast.tsx`

Toast notification system.

#### `Avatar`
**Location:** `src/components/ui/avatar.tsx`

User avatar component.

#### `DropdownMenu`
**Location:** `src/components/ui/dropdown-menu.tsx`

Dropdown menu component.

#### `ScrollArea`
**Location:** `src/components/ui/scroll-area.tsx`

Custom scrollable area.

#### `Skeleton`
**Location:** `src/components/ui/skeleton.tsx`

Loading skeleton component.

## Component Patterns

### State Management

Components use React hooks for local state:
- `useState` for component state
- `useEffect` for side effects
- `useRef` for DOM references

### Authentication

Components check authentication status using the `useAuth` hook:
```tsx
const { user } = useAuth();
```

### Error Handling

Components use the `useToast` hook for user notifications:
```tsx
const { toast } = useToast();
```

### Styling

All components use Tailwind CSS classes with a custom design system:
- CSS variables for theming
- Responsive design utilities
- Dark mode support

### Accessibility

Components follow accessibility best practices:
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Screen reader compatibility

## Component Communication

### Props Interface

Components use TypeScript interfaces for prop validation:

```tsx
interface ComponentProps {
  requiredProp: string;
  optionalProp?: number;
  onAction: (data: DataType) => void;
}
```

### Event Handling

Components emit events through callback props:

```tsx
interface ComponentProps {
  onItemSelect: (item: Item) => void;
  onActionComplete: () => void;
}
```

### Context Usage

Components consume context through custom hooks:
- `useAuth()` for authentication
- `useToast()` for notifications

## Performance Considerations

### Lazy Loading

Large components are lazy loaded:
```tsx
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### Memoization

Expensive computations are memoized:
```tsx
const memoizedValue = useMemo(() => computeExpensiveValue(dep), [dep]);
```

### Virtualization

Long lists use virtualization for performance:
- Pagination for hadith collections
- Windowing for large result sets

## Testing

Components are designed for testability:
- Pure functions where possible
- Dependency injection through props
- Mockable hooks and APIs
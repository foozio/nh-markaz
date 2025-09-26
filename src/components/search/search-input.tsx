'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
}

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = "Cari dalam Al-Quran dan Hadis...",
  className,
  isLoading = false,
  suggestions = [],
  onSuggestionSelect
}: SearchInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(newValue.length > 0 && suggestions.length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSuggestionSelect?.(suggestion);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    onChange('');
    setShowSuggestions(false);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="pl-10 pr-10 h-12 text-base font-naskh focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
            dir="rtl"
            onFocus={() => setShowSuggestions(value.length > 0 && suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-muted"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Button
          type="submit"
          className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
          disabled={!value.trim() || isLoading}
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            "Cari"
          )}
        </Button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover p-1 shadow-md">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full rounded-sm px-3 py-2 text-right text-sm font-naskh hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
              onClick={() => handleSuggestionClick(suggestion)}
              dir="rtl"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
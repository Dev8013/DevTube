import React from 'react';

interface CategoryChipsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="sticky top-14 z-20 flex items-center gap-2 overflow-x-auto bg-[#0f0f0f] py-3 px-4 no-scrollbar border-b border-[#222222]/50">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all shrink-0 ${
              isSelected
                ? 'bg-white text-[#0f0f0f] shadow-sm font-semibold'
                : 'bg-[#272727] text-neutral-200 hover:bg-[#383838]'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

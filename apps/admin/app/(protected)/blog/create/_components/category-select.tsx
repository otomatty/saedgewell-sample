'use client';

import { useState, useEffect } from 'react';
import { getBlogCategories } from '@kit/next/actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import type { BlogCategory } from '@kit/types/blog';

interface CategorySelectProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange }) => {
  const [categories, setCategories] = useState<BlogCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getBlogCategories();
      setCategories(categories);
    };
    fetchCategories();
  }, []);

  return (
    <Select onValueChange={(value) => onChange(value.split(','))}>
      <SelectTrigger>
        <SelectValue placeholder="カテゴリーを選択" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategorySelect;

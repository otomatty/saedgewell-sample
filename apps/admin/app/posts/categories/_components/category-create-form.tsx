'use client';

import { useState } from 'react';
import { createBlogCategory } from '@kit/next/actions';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';

const CategoryCreateForm = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createBlogCategory(name);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">カテゴリー名</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <Button type="submit">作成</Button>
    </form>
  );
};

export default CategoryCreateForm;

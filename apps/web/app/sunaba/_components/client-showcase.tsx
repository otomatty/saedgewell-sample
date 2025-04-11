'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';
import { Input } from '@kit/ui/input';
import { Button } from '@kit/ui/button';
import { Grid2X2, List, Search } from 'lucide-react';
import { CATEGORIES } from '../types';
import type { ComponentDoc } from '../types';
import { ComponentCard } from './component-card';

export function ClientShowcase({
  initialComponents,
}: {
  initialComponents: ComponentDoc[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isGridView, setIsGridView] = useState(true);
  const [activeCategory, setActiveCategory] =
    useState<(typeof CATEGORIES)[number]['id']>('ui');

  const filteredComponents = initialComponents.filter((component) => {
    const matchesSearch =
      component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory = component.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const activeTab = CATEGORIES.find(
    (category) => category.id === activeCategory
  );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold">{activeTab?.label}</h2>
          <p className="text-muted-foreground">{activeTab?.description}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="コンポーネントを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsGridView(!isGridView)}
            title={isGridView ? 'リスト表示' : 'グリッド表示'}
          >
            {isGridView ? (
              <List className="h-4 w-4" />
            ) : (
              <Grid2X2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        <Tabs
          defaultValue="ui"
          onValueChange={(value) =>
            setActiveCategory(value as (typeof CATEGORIES)[number]['id'])
          }
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            {CATEGORIES.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {CATEGORIES.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div
                className={`grid gap-6 ${
                  isGridView
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {filteredComponents.map((component) => (
                  <ComponentCard
                    key={component.id}
                    component={component}
                    isGridView={isGridView}
                  />
                ))}
                {filteredComponents.length === 0 && (
                  <p className="text-center text-muted-foreground">
                    コンポーネントが見つかりませんでした
                  </p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

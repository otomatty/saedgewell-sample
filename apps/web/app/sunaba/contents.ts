export const CATEGORIES = [
  {
    id: 'ui',
    label: 'UI Components',
    description: 'shadcn/ui ベースのカスタムコンポーネント',
  },
  {
    id: 'animation',
    label: 'Animation',
    description: 'アニメーション系コンポーネント',
  },
  {
    id: 'layout',
    label: 'Layout',
    description: 'レイアウト系コンポーネント',
  },
] as const;

export interface ComponentInfo {
  id: string;
  category: (typeof CATEGORIES)[number]['id'];
  label: string;
  description: string;
}

export const COMPONENTS: ComponentInfo[] = [
  {
    id: 'theme-toggle',
    category: 'ui',
    label: 'Theme Toggle',
    description: 'ダークモード切り替えコンポーネント',
  },
  {
    id: 'galaxy-3d',
    category: 'animation',
    label: 'Galaxy 3D',
    description: '3Dの銀河アニメーション',
  },
  {
    id: 'bento-grid',
    category: 'layout',
    label: 'Bento Grid',
    description: 'モダンなベントーグリッドレイアウト',
  },
];

export function getCategoryInfo(id: string) {
  return CATEGORIES.find((category) => category.id === id);
}

export function getComponentInfo(id: string) {
  return COMPONENTS.find((component) => component.id === id);
}

export function getComponentsByCategory(categoryId: string) {
  return COMPONENTS.filter((component) => component.category === categoryId);
}

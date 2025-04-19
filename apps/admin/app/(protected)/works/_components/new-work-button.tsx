/**
 * @file 新規実績作成ページへのリンクボタンコンポーネント。
 * @description 実績一覧ページなどに配置し、新規作成ページへ遷移します。
 * shadcn/ui/button と Next.js の Link を使用。
 */

import type React from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@kit/ui/button';
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react"; // アイコン例

/**
 * @function NewWorkButton
 * @description 新規実績作成ページへのリンクボタンを表示するコンポーネント。
 * @returns {React.ReactElement} 新規作成ボタン。
 */
const NewWorkButton: React.FC = () => {
  return (
    <Button asChild>
      <Link href="/works/new">
        {' '}
        {/* 新規作成ページのパス */}
        <PlusCircle className="mr-2 h-4 w-4" />
        新規作成
      </Link>
    </Button>
  );
};

export default NewWorkButton;

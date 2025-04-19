'use client';

import React from 'react';
import Image from 'next/image';

interface SkillIconProps {
  icon?: string; // Optional icon filename
  name: string; // Skill name for alt text
  width?: number;
  height?: number;
  className?: string;
}

/**
 * スキルアイコンを表示する Client Component
 * 画像の読み込みエラー時のフォールバック処理(onError)を担当します。
 */
const SkillIcon: React.FC<SkillIconProps> = ({
  icon,
  name,
  width = 32,
  height = 32,
  className = 'rounded-md',
}) => {
  const iconPath = icon ? `/icons/${icon}` : '/icons/placeholder.svg';
  const [imgSrc, setImgSrc] = React.useState(iconPath);

  React.useEffect(() => {
    setImgSrc(iconPath); // icon prop が変更された場合に再設定
  }, [iconPath]);

  return (
    <Image
      src={imgSrc}
      alt={`${name} icon`}
      width={width}
      height={height}
      className={className}
      onError={() => {
        // 画像読み込み失敗時にプレースホルダー画像に切り替える
        setImgSrc('/icons/placeholder.svg');
      }}
      unoptimized={imgSrc === '/icons/placeholder.svg'} // プレースホルダーSVGは最適化しない場合
    />
  );
};

export default SkillIcon;

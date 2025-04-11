import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { cn } from '@kit/ui/utils';

/**
 * GitHubのプロフィール画像を重ねて表示するコンポーネント
 */
export const GitHubImages = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {[2, 1, 0].map((index) => (
        <Image
          key={index}
          src={
            resolvedTheme === 'dark'
              ? `/images/github-dark-${index + 1}.webp`
              : `/images/github-light-${index + 1}.webp`
          }
          alt={`GitHub Profile ${index + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn(
            'object-contain transition-all absolute scale-90',
            'transform-gpu perspective-[2000px]',
            index === 0 &&
              'z-30 translate-y-[10%] translate-x-[3%] group-hover:translate-y-[8%] duration-500 delay-200',
            index === 1 &&
              'z-20 translate-y-[5%] translate-x-[0%] group-hover:translate-y-[2%] duration-500 delay-100',
            index === 2 &&
              'z-10 translate-y-0 translate-x-[-3%] group-hover:translate-y-[-3%] duration-500',
            '[transform-style:preserve-3d]',
            '[backface-visibility:hidden]',
            'origin-center',
            'rotate-y-[20deg] rotate-x-[-14deg] skew-y-[-4deg]',
            'group-hover:rotate-y-[15deg] group-hover:rotate-x-[-10deg]',
            'ease-out'
          )}
          style={{
            filter: `brightness(${1 - index * 0.1})`,
            transitionProperty: 'transform, filter',
          }}
        />
      ))}
    </>
  );
};

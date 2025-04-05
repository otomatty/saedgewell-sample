'use client';

import { motion, AnimatePresence, animate } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { SectionTitle } from '@kit/ui/section-title';
import { useRef, useState, useEffect } from 'react';
import React from 'react';

const featuredBlogs = [
  {
    title: 'Next.js 14でのサーバーアクションの活用方法',
    date: '2024-02-15',
    excerpt:
      'Next.js 14の新機能であるサーバーアクションの効果的な使用方法について解説します。',
    slug: 'nextjs-14-server-actions',
    image: '/images/blog/nextjs-14.jpg',
  },
  {
    title: 'Supabaseを使用した認証システムの実装',
    date: '2024-02-01',
    excerpt:
      'SupabaseとNext.jsを組み合わせた認証システムの実装方法を詳しく解説します。',
    slug: 'supabase-auth-implementation',
    image: '/images/blog/supabase-auth.jpg',
  },
  {
    title: 'Vercel',
    date: '2024-02-01',
    excerpt:
      'VercelとNext.jsを組み合わせた認証システムの実装方法を詳しく解説します。',
    slug: 'supabase-auth-implementation2',
    image: '/images/blog/supabase-auth.jpg',
  },
  {
    title: 'Three.js',
    date: '2024-02-01',
    excerpt:
      'ThreeとNext.jsを組み合わせた認証システムの実装方法を詳しく解説します。',
    slug: 'supabase-auth-implementation3',
    image: '/images/blog/supabase-auth.jpg',
  },
  {
    title: 'AI',
    date: '2024-02-01',
    excerpt:
      'AIとNext.jsを組み合わせた認証システムの実装方法を詳しく解説します。',
    slug: 'supabase-auth-implementation4',
    image: '/images/blog/supabase-auth.jpg',
  },
  {
    title: '機械学習',
    date: '2024-02-01',
    excerpt:
      '機械学習とNext.jsを組み合わせた認証システムの実装方法を詳しく解説します。',
    slug: 'supabase-auth-implementation5',
    image: '/images/blog/supabase-auth.jpg',
  },
];

const featuredWorks = [
  {
    title: 'AI教育支援プラットフォーム',
    category: '企業案件',
    description: 'AIを活用した個別最適化学習プラットフォームの開発',
    image: '/images/works/education-platform.jpg',
    link: '/works/company/education-platform',
  },
  {
    title: 'クラウドネイティブCMS',
    category: '個人開発',
    description: 'Next.jsとSupabaseを使用したモダンなCMSの開発',
    image: '/images/works/cloud-cms.jpg',
    link: '/works/personal/cloud-cms',
  },
  {
    title: 'AI',
    category: '個人開発',
    description: 'Next.jsとSupabaseを使用したモダンなCMSの開発',
    image: '/images/works/cloud-cms.jpg',
    link: '/works/personal/cloud-cms',
  },
  {
    title: 'AI2',
    category: '個人開発',
    description: 'Next.jsとSupabaseを使用したモダンなCMSの開発',
    image: '/images/works/cloud-cms.jpg',
    link: '/works/personal/cloud-cms',
  },
  {
    title: 'AI3',
    category: '個人開発',
    description: 'Next.jsとSupabaseを使用したモダンなCMSの開発',
    image: '/images/works/cloud-cms.jpg',
    link: '/works/personal/cloud-cms',
  },
  {
    title: 'AI4',
    category: '企業案件',
    description: 'AIを活用した個別最適化学習プラットフォームの開発',
    image: '/images/works/education-platform.jpg',
    link: '/works/company/education-platform',
  },
];

const Slider = ({
  children,
  itemsToShow,
  cardWidth,
}: { children: React.ReactNode; itemsToShow: number; cardWidth: string }) => {
  const [current, setCurrent] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const validChildren = React.Children.toArray(children);

  const handlePrev = () => {
    const newCurrent =
      current === 0
        ? validChildren
          ? validChildren.length - itemsToShow
          : 0
        : current - 1;

    animate(current, newCurrent, {
      duration: 0.5,
      ease: 'easeInOut',
      onUpdate: (value) => {
        setCurrent(value);
      },
    });
  };

  const handleNext = () => {
    const newCurrent =
      current >= (validChildren ? validChildren.length - itemsToShow : 0)
        ? 0
        : current + 1;

    animate(current, newCurrent, {
      duration: 0.5,
      ease: 'easeInOut',
      onUpdate: (value) => {
        setCurrent(value);
      },
    });
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          style={{
            width: `calc(100% * ${
              validChildren ? validChildren.length / itemsToShow : 1
            })`,
            transform: `translateX(-${
              (current /
                (validChildren ? validChildren.length / itemsToShow : 1)) *
              100
            }%)`,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {validChildren && validChildren.length > 0 ? (
            validChildren.map((child) => {
              const key =
                typeof child === 'object' &&
                child !== null &&
                'key' in child &&
                typeof child.key === 'string'
                  ? child.key
                  : String(Math.random());
              return (
                <div
                  key={key}
                  className="w-full shrink-0 px-2"
                  style={{ width: cardWidth }}
                >
                  {child}
                </div>
              );
            })
          ) : (
            <div>No items to display</div>
          )}
        </motion.div>
      </div>
      <div className="flex mt-4 gap-2">
        <button
          onClick={handlePrev}
          type="button"
          className="p-2 border rounded-full"
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="p-2 border rounded-full"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export const Featured = () => {
  const [blogItemsToShow, setBlogItemsToShow] = useState(3);
  const [workItemsToShow, setWorkItemsToShow] = useState(2);
  const [cardWidth, setCardWidth] = useState('200px');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setBlogItemsToShow(2);
        setWorkItemsToShow(2);
        setCardWidth('200px');
      } else if (window.innerWidth >= 1024) {
        setBlogItemsToShow(4);
        setWorkItemsToShow(4);
        setCardWidth('400px');
      } else {
        setBlogItemsToShow(3);
        setWorkItemsToShow(2);
        setCardWidth('300px');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Featured Blog Posts */}
        <div className="mb-20">
          <div className="flex justify-between items-center mb-8">
            <SectionTitle
              title="最新のブログ記事"
              subtitle="最新のブログ記事を表示します。"
            />
            <Button variant="ghost" asChild>
              <Link href="/blog">
                もっと見る
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Slider itemsToShow={blogItemsToShow} cardWidth={cardWidth}>
            {featuredBlogs.map((blog, index) => (
              <Link key={blog.slug} href={`/blog/${blog.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="relative h-48 w-full">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="text-sm text-muted-foreground mb-2">
                      {blog.date}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                    <p className="text-muted-foreground">{blog.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </Slider>
        </div>

        {/* Featured Works */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <SectionTitle
              title="注目の制作実績"
              subtitle="注目の制作実績を表示します。"
            />
            <Button variant="ghost" asChild>
              <Link href="/works">
                もっと見る
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Slider itemsToShow={workItemsToShow} cardWidth={cardWidth}>
            {featuredWorks.map((work, index) => (
              <Link key={work.title} href={work.link}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="relative h-48 w-full">
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="text-sm text-primary font-medium mb-2">
                      {work.category}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{work.title}</h3>
                    <p className="text-muted-foreground">{work.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Button } from '@kit/ui/button';

const footerLinks = [
  {
    title: 'About',
    items: [
      { label: '自己紹介', href: '/about' },
      { label: '経歴', href: '/about#career' },
      { label: 'スキル', href: '/about#skills' },
    ],
  },
  {
    title: 'Works',
    items: [
      { label: '企業案件', href: '/works/company' },
      { label: 'フリーランス', href: '/works/freelance' },
      { label: '個人開発', href: '/works/personal' },
    ],
  },
  {
    title: 'Blog',
    items: [
      { label: '最新記事', href: '/blog' },
      { label: 'カテゴリー', href: '/blog/categories' },
      { label: 'アーカイブ', href: '/blog/archives' },
    ],
  },
  {
    title: 'Contact',
    items: [
      { label: 'お見積もり', href: '/estimate' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
];

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/saedgewell',
    icon: Github,
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/saedgewell',
    icon: Twitter,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/saedgewell',
    icon: Linkedin,
  },
  {
    label: 'Mail',
    href: 'mailto:contact@saedgewell.com',
    icon: Mail,
  },
];

export const Footer = () => {
  return (
    <footer className="border-t bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {footerLinks.map((section) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="mb-3 text-sm font-semibold">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => (
              <Button key={social.label} variant="ghost" size="icon" asChild>
                <Link
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              </Button>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
            <nav className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">
                プライバシーポリシー
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                利用規約
              </Link>
            </nav>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Saedgewell. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

'use client';

import { motion } from 'motion/react';
import { Card } from '@kit/ui/card';
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';

interface BlogContentProps {
  content: MDXRemoteSerializeResult;
}

export const BlogContent = ({ content }: BlogContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 md:p-8 lg:p-12 prose prose-zinc dark:prose-invert max-w-none">
        <MDXRemote {...content} />
      </Card>
    </motion.div>
  );
};

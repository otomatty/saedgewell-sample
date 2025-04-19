'use client';

import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Code } from 'lucide-react';

const TechnicalInterests = () => {
  const technicalInterests = [
    {
      name: 'Web フロントエンド',
      description: '最新のフレームワークやライブラリ、UI/UX デザイン',
    },
    {
      name: 'Web バックエンド',
      description: 'サーバーレスアーキテクチャ、API デザイン、データベース',
    },
    {
      name: 'クラウド',
      description: 'AWS, GCP, Cloudflare',
    },
    {
      name: 'DevOps',
      description: 'CI/CD, IaC',
    },
    {
      name: 'セキュリティ',
      description: 'Web アプリケーションセキュリティ、脆弱性診断',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-semibold flex items-center">
          <Code className="mr-2 h-5 w-5" />
          技術分野
        </CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {technicalInterests.map((item, index) => (
          <Card key={item.name}>
            <CardContent className="flex items-start">
              <Code className="mr-4 h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default TechnicalInterests;

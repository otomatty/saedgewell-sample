'use client';

import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';

const TechnicalChallenges = () => {
  const technicalChallenges = [
    'WebAssembly を用いた、Web アプリケーションのパフォーマンス改善',
    'Rust を用いた、高パフォーマンスなバックエンドシステムの構築',
    '機械学習を用いた、Web サービスの自動化',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">技術的な挑戦</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-none pl-0">
            {technicalChallenges.map((item, index) => (
              <li key={crypto.randomUUID()} className="mb-2">
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TechnicalChallenges;

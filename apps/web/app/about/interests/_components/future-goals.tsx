'use client';

import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';

const FutureGoals = () => {
  const futureGoals = [
    {
      goal: '3 年後: Web サービスの開発チームリーダー',
      deadline: '2027年',
    },
    {
      goal: '5 年後: 技術顧問、OSS プロジェクトリーダー',
      deadline: '2029年',
    },
    {
      goal: '10 年後: 独立、起業',
      deadline: '2034年',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            これからの目標
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-none pl-0">
            {futureGoals.map((item) => (
              <li key={item.goal} className="mb-2">
                {item.goal} ({item.deadline})
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FutureGoals;

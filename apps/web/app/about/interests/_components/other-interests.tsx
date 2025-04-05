'use client';

import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Music, Plane, Book, Film, Camera } from 'lucide-react';

const OtherInterests = () => {
  const otherInterests = [
    {
      name: '音楽',
      description: 'ギター演奏、DTM、音楽理論',
      icon: Music,
    },
    {
      name: '旅行',
      description: 'バックパッカー旅行、秘境探検',
      icon: Plane,
    },
    {
      name: '読書',
      description: '歴史小説、SF 小説、ノンフィクション',
      icon: Book,
    },
    {
      name: '映画',
      description: 'アート系映画、ドキュメンタリー映画',
      icon: Film,
    },
    {
      name: '写真',
      description: '風景写真、ポートレート写真',
      icon: Camera,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-semibold flex items-center">
          その他分野
        </CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {otherInterests.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={item.name}>
              <CardContent className="flex items-start">
                {Icon && <Icon className="mr-4 h-8 w-8 text-primary" />}
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
};

export default OtherInterests;

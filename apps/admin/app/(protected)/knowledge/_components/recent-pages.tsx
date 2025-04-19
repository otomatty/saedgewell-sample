import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import type { Database } from '@kit/supabase/database';

type Page = Database['public']['Tables']['knowledge_pages']['Row'] & {
  knowledge_projects: Pick<
    Database['public']['Tables']['knowledge_projects']['Row'],
    'project_name'
  >;
};

interface RecentPagesProps {
  pages: Page[];
}

export function RecentPages({ pages }: RecentPagesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>最近の更新</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pages.map((page) => (
            <div
              key={page.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-semibold">{page.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {page.knowledge_projects.project_name}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(page.updated_at).toLocaleString('ja-JP')}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

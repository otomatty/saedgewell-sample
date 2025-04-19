'use client';

import { useState, useCallback } from 'react';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Alert, AlertDescription } from '@kit/ui/alert';
import { toast } from 'sonner';
import { checkProjectExists, registerProject } from '~/actions/knowledge';

export function ManualSync() {
  const [projectName, setProjectName] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [projectInfo, setProjectInfo] = useState<{
    exists: boolean;
    count?: number;
    error?: string;
  } | null>(null);

  const handleCheck = useCallback(async () => {
    if (!projectName.trim()) {
      toast.error('プロジェクト名を入力してください。');
      return;
    }

    setIsChecking(true);
    try {
      const result = await checkProjectExists(projectName);
      setProjectInfo(result);
      if (!result.exists) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('プロジェクトの確認中にエラーが発生しました。');
      console.error('Project check error:', error);
    } finally {
      setIsChecking(false);
    }
  }, [projectName]);

  const handleRegister = useCallback(async () => {
    if (!projectInfo?.exists || !projectInfo.count) return;

    setIsRegistering(true);
    try {
      const result = await registerProject(projectName, projectInfo.count);
      if (result.success) {
        toast.success('プロジェクトを登録しました。');
        setProjectName('');
        setProjectInfo(null);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('プロジェクトの登録に失敗しました。');
      console.error('Project registration error:', error);
    } finally {
      setIsRegistering(false);
    }
  }, [projectName, projectInfo]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="プロジェクト名を入力"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          disabled={isChecking || isRegistering}
        />
        <Button
          onClick={handleCheck}
          disabled={isChecking || isRegistering || !projectName.trim()}
        >
          {isChecking ? '確認中...' : '確認'}
        </Button>
      </div>

      {projectInfo?.exists && (
        <Alert>
          <AlertDescription>
            プロジェクト「{projectName}」が見つかりました。
            <br />
            総ページ数: {projectInfo.count}
            <div className="mt-2">
              <Button onClick={handleRegister} disabled={isRegistering}>
                {isRegistering ? '登録中...' : 'プロジェクトとして登録'}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

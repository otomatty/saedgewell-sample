'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { ExternalLink, Github, Edit, Check, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@kit/ui/button';
import { Textarea } from '@kit/ui/textarea';
import { Input } from '@kit/ui/input';
import { toast } from 'sonner';
import { updateWorkDescription } from '../../../../../actions/works/update-work-description';
import { updateWorkDetail } from '../../../../../actions/works/update-work-detail';
import { updateWorkLinks } from '../../../../../actions/works/update-work-links';
import { GithubRepositorySelectorModal } from '~/components/github/github-repository-selector-modal';

interface WorkInfoProps {
  work: {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    github_url: string | null;
    website_url: string | null;
    slug: string;
  };
  workDetail?: {
    overview: string;
    role: string;
    period: string;
    team_size: string;
  } | null;
}

interface DetailState {
  overview: string;
  role: string;
  period: string;
  team_size: string;
}

/**
 * 実績基本情報コンポーネント
 */
export function WorkInfo({ work, workDetail }: WorkInfoProps) {
  // 説明文の編集状態
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(work.description);
  const [tempDescription, setTempDescription] = useState(work.description);
  const [isSubmittingDescription, setIsSubmittingDescription] = useState(false);

  // 詳細情報の初期値
  const initialDetail: DetailState = {
    overview: workDetail?.overview || '',
    role: workDetail?.role || '',
    period: workDetail?.period || '',
    team_size: workDetail?.team_size || '',
  };

  // 詳細情報の編集状態
  const [detail, setDetail] = useState<DetailState>(initialDetail);
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [tempOverview, setTempOverview] = useState(initialDetail.overview);
  const [isSubmittingOverview, setIsSubmittingOverview] = useState(false);

  // 担当・期間・規模の編集状態
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [tempInfo, setTempInfo] = useState<DetailState>(initialDetail);
  const [isSubmittingInfo, setIsSubmittingInfo] = useState(false);

  // URLリンクの編集状態
  const [isEditingLinks, setIsEditingLinks] = useState(false);
  const [links, setLinks] = useState({
    github_url: work.github_url || '',
    website_url: work.website_url || '',
  });
  const [tempLinks, setTempLinks] = useState({
    github_url: work.github_url || '',
    website_url: work.website_url || '',
  });
  const [isSubmittingLinks, setIsSubmittingLinks] = useState(false);

  // 説明文の編集処理
  const handleEditDescriptionClick = () => {
    setTempDescription(description);
    setIsEditingDescription(true);
  };

  const handleCancelDescription = () => {
    setTempDescription(description);
    setIsEditingDescription(false);
  };

  const handleSaveDescription = async () => {
    if (tempDescription.trim() === '') {
      toast.error('説明文を入力してください');
      return;
    }

    try {
      setIsSubmittingDescription(true);
      await updateWorkDescription(work.id, tempDescription);
      setDescription(tempDescription);
      setIsEditingDescription(false);
      toast.success('説明文を更新しました');
    } catch (error) {
      console.error('説明文の更新に失敗しました:', error);
      toast.error('説明文の更新に失敗しました');
    } finally {
      setIsSubmittingDescription(false);
    }
  };

  // 概要の編集処理
  const handleEditOverviewClick = () => {
    setTempOverview(detail.overview);
    setIsEditingOverview(true);
  };

  const handleCancelOverview = () => {
    setTempOverview(detail.overview);
    setIsEditingOverview(false);
  };

  const handleSaveOverview = async () => {
    try {
      setIsSubmittingOverview(true);
      await updateWorkDetail(work.id, { overview: tempOverview });
      setDetail((prev) => ({ ...prev, overview: tempOverview }));
      setIsEditingOverview(false);
      toast.success('概要を更新しました');
    } catch (error) {
      console.error('概要の更新に失敗しました:', error);
      toast.error('概要の更新に失敗しました');
    } finally {
      setIsSubmittingOverview(false);
    }
  };

  // 担当・期間・規模の編集処理
  const handleEditInfoClick = () => {
    setTempInfo({ ...detail });
    setIsEditingInfo(true);
  };

  const handleCancelInfo = () => {
    setTempInfo({ ...detail });
    setIsEditingInfo(false);
  };

  const handleSaveInfo = async () => {
    try {
      setIsSubmittingInfo(true);
      await updateWorkDetail(work.id, {
        role: tempInfo.role,
        period: tempInfo.period,
        team_size: tempInfo.team_size,
      });
      setDetail((prev) => ({
        ...prev,
        role: tempInfo.role,
        period: tempInfo.period,
        team_size: tempInfo.team_size,
      }));
      setIsEditingInfo(false);
      toast.success('詳細情報を更新しました');
    } catch (error) {
      console.error('詳細情報の更新に失敗しました:', error);
      toast.error('詳細情報の更新に失敗しました');
    } finally {
      setIsSubmittingInfo(false);
    }
  };

  // URLリンクの編集処理
  const handleEditLinksClick = () => {
    setTempLinks({
      github_url: links.github_url,
      website_url: links.website_url,
    });
    setIsEditingLinks(true);
  };

  const handleCancelLinks = () => {
    setTempLinks({
      github_url: links.github_url,
      website_url: links.website_url,
    });
    setIsEditingLinks(false);
  };

  const handleSaveLinks = async () => {
    try {
      setIsSubmittingLinks(true);

      // 空文字列の場合はnullに変換
      const dataToUpdate = {
        github_url:
          tempLinks.github_url.trim() === '' ? null : tempLinks.github_url,
        website_url:
          tempLinks.website_url.trim() === '' ? null : tempLinks.website_url,
      };

      await updateWorkLinks(work.id, dataToUpdate);

      setLinks({
        github_url: dataToUpdate.github_url || '',
        website_url: dataToUpdate.website_url || '',
      });
      setIsEditingLinks(false);
      toast.success('リンク情報を更新しました');
    } catch (error) {
      console.error('リンク情報の更新に失敗しました:', error);
      toast.error('リンク情報の更新に失敗しました');
    } finally {
      setIsSubmittingLinks(false);
    }
  };

  // GitHubリポジトリ選択時の処理
  const handleSelectRepository = (url: string) => {
    setTempLinks((prev) => ({
      ...prev,
      github_url: url,
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* サムネイル画像 */}
      <div className="md:col-span-1">
        <div className="rounded-lg overflow-hidden border bg-card aspect-video relative">
          {work.thumbnail_url ? (
            <Image
              src={work.thumbnail_url}
              alt={work.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
              画像なし
            </div>
          )}
        </div>

        {/* 外部リンク */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              外部リンク
            </h3>
            {!isEditingLinks && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEditLinksClick}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>

          {isEditingLinks ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="github_url" className="text-sm font-medium">
                  GitHubリポジトリ
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="github_url"
                    value={tempLinks.github_url}
                    onChange={(e) =>
                      setTempLinks((prev) => ({
                        ...prev,
                        github_url: e.target.value,
                      }))
                    }
                    placeholder="https://github.com/username/repo"
                    className="flex-1"
                    disabled={isSubmittingLinks}
                  />
                  <GithubRepositorySelectorModal
                    onSelect={handleSelectRepository}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="website_url" className="text-sm font-medium">
                  公開サイト
                </label>
                <Input
                  id="website_url"
                  value={tempLinks.website_url}
                  onChange={(e) =>
                    setTempLinks((prev) => ({
                      ...prev,
                      website_url: e.target.value,
                    }))
                  }
                  placeholder="https://example.com"
                  className="mt-1"
                  disabled={isSubmittingLinks}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelLinks}
                  disabled={isSubmittingLinks}
                >
                  <X className="mr-2 h-4 w-4" />
                  キャンセル
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveLinks}
                  disabled={isSubmittingLinks}
                >
                  <Check className="mr-2 h-4 w-4" />
                  保存
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              {links.github_url ? (
                <Link
                  href={links.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHubリポジトリ
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground flex items-center">
                  <Github className="mr-2 h-4 w-4" />
                  GitHubリポジトリ未設定
                </p>
              )}

              {links.website_url ? (
                <Link
                  href={links.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  公開サイト
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground flex items-center">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  公開サイト未設定
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 基本情報 */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-muted-foreground">説明</h3>
                  {!isEditingDescription && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleEditDescriptionClick}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {isEditingDescription ? (
                  <div className="mt-1">
                    <Textarea
                      value={tempDescription}
                      onChange={(e) => setTempDescription(e.target.value)}
                      rows={4}
                      disabled={isSubmittingDescription}
                      className="resize-none"
                    />
                    <div className="flex justify-end mt-2 space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelDescription}
                        disabled={isSubmittingDescription}
                      >
                        <X className="mr-2 h-4 w-4" />
                        キャンセル
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveDescription}
                        disabled={isSubmittingDescription}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        保存
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1">{description}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-muted-foreground">概要</h3>
                  {!isEditingOverview && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleEditOverviewClick}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {isEditingOverview ? (
                  <div className="mt-1">
                    <Textarea
                      value={tempOverview}
                      onChange={(e) => setTempOverview(e.target.value)}
                      rows={6}
                      disabled={isSubmittingOverview}
                      className="resize-none"
                    />
                    <div className="flex justify-end mt-2 space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelOverview}
                        disabled={isSubmittingOverview}
                      >
                        <X className="mr-2 h-4 w-4" />
                        キャンセル
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveOverview}
                        disabled={isSubmittingOverview}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        保存
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 whitespace-pre-wrap">
                    {detail.overview || '(未設定)'}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col col-span-3 items-end mb-2">
                  {!isEditingInfo && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleEditInfoClick}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {isEditingInfo ? (
                  <>
                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        担当
                      </h3>
                      <Input
                        value={tempInfo.role}
                        onChange={(e) =>
                          setTempInfo((prev) => ({
                            ...prev,
                            role: e.target.value,
                          }))
                        }
                        className="mt-1"
                        disabled={isSubmittingInfo}
                      />
                    </div>

                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        期間
                      </h3>
                      <Input
                        value={tempInfo.period}
                        onChange={(e) =>
                          setTempInfo((prev) => ({
                            ...prev,
                            period: e.target.value,
                          }))
                        }
                        className="mt-1"
                        disabled={isSubmittingInfo}
                      />
                    </div>

                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        規模
                      </h3>
                      <Input
                        value={tempInfo.team_size}
                        onChange={(e) =>
                          setTempInfo((prev) => ({
                            ...prev,
                            team_size: e.target.value,
                          }))
                        }
                        className="mt-1"
                        disabled={isSubmittingInfo}
                      />
                    </div>

                    <div className="col-span-3 flex justify-end mt-2 space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelInfo}
                        disabled={isSubmittingInfo}
                      >
                        <X className="mr-2 h-4 w-4" />
                        キャンセル
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveInfo}
                        disabled={isSubmittingInfo}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        保存
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        担当
                      </h3>
                      <p className="mt-1">{detail.role || '(未設定)'}</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        期間
                      </h3>
                      <p className="mt-1">{detail.period || '(未設定)'}</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        規模
                      </h3>
                      <p className="mt-1">{detail.team_size || '(未設定)'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

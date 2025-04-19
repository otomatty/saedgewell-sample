'use client';

import { useState, useRef, useTransition } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@kit/ui/dialog';
import { Button } from '@kit/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
  Trash2,
  Edit,
} from 'lucide-react';
import { Input } from '@kit/ui/input';
import { toast } from 'sonner';

import { uploadWorkImageAction } from '~/actions/works/upload-work-image';
import { deleteWorkImageAction } from '~/actions/works/delete-work-image';
import { updateWorkImageAction } from '~/actions/works/update-work-image';

interface WorkImage {
  id: string;
  url: string;
  alt: string;
  caption?: string | null;
  sort_order: number;
}

interface WorkGalleryProps {
  workId: string;
  initialImages: WorkImage[];
}

/**
 * 実績画像ギャラリーコンポーネント
 */
export function WorkGallery({ workId, initialImages }: WorkGalleryProps) {
  const [images, setImages] = useState<WorkImage[]>(initialImages);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nextImage = () => {
    if (images.length === 0) return;
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length === 0) return;
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectedImage = images[selectedIndex];

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('workId', workId);

    startTransition(async () => {
      try {
        // 実際のサーバーアクションを呼び出し
        const result = await uploadWorkImageAction(formData);

        if (result.success && result.data) {
          // 新しい画像データを状態に追加
          setImages((prev) =>
            [...prev, result.data].sort((a, b) => a.sort_order - b.sort_order)
          );
          // 新しく追加された画像を選択状態に
          setSelectedIndex(images.length);
          toast.success('画像をアップロードしました');
        } else {
          toast.error(result.error || '画像のアップロードに失敗しました');
        }
      } catch (error) {
        console.error(error);
        toast.error('予期せぬエラーが発生しました');
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // ファイル選択をクリア
        }
      }
    });
  };

  const handleImageDelete = (imageId: string, imageAlt: string) => {
    if (
      !window.confirm(
        `画像 "${imageAlt}" を削除しますか？\nこの操作は元に戻せません。`
      )
    ) {
      return;
    }

    startTransition(async () => {
      try {
        // 実際のサーバーアクションを呼び出し
        const result = await deleteWorkImageAction({ workId, imageId });

        if (result.success) {
          const newImages = images.filter((img) => img.id !== imageId);
          setImages(newImages);

          // 選択インデックスの調整
          if (newImages.length === 0) {
            setSelectedIndex(0); // 画像がなくなったら0に
          } else if (selectedIndex >= newImages.length) {
            setSelectedIndex(newImages.length - 1); // インデックスが範囲外になったら末尾を選択
          }

          toast.success('画像を削除しました');
        } else {
          toast.error(result.error || '画像の削除に失敗しました');
        }
      } catch (error) {
        console.error(error);
        toast.error('予期せぬエラーが発生しました');
      }
    });
  };

  const handleImageUpdate = (
    imageId: string,
    data: Partial<Pick<WorkImage, 'alt' | 'caption'>>
  ) => {
    startTransition(async () => {
      try {
        // 実際のサーバーアクションを呼び出し
        const result = await updateWorkImageAction({
          workId,
          imageId,
          ...data,
        });

        if (result.success && result.data) {
          setImages((prev) =>
            prev.map((img) =>
              img.id === imageId ? { ...img, ...result.data } : img
            )
          );
          toast.success('画像情報を更新しました');
        } else {
          toast.error(result.error || '画像情報の更新に失敗しました');
        }
      } catch (error) {
        console.error(error);
        toast.error('予期せぬエラーが発生しました');
      }
    });
  };

  // 簡易版の編集処理（本実装ではモーダルやフォームを使うと良い）
  const handleEditImage = (imageId: string) => {
    const image = images.find((img) => img.id === imageId);
    if (!image) return;

    // 簡易的なプロンプトで実装（本来はモーダルフォームが望ましい）
    const newAlt = prompt('画像の代替テキスト (alt):', image.alt);
    if (newAlt === null) return; // キャンセル時

    const newCaption = prompt('画像のキャプション:', image.caption || '');
    if (newCaption === null) return; // キャンセル時

    // 更新処理を呼び出し
    handleImageUpdate(imageId, {
      alt: newAlt,
      caption: newCaption || null,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>画像ギャラリー</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              disabled={isPending}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              disabled={isPending}
            >
              <Upload className="mr-2 h-4 w-4" />
              画像を追加
            </Button>
            {isPending && (
              <span className="text-sm text-muted-foreground">処理中...</span>
            )}
          </div>

          {images.length > 0 && selectedImage ? (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border cursor-pointer group">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-12 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageDelete(selectedImage.id, selectedImage.alt);
                    }}
                    disabled={isPending}
                    aria-label="画像を削除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditImage(selectedImage.id);
                    }}
                    disabled={isPending}
                    aria-label="画像を編集"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 1200px"
                    className="object-contain bg-muted/30"
                    priority
                    onClick={() => setIsDialogOpen(true)}
                  />
                  {selectedImage.caption && (
                    <div className="absolute bottom-0 left-0 w-full bg-black/70 p-2 text-white text-sm truncate">
                      {selectedImage.caption}
                    </div>
                  )}
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[80vh] p-0">
                <div className="relative h-full w-full">
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.alt}
                    fill
                    sizes="80vw"
                    className="object-contain"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 rounded-full bg-black/50 hover:bg-black/70 text-white"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  {images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        disabled={isPending}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        disabled={isPending}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </>
                  )}

                  {selectedImage.caption && (
                    <div className="absolute bottom-0 left-0 w-full bg-black/70 p-4 text-white text-base" />
                  )}
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <div className="flex items-center justify-center aspect-video w-full rounded-lg border border-dashed bg-muted/50">
              <p className="text-muted-foreground">
                画像が登録されていません。上のボタンから追加してください。
              </p>
            </div>
          )}

          {images.length > 1 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {images.map((image, index) => (
                <div key={image.id} className="relative group">
                  <button
                    className={`
                      relative aspect-square w-full rounded-md border overflow-hidden cursor-pointer block focus:outline-none focus:ring-ring focus:ring-offset-2
                      ${index === selectedIndex ? 'ring-primary ring-offset-1' : ''}
                    `}
                    onClick={() => setSelectedIndex(index)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedIndex(index);
                        e.preventDefault();
                      }
                    }}
                    type="button"
                    tabIndex={0}
                    aria-label={`画像${index + 1}: ${image.alt}`}
                    disabled={isPending}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 16vw, 12.5vw"
                      className="object-cover"
                    />
                    {index === selectedIndex && (
                      <div className="absolute inset-0 bg-primary/30 pointer-events-none" />
                    )}
                  </button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 z-10 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageDelete(image.id, image.alt);
                    }}
                    disabled={isPending}
                    aria-label="画像を削除"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

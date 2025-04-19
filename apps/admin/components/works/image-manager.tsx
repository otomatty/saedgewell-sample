'use client'; // 画像のアップロード、状態管理、インタラクションのため

/**
 * @file 画像管理コンポーネント。
 * @description 実績画像のアップロード、プレビュー、編集（代替テキスト、キャプション）、削除、並び替えを行います。
 * Supabase Storageとの連携が必要です。
 */

import type React from 'react';
import { useState, useEffect, useCallback, useTransition } from 'react';
import {
  useFieldArray,
  useFormContext,
  type UseFieldArrayReturn,
} from 'react-hook-form';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea';
import { UploadCloud, GripVertical, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Label } from '@kit/ui/label';
import { toast } from 'sonner';
import { v4 as uuid } from 'uuid';
import type {
  WorkFormData,
  ImageItem,
} from '../../app/(protected)/works/_components/schemas';
import { uploadImage } from '../../actions/storage/upload-image';
import { deleteImage } from '../../actions/storage/delete-image';
import { createBlobUrl, revokeBlobUrl } from '../../lib/storage-utils';

// UI 状態 (ローディング、エラー) を管理するための型
interface ImageUiState {
  uploading: boolean;
  error?: string;
}

/**
 * DnD 機能付きの画像リストアイテム
 */
interface SortableImageItemProps {
  /** dnd-kit で使用する一意なID (ImageItem.id) */
  dndId: string;
  /** 表示対象の画像データ (Zod スキーマ由来) */
  item: ImageItem;
  /** 配列内でのインデックス */
  index: number;
  /** useFieldArray の remove 関数 */
  removeFn: UseFieldArrayReturn<WorkFormData, 'images', 'fieldId'>['remove'];
  /** フォームフィールド名を特定するためのプレフィックス (例: "images") */
  namePrefix: 'images'; // 固定
  /** このアイテムのUI状態 (uploading, error) */
  uiState: ImageUiState | undefined;
  /** 画像を削除する関数 */
  onDeleteImage?: (url: string) => Promise<void>;
}

const SortableImageItem: React.FC<SortableImageItemProps> = ({
  dndId,
  item,
  index,
  removeFn,
  namePrefix,
  uiState,
  onDeleteImage,
}) => {
  const { setValue } = useFormContext<WorkFormData>();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: dndId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  /**
   * 代替テキストまたはキャプションを更新します。
   * @param field 更新するフィールド名 ('alt' または 'caption')
   * @param value 新しい値
   */
  const handleUpdateField = (
    field: keyof Pick<ImageItem, 'alt' | 'caption'>,
    value: string
  ) => {
    // useFieldArray の update より setValue の方が部分更新に適している
    setValue(`${namePrefix}.${index}.${field}`, value, { shouldDirty: true });
  };

  /**
   * 画像をリストから削除します。
   */
  const handleRemove = async () => {
    try {
      // サーバーに画像が保存されていたら削除
      if (item.url && !item.url.startsWith('blob:') && onDeleteImage) {
        await onDeleteImage(item.url);
      }

      // Blob URL があれば revoke
      if (item.url?.startsWith('blob:')) {
        revokeBlobUrl(item.url);
      }

      removeFn(index);
      // TODO: 削除後の order 更新ロジックを ImageManager 側で実行する
      // TODO: 関連する UI State (uiStateMap) も削除する
    } catch (error) {
      console.error('画像削除エラー:', error);
      toast.error('画像の削除に失敗しました');
    }
  };

  // UI表示用の状態は props から受け取る
  const uploading = uiState?.uploading ?? false;
  const error = uiState?.error;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-4 flex items-start space-x-3 rounded border bg-card p-4 shadow"
    >
      {/* ドラッグハンドル */}
      <button
        {...attributes}
        {...listeners}
        type="button"
        className="cursor-grab touch-none pt-1 text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="画像を並び替え"
      >
        <GripVertical size={20} />
      </button>

      {/* 画像プレビュー */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded">
        {item.url ? (
          <Image
            src={item.url}
            alt={item.alt} // altは必須なので || 'プレビュー' は不要
            fill
            sizes="96px"
            className="object-cover"
            priority={index < 3}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            ?
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
        {error && (
          <div className="absolute bottom-0 left-0 w-full bg-destructive/80 p-1 text-center text-xs text-destructive-foreground">
            {error}
          </div>
        )}
      </div>

      {/* 代替テキストとキャプション */}
      <div className="flex-1 space-y-2">
        <Input
          placeholder="代替テキスト (必須)"
          value={item.alt} // Zod スキーマで必須のはず
          onChange={(e) => handleUpdateField('alt', e.target.value)}
          required // UI上の必須マーク
          aria-label={`画像 ${index + 1} の代替テキスト`}
          disabled={uploading}
        />
        <Textarea
          placeholder="キャプション (任意)"
          value={item.caption || ''} // caption は optional
          onChange={(e) => handleUpdateField('caption', e.target.value)}
          rows={2}
          aria-label={`画像 ${index + 1} のキャプション`}
          disabled={uploading}
        />
      </div>

      {/* 削除ボタン */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleRemove}
        type="button"
        className="text-destructive hover:text-destructive"
        aria-label={`画像 ${index + 1} を削除`}
        disabled={uploading}
      >
        <Trash2 size={18} />
      </Button>
    </div>
  );
};

/**
 * 画像のアップロード、プレビュー、並び替え、メタデータ編集を行うコンポーネント。
 * react-hook-form と zod、@dnd-kit と連携します。
 * 親コンポーネントが FormProvider でラップされている必要があります。
 */
const ImageManager = ({ workId }: { workId?: string }) => {
  const name = 'images';
  const { control, getValues, setValue } = useFormContext<WorkFormData>();
  const [isPending, startTransition] = useTransition();

  const { fields, append, remove, move } = useFieldArray<
    WorkFormData,
    'images',
    'fieldId'
  >({
    control,
    name,
    keyName: 'fieldId',
  });

  const [imageUiStateMap, setImageUiStateMap] = useState<
    Record<string, ImageUiState>
  >({});

  // 既存の画像データに基づいて初期UI状態を設定
  useEffect(() => {
    const initialImages = getValues(name);
    if (Array.isArray(initialImages)) {
      const initialMap: Record<string, ImageUiState> = {};
      for (const img of initialImages) {
        if (img?.id) {
          initialMap[img.id] = { uploading: false, error: undefined };
        }
      }
      setImageUiStateMap(initialMap);
    }
  }, [getValues]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fieldIds = fields.map(
    (_, index) => getValues(`${name}.${index}`)?.id ?? ''
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fieldIds.indexOf(active.id.toString());
      const newIndex = fieldIds.indexOf(over.id.toString());
      if (oldIndex !== -1 && newIndex !== -1) {
        move(oldIndex, newIndex);
        // 並び替え後にorderを更新
        updateOrdersAfterChange();
      }
    }
  };

  /**
   * 画像ファイルの選択ハンドラ
   */
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    // 選択されたすべてのファイルをループ処理
    for (const file of Array.from(fileList)) {
      try {
        // 一意のIDを生成
        const imageId = uuid();

        // 一時的なBlob URLを生成
        const blobUrl = createBlobUrl(file);

        // UI状態を更新 (アップロード中)
        setImageUiStateMap((prev) => ({
          ...prev,
          [imageId]: { uploading: true },
        }));

        // フォームに追加（一時URL）
        const newImageItem: ImageItem = {
          id: imageId,
          url: blobUrl,
          alt: file.name.split('.')[0] || '画像', // デフォルトの代替テキストはファイル名から
          order: getValues(name)?.length || 0,
        };

        append(newImageItem);

        // 実際のアップロード処理（workIdが存在する場合のみ）
        if (workId) {
          startTransition(async () => {
            try {
              // Server Actionを使用して画像をアップロード
              const permanentUrl = await uploadImage(blobUrl, workId);

              // 一時URLを解放
              revokeBlobUrl(blobUrl);

              // フォームの値を更新（永続的なURL）
              const index = getValues(name).findIndex(
                (item) => item.id === imageId
              );
              if (index !== -1) {
                setValue(`${name}.${index}.url`, permanentUrl, {
                  shouldDirty: true,
                });
              }

              // UI状態を更新（アップロード完了）
              setImageUiStateMap((prev) => ({
                ...prev,
                [imageId]: { uploading: false },
              }));

              // 順序を更新
              updateOrdersAfterChange();
            } catch (error) {
              console.error('画像アップロードエラー:', error);

              // UI状態をエラーに更新
              setImageUiStateMap((prev) => ({
                ...prev,
                [imageId]: {
                  uploading: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : '画像のアップロードに失敗しました',
                },
              }));

              toast.error('画像のアップロードに失敗しました');
            }
          });
        } else {
          // workIdがない場合（新規作成時など）は一時的なBlob URLのままにする
          setImageUiStateMap((prev) => ({
            ...prev,
            [imageId]: { uploading: false },
          }));
        }
      } catch (error) {
        console.error('画像処理エラー:', error);
        toast.error('画像の処理に失敗しました');
      }
    }

    // 入力をリセット（同じファイルを連続で選択できるようにする）
    event.target.value = '';
  };

  /**
   * 画像削除ハンドラ
   */
  const handleDeleteImage = useCallback(
    async (url: string) => {
      if (!url) return;

      try {
        if (workId && !url.startsWith('blob:')) {
          // Server Actionを使用して画像を削除
          const success = await deleteImage(url);
          if (!success) {
            throw new Error('画像の削除に失敗しました');
          }
        } else if (url.startsWith('blob:')) {
          // Blob URLを解放
          revokeBlobUrl(url);
        }
      } catch (error) {
        console.error('画像削除エラー:', error);
        throw error; // 呼び出し元でハンドリングするためにエラーを再スロー
      }
    },
    [workId]
  );

  /**
   * 画像の順序を更新
   */
  const updateOrdersAfterChange = () => {
    const images = getValues(name);
    if (!Array.isArray(images)) return;

    // 各画像のorder値を更新
    images.forEach((_, index) => {
      setValue(`${name}.${index}.order`, index, { shouldDirty: true });
    });
  };

  // DnDのコンテキストが提供するコンポーネント
  return (
    <Card>
      <CardHeader>
        <CardTitle>画像</CardTitle>
      </CardHeader>
      <CardContent>
        {/* ファイル選択UI */}
        <div className="mb-6">
          <Label htmlFor="image-upload" className="mb-2 block">
            画像をアップロード
          </Label>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="w-full cursor-pointer py-8 text-center"
              onClick={() => document.getElementById('image-upload')?.click()}
              type="button"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="mr-2 h-5 w-5" />
              )}
              画像を選択
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                aria-label="画像を選択"
                disabled={isPending}
              />
            </Button>
          </div>
        </div>

        {/* 画像リスト */}
        <div>
          {fields.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fieldIds}
                strategy={verticalListSortingStrategy}
              >
                {fields.map((field, index) => {
                  const item = getValues(`${name}.${index}`);
                  return (
                    <SortableImageItem
                      key={field.fieldId}
                      dndId={item?.id || field.fieldId}
                      item={item}
                      index={index}
                      removeFn={remove}
                      namePrefix={name}
                      uiState={item?.id ? imageUiStateMap[item.id] : undefined}
                      onDeleteImage={handleDeleteImage}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
          ) : (
            <div className="rounded border border-dashed p-6 text-center text-muted-foreground">
              まだ画像がありません。「画像を選択」ボタンをクリックして画像をアップロードしてください。
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageManager;

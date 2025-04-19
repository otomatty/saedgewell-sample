'use client'; // リストの状態管理とインタラクション、DnDのため

/**
 * @file 編集可能なリストコンポーネント。
 * @description 課題、解決策、担当業務、成果など、複数の項目を持つリストを管理します。
 * 項目の追加、編集、削除、ドラッグ&ドロップによる並び替え機能を提供します。
 * react-hook-form と @dnd-kit と連携します。
 */

import React, { useCallback, useState } from 'react';
import {
  useFieldArray,
  useFormContext,
  Controller,
  type Control,
  type FieldValues,
  type UseFieldArrayAppend,
  type UseFieldArrayRemove,
  type UseFieldArrayMove,
  UseFieldArrayProps,
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea';
import { GripVertical, Plus, Trash2, Pencil } from 'lucide-react'; // アイコン例
import { cn } from '@kit/ui/utils';
import { Label } from '@kit/ui/label';
import ConfirmationDialog from './confirmation-dialog'; // 削除確認用

// 基本となるリストアイテムの型定義
export type ListItemBase = {
  id: string;
  [key: string]: unknown;
};

/** 各リストアイテムが持つフィールドの定義 */
interface ItemFieldSchema {
  name: string; // フィールド名 (react-hook-formのnameに対応)
  label: string; // 表示ラベル
  type: 'input' | 'textarea'; // 入力タイプ
  required?: boolean; // 必須フラグ
  placeholder?: string;
}

/** EditableList コンポーネントの Props */
interface EditableListProps {
  /** react-hook-form の control オブジェクト */
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  control: Control<any>;
  /** フィールド配列の名前 (例: 'challenges') */
  name: string;
  /** 各リストアイテムが持つフィールドのスキーマ定義 */
  itemSchema: ItemFieldSchema[];
  /** 「項目を追加」ボタンのラベル */
  addLabel?: string;
  /** リスト全体のラベル (オプション) */
  listLabel?: string;
  /** 項目削除時の確認メッセージ (オプション) */
  confirmDeleteMessage?: (item: ListItemBase) => string;
}

/**
 * ドラッグ可能なリストアイテムを表示する内部コンポーネント。
 */
const SortableItem = React.memo(
  ({
    id,
    index,
    item,
    itemSchema,
    control,
    name,
    onRemove,
    onEdit,
    confirmDeleteMessage,
  }: {
    id: string;
    index: number;
    item: ListItemBase;
    itemSchema: ItemFieldSchema[];
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    control: Control<any>;
    name: string;
    onRemove: (index: number) => void;
    onEdit?: (index: number) => void;
    confirmDeleteMessage?: (item: ListItemBase) => string;
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 10 : undefined, // ドラッグ中は手前に表示
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn(
          'flex items-start space-x-2 bg-card border p-3 rounded mb-2 shadow-sm',
          isDragging && 'opacity-75 shadow-lg'
        )}
      >
        {/* ドラッグハンドル */}
        <button
          type="button"
          {...listeners}
          className="cursor-move pt-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded"
        >
          <GripVertical size={18} />
          <span className="sr-only">並び替え</span>
        </button>

        {/* フォームフィールド */}
        <div className="flex-grow space-y-2">
          {itemSchema.map((fieldSchema) => (
            <Controller
              key={fieldSchema.name}
              name={`${name}.${index}.${fieldSchema.name}`}
              control={control}
              rules={{ required: fieldSchema.required }}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <Label htmlFor={field.name}>
                    {fieldSchema.label}
                    {fieldSchema.required && ' *'}
                  </Label>
                  {fieldSchema.type === 'textarea' ? (
                    <Textarea
                      id={field.name}
                      placeholder={fieldSchema.placeholder}
                      {...field}
                      className={cn(fieldState.error && 'border-destructive')}
                    />
                  ) : (
                    <Input
                      id={field.name}
                      placeholder={fieldSchema.placeholder}
                      {...field}
                      className={cn(fieldState.error && 'border-destructive')}
                    />
                  )}
                  {fieldState.error && (
                    <p className="text-sm text-destructive">
                      {fieldState.error.message || '入力エラー'}
                    </p>
                  )}
                </div>
              )}
            />
          ))}
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col space-y-1 pt-1">
          {onEdit && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onEdit(index)}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <Pencil size={14} />
              <span className="sr-only">編集</span>
            </Button>
          )}
          <ConfirmationDialog
            trigger={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 size={14} />
                <span className="sr-only">削除</span>
              </Button>
            }
            title="項目の削除"
            description={
              confirmDeleteMessage
                ? confirmDeleteMessage(item)
                : 'この項目を削除してもよろしいですか？'
            }
            onConfirm={async () => onRemove(index)}
          />
        </div>
      </div>
    );
  }
);
SortableItem.displayName = 'SortableItem';

/**
 * 編集可能なリストコンポーネント。
 * react-hook-form と @dnd-kit を使用します。
 */
const EditableList = ({
  control,
  name,
  itemSchema,
  addLabel = '項目を追加',
  listLabel,
  confirmDeleteMessage,
}: EditableListProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fields, append, remove, move } = useFieldArray({
    control,
    name,
    keyName: 'id',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ドラッグ終了時の処理
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = fields.findIndex((item) => item.id === active.id);
        const newIndex = fields.findIndex((item) => item.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          move(oldIndex, newIndex);
        }
      }
    },
    [fields, move]
  );

  // 項目追加処理
  const handleAddItem = useCallback(() => {
    const defaultValues: Record<string, unknown> = {};
    for (const schema of itemSchema) {
      defaultValues[schema.name] = '';
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    append(defaultValues as any);
  }, [append, itemSchema]);

  // 項目削除処理 (ConfirmationDialog内で呼び出される)
  const handleRemoveItem = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  // TODO: 項目編集処理 (例: モーダルを開く、など)
  const handleEditItem = useCallback(
    (index: number) => {
      console.log('Edit item at index:', index, fields[index]);
      // ここで編集用のモーダルを開く等の処理を実装
      alert(`Edit item at index: ${index} (実装はTODO)`);
    },
    [fields]
  );

  return (
    <div className="space-y-4">
      {listLabel && (
        <Label className="text-base font-medium">{listLabel}</Label>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={fields} strategy={verticalListSortingStrategy}>
          {fields.map((field, index) => (
            <SortableItem
              key={field.id}
              id={field.id}
              index={index}
              item={field as ListItemBase}
              itemSchema={itemSchema}
              control={control}
              name={name}
              onRemove={handleRemoveItem}
              onEdit={handleEditItem}
              confirmDeleteMessage={confirmDeleteMessage}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button type="button" variant="outline" onClick={handleAddItem} size="sm">
        <Plus className="mr-2 h-4 w-4" /> {addLabel}
      </Button>
    </div>
  );
};

export default EditableList;

'use client';

import { useAtom } from 'jotai';
import { Card } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { Badge } from '@kit/ui/badge';
import { AlertTriangle, ArrowLeft, Download, Send } from 'lucide-react';
import { toast } from 'sonner';
import {
  formDataAtom,
  proposedFeaturesAtom,
  selectedFeatureIdsAtom,
  currentStepAtom,
} from '~/store/estimate';
import { calculateRushFee } from '../../_utils/calculateRushFee';
import { calculateImplementationCosts } from '../../_utils/calculateImplementationCosts';
import { Alert, AlertDescription } from '@kit/ui/alert';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { EstimatePDFDocument } from '../pdf/estimate-pdf-document';

/**
 * 見積もり結果表示およびPDFダウンロード/問い合わせを行うステップコンポーネント
 */
export function EstimateResultStep() {
  const [formData] = useAtom(formDataAtom);
  const [proposedFeatures] = useAtom(proposedFeaturesAtom);
  const [selectedFeatureIds] = useAtom(selectedFeatureIdsAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);

  const selectedFeatures = proposedFeatures.filter((f) =>
    selectedFeatureIds.includes(f.id)
  );

  // 機能の基本費用と期間を計算
  const basePrice = selectedFeatures.reduce((sum, f) => sum + f.price, 0);
  const baseDuration = selectedFeatures.reduce((sum, f) => sum + f.duration, 0);

  // 実装要件による追加コストと期間を計算
  const implementationCosts = formData.implementationRequirements
    ? calculateImplementationCosts(formData.implementationRequirements)
    : {
        totalAdditionalCost: 0,
        additionalDuration: 0,
        designCost: { amount: 0, reason: '' },
        assetsCost: { amount: 0, reason: '' },
        contentCost: { amount: 0, reason: '' },
      };

  // 合計金額と期間を計算
  const totalPrice = basePrice + implementationCosts.totalAdditionalCost;
  const totalDuration = baseDuration + implementationCosts.additionalDuration;

  // 特急料金の計算
  const rushFeeCalculation = calculateRushFee(
    totalPrice,
    totalDuration,
    formData.deadline
  );

  const handleAdjustDeadline = () => {
    setCurrentStep('deadline');
  };

  /**
   * 問い合わせボタンのクリックハンドラ
   */
  const handleSendInquiry = () => {
    // TODO: 問い合わせフォームへの遷移処理を実装
    console.log('Send inquiry');
  };

  const pdfDocumentProps = {
    data: formData,
    baseCost: basePrice,
    rushFee: rushFeeCalculation.rushFee,
    totalCost: rushFeeCalculation.totalPrice,
    selectedFeatures: selectedFeatures.map((f) => ({ name: f.name })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-4">見積もり概要</h3>
        <Card className="p-4 space-y-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              プロジェクトの種類
            </div>
            <div className="font-medium">
              {formData.projectType === 'website'
                ? 'Webサイト'
                : formData.projectType === 'business_system'
                  ? '業務システム'
                  : formData.projectType === 'application'
                    ? 'Webアプリケーション'
                    : 'その他'}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">開発期間</div>
            <div className="font-medium">
              {formData.deadline === 'asap'
                ? 'できるだけ早く'
                : formData.deadline === '1month'
                  ? '1ヶ月以内'
                  : formData.deadline === '3months'
                    ? '3ヶ月以内'
                    : formData.deadline === '6months'
                      ? '6ヶ月以内'
                      : '柔軟に対応可能'}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              プロジェクトの概要
            </div>
            <div className="font-medium whitespace-pre-wrap">
              {formData.description}
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">選択された機能</h3>
        <div className="grid gap-4">
          {selectedFeatures.map((feature) => (
            <Card key={feature.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-medium">{feature.name}</div>
                    {feature.isRequired && <Badge>必須</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {feature.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {feature.price.toLocaleString()}円
                  </div>
                  <div className="text-sm text-muted-foreground">
                    約{feature.duration.toFixed(1)}日
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {(implementationCosts.designCost.amount > 0 ||
        implementationCosts.assetsCost.amount > 0 ||
        implementationCosts.contentCost.amount > 0) && (
        <div>
          <h3 className="text-lg font-bold mb-4">追加実装要件</h3>
          <div className="grid gap-4">
            {implementationCosts.designCost.amount > 0 && (
              <Card className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">デザイン関連</div>
                    <p className="text-sm text-muted-foreground">
                      {implementationCosts.designCost.reason}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {implementationCosts.designCost.amount.toLocaleString()}円
                    </div>
                  </div>
                </div>
              </Card>
            )}
            {implementationCosts.assetsCost.amount > 0 && (
              <Card className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">アセット関連</div>
                    <p className="text-sm text-muted-foreground">
                      {implementationCosts.assetsCost.reason}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {implementationCosts.assetsCost.amount.toLocaleString()}円
                    </div>
                  </div>
                </div>
              </Card>
            )}
            {implementationCosts.contentCost.amount > 0 && (
              <Card className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">コンテンツ関連</div>
                    <p className="text-sm text-muted-foreground">
                      {implementationCosts.contentCost.reason}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {implementationCosts.contentCost.amount.toLocaleString()}
                      円
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      <Card className="p-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold mb-1">見積もり合計</h3>
            <p className="text-sm text-muted-foreground">
              選択した機能と追加実装要件の合計金額と想定開発期間
            </p>
          </div>
          <div className="text-right">
            {rushFeeCalculation.rushFee > 0 ? (
              <>
                <div className="text-base line-through text-muted-foreground mb-1">
                  {rushFeeCalculation.basePrice.toLocaleString()}円
                </div>
                <div className="text-2xl font-bold mb-1 text-primary">
                  {rushFeeCalculation.totalPrice.toLocaleString()}円
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  （特急料金：{rushFeeCalculation.rushFee.toLocaleString()}
                  円）
                </div>
              </>
            ) : (
              <div className="text-2xl font-bold mb-1">
                {rushFeeCalculation.totalPrice.toLocaleString()}円
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              想定開発期間：約{totalDuration.toFixed(1)}日
            </div>
          </div>
        </div>
        {rushFeeCalculation.rushFee > 0 && (
          <div className="space-y-4 mb-6">
            {rushFeeCalculation.isTimelineDangerous ? (
              <Alert
                variant="destructive"
                className="bg-destructive/10 border-none"
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{rushFeeCalculation.reason}</AlertDescription>
              </Alert>
            ) : (
              <div className="p-3 bg-primary/10 rounded-md text-sm">
                {rushFeeCalculation.reason}
              </div>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleAdjustDeadline}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              開発期間を調整する
            </Button>
          </div>
        )}
        <div className="flex gap-4">
          <PDFDownloadLink
            document={<EstimatePDFDocument {...pdfDocumentProps} />}
            fileName={`見積書_${new Date().toLocaleDateString('ja-JP')}.pdf`}
          >
            {({ blob, url, loading, error }) => (
              <Button disabled={loading} className="w-full md:w-auto">
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <title>Loading...</title>
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    生成中...
                  </span>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    PDFでダウンロード
                  </>
                )}
              </Button>
            )}
          </PDFDownloadLink>
          <Button className="flex-1" onClick={handleSendInquiry}>
            <Send className="w-4 h-4 mr-2" />
            問い合わせる
          </Button>
        </div>
      </Card>

      <div className="text-sm text-muted-foreground">
        <p>※ この見積もりは概算です。</p>
        <p>
          実際の開発費用や期間は、詳細な要件定義や技術的な制約によって変動する可能性があります。
        </p>
        <p>
          正確な見積もりをご希望の場合は、問い合わせフォームよりご連絡ください。
        </p>
      </div>
    </div>
  );
}

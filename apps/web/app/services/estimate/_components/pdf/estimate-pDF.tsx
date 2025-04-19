import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type {
  EstimateFormData,
  FeatureProposal,
  ImplementationCosts,
  RushFeeCalculation,
} from '../../../../../types/estimate';

// フォントの登録
Font.register({
  family: 'NotoSansJP',
  src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5.0.16/files/noto-sans-jp-japanese-400-normal.woff',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5.0.16/files/noto-sans-jp-japanese-700-normal.woff',
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'NotoSansJP',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    borderBottom: '1px solid #000',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 120,
    fontSize: 12,
    color: '#666',
  },
  value: {
    flex: 1,
    fontSize: 12,
  },
  card: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 4,
    border: '1px solid #eee',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 10,
    color: '#666',
  },
  badge: {
    fontSize: 10,
    color: '#fff',
    backgroundColor: '#000',
    padding: '2px 6px',
    borderRadius: 4,
    marginLeft: 5,
  },
  total: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
});

interface EstimatePDFProps {
  formData: EstimateFormData;
  selectedFeatures: FeatureProposal[];
  implementationCosts: ImplementationCosts;
  rushFeeCalculation: RushFeeCalculation;
  totalDuration: number;
}

export function EstimatePDF({
  formData,
  selectedFeatures,
  implementationCosts,
  rushFeeCalculation,
  totalDuration,
}: EstimatePDFProps) {
  const today = new Date().toLocaleDateString('ja-JP');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ヘッダー */}
        <View style={styles.section}>
          <Text style={styles.title}>お見積書</Text>
          <View style={styles.row}>
            <Text style={styles.label}>発行日：</Text>
            <Text style={styles.value}>{today}</Text>
          </View>
        </View>

        {/* プロジェクト概要 */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>プロジェクト概要</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>プロジェクト種類：</Text>
              <Text style={styles.value}>
                {formData.projectType === 'web'
                  ? 'Webサイト'
                  : formData.projectType === 'app'
                    ? 'Webアプリケーション'
                    : 'その他'}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>希望開発期間：</Text>
              <Text style={styles.value}>
                {formData.deadline === 'asap'
                  ? 'できるだけ早く'
                  : formData.deadline === '1month'
                    ? '1ヶ月以内'
                    : formData.deadline === '3months'
                      ? '3ヶ月以内'
                      : formData.deadline === '6months'
                        ? '6ヶ月以内'
                        : '柔軟に対応可能'}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>プロジェクト概要：</Text>
              <Text style={styles.value}>{formData.description}</Text>
            </View>
          </View>
        </View>

        {/* 機能一覧 */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>実装機能</Text>
          {selectedFeatures.map((feature) => (
            <View key={feature.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.cardTitle}>{feature.name}</Text>
                  {feature.isRequired && <Text style={styles.badge}>必須</Text>}
                </View>
                <Text style={styles.cardPrice}>
                  {feature.price.toLocaleString()}円
                </Text>
              </View>
              <Text style={styles.cardDescription}>{feature.description}</Text>
              <Text style={styles.cardDescription}>
                想定開発期間：約{feature.duration.toFixed(1)}日
              </Text>
            </View>
          ))}
        </View>

        {/* 追加実装要件 */}
        {(implementationCosts.designCost.amount > 0 ||
          implementationCosts.assetsCost.amount > 0 ||
          implementationCosts.contentCost.amount > 0) && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>追加実装要件</Text>
            {implementationCosts.designCost.amount > 0 && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>デザイン関連</Text>
                  <Text style={styles.cardPrice}>
                    {implementationCosts.designCost.amount.toLocaleString()}円
                  </Text>
                </View>
                <Text style={styles.cardDescription}>
                  {implementationCosts.designCost.reason}
                </Text>
              </View>
            )}
            {implementationCosts.assetsCost.amount > 0 && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>アセット関連</Text>
                  <Text style={styles.cardPrice}>
                    {implementationCosts.assetsCost.amount.toLocaleString()}円
                  </Text>
                </View>
                <Text style={styles.cardDescription}>
                  {implementationCosts.assetsCost.reason}
                </Text>
              </View>
            )}
            {implementationCosts.contentCost.amount > 0 && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>コンテンツ関連</Text>
                  <Text style={styles.cardPrice}>
                    {implementationCosts.contentCost.amount.toLocaleString()}円
                  </Text>
                </View>
                <Text style={styles.cardDescription}>
                  {implementationCosts.contentCost.reason}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* 合計金額 */}
        <View style={styles.total}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>基本料金：</Text>
            <Text style={styles.totalValue}>
              {rushFeeCalculation.basePrice.toLocaleString()}円
            </Text>
          </View>
          {rushFeeCalculation.rushFee > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>特急料金：</Text>
              <Text style={styles.totalValue}>
                {rushFeeCalculation.rushFee.toLocaleString()}円
              </Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>合計金額：</Text>
            <Text style={styles.totalValue}>
              {rushFeeCalculation.totalPrice.toLocaleString()}円
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>想定開発期間：</Text>
            <Text style={styles.totalValue}>
              約{totalDuration.toFixed(1)}日
            </Text>
          </View>
        </View>

        {/* フッター */}
        <View style={styles.footer}>
          <Text>※ この見積もりは概算です。</Text>
          <Text>
            実際の開発費用や期間は、詳細な要件定義や技術的な制約によって変動する可能性があります。
          </Text>
          <Text>
            正確な見積もりをご希望の場合は、問い合わせフォームよりご連絡ください。
          </Text>
        </View>
      </Page>
    </Document>
  );
}

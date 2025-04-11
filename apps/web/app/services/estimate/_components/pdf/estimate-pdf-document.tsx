import type React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type { EstimateFormData } from '../../../../../types/estimate';

// フォントの登録 (パスは環境に合わせて調整してください)
// WARN: フォントファイルが実際にこのパスに存在する必要があります
Font.register({
  family: 'Noto Sans JP',
  fonts: [
    {
      src: './public/fonts/NotoSansJP-VariableFont_wght.ttf',
      fontWeight: 400,
    },
    {
      src: './public/fonts/NotoSansJP-VariableFont_wght.ttf',
      fontWeight: 700,
    },
  ],
});

// スタイルの定義
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Noto Sans JP',
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 30,
    lineHeight: 1.5,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 700,
  },
  date: {
    fontSize: 10,
    textAlign: 'right',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  text: {
    fontSize: 11,
  },
  listItem: {
    marginLeft: 10,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '70%',
    borderStyle: 'solid',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f0f0f0',
    padding: 5,
    fontWeight: 700,
  },
  tableCol: {
    width: '70%',
    borderStyle: 'solid',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 5,
  },
  tableColAmountHeader: {
    width: '30%',
    borderStyle: 'solid',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f0f0f0',
    padding: 5,
    textAlign: 'right',
    fontWeight: 700,
  },
  tableColAmount: {
    width: '30%',
    borderStyle: 'solid',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 5,
    textAlign: 'right',
  },
  totalRow: {
    fontWeight: 700,
  },
  notes: {
    marginTop: 30,
    fontSize: 9,
    color: '#666',
  },
});

interface EstimatePDFDocumentProps {
  data: EstimateFormData;
  baseCost: number;
  rushFee: number;
  totalCost: number;
  selectedFeatures: { name: string }[];
}

/**
 * 見積書PDFを生成するためのReactコンポーネント
 */
export const EstimatePDFDocument: React.FC<EstimatePDFDocumentProps> = ({
  data,
  baseCost,
  rushFee,
  totalCost,
  selectedFeatures,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>お見積書</Text>
      <Text style={styles.date}>
        発行日: {new Date().toLocaleDateString('ja-JP')}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>プロジェクト概要</Text>
        <Text style={styles.text}>{data.description}</Text>
      </View>

      {/* 実装要件は data.implementationRequirements を参照して表示する必要があるが、
          元の renderPDFTemplate のロジックをここに移植する必要がある。
          一旦省略。 TODO: 実装要件表示を追加 */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>実装要件</Text>
         ... 
      </View> */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>機能一覧</Text>
        {selectedFeatures.map((feature) => (
          <Text key={feature.name} style={styles.listItem}>
            ・ {feature.name}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>見積金額</Text>
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>項目</Text>
            <Text style={styles.tableColAmountHeader}>金額 (税抜)</Text>
          </View>
          {/* Base Cost Row */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>基本料金</Text>
            <Text style={styles.tableColAmount}>
              ¥{baseCost.toLocaleString()}
            </Text>
          </View>
          {/* Rush Fee Row (if applicable) */}
          {rushFee > 0 && (
            <View style={styles.tableRow}>
              <Text style={styles.tableCol}>特急料金</Text>
              <Text style={styles.tableColAmount}>
                ¥{rushFee.toLocaleString()}
              </Text>
            </View>
          )}
          {/* Total Cost Row */}
          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={styles.tableCol}>合計金額 (税抜)</Text>
            <Text style={styles.tableColAmount}>
              ¥{totalCost.toLocaleString()}
            </Text>
          </View>
          {/* Total Cost Row (incl. tax) */}
          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={styles.tableCol}>合計金額 (税込)</Text>
            <Text style={styles.tableColAmount}>
              ¥{Math.floor(totalCost * 1.1).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.notes}>
        <Text>※ 本見積もりの有効期限は発行日より30日間です。</Text>
        <Text>※ 実際の開発内容により金額が変動する可能性があります。</Text>
      </View>
    </Page>
  </Document>
);

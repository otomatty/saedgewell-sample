'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import {
  FileText,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  CalendarClock,
} from 'lucide-react';
import { SectionTitle } from '@kit/ui/section-title';
import { ContactDialog } from '~/components/contacts/contact-dialog';
import { cn } from '@kit/ui/utils';

export interface CTASectionProps {
  /**
   * 見出し
   * @default "Contact"
   */
  title?: string;
  /**
   * 副見出し
   * @default "お問い合わせ・お見積り"
   */
  subtitle?: string;
  /**
   * お問い合わせボタンのテキスト
   * @default "お問い合わせ"
   */
  contactButtonText?: string;
  /**
   * 見積もりページのリンク
   * @default "/services/estimate"
   */
  estimateLink?: string;
  /**
   * 見積もりボタンのテキスト
   * @default "お見積りはこちら"
   */
  estimateButtonText?: string;
  /**
   * メールアドレス
   * @default "saedgewell@gmail.com"
   */
  email?: string;
  /**
   * 電話番号
   * @default "080-9068-9306"
   */
  phoneNumber?: string;
}

const AvailabilityIndicator = ({ status }: { status: '○' | '△' | '×' }) => {
  const getColor = () => {
    switch (status) {
      case '○':
        return 'bg-green-500/80 ring-green-500/30';
      case '△':
        return 'bg-yellow-500/80 ring-yellow-500/30';
      case '×':
        return 'bg-red-500/80 ring-red-500/30';
      default:
        return 'bg-gray-500/80 ring-gray-500/30';
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          'w-3 h-3 rounded-full ring-2 ring-offset-1 ring-offset-background transition-all',
          getColor()
        )}
      />
    </div>
  );
};

/**
 * CTAセクション
 * @param props
 * @constructor
 */
export const CTASection = ({
  title = 'Contact',
  subtitle = 'お問い合わせ・お見積り',
  contactButtonText = 'お問い合わせはこちら',
  estimateLink = '/services/estimate',
  estimateButtonText = 'お見積りはこちら',
  email = 'saedgewell@gmail.com',
  phoneNumber = '080-9068-9306',
}: CTASectionProps) => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* 背景のデコレーション */}
      <div className="absolute inset-0 bg-linear-to-b from-background to-muted/30" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container relative mx-auto px-4">
        <SectionTitle
          title={title}
          subtitle={subtitle}
          align="center"
          className="mb-16"
        />

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-linear-to-r from-primary to-primary-foreground rounded-2xl blur-sm opacity-25 transition-all group-hover:opacity-40" />
            <Card className="relative h-full bg-card/95 backdrop-blur-sm supports-backdrop-filter:bg-card/75 transition-all duration-300 group-hover:scale-[1.02]">
              <CardContent className="p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3 text-primary">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight">
                      チャットでのお問い合わせ
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-pretty">
                    ご質問・ご相談などお気軽にお問い合わせください。
                    <br />
                    リアルタイムでご対応いたします。
                  </p>
                  <ContactDialog
                    triggerText={contactButtonText}
                    buttonProps={{
                      className: 'w-full',
                      size: 'lg',
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Estimate Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-linear-to-r from-primary to-primary-foreground rounded-2xl blur-sm opacity-25 transition-all group-hover:opacity-40" />
            <Card className="relative h-full bg-card/95 backdrop-blur-sm supports-backdrop-filter:bg-card/75 transition-all duration-300 group-hover:scale-[1.02]">
              <CardContent className="p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3 text-primary">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight">
                      お見積り
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-pretty">
                    AIによる自動見積もりシステムで、
                    <br />
                    素早く正確なお見積りを提供いたします。
                  </p>
                  <Button asChild size="lg" className="w-full">
                    <Link href={estimateLink}>{estimateButtonText}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info & Availability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card className="bg-card/95 backdrop-blur-sm supports-backdrop-filter:bg-card/75 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-end gap-8">
                  {/* Availability Schedule */}
                  <div className="space-y-6 flex-1 h-full">
                    <div className="flex items-center gap-3 text-foreground">
                      <div className="p-2 rounded-lg bg-muted">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-semibold tracking-tight">
                        対応可能時間
                      </h3>
                    </div>
                    <div className="overflow-x-auto rounded-lg border bg-card/50">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-3 py-3 text-left font-medium">
                              時間帯
                            </th>
                            <th className="px-3 py-3 text-center font-medium">
                              月
                            </th>
                            <th className="px-3 py-3 text-center font-medium">
                              火
                            </th>
                            <th className="px-3 py-3 text-center font-medium">
                              水
                            </th>
                            <th className="px-3 py-3 text-center font-medium">
                              木
                            </th>
                            <th className="px-3 py-3 text-center font-medium">
                              金
                            </th>
                            <th className="px-3 py-3 text-center font-medium">
                              土
                            </th>
                            <th className="px-3 py-3 text-center font-medium">
                              日
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="px-3 py-3 font-medium">
                              9:00 - 12:00
                            </td>
                            <td className="px-3 py-3">
                              <AvailabilityIndicator status="○" />
                            </td>
                            <td className="px-3 py-3">
                              <AvailabilityIndicator status="○" />
                            </td>
                            <td className="px-3 py-3">
                              <AvailabilityIndicator status="○" />
                            </td>
                            <td className="px-3 py-3">
                              <AvailabilityIndicator status="○" />
                            </td>
                            <td className="px-3 py-3">
                              <AvailabilityIndicator status="○" />
                            </td>
                            <td className="px-3 py-3">
                              <AvailabilityIndicator status="×" />
                            </td>
                            <td className="px-3 py-3">
                              <AvailabilityIndicator status="×" />
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-3 py-3 font-medium">
                              13:00 - 19:00
                            </td>
                            <td className="px-3 py-3">
                              <AvailabilityIndicator status="○" />
                            </td>
                            <td className="px-3 py-3">
                              <AvailabilityIndicator status="○" />
                            </td>
                            <td className="px-3 py-3">
                              <AvailabilityIndicator status="○" />
                            </td>
                            <td className="px-3 py-3">
                              <AvailabilityIndicator status="○" />
                            </td>
                            <td className="px-3 py-3">
                              <AvailabilityIndicator status="○" />
                            </td>
                            <td className="px-3 py-3">
                              <AvailabilityIndicator status="×" />
                            </td>
                            <td className="px-3 py-3">
                              <AvailabilityIndicator status="×" />
                            </td>
                          </tr>
                          <tr>
                            <td className="px-3 py-3 font-medium">
                              20:00 - 22:00
                            </td>
                            <td className="px-3 py-3">
                              <AvailabilityIndicator status="△" />
                            </td>
                            <td className="px-3 py-3">
                              <AvailabilityIndicator status="△" />
                            </td>
                            <td className="px-3 py-3">
                              <AvailabilityIndicator status="△" />
                            </td>
                            <td className="px-3 py-3">
                              <AvailabilityIndicator status="△" />
                            </td>
                            <td className="px-3 py-3">
                              <AvailabilityIndicator status="△" />
                            </td>
                            <td className="px-3 py-3">
                              <AvailabilityIndicator status="×" />
                            </td>
                            <td className="px-3 py-3">
                              <AvailabilityIndicator status="×" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="flex gap-6 p-4 text-sm text-muted-foreground bg-muted/30">
                        <div className="flex items-center gap-2">
                          <AvailabilityIndicator status="○" />
                          <span>対応可能</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AvailabilityIndicator status="△" />
                          <span>要相談</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AvailabilityIndicator status="×" />
                          <span>対応不可</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-8 flex-1">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-foreground">
                        <div className="p-2 rounded-lg bg-muted">
                          <Mail className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-semibold tracking-tight">
                          メールアドレス
                        </h3>
                      </div>
                      <a
                        href={`mailto:${email}`}
                        className="group/link inline-flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
                      >
                        <span className="text-lg">{email}</span>
                        <span className="text-primary/70 group-hover/link:translate-x-0.5 transition-transform">
                          →
                        </span>
                      </a>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-foreground">
                        <div className="p-2 rounded-lg bg-muted">
                          <Phone className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-semibold tracking-tight">
                          電話番号
                        </h3>
                      </div>
                      <a
                        href={`tel:${phoneNumber}`}
                        className="group/link inline-flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
                      >
                        <span className="text-lg">{phoneNumber}</span>
                        <span className="text-primary/70 group-hover/link:translate-x-0.5 transition-transform">
                          →
                        </span>
                      </a>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-foreground">
                        <div className="p-2 rounded-lg bg-muted">
                          <CalendarClock className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-semibold tracking-tight">
                          ミーティングを予約する
                        </h3>
                      </div>
                      <Button asChild size="lg" className="w-full ">
                        <Link
                          href="https://calendly.com/saedgewell"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2"
                        >
                          <CalendarClock className="w-5 h-5" />
                          <span>ミーティングを予約する</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

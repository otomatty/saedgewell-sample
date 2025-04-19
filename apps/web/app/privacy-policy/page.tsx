import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "プライバシーポリシー | Saedgewell Portfolio",
	description:
		"Saedgewell Portfolioのプライバシーポリシーについて説明しています。",
};

export default function PrivacyPolicyPage() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<h1 className="text-3xl font-bold mb-8">プライバシーポリシー</h1>

			<div className="space-y-6">
				<section>
					<h2 className="text-2xl font-semibold mb-4">
						1. 個人情報の収集について
					</h2>
					<p className="text-gray-700">
						当サイトでは、以下の場合に個人情報を収集する場合があります：
					</p>
					<ul className="list-disc ml-6 mt-2 space-y-2">
						<li>お問い合わせフォームの利用時</li>
						<li>Googleアカウントを使用したログイン時</li>
						<li>メールの送受信時</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">2. 収集する情報</h2>
					<p className="text-gray-700">
						収集する個人情報には以下が含まれます：
					</p>
					<ul className="list-disc ml-6 mt-2 space-y-2">
						<li>氏名</li>
						<li>メールアドレス</li>
						<li>プロフィール情報</li>
						<li>IPアドレス</li>
						<li>利用端末の情報</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">3. 個人情報の利用目的</h2>
					<p className="text-gray-700">
						収集した個人情報は、以下の目的で利用します：
					</p>
					<ul className="list-disc ml-6 mt-2 space-y-2">
						<li>お問い合わせへの回答</li>
						<li>サービスの提供・運営</li>
						<li>ユーザー認証</li>
						<li>サービスの改善・新機能の開発</li>
						<li>不正アクセスの防止</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						4. 個人情報の第三者提供
					</h2>
					<p className="text-gray-700">
						当サイトでは、以下の場合を除き、収集した個人情報を第三者に提供することはありません：
					</p>
					<ul className="list-disc ml-6 mt-2 space-y-2">
						<li>ユーザーの同意がある場合</li>
						<li>法令に基づく場合</li>
						<li>人の生命、身体または財産の保護のために必要がある場合</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">5. セキュリティ対策</h2>
					<p className="text-gray-700">
						個人情報の漏洩、滅失、き損の防止、その他の個人情報の安全管理のために必要かつ適切な措置を講じています。
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						6. プライバシーポリシーの変更
					</h2>
					<p className="text-gray-700">
						本プライバシーポリシーの内容は、法令その他本プライバシーポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく変更することができるものとします。変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">7. お問い合わせ</h2>
					<p className="text-gray-700">
						本プライバシーポリシーに関するお問い合わせは、お問い合わせフォームよりご連絡ください。
					</p>
				</section>

				<div className="mt-8 text-sm text-gray-500">
					<p>最終更新日: 2024年2月17日</p>
				</div>
			</div>
		</div>
	);
}

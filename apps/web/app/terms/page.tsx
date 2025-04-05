import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "利用規約 | Saedgewell Portfolio",
	description: "Saedgewell Portfolioの利用規約について説明しています。",
};

export default function TermsPage() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<h1 className="text-3xl font-bold mb-8">利用規約</h1>

			<div className="space-y-6">
				<section>
					<h2 className="text-2xl font-semibold mb-4">1. はじめに</h2>
					<p className="text-gray-700">
						本利用規約（以下「本規約」といいます）は、Saedgewell
						Portfolio（以下「当サイト」といいます）の利用条件を定めるものです。ユーザーの皆様には、本規約に従って当サイトをご利用いただきます。
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">2. 利用登録</h2>
					<p className="text-gray-700">
						当サイトの一部のサービスでは、Googleアカウントを使用した認証が必要となります。利用登録は以下の条件を満たす方に限り行うことができます：
					</p>
					<ul className="list-disc ml-6 mt-2 space-y-2">
						<li>本規約に同意いただける方</li>
						<li>過去に本規約に違反したことのない方</li>
						<li>Googleアカウントを保有している方</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">3. 禁止事項</h2>
					<p className="text-gray-700">
						ユーザーは、当サイトの利用にあたり、以下の行為をしてはなりません：
					</p>
					<ul className="list-disc ml-6 mt-2 space-y-2">
						<li>法令または公序良俗に違反する行為</li>
						<li>犯罪行為に関連する行為</li>
						<li>
							当サイトのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
						</li>
						<li>当サイトのサービスの運営を妨害するおそれのある行為</li>
						<li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
						<li>他のユーザーに成りすます行為</li>
						<li>
							当サイトのサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">4. 当サイトの権利</h2>
					<p className="text-gray-700">
						当サイトは、以下の場合には、ユーザーに事前に通知することなく、本サービスの全部または一部の提供を停止または中断することができるものとします：
					</p>
					<ul className="list-disc ml-6 mt-2 space-y-2">
						<li>システムの保守点検または更新を行う場合</li>
						<li>
							地震、落雷、火災、停電、天災などの不可抗力により、本サービスの提供が困難となった場合
						</li>
						<li>コンピュータまたは通信回線等が事故により停止した場合</li>
						<li>その他、当サイトが本サービスの提供が困難と判断した場合</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">5. 免責事項</h2>
					<p className="text-gray-700">
						当サイトは、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						6. サービス内容の変更等
					</h2>
					<p className="text-gray-700">
						当サイトは、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">7. 利用規約の変更</h2>
					<p className="text-gray-700">
						当サイトは、必要と判断した場合には、ユーザーに通知することなく、本規約を変更することができるものとします。変更後の本規約は、本ウェブサイトに掲載したときから効力を生じるものとします。
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">8. 準拠法・裁判管轄</h2>
					<p className="text-gray-700">
						本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当サイトの本店所在地を管轄する裁判所を専属的合意管轄とします。
					</p>
				</section>

				<div className="mt-8 text-sm text-gray-500">
					<p>最終更新日: 2024年2月17日</p>
				</div>
			</div>
		</div>
	);
}

const KagomePattern = () => {
	const patternSize = {
		width: 70,
		height: 120,
	};

	return (
		<div
			className="w-full h-screen bg-repeat"
			style={{
				backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${patternSize.width}" height="${patternSize.height}" viewBox="0 0 160 240" preserveAspectRatio="none">
          <path fill="#cccccc" d="M-80-120v480h320v-480z"/>
          <path fill="none" stroke="#333333" stroke-width="41" d="M0 0 160 240M0 240 160 0M-15 60h190M-15 180h190"/>
          <path fill="#808080" d="M11-38h29l-51 76h-29zM-15 48h21l16 24h-37zM-15 168h101l16 24h-117zM11 202h29l-51 76h-29zM21 10l53 80-15 21-53-80zM58 48h117v24h-101zM171-38h29l-51 76h-29zM91 82h29l-51 76h-29zM101 129l53 80-15 21-53-80zM138 168h37v24h-21zM171 202h29l-51 76h-29z"/>
        </svg>
      `)}"`,
			}}
		>
			<div className="p-4">
				<h1 className="text-2xl font-bold mb-4">籠目柄 (Kagome Pattern)</h1>
				<p className="text-gray-700">
					伝統的な日本の籠目編みパターンをベースにしたデザインです。
				</p>
			</div>
		</div>
	);
};

export default KagomePattern;

"use client";
import TechnicalInterests from "./technical-interests";
import OtherInterests from "./other-interests";

const InterestsList = () => {
	return (
		<section className="container mx-auto py-10">
			<h2 className="text-3xl font-bold mb-4">興味関心</h2>
			<div className="flex flex-col gap-8">
				<TechnicalInterests />
				<OtherInterests />
			</div>
		</section>
	);
};

export default InterestsList;

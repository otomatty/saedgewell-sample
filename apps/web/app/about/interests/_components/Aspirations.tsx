"use client";

import TechnicalChallenges from "./TechnicalChallenges";
import FutureGoals from "./FutureGoals";

const Aspirations = () => {
	return (
		<section className="container mx-auto py-10">
			<h2 className="text-3xl font-bold mb-4">目指しているもの</h2>
			<div className="flex flex-col gap-8">
				<TechnicalChallenges />
				<FutureGoals />
			</div>
		</section>
	);
};

export default Aspirations;

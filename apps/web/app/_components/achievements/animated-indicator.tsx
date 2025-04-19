"use client";

import { motion, AnimatePresence } from "motion/react";

interface AnimatedIndicatorProps {
	isActive: boolean;
}

/**
 * アクティブなバーを示すインジケーターコンポーネント
 * アクティブ時にリップルアニメーションを表示する
 *
 * @param props.isActive - インジケーターがアクティブかどうかを示すフラグ
 */
export const AnimatedIndicator = ({ isActive }: AnimatedIndicatorProps) => {
	const transition = {
		duration: 0.6,
		ease: [0.4, 0, 0.2, 1], // よりスムーズなイージング
	};

	const indicatorVariants = {
		active: {
			opacity: 1,
			scale: 1,
			x: "-50%",
			transition: {
				...transition,
				duration: 0.4,
			},
		},
		inactive: {
			opacity: 0,
			scale: 0.5,
			x: "-50%",
			transition: {
				...transition,
				duration: 0.3,
			},
		},
	};

	const rippleVariants = {
		initial: {
			opacity: 0.8,
			scale: 0.8,
		},
		animate: {
			opacity: 0,
			scale: 2,
			transition: {
				repeat: Number.POSITIVE_INFINITY,
				duration: 2,
				ease: "easeOut",
				repeatDelay: 0.2,
			},
		},
		exit: {
			opacity: 0,
			scale: 0.8,
			transition: {
				duration: 0.2,
			},
		},
	};

	return (
		<motion.div
			className="absolute -bottom-4 left-1/2 w-2 h-2 bg-background dark:bg-foreground rounded-full"
			animate={isActive ? "active" : "inactive"}
			variants={indicatorVariants}
			initial="inactive"
		>
			<AnimatePresence mode="wait">
				{isActive && (
					<motion.div
						className="absolute inset-0 bg-background dark:bg-foreground rounded-full"
						variants={rippleVariants}
						initial="initial"
						animate="animate"
						exit="exit"
					/>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

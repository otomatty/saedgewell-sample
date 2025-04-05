import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@kit/ui/utils';
import { ShimmerButton } from '@kit/ui/shimmer-button';

export const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm text-muted-foreground">テーマを切り替える</p>
      <ShimmerButton
        className={cn(
          'relative w-24 h-12 rounded-full p-1 border-2',
          'transition-colors duration-300',
          isDark
            ? 'bg-neutral-900 border-neutral-700'
            : 'bg-amber-50 border-amber-200'
        )}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
      >
        {/* トラック装飾 */}
        <div
          className={cn(
            'absolute inset-0 rounded-full transition-colors duration-300',
            isDark
              ? 'bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#000000_100%)]'
              : 'bg-[radial-gradient(circle_at_center,#fef3c7_0%,#fde68a_100%)]'
          )}
        />

        {/* スライディングサークル */}
        <motion.div
          className="relative w-9 h-9"
          initial={false}
          animate={{ x: isDark ? 'calc(100% + 30%)' : '0' }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{ position: 'absolute', left: '5%' }}
        >
          <div
            className={cn(
              'absolute inset-0 rounded-full shadow-lg transition-colors duration-300',
              isDark
                ? 'bg-linear-to-br from-neutral-800 to-neutral-950'
                : 'bg-linear-to-br from-white to-amber-50'
            )}
          />

          <AnimatePresence mode="wait">
            {isDark ? (
              // ダークモード：月のデザイン
              <motion.div
                key="moon"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative w-6 h-6">
                  {/* 月の背景 */}
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-amber-200 to-amber-300 opacity-90" />
                  {/* 月の影 */}
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-neutral-800 to-neutral-950 opacity-50 transform -translate-x-1" />
                </div>
              </motion.div>
            ) : (
              // ライトモード：太陽のデザイン
              <motion.div
                key="sun"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative w-6 h-6">
                  {/* 太陽の本体 */}
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-amber-300 to-amber-500" />
                  {/* 光の効果 */}
                  <div className="absolute inset-[-25%] rounded-full bg-linear-to-br from-amber-200 to-amber-400 opacity-50 animate-pulse" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </ShimmerButton>
    </div>
  );
};

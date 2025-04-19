import { SeigaihaPattern } from '@kit/ui/seigaiha-pattern';

export function SunabaHero() {
  return (
    <div className="relative overflow-hidden">
      <SeigaihaPattern className="absolute inset-0 h-full w-full opacity-20" />
      <div className="container relative z-10 py-20">
        <h1 className="text-4xl font-bold md:text-5xl">実験場</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          ここはコンポーネントの実験場です。様々なコンポーネントの動作確認や実験を行うことができます。
        </p>
      </div>
    </div>
  );
}

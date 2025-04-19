/**
 * CLIのローディングアニメーションを管理するクラス
 */
export class LoadingSpinner {
  private frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  private interval: NodeJS.Timeout | null = null;
  private currentFrame = 0;
  private text: string;

  constructor(text = 'Loading...') {
    this.text = text;
  }

  start(text?: string) {
    if (text) {
      this.text = text;
    }

    if (this.interval) {
      return;
    }

    // カーソルを非表示
    process.stdout.write('\x1B[?25l');

    this.interval = setInterval(() => {
      const frame = this.frames[this.currentFrame];
      process.stdout.write(`\r${frame} ${this.text}`);
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }, 80);

    return this;
  }

  stop(text?: string) {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    // 現在の行をクリア
    process.stdout.write('\r\x1B[K');

    // 完了メッセージがある場合は表示
    if (text) {
      console.log(text);
    }

    // カーソルを再表示
    process.stdout.write('\x1B[?25h');
  }

  update(text: string) {
    this.text = text;
  }
}

'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 絵文字のカテゴリーとその説明
const emojiDatabase = {
  faces:
    '😀 😃 😄 😁 😅 😂 🤣 ☺️ 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🤭 🤫 🤥 😶 😐 😑 😬 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕',
  gestures:
    '👋 🤚 ✋ 🖐 👌 🤌 🤏 ✌️ 🤞 🫰 🤟 🤘 🤙 👈 👉 👆 🖕 👇 ☝️ 👍 👎 ✊ 👊 🤛 🤜 👏 🙌 👐 🤲 🤝 🙏 ✍️ 💅 🤳 💪 🦾 🦿 🦵 🦶 👂 🦻 👃 🫀 🫁 🧠 🦷 🦴 👀 👁 👅 👄',
  nature:
    '🌸 🌺 🌹 🌷 🌼 🌻 🌞 🌝 🌛 🌜 ⭐ 🌟 ✨ 💫 ☀️ 🌤 ⛅ 🌥 ☁️ 🌦 🌧 ⛈ 🌩 🌨 ❄️ 🌬 💨 🌪 🌫 🌊 🌱 🌲 🌳 🌴 🌵 🌾 🌿 ☘️ 🍀 🍁 🍂 🍃',
  food: '🍎 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🫐 🍈 🍒 🍑 🥭 🍍 🥥 🥝 🍅 🍆 🥑 🥦 🥬 🥒 🌶 🫑 🥕 🧄 🧅 🥔 🍠 🥐 🥯 🍞 🥖 🥨 🧀 🥚 🍳 🧈 🥞 🧇 🥓 🥩 🍗 🍖 🦴 🌭 🍔 🍟 🍕 🫓 🥪 🥙 🧆 🌮 🌯 🫔 🥗 🥘 🫕 🥫 🍝 🍜 🍲 🍛 🍣 🍱 🥟 🦪 🍤 🍙 🍚 🍘 🍥 🥠 🥮 🍢 🍡 🍧 🍨 🍦 🥧 🧁 🍰 🎂 🍮 🍭 🍬 🍫 🍿 🍩 🍪 🌰 🥜 🍯 🥛 🍼 🫖 ☕️ 🍵 🧃 🥤 🧋 🍶 🍺 🍻 🥂 🍷 🥃 🍸 🍹 🧉 🍾 🧊 🥄 🍴 🍽 🥢 🥡',
  activities:
    '💻 📱 💡 🎮 🎨 🎭 🎪 🎢 🎡 🎯 🎲 🎳 🎮 🎰 🎨 🖼 🎭 🎪 🎢 🎡 🎯 🎲 🎳 🎮 🎰 🚗 ✈️ 🚀 🛸 🎉 🎊 🎈 🎁 🎗 🎟 🎫 🎖 🏆 🥇 🥈 🥉 🏅 🎭 🎨 🎪 🎤 🎧 🎼 🎹 🥁 🎷 🎺 🎸 🪕 🎻 🎲 🎯 🎳 🎮 🎰 🧩',
  objects:
    '📚 📖 📝 ✏️ 📌 📍 📎 🔍 🔎 🔐 🔑 🔨 🪛 🔧 🪜 🧰 🎁 🎈 🎀 🎊 🎉 🎭 🎪 🎢 🎡 🎯 🎲 🎳 🎮 🎰 💡 🔦 🏮 📔 📕 📗 📘 📙 📚 📖 🔖 🧷 📐 📏 📌 📍 📎 🖇 📝 ✏️ 🔍 🔎 🔏 🔐 🔒 🔓 ❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 ❣️ 💕 💞 💓 💗 💖 💘 💝 💟 ☮️ ✝️ ☪️ 🕉 ☸️ ✡️ 🔯 🕎 ☯️ ☦️ 🛐 ⛎ ♈️ ♉️ ♊️ ♋️ ♌️ ♍️ ♎️ ♏️ ♐️ ♑️ ♒️ ♓️ 🆔 ⚛️ 🉑 ☢️ ☣️ 📴 📳 🈶 🈚️ 🈸 🈺 🈷️ ✴️ 🆚 💮 🉐 ㊙️ ㊗️ 🈴 🈵 🈹 🈲 🅰️ 🅱️ 🆎 🆑 🅾️ 🆘 ❌ ⭕️ 🛑 ⛔️ 📛 🚫 💯 💢 ♨️ 🚷 🚯 🚳 🚱 🔞 📵 🚭 ❗️ ❕ ❓ ❔ ‼️ ⁉️ 🔅 🔆 〽️ ⚠️ 🚸 🔱 ⚜️ 🔰 ♻️ ✅ 🈯️ 💹 ❇️ ✳️ ❎ 🌐 💠 Ⓜ️ 🌀 💤 🏧 🚾 ♿️ 🅿️ 🛗 🈳 🈂️ 🛂 🛃 🛄 🛅 🚹 🚺 🚼 ⚧ 🚻 🚮 🎦 📶 🈁 🔣 ℹ️ 🔤 🔡 🔠 🆖 🆗 🆙 🆒 🆕 🆓 0️⃣ 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 🔟 🔢 #️⃣ *️⃣ ⏏️ ▶️ ⏸ ⏯ ⏹ ⏺ ⏭ ⏮ ⏩ ⏪ ⏫ ⏬ ◀️ 🔼 🔽 ➡️ ⬅️ ⬆️ ⬇️ ↗️ ↘️ ↙️ ↖️ ↕️ ↔️ ↪️ ↩️ ⤴️ ⤵️ 🔀 🔁 🔂 🔄 🔃 🎵 🎶 ➕ ➖ ➗ ✖️ ♾ 💲 💱 ™️ ©️ ®️ 〰️ ➰ ➿ 🔚 🔙 🔛 🔝 🔜 ✔️ ☑️ 🔘 🔴 🟠 🟡 🟢 🔵 🟣 ⚫️ ⚪️ 🟤 🔺 🔻 🔸 🔹 🔶 🔷 🔳 🔲 ▪️ ▫️ ◾️ ◽️ ◼️ ◻️ 🟥 🟧 🟨 🟩 🟦 🟪 ⬛️ ⬜️ 🟫 🔈 🔇 🔉 🔊 🔔 🔕 📣 📢 👁‍🗨 💬 💭 🗯 ♠️ ♣️ ♥️ ♦️ 🃏 🎴 🀄️ 🕐 🕑 🕒 🕓 🕔 🕕 🕖 🕗 🕘 🕙 🕚 🕛 🕜 🕝 🕞 🕟 🕠 🕡 🕢 🕤 🕥 🕦 🕧',
};

// ランダムな絵文字を取得する関数
function getRandomEmojis(count: number): string[] {
  const allEmojis = Object.values(emojiDatabase)
    .join(' ')
    .split(' ')
    .filter((emoji) => emoji.trim());

  const randomEmojis: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * allEmojis.length);
    const emoji = allEmojis[randomIndex];
    if (emoji) {
      randomEmojis.push(emoji);
    }
  }

  return randomEmojis;
}

// 絵文字を抽出する関数
function extractEmojis(text: string): string[] {
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  const matches = text.match(emojiRegex);
  return matches || [];
}

const systemPrompt = `
あなたは絵文字提案の専門家です。
与えられたテキストの内容や感情を分析し、最も適切な絵文字を提案してください。
以下の点を考慮して提案を行ってください：

1. テキストの主要なテーマや概念
2. テキストから感じられる感情や雰囲気
3. テキストに含まれる具体的な物事やアクション
4. 業務やプロジェクトに関連する場合は、その目的や性質

提案する絵文字は：
- 文脈に最も適している
- 視覚的に分かりやすい
- 一般的に認識されやすい
- プロフェッショナルな場面でも使用可能

返答は絵文字のみを含む配列形式とし、5つの絵文字を提案してください。
適切な絵文字が見つからない場合は、"NO_SUITABLE_EMOJI"と返してください。
`;

export async function suggestEmojis(
  text: string
): Promise<{ emojis: string[]; error?: string }> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
テキスト: ${text}

このテキストに最も適した絵文字を5つ提案してください。
以下の絵文字データベースから選択するか、テキストの内容から連想される適切な絵文字を提案してください：

${Object.entries(emojiDatabase)
  .map(([category, emojis]) => `${category}: ${emojis}`)
  .join('\n')}

絵文字のみを返してください。余計な説明は不要です。
適切な絵文字が見つからない場合は、"NO_SUITABLE_EMOJI"と返してください。
`;

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: prompt },
    ]);
    const response = await result.response;
    const responseText = response.text();

    if (responseText.includes('NO_SUITABLE_EMOJI')) {
      return {
        emojis: getRandomEmojis(10),
      };
    }

    const emojis = extractEmojis(responseText);

    if (emojis.length === 0) {
      return {
        emojis: getRandomEmojis(10),
      };
    }

    return {
      emojis: emojis.slice(0, 5),
    };
  } catch (error) {
    return {
      emojis: [],
      error: '絵文字の提案中にエラーが発生しました',
    };
  }
}

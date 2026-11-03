# 小兔数学 · 一年级专项练习

基于 [binarydevil/bunny-math](https://github.com/binarydevil/bunny-math) 扩展，参考[原网站](https://binarydevil.github.io/bunny-math/)。发布仓库为 [assilzm/bunny-math](https://github.com/assilzm/bunny-math)，网站地址为 [https://assilzm.github.io/bunny-math/](https://assilzm.github.io/bunny-math/)。本地 `origin` 指向发布仓库，原项目保留为 `upstream`。

## GitHub Pages 发布

仓库 Settings → Pages 的 Source 使用 **GitHub Actions**。推送到 `main` 或在 Actions 手动运行 **Deploy to GitHub Pages** 后，会依次安装依赖、运行测试、生产构建并发布 `dist/`。

日常修改并完成测试后，提交代码并执行 `git push origin main` 即可更新网站。发布结果见[仓库 Actions](https://github.com/assilzm/bunny-math/actions/workflows/deploy.yml)。

## 新增练习

| 专项 | 难度 | 规则 |
| --- | --- | --- |
| 三个一位数连加 | 20 以内 / 挑战 27 | 三个 0–9 的数相加，完整显示三个加数，分两步讲解 |
| 乘法口诀验证 | 一到五口诀 / 完整九九表 | 一个乘数 1–5 或 1–9，另一个 1–9；填写积后校验；作答后和讲解中展示中文口诀 |
| 两位数加法 | 不进位 / 进位 | 两个加数均为两位数，得数不超过 99；进位档每题都需要个位进位 |

原有加减乘除、五种题目形式、积木和竖式讲解、错题复练、星星和贴纸、本地进度、多语言、打印练习纸及答案页均保留。新增专项可选择 10、15、20 题，也可打印多页。乘法属于拓展练习，家长可按学习进度选用。

## 本地启动

需要 Node.js 22.x（≥22.12）、24 LTS 或 26+（与原项目 Vitest 引擎约束一致，建议使用 LTS）。项目使用 `.npmrc` 指向 npm 官方源，不改全局 npm 设置。

```text
npm ci
npm run dev -- --host 127.0.0.1 --port 5173
```

浏览器访问 `http://127.0.0.1:5173`。或者在 Windows 上运行：

```text
pwsh -NoLogo -NoProfile -File scripts/start-preview.ps1
```

该脚本在后台启动本机预览并输出进程 PID；日志在 `.preview.log` / `.preview-error.log`，端口占用时不会自动切换端口。

```text
npm test
npm run build
```

构建结果在 `dist/`，可以放到静态网站服务器。页面不需要账号或业务后端，进度仅保存在当前浏览器；首次运行跟随浏览器语言，可在右上角切换。新增文案支持简体中文、繁体中文、英文，其余原有语言的新增部分回退英文。

设计说明见 [DESIGN.md](DESIGN.md)。下文保留上游项目说明。

---

# Bunny Math 🐰

Cute maths practice for kids around 8: adding and taking away, or all four operations. It runs entirely in the browser: no accounts, no server, and progress is saved on the device.

- Two modes, picked on the first visit and switchable from the home screen:
  - **Add & take away**, 6 levels: within 20, no carrying, carrying/borrowing, two-digit sums, three-digit sums, and three-digit sums with lots of carrying (including borrowing across a zero)
  - **All four**, 4 levels: tables of 2, 5 and 10; tables up to 5; tables up to 10; two-digit × and ÷ by one digit. Two thirds of the questions are × or ÷.
- 5 question types: type the answer, pick the answer, missing number, compare (< = >), picture stories
- Fresh questions every time; `?seed=123` in the URL gives the same quiz again
- "Show me how" explains each question step by step, in one of two styles (the choice is remembered):
  - **Blocks**: hundreds, tens and ones blocks, and dot arrays for × and ÷
  - **Columns**: the written column method (竖式), one column at a time, with carried digits, borrow dots, and long division
- Missed questions come back at the end; results show stars, skills, and a sticker reward
- Printable worksheets with an answer key (🖨️ on the home screen)
- 9 languages: English, 简体中文, 繁體中文, Français, Español, Deutsch, 日本語, 한국어, Português. The 🌐 button picks one; on the first visit it follows the browser's language

## Run it

```bash
npm install
npm run dev
```

```bash
npm test
```

## Put it on GitHub Pages

1. Push this repo to GitHub.
2. In the repo, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Every push to `main` then tests, builds, and publishes the app (see `.github/workflows/deploy.yml`).

The build uses relative paths, so it works under any repo name.

## Where things are

- `src/lib/generator.ts`: makes the questions for each level
- `src/lib/explain.ts`: builds the "Show me how" steps
- `src/components/`: the screens (home, quiz, results, sticker book, worksheet)
- `src/i18n/`: translations, one file per language (see below)
- `src/styles.css`: colors, fonts, and layouts for tablets and phones
- `design/`: the original clickable mockup, and `og-card.html`, the picture shown when the link is shared (`public/og.png`, 1200×630). After editing it, take a 1200×630 screenshot of it and save over `public/og.png`.

## Languages

All the words the app shows, including the "Show me how" steps and the printed worksheets, live in `src/i18n/`. `en.ts` is the source of truth: every other language is typed as `Messages`, so TypeScript reports a missing or extra key, and `npm test` checks that every language has the same keys and `{placeholders}` as English.

- `{name}` is filled in by the code; `*stars*` mark highlighted words in the explanations.
- `_one` / `_other` pairs are plurals (picked with `Intl.PluralRules`). Languages without plurals repeat the same text.
- Numbers always use the digits 0–9, and the signs + − × ÷ stay the same in every language.
- The choice is saved on the device. Until a language is picked, it follows `navigator.languages` (zh-TW, zh-HK and zh-Hant → 繁體中文, other zh → 简体中文, pt-BR and pt-PT → Português), falling back to English.
- The link preview tags in `index.html` stay in English, since link previews don't run the app.

To add a language:

1. Copy `src/i18n/fr.ts` to `src/i18n/<code>.ts`, rename the export, and translate the values (keep `{placeholders}` and `*stars*`).
2. In `src/i18n/index.ts`, add it to `LANGS` (code, native name, short badge) and to `MESSAGES`. If the browser uses a different code for it, teach `detectLang` the mapping.
3. If it uses a script the web fonts don't cover, add system fonts for it in `src/styles.css` (see the `--cjk` lines).
4. Run `npm test` and `npm run build`.

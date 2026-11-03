// @vitest-environment happy-dom
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './app';
import { Worksheet } from './components/Worksheet';
import { activate } from './i18n';
import { load } from './lib/storage';

vi.mock('./lib/sound', () => ({ setSound: vi.fn(), sounds: { tap: vi.fn(), right: vi.fn(), wrong: vi.fn(), done: vi.fn() } }));
vi.mock('./lib/celebrate', () => ({ smallBurst: vi.fn(), bigParty: vi.fn() }));
let root: HTMLDivElement;
beforeEach(() => { localStorage.clear(); root = document.createElement('div'); document.body.append(root); activate('zh-CN'); });
afterEach(() => { act(() => render(null, root)); root.remove(); activate('en'); });

describe('year-one integration', () => {
  it('migrates an existing save and allows selecting every new mode without losing progress', () => {
    localStorage.setItem('bunny-math:v1', JSON.stringify({ lang: 'zh-CN', mode: 'plus', stickers: ['🍓'], levelFor: { plus: 3, all: 12 } }));
    expect(load().levelFor).toMatchObject({ plus: 3, all: 12, chain: 21, tables: 31, double: 41 });
    act(() => render(<App />, root));
    act(() => root.querySelector<HTMLButtonElement>('.mode-btn')!.click());
    expect(root.querySelectorAll('.mode-card')).toHaveLength(5);
    act(() => root.querySelector<HTMLButtonElement>('.m-chain')!.click());
    expect(root.querySelector('.practice-heading')!.textContent).toContain('三个一位数连加');
    act(() => root.querySelector<HTMLButtonElement>('.start')!.click());
    expect(root.querySelectorAll('.chain-equation > .op')).toHaveLength(3);
    expect(JSON.parse(localStorage.getItem('bunny-math:v1')!).stickers).toEqual(['🍓']);
  });

  it('prints every addend and a matching answer key, including multiple pages', () => {
    act(() => render(<Worksheet level={21} count={10} onBack={() => {}} />, root));
    const check = () => {
      const questions = Array.from(root.querySelectorAll('.ws-q > span:last-child'));
      const answers = Array.from(root.querySelectorAll('.ws-key li'));
      expect(questions.length).toBe(answers.length);
      questions.forEach((q, i) => {
        const values = q.textContent!.match(/\d+/g)!.map(Number);
        expect(values).toHaveLength(3);
        expect(values.reduce((a, b) => a + b, 0)).toBe(Number(answers[i].textContent));
      });
    };
    check();
    act(() => root.querySelectorAll<HTMLButtonElement>('.print-bar [role="radio"]')[2].click());
    expect(root.querySelectorAll('.ws-page')).toHaveLength(3);
    check();
  });
});

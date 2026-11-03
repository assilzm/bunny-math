import { describe, expect, it } from 'vitest';
import { correctAnswer, factExpression, generateQuiz, makeFact, nextLevel, regroups, tableMnemonic } from './generator';
import { explain, questionText } from './explain';
import { activate } from '../i18n';
import { makeRng } from './rng';
import type { LevelId } from './types';

describe('year-one exercise domains', () => {
  it.each([21, 22] as const)('level %i keeps all three addends single-digit, answers correct and prompts complete', (level) => {
    for (let seed = 1; seed <= 100; seed++) {
      const quiz = generateQuiz({ level, count: 20, seed });
      expect(new Set(quiz.map(q => factExpression(q.fact))).size).toBe(20);
      for (const q of quiz) {
        const { a, b, extra, c } = q.fact;
        for (const n of [a, b, extra!]) expect(n).toBeGreaterThanOrEqual(0);
        for (const n of [a, b, extra!]) expect(n).toBeLessThanOrEqual(9);
        expect(c).toBe(a + b + extra!);
        expect(c).toBeLessThanOrEqual(level === 21 ? 20 : 27);
        expect(correctAnswer(q)).toBe(c);
        expect(q.kind).toBe('type');
        expect(questionText(q).split(' + ')).toHaveLength(3);
      }
    }
  });

  it.each([31, 32] as const)('level %i exclusively checks the requested multiplication table', (level) => {
    for (let seed = 1; seed <= 100; seed++) {
      for (const q of generateQuiz({ level, count: 20, seed })) {
        expect(q.fact.op).toBe('×');
        expect(q.fact.a).toBeGreaterThanOrEqual(1);
        expect(q.fact.a).toBeLessThanOrEqual(level === 31 ? 5 : 9);
        expect(q.fact.b).toBeGreaterThanOrEqual(1);
        expect(q.fact.b).toBeLessThanOrEqual(9);
        expect(correctAnswer(q)).toBe(q.fact.a * q.fact.b);
        expect(q.tablePractice).toBe(true);
        expect(q.kind).toBe('type');
      }
    }
  });

  it.each([41, 42] as const)('level %i keeps both addends two-digit and enforces carrying difficulty', (level) => {
    for (let seed = 1; seed <= 100; seed++) {
      const f = makeFact(makeRng(seed), level);
      expect(f.op).toBe('+');
      for (const n of [f.a, f.b]) { expect(n).toBeGreaterThanOrEqual(10); expect(n).toBeLessThanOrEqual(99); }
      expect(f.c).toBe(f.a + f.b);
      expect(f.c).toBeLessThanOrEqual(99);
      expect(regroups(f)).toBe(level === 42);
    }
  });

  it('keeps reproducible quizzes and progression inside each new mode', () => {
    for (const level of [21, 22, 31, 32, 41, 42] as LevelId[]) {
      expect(generateQuiz({ level, seed: 42, count: 20 })).toEqual(generateQuiz({ level, seed: 42, count: 20 }));
    }
    expect([nextLevel(21), nextLevel(22), nextLevel(31), nextLevel(32), nextLevel(41), nextLevel(42)]).toEqual([22, null, 32, null, 42, null]);
  });
});

describe('new explanations', () => {
  it.each(['blocks', 'column'] as const)('explains zero and all three addends in %s style', style => {
    activate('zh-CN');
    for (const [a, b, extra] of [[0, 0, 0], [0, 9, 8], [9, 9, 9], [3, 5, 7]]) {
      const q = { id: 'chain', kind: 'type' as const, skill: 'add' as const, fact: { a, b, extra, c: a + b + extra, op: '+' as const } };
      const steps = explain(q, style);
      expect(steps.length).toBeGreaterThan(3);
      const last = steps.at(-1)!;
      expect(last.scene).toEqual({ type: 'text', lines: [`${a} + ${b} + ${extra} = ${a + b + extra}`] });
      expect(last.caption).not.toContain('undefined');
    }
    activate('en');
  });

  it('uses traditional mnemonics and normalizes factor order', () => {
    for (const [a, b, want] of [[1, 1, '一一得一'], [2, 5, '二五一十'], [9, 9, '九九八十一'], [8, 7, '七八五十六'], [3, 4, '三四十二']] as const) {
      expect(tableMnemonic({ a, b, c: a * b, op: '×' })).toBe(want);
    }
  });
});

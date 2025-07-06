const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('updateCountdown', () => {
  test('updates countdown and netdays text', () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

    const dom = new JSDOM(html, { runScripts: 'dangerously' });
    const { window } = dom;

    const mockNow = new Date('2025-07-12T00:00:00+03:00');
    const RealDate = window.Date;
    window.Date = class extends RealDate {
      constructor(...args) {
        if (args.length === 0) {
          return new RealDate(mockNow);
        }
        return new RealDate(...args);
      }
      static now() {
        return new RealDate(mockNow).getTime();
      }
    };

    window.updateCountdown();

    const countdownText = window.document.getElementById('countdown').textContent;
    const netdaysText = window.document.getElementById('netdays').textContent;

    expect(countdownText).toContain('🕒 الوقت المتبقي حتى أول امتحان');
    expect(countdownText).toContain('3 يوم');
    expect(netdaysText).toBe('📅 أيام المذاكرة المتبقية (صافية): 1 يوم');
  });
});

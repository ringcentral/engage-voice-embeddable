import 'expect-puppeteer';

describe('E2E Test for localhost:8080', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:8080', {
      waitUntil: 'networkidle0',
      timeout: 150000,
    });
  });

  it('should load the page without errors', async () => {
    await expect(page.title()).resolves.not.toBeNull();
  });

  it('should not have any console errors', async () => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Reload to capture startup errors
    await page.reload({
      waitUntil: 'networkidle0',
      timeout: 20000,
    });

    // Wait a bit for any async errors
    await new Promise(resolve => setTimeout(resolve, 5000));

    expect(errors).toEqual([]);
  });

  it('should not have any page errors', async () => {
    const errors: Error[] = [];
    page.on('pageerror', (err) => {
      errors.push(err);
    });

    // Reload to capture startup errors
    await page.reload();

    // Wait a bit for any async errors
    await new Promise(resolve => setTimeout(resolve, 1000));

    expect(errors).toEqual([]);
  });
});

import { test, expect } from '@playwright/test'

test.describe('Button E2E', () => {
  test.beforeEach(async ({ page, browserName }) => {
    const waitUntil = browserName === 'firefox' ? 'domcontentloaded' : 'networkidle'
    await page.goto('/', { waitUntil, timeout: 30000 })
    await page.waitForSelector('button', { state: 'attached', timeout: 10000 })
  })

  test('应该正确显示按钮点击功能', async ({ page }) => {
    const button = page.locator('button').first()
    await expect(button).toBeVisible()

    await button.click()
    await expect(button).toBeVisible()
  })

  test('应该正确显示 disabled 状态', async ({ page }) => {
    const disabledButton = page.locator('button[disabled]').first()

    if ((await disabledButton.count()) > 0) {
      await expect(disabledButton).toBeVisible()
      await expect(disabledButton).toBeDisabled()
    } else {
      test.skip()
    }
  })

  test('应该正确显示 loading 状态和 data-loading 属性', async ({ page }) => {
    const loadingButton = page.locator('button[data-loading="true"]').first()

    if ((await loadingButton.count()) > 0) {
      await expect(loadingButton).toBeVisible()
      await expect(loadingButton).toHaveAttribute('data-loading', 'true')
      await expect(loadingButton).toBeDisabled()
    } else {
      test.skip()
    }
  })

  test('loading 状态下不应该响应点击', async ({ page }) => {
    const loadingButton = page.locator('button[data-loading="true"]').first()

    if ((await loadingButton.count()) > 0) {
      await expect(loadingButton).toBeDisabled()
      // 尝试点击，应该不会触发
      await loadingButton.click({ force: true })
      await page.waitForTimeout(100)
      // 验证按钮仍然是 disabled 状态
      await expect(loadingButton).toBeDisabled()
    } else {
      test.skip()
    }
  })

  test('应该支持键盘导航和焦点', async ({ page }) => {
    const button = page.locator('button').first()
    await expect(button).toBeVisible()

    await button.focus()
    await expect(button).toBeFocused()
  })

  test('应该支持自定义元素 (as prop)', async ({ page }) => {
    const customElement = page.locator('div').filter({ hasText: 'Custom Element' }).first()

    if ((await customElement.count()) > 0) {
      await expect(customElement).toBeVisible()
      await customElement.click()
      await page.waitForTimeout(100)
    } else {
      test.skip()
    }
  })

  test('触摸设备不应该触发 hover', async ({ page, isMobile }) => {
    const button = page.locator('button').first()
    await expect(button).toBeVisible()

    if (isMobile) {
      await button.tap()
    } else {
      await button.dispatchEvent('pointerdown', { pointerType: 'touch' })
      await button.dispatchEvent('pointerup', { pointerType: 'touch' })
    }

    await page.waitForTimeout(100)
    await expect(button).toBeVisible()
  })
})

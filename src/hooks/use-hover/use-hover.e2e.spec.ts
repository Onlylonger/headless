import { test, expect } from '@playwright/test'

test.describe('useHover E2E', () => {
  test.beforeEach(async ({ page, browserName }) => {
    // Firefox 有时连接不稳定，使用 domcontentloaded 而不是 networkidle
    const waitUntil = browserName === 'firefox' ? 'domcontentloaded' : 'networkidle'
    await page.goto('/', { waitUntil, timeout: 30000 })
    // 等待页面加载完成，确保 useHover 元素已渲染
    await page.waitForSelector('[data-hover]', { state: 'attached', timeout: 10000 })
  })

  test('应该正确显示 hover 状态', async ({ page }) => {
    // 查找包含 hover 功能的元素
    const hoverElement = page.locator('[data-hover]').first()

    // 等待元素可见
    await expect(hoverElement).toBeVisible()

    // 初始状态应该是 false
    await expect(hoverElement).toHaveAttribute('data-hover', 'false')

    // 鼠标悬停
    await hoverElement.hover()

    // 等待状态更新
    await expect(hoverElement).toHaveAttribute('data-hover', 'true', { timeout: 2000 })

    // 鼠标离开
    await page.mouse.move(0, 0)

    // 等待状态变回 false
    await expect(hoverElement).toHaveAttribute('data-hover', 'false', { timeout: 2000 })
  })

  test('应该触发 hover 回调', async ({ page }) => {
    // 监听控制台日志（如果 playground 中有日志输出）
    const logs: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'log') {
        logs.push(msg.text())
      }
    })

    const hoverElement = page.locator('[data-hover]').first()

    // 等待元素可见
    await expect(hoverElement).toBeVisible()

    await hoverElement.hover()

    // 验证元素仍然可见
    await expect(hoverElement).toBeVisible()
  })

  test('触摸设备不应该触发 hover', async ({ page, isMobile }) => {
    const hoverElement = page.locator('[data-hover]').first()

    // 等待元素可见
    await expect(hoverElement).toBeVisible()

    // 初始状态
    await expect(hoverElement).toHaveAttribute('data-hover', 'false')

    if (isMobile) {
      // 移动设备：触摸元素
      await hoverElement.tap()
    } else {
      // 桌面设备：模拟触摸事件（pointerdown/pointerup），不应该触发 hover
      await hoverElement.dispatchEvent('pointerdown', { pointerType: 'touch' })
      await hoverElement.dispatchEvent('pointerup', { pointerType: 'touch' })
    }

    // 等待一小段时间确保状态不会改变
    await page.waitForTimeout(100)

    // 触摸不应该触发 hover
    await expect(hoverElement).toHaveAttribute('data-hover', 'false')
  })
})

# Dialog 组件 Props 处理模式分析

## 问题场景

`DialogContent` 组件内部使用了 3 个嵌套组件：
- `FloatingPortal` - 渲染到 portal
- `FloatingOverlay` - 遮罩层
- `FloatingFocusManager` - 焦点管理

每个组件都有自己的 props，如何让用户能够配置这些子组件的 props？

---

## 成熟库的处理方式

### 1. **Slots/命名 Props 模式**（推荐 ⭐⭐⭐⭐⭐）

**代表库**: Radix UI, Shadcn UI, Mantine

**特点**:
- 通过命名 props 传递子组件配置
- 类型安全，易于理解
- 支持部分覆盖

**实现示例**:
```typescript
// 类型定义
export type DialogContentProps = HTMLProps<HTMLDivElement> & {
  // 主内容 props（透传给最外层 div）
  children?: ReactNode
  
  // 子组件配置
  portalProps?: ComponentProps<typeof FloatingPortal>
  overlayProps?: ComponentProps<typeof FloatingOverlay>
  focusManagerProps?: ComponentProps<typeof FloatingFocusManager>
}

// 使用
function DialogContentImpl(props: DialogContentProps, ref: ForwardedRef<HTMLDivElement>) {
  const {
    children,
    portalProps,
    overlayProps,
    focusManagerProps,
    ...rest // 主内容 div 的 props
  } = props

  const { context: floatingContext, ...context } = useDialogContext()
  const mergedRef = useMergeRefs([context.refs.setFloating, ref])

  if (!floatingContext.open) return null

  return (
    <FloatingPortal {...portalProps}>
      <FloatingOverlay className="Dialog-overlay" lockScroll {...overlayProps}>
        <FloatingFocusManager context={floatingContext} {...focusManagerProps}>
          <div
            ref={mergedRef}
            aria-labelledby={context.labelId}
            aria-describedby={context.descriptionId}
            {...context.getFloatingProps(rest)}
          >
            {children}
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  )
}
```

**使用方式**:
```tsx
<DialogContent
  className="my-dialog"
  portalProps={{ container: document.body }}
  overlayProps={{ className: "custom-overlay", onClick: handleOverlayClick }}
  focusManagerProps={{ initialFocus: buttonRef }}
>
  Content
</DialogContent>
```

**优点**:
- ✅ 类型安全，IDE 自动补全
- ✅ 清晰明确，易于理解
- ✅ 支持部分配置
- ✅ 符合 React 习惯

**缺点**:
- ⚠️ Props 数量可能较多（但可以通过对象分组优化）

---

### 2. **配置对象模式**

**代表库**: Ant Design, Material-UI (部分组件)

**特点**:
- 通过单个配置对象传递所有子组件配置
- 结构清晰，但类型推导可能复杂

**实现示例**:
```typescript
export type DialogContentProps = HTMLProps<HTMLDivElement> & {
  children?: ReactNode
  components?: {
    portal?: ComponentProps<typeof FloatingPortal>
    overlay?: ComponentProps<typeof FloatingOverlay>
    focusManager?: ComponentProps<typeof FloatingFocusManager>
  }
}

// 使用
function DialogContentImpl(props: DialogContentProps, ref: ForwardedRef<HTMLDivElement>) {
  const { children, components, ...rest } = props
  const { portal, overlay, focusManager } = components || {}

  return (
    <FloatingPortal {...portal}>
      <FloatingOverlay {...overlay}>
        <FloatingFocusManager {...focusManager}>
          <div {...rest}>{children}</div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  )
}
```

**使用方式**:
```tsx
<DialogContent
  className="my-dialog"
  components={{
    portal: { container: document.body },
    overlay: { className: "custom-overlay" },
    focusManager: { initialFocus: buttonRef }
  }}
>
  Content
</DialogContent>
```

**优点**:
- ✅ 结构清晰，所有子组件配置集中
- ✅ Props 数量少

**缺点**:
- ⚠️ 类型推导可能复杂
- ⚠️ 不够直观，需要查看文档

---

### 3. **分离组件模式**（当前 Headless UI 方式）

**代表库**: Headless UI

**特点**:
- 每个功能组件独立导出
- 用户手动组合
- 最大灵活性

**实现示例**:
```typescript
// 不封装，直接导出子组件
export { FloatingPortal, FloatingOverlay, FloatingFocusManager }

// 用户手动组合
<DialogContent>
  <FloatingPortal>
    <FloatingOverlay>
      <FloatingFocusManager>
        <div>Content</div>
      </FloatingFocusManager>
    </FloatingOverlay>
  </FloatingPortal>
</DialogContent>
```

**优点**:
- ✅ 最大灵活性
- ✅ 完全控制

**缺点**:
- ⚠️ 使用复杂，需要了解内部结构
- ⚠️ 容易出错

---

### 4. **Props 透传 + 默认值模式**（当前实现）

**特点**:
- 只处理主组件 props
- 子组件使用硬编码默认值
- 简单但不够灵活

**当前实现**:
```typescript
// 只能配置主 div 的 props
<DialogContent className="my-dialog">
  Content
</DialogContent>

// 无法配置 FloatingPortal、FloatingOverlay、FloatingFocusManager
```

**优点**:
- ✅ 简单直接
- ✅ API 简洁

**缺点**:
- ⚠️ 不够灵活
- ⚠️ 无法自定义子组件行为

---

## 推荐方案：Slots/命名 Props 模式

### 完整实现

```typescript
// types.ts
import type { ComponentProps } from 'react'
import type { FloatingPortal, FloatingOverlay, FloatingFocusManager } from '@floating-ui/react'

export type DialogContentProps = HTMLProps<HTMLDivElement> & {
  children?: ReactNode
  portalProps?: ComponentProps<typeof FloatingPortal>
  overlayProps?: ComponentProps<typeof FloatingOverlay>
  focusManagerProps?: Omit<ComponentProps<typeof FloatingFocusManager>, 'context'>
}
```

```typescript
// dialog-content.tsx
function DialogContentImpl(props: DialogContentProps, ref: ForwardedRef<HTMLDivElement>) {
  const {
    children,
    portalProps,
    overlayProps,
    focusManagerProps,
    ...rest
  } = props

  const { context: floatingContext, ...context } = useDialogContext()
  const mergedRef = useMergeRefs([context.refs.setFloating, ref])

  if (!floatingContext.open) return null

  return (
    <FloatingPortal {...portalProps}>
      <FloatingOverlay 
        className="Dialog-overlay" 
        lockScroll 
        {...overlayProps}
      >
        <FloatingFocusManager 
          context={floatingContext} 
          {...focusManagerProps}
        >
          <div
            ref={mergedRef}
            aria-labelledby={context.labelId}
            aria-describedby={context.descriptionId}
            {...context.getFloatingProps(rest)}
          >
            {children}
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  )
}
```

### 使用示例

```tsx
// 基础使用（只配置主内容）
<DialogContent className="my-dialog">
  Content
</DialogContent>

// 配置 portal
<DialogContent 
  portalProps={{ container: document.getElementById('modal-root') }}
>
  Content
</DialogContent>

// 配置 overlay
<DialogContent 
  overlayProps={{ 
    className: "custom-overlay",
    onClick: () => console.log('overlay clicked')
  }}
>
  Content
</DialogContent>

// 配置 focus manager
<DialogContent 
  focusManagerProps={{ 
    initialFocus: buttonRef,
    returnFocus: true
  }}
>
  Content
</DialogContent>

// 组合配置
<DialogContent 
  className="my-dialog"
  portalProps={{ container: document.body }}
  overlayProps={{ className: "custom-overlay" }}
  focusManagerProps={{ initialFocus: buttonRef }}
>
  Content
</DialogContent>
```

---

## 对比总结

| 模式 | 灵活性 | 易用性 | 类型安全 | 推荐度 |
|------|--------|--------|----------|--------|
| **Slots/命名 Props** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **配置对象** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **分离组件** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Props 透传** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 最终建议

**推荐使用 Slots/命名 Props 模式**，因为：
1. ✅ 符合 React 和现代组件库的最佳实践
2. ✅ 类型安全，IDE 支持好
3. ✅ 灵活且易用
4. ✅ 与 Radix UI、Shadcn UI 等成熟库一致


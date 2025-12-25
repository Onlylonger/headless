# useMergeRefs 原理详解

## 什么是 useMergeRefs？

`useMergeRefs` 是 Floating UI 提供的一个 React Hook，用于将多个 `ref` 合并成一个回调 ref。这在需要将同一个 DOM 元素同时传递给多个 ref 的场景中非常有用。

参考文档: [Floating UI - useMergeRefs](https://floating-ui.com/docs/react-utils#usemergerefs)

## React Ref 的类型

在 React 中，`ref` 有两种形式：

1. **RefObject** (`useRef` 创建的 ref):
   ```typescript
   const ref = useRef<HTMLDivElement>(null)
   // ref.current = element
   ```

2. **Callback Ref** (函数形式的 ref):
   ```typescript
   const ref = (element: HTMLDivElement | null) => {
     // 当元素挂载/卸载时调用
   }
   ```

3. **ForwardedRef** (从 `forwardRef` 传递的 ref):
   ```typescript
   const MyComponent = forwardRef((props, ref) => {
     // ref 可能是 RefObject 或 Callback Ref
   })
   ```

## useMergeRefs 的实现原理

### 核心思想

`useMergeRefs` 的核心思想是：
1. 接收一个 ref 数组
2. 返回一个**回调 ref**（Callback Ref）
3. 当这个回调 ref 被调用时，遍历所有传入的 ref，将元素引用传递给每个 ref

### 简化实现示例

```typescript
import { useCallback } from 'react'
import type { Ref, RefCallback } from 'react'

function useMergeRefs<Instance>(
  refs: Array<Ref<Instance> | undefined>
): RefCallback<Instance> | null {
  return useCallback(
    (instance: Instance | null) => {
      // 遍历所有 ref，将 instance 传递给每个 ref
      for (const ref of refs) {
        if (ref == null) continue

        // 处理 Callback Ref
        if (typeof ref === 'function') {
          ref(instance)
        }
        // 处理 RefObject
        else {
          ref.current = instance
        }
      }
    },
    [refs] // 依赖 refs 数组
  )
}
```

### 完整实现（考虑边界情况）

```typescript
import { useCallback, useMemo } from 'react'
import type { Ref, RefCallback } from 'react'

function useMergeRefs<Instance>(
  refs: Array<Ref<Instance> | undefined | null>
): RefCallback<Instance> | null {
  // 过滤掉 null/undefined，并创建稳定的 refs 数组
  const validRefs = useMemo(
    () => refs.filter((ref): ref is Ref<Instance> => ref != null),
    [refs]
  )

  // 如果没有有效的 ref，返回 null
  if (validRefs.length === 0) {
    return null
  }

  // 如果只有一个 ref，直接返回它（优化）
  if (validRefs.length === 1) {
    const singleRef = validRefs[0]
    if (typeof singleRef === 'function') {
      return singleRef
    }
    // 如果是 RefObject，需要包装成回调 ref
    return (instance: Instance | null) => {
      if (singleRef && 'current' in singleRef) {
        singleRef.current = instance
      }
    }
  }

  // 多个 ref 的情况：返回合并的回调 ref
  return useCallback(
    (instance: Instance | null) => {
      for (const ref of validRefs) {
        if (typeof ref === 'function') {
          // Callback Ref: 直接调用函数
          ref(instance)
        } else if (ref && 'current' in ref) {
          // RefObject: 设置 current 属性
          ref.current = instance
        }
      }
    },
    [validRefs]
  )
}
```

## 使用场景

### 场景 1: 合并 forwardRef 和内部 ref

```typescript
// dialog-content.tsx
function DialogContentImpl(
  props: DialogContentProps,
  ref: ForwardedRef<HTMLDivElement> // 来自 forwardRef
) {
  const { context } = useDialogContext()
  
  // 需要同时使用：
  // 1. 外部传入的 ref (forwardRef)
  // 2. floating-ui 内部的 ref (context.refs.setFloating)
  const mergedRef = useMergeRefs([
    context.refs.setFloating, // Floating UI 需要这个 ref
    ref                        // 外部组件也需要这个 ref
  ])

  return <div ref={mergedRef}>Content</div>
}
```

### 场景 2: 合并多个库的 ref

```typescript
function MyComponent({ forwardedRef }: Props) {
  const internalRef = useRef<HTMLDivElement>(null)
  const libraryRef = useRef<HTMLDivElement>(null)
  
  // 合并三个 ref：
  // 1. 外部传入的 ref
  // 2. 组件内部的 ref
  // 3. 第三方库需要的 ref
  const mergedRef = useMergeRefs([
    forwardedRef,
    internalRef,
    libraryRef
  ])

  return <div ref={mergedRef}>Content</div>
}
```

## 工作原理详解

### 1. 回调 Ref 的执行时机

当 React 渲染组件并挂载 DOM 元素时：
```typescript
// React 内部伪代码
function mountElement(element: HTMLElement) {
  if (typeof ref === 'function') {
    // 调用回调 ref，传入元素
    ref(element)
  } else if (ref && 'current' in ref) {
    // 设置 RefObject 的 current
    ref.current = element
  }
}
```

### 2. useMergeRefs 的执行流程

```typescript
// 1. 组件渲染
const mergedRef = useMergeRefs([ref1, ref2, ref3])

// 2. 将 mergedRef 传递给 DOM 元素
<div ref={mergedRef} />

// 3. React 挂载元素时，调用 mergedRef(element)
mergedRef(domElement)

// 4. mergedRef 内部遍历所有 ref，分别设置
ref1.current = domElement  // 如果是 RefObject
ref2(domElement)           // 如果是 Callback Ref
ref3.current = domElement  // 如果是 RefObject
```

### 3. 为什么需要 useCallback？

```typescript
// ❌ 错误：每次渲染都创建新的回调 ref
function useMergeRefs(refs) {
  return (instance) => {
    // 每次渲染都创建新函数，导致 React 认为 ref 改变了
    // 可能会触发不必要的重新挂载
  }
}

// ✅ 正确：使用 useCallback 记忆化
function useMergeRefs(refs) {
  return useCallback((instance) => {
    // 只有当 refs 数组改变时才创建新函数
  }, [refs])
}
```

## 性能优化

### 1. 空数组优化

```typescript
// 如果没有 ref，返回 null，避免创建不必要的回调
if (validRefs.length === 0) {
  return null
}
```

### 2. 单个 ref 优化

```typescript
// 如果只有一个 ref，直接返回它，避免额外的包装
if (validRefs.length === 1) {
  return validRefs[0] // 直接返回，无需合并逻辑
}
```

### 3. 稳定的依赖

```typescript
// 使用 useMemo 稳定 refs 数组引用
const validRefs = useMemo(
  () => refs.filter(ref => ref != null),
  [refs]
)
```

## 实际使用示例

### 项目中的使用

```typescript
// dialog-content.tsx
const mergedRef = useMergeRefs([
  context.refs.setFloating, // Floating UI 需要控制定位
  ref                        // 外部组件可能需要访问 DOM
])

// dialog-trigger.tsx
const ref = useMergeRefs([
  context.refs.setReference, // Floating UI 需要设置参考元素
  propRef                    // 外部传入的 ref
])
```

## 总结

`useMergeRefs` 的核心原理：

1. **输入**: 一个 ref 数组（可能包含 RefObject、Callback Ref、null/undefined）
2. **处理**: 创建一个回调 ref，当被调用时遍历所有 ref 并设置值
3. **输出**: 一个记忆化的回调 ref 或 null
4. **优势**: 
   - 统一处理多种 ref 类型
   - 性能优化（记忆化、单 ref 优化）
   - 简洁的 API

这使得在需要同时使用多个 ref 的场景中，代码更加简洁和可维护。


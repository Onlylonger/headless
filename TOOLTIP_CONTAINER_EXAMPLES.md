# TooltipContainer 使用场景说明

## 代码逻辑说明

```tsx
// 第 16-28 行：当 children 是有效的 React 元素时
if (isValidElement(children)) {
  const childType = children.type as any      // 提取元素类型（如 Button, div, span）
  const childProps = children.props as any    // 提取元素的所有 props

  return (
    <Tooltip>
      <TooltipTrigger component={childType} {...childProps}>
        {childProps.children}
      </TooltipTrigger>
      <TooltipContent>{title}</TooltipContent>
    </Tooltip>
  )
}
```

## 什么时候会用到这种处理？

这段代码会在 **children 是 React 元素** 时执行，这是最常见的使用场景。

---

## 使用场景示例

### ✅ 场景 1: 使用自定义组件（最常见）

```tsx
// ✅ 会进入第 16-28 行的处理
<TooltipContainer title="提示信息">
  <Button variant="primary" size="large">
    点击我
  </Button>
</TooltipContainer>

// 处理过程：
// 1. children = <Button variant="primary" size="large">点击我</Button>
// 2. isValidElement(children) = true ✅
// 3. childType = Button 组件
// 4. childProps = { variant: "primary", size: "large", children: "点击我" }
// 5. 渲染为：
//    <TooltipTrigger component={Button} variant="primary" size="large">
//      点击我
//    </TooltipTrigger>
```

**结果**：Button 的所有 props（variant, size）都被保留，tooltip 功能正常。

---

### ✅ 场景 2: 使用原生 HTML 元素

```tsx
// ✅ 会进入第 16-28 行的处理
<TooltipContainer title="提示信息">
  <div className="custom-trigger" onClick={handleClick}>
    自定义触发器
  </div>
</TooltipContainer>

// 处理过程：
// 1. children = <div className="custom-trigger" onClick={handleClick}>自定义触发器</div>
// 2. isValidElement(children) = true ✅
// 3. childType = "div" (字符串)
// 4. childProps = { className: "custom-trigger", onClick: handleClick, children: "自定义触发器" }
// 5. 渲染为：
//    <TooltipTrigger component="div" className="custom-trigger" onClick={handleClick}>
//      自定义触发器
//    </TooltipTrigger>
```

**结果**：div 的所有 props（className, onClick）都被保留。

---

### ✅ 场景 3: 使用带 ref 的组件

```tsx
const MyButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <button ref={ref} {...props} />
})

// ✅ 会进入第 16-28 行的处理
<TooltipContainer title="提示信息">
  <MyButton ref={buttonRef} disabled>
    我的按钮
  </MyButton>
</TooltipContainer>

// 处理过程：
// 1. children = <MyButton ref={buttonRef} disabled>我的按钮</MyButton>
// 2. isValidElement(children) = true ✅
// 3. childType = MyButton 组件
// 4. childProps = { disabled: true, children: "我的按钮" }
// 5. 渲染为：
//    <TooltipTrigger component={MyButton} disabled>
//      我的按钮
//    </TooltipTrigger>
```

**结果**：MyButton 的 ref 和 props 都能正确传递。

---

### ✅ 场景 4: 使用带复杂 props 的组件

```tsx
// ✅ 会进入第 16-28 行的处理
<TooltipContainer title="提示信息">
  <input
    type="text"
    placeholder="输入内容"
    value={value}
    onChange={handleChange}
    className="custom-input"
    data-testid="tooltip-input"
  />
</TooltipContainer>

// 处理过程：
// 1. children = <input type="text" ... />
// 2. isValidElement(children) = true ✅
// 3. childType = "input"
// 4. childProps = { type: "text", placeholder: "输入内容", value, onChange, className, data-testid }
// 5. 渲染为：
//    <TooltipTrigger 
//      component="input"
//      type="text"
//      placeholder="输入内容"
//      value={value}
//      onChange={handleChange}
//      className="custom-input"
//      data-testid="tooltip-input"
//    />
```

**结果**：input 的所有属性都被保留，tooltip 可以正常工作。

---

### ❌ 场景 5: 使用字符串或数字（不会进入这段代码）

```tsx
// ❌ 不会进入第 16-28 行，会进入第 30-36 行的处理
<TooltipContainer title="提示信息">
  普通文本
</TooltipContainer>

// 处理过程：
// 1. children = "普通文本" (字符串)
// 2. isValidElement(children) = false ❌
// 3. 进入第 30-36 行：
//    <TooltipTrigger>普通文本</TooltipTrigger>
//    (默认使用 Button 组件)
```

**结果**：使用默认的 Button 组件包装文本。

---

### ❌ 场景 6: 使用数组（不会进入这段代码）

```tsx
// ❌ 不会进入第 16-28 行
<TooltipContainer title="提示信息">
  {[<span>1</span>, <span>2</span>]}
</TooltipContainer>

// 处理过程：
// 1. children = [<span>1</span>, <span>2</span>] (数组)
// 2. isValidElement(children) = false ❌
// 3. 进入第 30-36 行
```

---

## 为什么需要这种处理？

### 1. **保留原始元素的所有属性**

```tsx
// 如果不提取 props，会丢失所有属性
<TooltipContainer title="提示">
  <Button variant="primary" size="large" disabled>
    按钮
  </Button>
</TooltipContainer>

// ❌ 错误方式（丢失 props）：
<TooltipTrigger>
  <Button variant="primary" size="large" disabled>按钮</Button>
</TooltipTrigger>
// 问题：Button 被嵌套，可能无法正确接收 tooltip 的事件

// ✅ 正确方式（保留 props）：
<TooltipTrigger component={Button} variant="primary" size="large" disabled>
  按钮
</TooltipTrigger>
// 结果：Button 直接作为 trigger，所有 props 都保留
```

### 2. **支持任意组件类型**

```tsx
// 支持任何 React 组件
<TooltipContainer title="提示">
  <CustomComponent prop1="value1" prop2="value2" />
</TooltipContainer>

// 自动提取 CustomComponent 和它的所有 props
```

### 3. **保持 API 简洁**

```tsx
// 用户只需要这样写：
<TooltipContainer title="提示">
  <Button>按钮</Button>
</TooltipContainer>

// 不需要手动处理：
<Tooltip>
  <TooltipTrigger component={Button}>按钮</TooltipTrigger>
  <TooltipContent>提示</TooltipContent>
</Tooltip>
```

---

## 实际应用场景

### 场景 A: 表单输入提示

```tsx
<TooltipContainer title="请输入您的邮箱地址">
  <input
    type="email"
    placeholder="email@example.com"
    required
    className="form-input"
  />
</TooltipContainer>
```

### 场景 B: 按钮提示

```tsx
<TooltipContainer title="删除此项目" placement="top">
  <Button variant="danger" size="small">
    <DeleteIcon />
  </Button>
</TooltipContainer>
```

### 场景 C: 图标提示

```tsx
<TooltipContainer title="更多信息">
  <IconButton aria-label="info">
    <InfoIcon />
  </IconButton>
</TooltipContainer>
```

### 场景 D: 链接提示

```tsx
<TooltipContainer title="点击查看详情">
  <a href="/details" className="link">
    查看详情
  </a>
</TooltipContainer>
```

---

## 总结

**第 16-28 行的代码会在以下情况执行：**

1. ✅ `children` 是 React 元素（组件或 HTML 元素）
2. ✅ 需要保留原始元素的所有 props
3. ✅ 需要支持任意组件类型
4. ✅ 这是 **最常见的使用场景**（99% 的情况）

**不会执行的情况：**

1. ❌ `children` 是字符串、数字等原始值
2. ❌ `children` 是数组
3. ❌ `children` 是 null/undefined

这种设计让 TooltipContainer 的 API 更加简洁和灵活，用户可以直接传入任何 React 元素，组件会自动处理。


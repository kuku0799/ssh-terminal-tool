import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    overflow: hidden;
    user-select: none;
  }

  #root {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.primary};
  }

  /* 选择文本样式 */
  ::selection {
    background: ${props => props.theme.colors.primary}40;
  }

  /* 输入框样式 */
  input, textarea, select {
    font-family: inherit;
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 4px;
    padding: 8px 12px;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
    }

    &::placeholder {
      color: ${props => props.theme.colors.textSecondary};
    }
  }

  /* 按钮样式 */
  button {
    font-family: inherit;
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.textInverse};
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    outline: none;

    &:hover {
      background: ${props => props.theme.colors.primaryHover};
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background: ${props => props.theme.colors.backgroundSecondary};
      color: ${props => props.theme.colors.textSecondary};
      cursor: not-allowed;
      transform: none;
    }
  }

  /* 链接样式 */
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${props => props.theme.colors.primaryHover};
    }
  }

  /* 代码样式 */
  code {
    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
    background: ${props => props.theme.colors.backgroundSecondary};
    padding: 2px 4px;
    border-radius: 2px;
    font-size: 0.9em;
  }

  pre {
    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
    background: ${props => props.theme.colors.backgroundSecondary};
    padding: 16px;
    border-radius: 4px;
    overflow-x: auto;
    line-height: 1.5;
  }

  /* 工具提示样式 */
  .tooltip {
    position: relative;
    display: inline-block;
  }

  .tooltip .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
    text-align: center;
    border-radius: 4px;
    padding: 4px 8px;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -60px;
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 12px;
    border: 1px solid ${props => props.theme.colors.border};
  }

  .tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }
`

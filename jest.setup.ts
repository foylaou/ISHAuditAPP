import '@testing-library/jest-dom'
import React from 'react'

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({ src, alt, width, height, priority, ...props }: any): React.JSX.Element {
    return React.createElement('img', {
      src,
      alt,
      width,
      height,
      'data-priority': priority, // 將 priority 轉換為 data 屬性
      ...props
    })
  }
}))

// Mock ExampleLoaderComponent
jest.mock('@/dev/palette', () => ({
  ExampleLoaderComponent: () => React.createElement('div', {
    'data-testid': 'loader'
  }, 'Loading...')
}))

beforeAll(() => {
  // 全局設置
})

afterEach(() => {
  jest.resetModules()
})

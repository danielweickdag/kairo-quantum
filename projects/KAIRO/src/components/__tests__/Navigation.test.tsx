import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { usePathname } from 'next/navigation'
import Navigation from '../Navigation'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

// Mock the auth context
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    user: { name: 'Test User', email: 'test@example.com' },
    logout: jest.fn(),
  })),
}))

// Mock the broker account context
jest.mock('@/contexts/BrokerAccountContext', () => ({
  useBrokerAccount: jest.fn(() => ({
    selectedAccount: null,
  })),
}))

beforeEach(() => {
  ;(usePathname as jest.Mock).mockReturnValue('/dashboard')
})

describe('Navigation', () => {
  it('should render navigation with proper accessibility attributes', () => {
    render(<Navigation />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    expect(nav).toHaveAttribute('aria-label', 'Main navigation')
  })

  it('should render all main navigation links', () => {
    render(<Navigation />)
    
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /trading/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /portfolio/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /automation/i })).toBeInTheDocument()
  })

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<Navigation />)
    
    const firstLink = screen.getByRole('link', { name: /dashboard/i })
    
    // Focus the first link
    await user.tab()
    expect(firstLink).toHaveFocus()
    
    // Test Enter key navigation
    await user.keyboard('{Enter}')
    // Note: In a real test, you'd mock the router and check navigation
  })

  it('should toggle mobile menu', async () => {
    render(<Navigation />)
    
    const menuButton = screen.getByRole('button', { name: /toggle navigation menu/i })
    expect(menuButton).toBeInTheDocument()
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    
    // Open menu
    fireEvent.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    
    // Close menu
    fireEvent.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('should handle mobile menu keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<Navigation />)
    
    const menuButton = screen.getByRole('button', { name: /toggle navigation menu/i })
    
    // Open menu with Enter key
    await user.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    
    // Close menu with Escape key
    await user.keyboard('{Escape}')
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('should show current page indicator', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/trading')
    render(<Navigation />)
    
    const tradingLink = screen.getByRole('link', { name: /trading/i })
    expect(tradingLink).toHaveAttribute('aria-current', 'page')
  })

  it('should have proper focus styles', () => {
    render(<Navigation />)
    
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link.className).toContain('focus:outline-none')
      expect(link.className).toContain('focus:ring-2')
    })
  })

  it('should have accessible icons', () => {
    render(<Navigation />)
    
    // Check that icons are properly hidden from screen readers
    const icons = document.querySelectorAll('svg')
    icons.forEach(icon => {
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })
  })

  it('should display user information when logged in', () => {
    render(<Navigation />)
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })
})
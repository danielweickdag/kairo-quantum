import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import LoginPage from '../page'

// Mock the auth context
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}))

// Mock the error handler
jest.mock('@/lib/errorHandler', () => ({
  useErrorHandler: jest.fn(() => ({
    handleError: jest.fn(),
  })),
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockPush = jest.fn()
const mockLogin = jest.fn()
const mockHandleError = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  ;(useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  })
  
  const { useAuth } = require('@/contexts/AuthContext')
  useAuth.mockReturnValue({
    login: mockLogin,
  })
  
  const { useErrorHandler } = require('@/lib/errorHandler')
  useErrorHandler.mockReturnValue({
    handleError: mockHandleError,
  })
})

describe('LoginPage', () => {
  it('should render login form elements', () => {
    render(<LoginPage />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument()
  })

  it('should handle successful login', async () => {
    mockLogin.mockResolvedValueOnce({})
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('should handle login errors', async () => {
    const error = new Error('Invalid credentials')
    mockLogin.mockRejectedValueOnce(error)
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockHandleError).toHaveBeenCalledWith(error, 'Login attempt failed')
    })
  })

  it('should toggle password visibility', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const passwordInput = screen.getByLabelText(/password/i)
    // Find the toggle button by looking for buttons that are not the submit button
    const buttons = screen.getAllByRole('button')
    const toggleButton = buttons.find(button => button.getAttribute('type') === 'button')
    
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    if (toggleButton) {
      await user.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'text')
      
      await user.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'password')
    }
  })

  it('should have remember me checkbox', () => {
    render(<LoginPage />)
    
    const rememberMeCheckbox = screen.getByLabelText(/remember me/i)
    expect(rememberMeCheckbox).toBeInTheDocument()
    expect(rememberMeCheckbox).toHaveAttribute('type', 'checkbox')
  })

  it('should have proper accessibility attributes', () => {
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('autoComplete', 'email')
    expect(passwordInput).toHaveAttribute('autoComplete', 'current-password')
  })

  it('should display demo credentials', () => {
    render(<LoginPage />)
    
    expect(screen.getByText(/demo credentials/i)).toBeInTheDocument()
    expect(screen.getByText(/demo@kairo.com/i)).toBeInTheDocument()
    expect(screen.getByText(/demo123/i)).toBeInTheDocument()
  })

  it('should show loading state during login', async () => {
    // Mock a delayed login
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    expect(screen.getByText(/signing in/i)).toBeInTheDocument()
  })
})
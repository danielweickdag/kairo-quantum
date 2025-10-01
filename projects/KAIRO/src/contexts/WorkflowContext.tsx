'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { workflowAutomationService, AutomatedWorkflow, WorkflowExecution, WorkflowTriggerEvent } from '../../lib/services/workflowAutomationService';
import { logger } from '../lib/logger';
import { useRouter } from 'next/navigation';

interface WorkflowState {
  workflows: AutomatedWorkflow[];
  activeWorkflows: AutomatedWorkflow[];
  currentExecution?: WorkflowExecution;
  recentExecutions: WorkflowExecution[];
  isConnected: boolean;
  isLoading: boolean;
  error?: string;
  selectedWorkflowId?: string;
  crossPageData?: Record<string, any>;
}

type WorkflowAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_WORKFLOWS'; payload: AutomatedWorkflow[] }
  | { type: 'ADD_WORKFLOW'; payload: AutomatedWorkflow }
  | { type: 'UPDATE_WORKFLOW'; payload: AutomatedWorkflow }
  | { type: 'DELETE_WORKFLOW'; payload: string }
  | { type: 'SET_CURRENT_EXECUTION'; payload: WorkflowExecution }
  | { type: 'ADD_EXECUTION'; payload: WorkflowExecution }
  | { type: 'SET_RECENT_EXECUTIONS'; payload: WorkflowExecution[] }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SELECT_WORKFLOW'; payload: string }
  | { type: 'SET_CROSS_PAGE_DATA'; payload: Record<string, any> }
  | { type: 'CLEAR_CROSS_PAGE_DATA' }
  | { type: 'SYNC_STATE'; payload: WorkflowState }
  | { type: 'UPDATE_WORKFLOW_STATUS'; payload: { workflowId: string; status: string } };

const initialState: WorkflowState = {
  workflows: [],
  activeWorkflows: [],
  recentExecutions: [],
  isConnected: false,
  isLoading: false,
  crossPageData: {}
};

function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: undefined };
    
    case 'SET_WORKFLOWS':
      return {
        ...state,
        workflows: action.payload,
        activeWorkflows: action.payload.filter(w => w.isActive)
      };
    
    case 'ADD_WORKFLOW':
      const newWorkflows = [...state.workflows, action.payload];
      return {
        ...state,
        workflows: newWorkflows,
        activeWorkflows: newWorkflows.filter(w => w.isActive)
      };
    
    case 'UPDATE_WORKFLOW':
      const updatedWorkflows = state.workflows.map(w => 
        w.id === action.payload.id ? action.payload : w
      );
      return {
        ...state,
        workflows: updatedWorkflows,
        activeWorkflows: updatedWorkflows.filter(w => w.isActive)
      };
    
    case 'DELETE_WORKFLOW':
      const filteredWorkflows = state.workflows.filter(w => w.id !== action.payload);
      return {
        ...state,
        workflows: filteredWorkflows,
        activeWorkflows: filteredWorkflows.filter(w => w.isActive)
      };
    
    case 'SET_CURRENT_EXECUTION':
      return { ...state, currentExecution: action.payload };
    
    case 'ADD_EXECUTION':
      return {
        ...state,
        recentExecutions: [action.payload, ...state.recentExecutions.slice(0, 9)]
      };
    
    case 'SET_RECENT_EXECUTIONS':
      return { ...state, recentExecutions: action.payload };
    
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    
    case 'SELECT_WORKFLOW':
      return { ...state, selectedWorkflowId: action.payload };
    
    case 'SET_CROSS_PAGE_DATA':
      return { ...state, crossPageData: { ...state.crossPageData, ...action.payload } };
    
    case 'CLEAR_CROSS_PAGE_DATA':
      return { ...state, crossPageData: {} };
    
    case 'SYNC_STATE':
      return { ...action.payload };
    
    case 'UPDATE_WORKFLOW_STATUS':
      const statusUpdatedWorkflows = state.workflows.map(w => 
        w.id === action.payload.workflowId 
          ? { ...w, status: action.payload.status }
          : w
      );
      return {
        ...state,
        workflows: statusUpdatedWorkflows,
        activeWorkflows: statusUpdatedWorkflows.filter(w => w.isActive)
      };
    
    default:
      return state;
  }
}

interface WorkflowContextType {
  workflowState: WorkflowState;
  
  // Workflow Management
  createWorkflow: (workflow: Omit<AutomatedWorkflow, 'id' | 'createdAt' | 'executionCount' | 'successRate'>) => Promise<string>;
  updateWorkflow: (id: string, updates: Partial<AutomatedWorkflow>) => Promise<boolean>;
  deleteWorkflow: (id: string) => Promise<boolean>;
  toggleWorkflow: (id: string) => Promise<boolean>;
  
  // Workflow Execution
  executeWorkflow: (workflowId: string, triggerData?: Record<string, any>) => Promise<string>;
  stopExecution: (executionId: string) => Promise<boolean>;
  updateWorkflowStatus: (workflowId: string, status: string) => Promise<void>;
  
  // Cross-page Communication
  triggerFromDashboard: (workflowId: string, data?: Record<string, any>) => void;
  receiveFromDashboard: (workflowId: string, data?: Record<string, any>) => void;
  navigateToTrading: (workflowId?: string, config?: Record<string, any>) => void;
  navigateToDashboard: (workflowId?: string, config?: Record<string, any>) => void;
  handleDeepLink: (searchParams: URLSearchParams) => void;
  setCrossPageData: (data: Record<string, any>) => void;
  clearCrossPageData: () => void;
  
  // State Management
  selectWorkflow: (workflowId: string) => void;
  refreshWorkflows: () => Promise<void>;
  clearError: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);
  const router = useRouter();

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('workflowState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'SYNC_STATE', payload: parsedState });
      }
    } catch (error) {
      logger.error('Failed to load workflow state from localStorage', error as Error);
    }
  }, []);

  // Real-time status broadcasting
  const broadcastStatusUpdate = useCallback((workflowId: string, status: string) => {
    const updateEvent = new CustomEvent('workflow-status-update', {
      detail: { workflowId, status, timestamp: Date.now() }
    });
    window.dispatchEvent(updateEvent);
    
    // Cross-tab communication
    localStorage.setItem('workflow-status-update', JSON.stringify({
      workflowId,
      status,
      timestamp: Date.now()
    }));
  }, []);

  // Listen for real-time status updates
  useEffect(() => {
    const handleStatusUpdate = (event: CustomEvent) => {
      const { workflowId, status } = event.detail;
      dispatch({ type: 'UPDATE_WORKFLOW_STATUS', payload: { workflowId, status } });
    };

    const handleStorageStatusUpdate = (event: StorageEvent) => {
      if (event.key === 'workflow-status-update' && event.newValue) {
        try {
          const { workflowId, status } = JSON.parse(event.newValue);
          dispatch({ type: 'UPDATE_WORKFLOW_STATUS', payload: { workflowId, status } });
        } catch (error) {
          console.error('Failed to parse workflow status update:', error);
        }
      }
    };

    window.addEventListener('workflow-status-update', handleStatusUpdate as EventListener);
    window.addEventListener('storage', handleStorageStatusUpdate);

    return () => {
      window.removeEventListener('workflow-status-update', handleStatusUpdate as EventListener);
      window.removeEventListener('storage', handleStorageStatusUpdate);
    };
  }, []);

  // Real-time synchronization
  useEffect(() => {
    // Save state to localStorage whenever it changes
    localStorage.setItem('workflowState', JSON.stringify(state));
    
    // Broadcast state changes to other tabs/windows
    const event = new CustomEvent('workflow-state-update', {
      detail: { state, timestamp: Date.now() }
    });
    window.dispatchEvent(event);
  }, [state]);

  useEffect(() => {
    // Listen for state updates from other tabs/windows
    const handleStateUpdate = (event: CustomEvent) => {
      const { state: newState } = event.detail;
      if (newState && JSON.stringify(newState) !== JSON.stringify(state)) {
        dispatch({ type: 'SYNC_STATE', payload: newState });
      }
    };

    // Listen for localStorage changes (cross-tab communication)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'workflowState' && event.newValue) {
        try {
          const newState = JSON.parse(event.newValue);
          if (JSON.stringify(newState) !== JSON.stringify(state)) {
            dispatch({ type: 'SYNC_STATE', payload: newState });
          }
        } catch (error) {
          console.error('Failed to parse workflow state from localStorage:', error);
        }
      }
    };

    window.addEventListener('workflow-state-update', handleStateUpdate as EventListener);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('workflow-state-update', handleStateUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [state]);

  // Initialize workflow service and set up event listeners
  useEffect(() => {
    const initializeWorkflows = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Initialize the service
        await workflowAutomationService.initialize();
        
        // Load existing workflows
        const workflows = workflowAutomationService.getAllWorkflows();
        dispatch({ type: 'SET_WORKFLOWS', payload: workflows });
        
        // Load recent executions
        const recentExecutions = workflowAutomationService.getRecentExecutions(10);
        dispatch({ type: 'SET_RECENT_EXECUTIONS', payload: recentExecutions });
        
        dispatch({ type: 'SET_CONNECTED', payload: true });
        logger.info('Workflow context initialized successfully');
        
      } catch (error) {
        logger.error('Failed to initialize workflow context', error as Error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize workflows' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeWorkflows();
  }, []);

  // Set up event listeners for workflow service events
  useEffect(() => {
    const handleWorkflowCreated = (workflow: AutomatedWorkflow) => {
      dispatch({ type: 'ADD_WORKFLOW', payload: workflow });
      logger.info(`Workflow created: ${workflow.name}`);
    };

    const handleWorkflowUpdated = (workflow: AutomatedWorkflow) => {
      dispatch({ type: 'UPDATE_WORKFLOW', payload: workflow });
      logger.info(`Workflow updated: ${workflow.name}`);
    };

    const handleWorkflowDeleted = (workflowId: string) => {
      dispatch({ type: 'DELETE_WORKFLOW', payload: workflowId });
      logger.info(`Workflow deleted: ${workflowId}`);
    };

    const handleExecutionStarted = (execution: WorkflowExecution) => {
      dispatch({ type: 'SET_CURRENT_EXECUTION', payload: execution });
      dispatch({ type: 'ADD_EXECUTION', payload: execution });
      logger.info(`Workflow execution started: ${execution.id}`);
    };

    const handleExecutionCompleted = (execution: WorkflowExecution) => {
      dispatch({ type: 'SET_CURRENT_EXECUTION', payload: execution });
      logger.info(`Workflow execution completed: ${execution.id}`);
    };

    const handleExecutionFailed = (execution: WorkflowExecution) => {
      dispatch({ type: 'SET_CURRENT_EXECUTION', payload: execution });
      logger.error(`Workflow execution failed: ${execution.id}`, new Error(execution.error));
    };

    const handlePageNavigation = (data: { to: string; workflow?: string }) => {
      if (data.workflow) {
        dispatch({ type: 'SELECT_WORKFLOW', payload: data.workflow });
        dispatch({ type: 'SET_CROSS_PAGE_DATA', payload: { selectedWorkflow: data.workflow } });
      }
      router.push(data.to);
    };

    // Register event listeners
    workflowAutomationService.on('workflow:created', handleWorkflowCreated);
    workflowAutomationService.on('workflow:updated', handleWorkflowUpdated);
    workflowAutomationService.on('workflow:deleted', handleWorkflowDeleted);
    workflowAutomationService.on('workflow:execution:started', handleExecutionStarted);
    workflowAutomationService.on('workflow:execution:completed', handleExecutionCompleted);
    workflowAutomationService.on('workflow:execution:failed', handleExecutionFailed);
    workflowAutomationService.on('page:navigate', handlePageNavigation);

    // Cleanup event listeners
    return () => {
      workflowAutomationService.off('workflow:created', handleWorkflowCreated);
      workflowAutomationService.off('workflow:updated', handleWorkflowUpdated);
      workflowAutomationService.off('workflow:deleted', handleWorkflowDeleted);
      workflowAutomationService.off('workflow:execution:started', handleExecutionStarted);
      workflowAutomationService.off('workflow:execution:completed', handleExecutionCompleted);
      workflowAutomationService.off('workflow:execution:failed', handleExecutionFailed);
      workflowAutomationService.off('page:navigate', handlePageNavigation);
    };
  }, [router]);

  // Context methods
  const createWorkflow = async (workflow: Omit<AutomatedWorkflow, 'id' | 'createdAt' | 'executionCount' | 'successRate'>): Promise<string> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const workflowId = workflowAutomationService.createWorkflow(workflow);
      return workflowId;
    } catch (error) {
      logger.error('Failed to create workflow', error as Error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create workflow' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateWorkflow = async (id: string, updates: Partial<AutomatedWorkflow>): Promise<boolean> => {
    try {
      const success = workflowAutomationService.updateWorkflow(id, updates);
      if (!success) {
        dispatch({ type: 'SET_ERROR', payload: 'Workflow not found' });
      }
      return success;
    } catch (error) {
      logger.error('Failed to update workflow', error as Error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update workflow' });
      return false;
    }
  };

  const deleteWorkflow = async (id: string): Promise<boolean> => {
    try {
      const success = workflowAutomationService.deleteWorkflow(id);
      if (!success) {
        dispatch({ type: 'SET_ERROR', payload: 'Workflow not found' });
      }
      return success;
    } catch (error) {
      logger.error('Failed to delete workflow', error as Error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete workflow' });
      return false;
    }
  };

  const toggleWorkflow = async (id: string): Promise<boolean> => {
    const workflow = workflowAutomationService.getWorkflow(id);
    if (!workflow) {
      dispatch({ type: 'SET_ERROR', payload: 'Workflow not found' });
      return false;
    }
    
    return updateWorkflow(id, { isActive: !workflow.isActive });
  };

  const executeWorkflow = async (workflowId: string, triggerData?: Record<string, any>): Promise<string> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const executionId = await workflowAutomationService.executeWorkflow(workflowId, triggerData);
      return executionId;
    } catch (error) {
      logger.error('Failed to execute workflow', error as Error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to execute workflow' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const stopExecution = async (executionId: string): Promise<boolean> => {
    try {
      // Implementation would depend on workflow service capabilities
      logger.info(`Stopping execution: ${executionId}`);
      return true;
    } catch (error) {
      logger.error('Failed to stop execution', error as Error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to stop execution' });
      return false;
    }
  };

  const triggerFromDashboard = (workflowId: string, data?: Record<string, any>) => {
    try {
      workflowAutomationService.triggerFromDashboard(workflowId, data);
      dispatch({ type: 'SELECT_WORKFLOW', payload: workflowId });
      dispatch({ type: 'SET_CROSS_PAGE_DATA', payload: { triggerSource: 'dashboard', workflowId, ...data } });
      
      // Broadcast trigger event to other tabs
      const event = new CustomEvent('workflow-trigger', {
        detail: { workflowId, data, timestamp: Date.now() }
      });
      window.dispatchEvent(event);
      
      // Also save to localStorage for cross-tab communication
      localStorage.setItem('workflow-trigger', JSON.stringify({
        workflowId,
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      logger.error('Failed to trigger workflow from dashboard', error as Error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to trigger workflow' });
    }
  };

  const receiveFromDashboard = (workflowId: string, data?: Record<string, any>) => {
    // Process received data from dashboard
    const workflow = workflowAutomationService.getWorkflow(workflowId);
    if (workflow) {
      dispatch({ type: 'SELECT_WORKFLOW', payload: workflowId });
      if (data) {
        setCrossPageData({ [`workflow_${workflowId}`]: data });
      }
      logger.info(`Received workflow data from dashboard for ${workflowId}: ${JSON.stringify(data)}`);
    }
  };

  const navigateToTrading = (workflowId?: string, config?: Record<string, any>) => {
    const params = new URLSearchParams();
    
    if (workflowId) {
      params.set('workflow', workflowId);
      params.set('source', 'dashboard');
      
      if (config) {
        // Encode configuration as URL parameters
        Object.entries(config).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
          }
        });
      }
      
      dispatch({ type: 'SELECT_WORKFLOW', payload: workflowId });
      dispatch({ type: 'SET_CROSS_PAGE_DATA', payload: { source: 'dashboard', workflowId, config } });
    }
    
    const url = params.toString() ? `/trading?${params.toString()}` : '/trading';
    router.push(url);
  };

  const navigateToDashboard = (workflowId?: string, config?: Record<string, any>) => {
    const params = new URLSearchParams();
    
    if (workflowId) {
      params.set('workflow', workflowId);
      params.set('source', 'trading');
      
      if (config) {
        Object.entries(config).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
          }
        });
      }
      
      dispatch({ type: 'SELECT_WORKFLOW', payload: workflowId });
      dispatch({ type: 'SET_CROSS_PAGE_DATA', payload: { source: 'trading', workflowId, config } });
    }
    
    const url = params.toString() ? `/dashboard?${params.toString()}` : '/dashboard';
    router.push(url);
  };

  // Deep link handler for URL parameters
  const handleDeepLink = useCallback((searchParams: URLSearchParams) => {
    const workflowId = searchParams.get('workflow');
    const source = searchParams.get('source');
    
    if (workflowId) {
      // Extract configuration from URL parameters
      const config: Record<string, any> = {};
      searchParams.forEach((value, key) => {
        if (key !== 'workflow' && key !== 'source') {
          try {
            // Try to parse as JSON first, fallback to string
            config[key] = value.startsWith('{') || value.startsWith('[') ? JSON.parse(value) : value;
          } catch {
            config[key] = value;
          }
        }
      });
      
      dispatch({ type: 'SELECT_WORKFLOW', payload: workflowId });
      dispatch({ type: 'SET_CROSS_PAGE_DATA', payload: { source, workflowId, config } });
      
      // Auto-execute workflow if specified
      if (config.autoExecute === 'true' || config.autoExecute === true) {
        setTimeout(() => {
          executeWorkflow(workflowId, config);
        }, 1000); // Small delay to ensure page is loaded
      }
    }
  }, [executeWorkflow]);

  const setCrossPageData = (data: Record<string, any>) => {
    dispatch({ type: 'SET_CROSS_PAGE_DATA', payload: data });
  };

  const clearCrossPageData = () => {
    dispatch({ type: 'CLEAR_CROSS_PAGE_DATA' });
  };

  const selectWorkflow = (workflowId: string) => {
    dispatch({ type: 'SELECT_WORKFLOW', payload: workflowId });
  };

  const refreshWorkflows = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const workflows = workflowAutomationService.getAllWorkflows();
      dispatch({ type: 'SET_WORKFLOWS', payload: workflows });
      
      const recentExecutions = workflowAutomationService.getRecentExecutions(10);
      dispatch({ type: 'SET_RECENT_EXECUTIONS', payload: recentExecutions });
    } catch (error) {
      logger.error('Failed to refresh workflows', error as Error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh workflows' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateWorkflowStatus = async (workflowId: string, status: string) => {
    try {
      // Use updateWorkflow method with isActive status
      const isActive = status === 'active';
      const success = workflowAutomationService.updateWorkflow(workflowId, { isActive });
      
      if (success) {
        dispatch({ type: 'UPDATE_WORKFLOW_STATUS', payload: { workflowId, status } });
        
        // Broadcast status update in real-time
        broadcastStatusUpdate(workflowId, status);
        
        logger.info(`Workflow ${workflowId} status updated to ${status}`);
      } else {
        throw new Error('Failed to update workflow');
      }
    } catch (error) {
      logger.error('Failed to update workflow status', error as Error);
      throw error;
    }
  };

  const contextValue: WorkflowContextType = {
    workflowState: state,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    toggleWorkflow,
    executeWorkflow,
    stopExecution,
    updateWorkflowStatus,
    triggerFromDashboard,
    receiveFromDashboard,
    navigateToTrading,
    navigateToDashboard,
    handleDeepLink,
    setCrossPageData,
    clearCrossPageData,
    selectWorkflow,
    refreshWorkflows,
    clearError
  };

  return (
    <WorkflowContext.Provider value={contextValue}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow(): WorkflowContextType {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}

export default WorkflowContext;
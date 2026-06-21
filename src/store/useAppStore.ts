import { create } from 'zustand'
import type { User } from 'firebase/auth'
import type { DayDocument, BacklogItem, RecurringTask } from '@/types'

interface AppStore {
  // Auth
  user: User | null
  authLoading: boolean
  setUser: (user: User | null) => void
  setAuthLoading: (loading: boolean) => void

  // Active day
  dayDoc: DayDocument | null
  dayId: string | null
  dayLoading: boolean
  setDayDoc: (doc: DayDocument | null, dayId: string | null) => void
  setDayLoading: (loading: boolean) => void

  // Backlog
  backlogItems: BacklogItem[]
  setBacklogItems: (items: BacklogItem[]) => void

  // Recurring
  recurringTasks: RecurringTask[]
  setRecurringTasks: (items: RecurringTask[]) => void

  // UI — lock confirmation dialog
  isLockDialogOpen: boolean
  setLockDialogOpen: (open: boolean) => void

  // UI — delete backlog confirmation dialog
  isDeleteBacklogDialogOpen: boolean
  deletingBacklogId: string | null
  openDeleteBacklogDialog: (id: string) => void
  closeDeleteBacklogDialog: () => void

  // UI — calendar ledger modal
  ledgerDate: string | null
  setLedgerDate: (date: string | null) => void

  // UI — active day IDs for calendar
  activeDayIds: string[]
  setActiveDayIds: (ids: string[]) => void
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  authLoading: true,
  setUser: (user) => set({ user }),
  setAuthLoading: (authLoading) => set({ authLoading }),

  dayDoc: null,
  dayId: null,
  dayLoading: true,
  setDayDoc: (dayDoc, dayId) => set({ dayDoc, dayId }),
  setDayLoading: (dayLoading) => set({ dayLoading }),

  backlogItems: [],
  setBacklogItems: (backlogItems) => set({ backlogItems }),

  recurringTasks: [],
  setRecurringTasks: (recurringTasks) => set({ recurringTasks }),

  isLockDialogOpen: false,
  setLockDialogOpen: (isLockDialogOpen) => set({ isLockDialogOpen }),

  isDeleteBacklogDialogOpen: false,
  deletingBacklogId: null,
  openDeleteBacklogDialog: (id) =>
    set({ isDeleteBacklogDialogOpen: true, deletingBacklogId: id }),
  closeDeleteBacklogDialog: () =>
    set({ isDeleteBacklogDialogOpen: false, deletingBacklogId: null }),

  ledgerDate: null,
  setLedgerDate: (ledgerDate) => set({ ledgerDate }),

  activeDayIds: [],
  setActiveDayIds: (activeDayIds) => set({ activeDayIds }),
}))

import { defineStore } from 'pinia'
import type { Employee } from '@/types/employee'

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    employees: [] as Employee[],
    currentEmployee: null as Employee | null,
  }),

  getters: {
    employeeById: (state) => (id: string) => state.employees.find(e => e.id === id),
    employeeCount: (state) => state.employees.length,
  },

  actions: {
    setEmployees(employees: Employee[]) {
      this.employees = employees
    },

    setCurrentEmployee(employee: Employee | null) {
      this.currentEmployee = employee
    },

    addEmployee(employee: Employee) {
      this.employees.push(employee)
    },

    updateEmployee(id: string, data: Partial<Employee>) {
      const index = this.employees.findIndex(e => e.id === id)
      if (index !== -1) {
        this.employees[index] = { ...this.employees[index], ...data } as Employee
      }
      if (this.currentEmployee?.id === id) {
        this.currentEmployee = { ...this.currentEmployee, ...data } as Employee
      }
    },

    removeEmployee(id: string) {
      const index = this.employees.findIndex(e => e.id === id)
      if (index !== -1) {
        this.employees.splice(index, 1)
      }
      if (this.currentEmployee?.id === id) {
        this.currentEmployee = null
      }
    },

    clearEmployees() {
      this.employees = []
      this.currentEmployee = null
    },
  },

  persist: {
    key: 'employee-store',
    storage: localStorage,
  },
})

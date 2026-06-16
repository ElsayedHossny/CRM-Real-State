"use client"
import React, { createContext, useContext, useState } from "react";
import { Invoice, mockInvoices } from "../../../data/inviocedata";

type InvoiceContextType = {
  invoices: Invoice[]
  addInvoice: (invoice: Invoice) => void
  deleteInvoice: (id: string) => void
}

const InvoiceContext = createContext<InvoiceContextType | null>(null)

export default function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)

  const addInvoice = (invoice: Invoice) => {
    setInvoices(prev => [invoice, ...prev])
  }

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id))
  }

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, deleteInvoice }}>
      {children}
    </InvoiceContext.Provider>
  )
}

export const useInvoices = () => {
  const ctx = useContext(InvoiceContext)
  if (!ctx) throw new Error('useInvoices must be used within InvoiceProvider')
  return ctx
}
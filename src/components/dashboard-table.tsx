"use client"

import { DataTable } from './data-table'
import { Conversation } from '@/db/schema'

interface DashboardTableProps {
  data: Conversation[]
}

export function DashboardTable({ data }: DashboardTableProps) {
  const handleExport = async (ids: number[]) => {
    try {
      // Make API call to export the conversations
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationIds: ids })
      })
      
      if (!response.ok) {
        throw new Error('Export failed')
      }

      // Get the filename from the response headers
      const contentDisposition = response.headers.get('Content-Disposition')
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/)
      const filename = filenameMatch ? filenameMatch[1] : 'conversations-export.json'

      // Create a blob from the response and download it
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      // Show success message
      alert(`Successfully exported ${ids.length} conversations`)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

  return <DataTable data={data} onExportRequested={handleExport} />
} 
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Column,
} from "@tanstack/react-table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

import { Sheet, SheetDescription } from "@/components/ui/sheet"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Action, Conversation, Message } from "@/db/schema"
import { SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"

// Helper function to render sortable column headers
function SortableHeader({ 
  column, 
  children 
}: { 
  column: Column<Conversation, unknown>, 
  children: React.ReactNode 
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-auto p-0 font-semibold hover:bg-transparent"
    >
      {children}
      {column.getIsSorted() === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  )
}

// Example Tanstack ColumnDef for the Conversation schema
export const conversationColumns: ColumnDef<Conversation>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <SortableHeader column={column}>
        ID
      </SortableHeader>
    ),
    cell: ({ row }) => row.original.id,
    enableHiding: true,
    enableSorting: true,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <TableCellViewer item={row.original} />,
    enableSorting: true,
  },
  {
    accessorKey: "jobType",
    header: ({ column }) => (
      <SortableHeader column={column}>
        Job Type
      </SortableHeader>
    ),
    cell: ({ row }) => row.original.jobType,
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <SortableHeader column={column}>
        Status
      </SortableHeader>
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="px-1.5 text-muted-foreground">
        {row.original.status}
      </Badge>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "urgency",
    header: ({ column }) => (
      <SortableHeader column={column}>
        Urgency
      </SortableHeader>
    ),
    cell: ({ row }) => row.original.urgency,
    enableSorting: true,
  },
  {
    accessorKey: "operator_id",
    header: ({ column }) => (
      <SortableHeader column={column}>
        Operator
      </SortableHeader>
    ),
    cell: ({ row }) => row.original.operatorId,
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader column={column}>
        Timestamp
      </SortableHeader>
    ),
    cell: ({ row }) => row.original.createdAt.toLocaleString(),
    enableSorting: true,
  },
]

interface DataTableProps {
  data: Conversation[]
}

export function DataTable({
  data: initialData,
}: DataTableProps) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data: initialData,
    columns: conversationColumns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Conversations Requiring Attention</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">

        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  const conversation = row.original
                  const isHighUrgency = conversation.urgency === 10
                  
                  return (
                    <TableRow 
                      key={row.id}
                      className={isHighUrgency ? "bg-red-100 dark:bg-red-950/40" : ""}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={conversationColumns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card >
  )
}


function TableCellViewer({ item }: { item: Conversation }) {

  const [conversationData, setConversationData] = React.useState<Conversation & { messages: Message[], actions: Action[] } | null>(null)
  const [loading, setLoading] = React.useState(false)

  const fetchConversationData = async (id: number) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/conversations/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch conversation data')
      }
      const data = await response.json()
      setConversationData(data)
    } catch (error) {
      console.error('Error fetching conversation data:', error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (item.id) {
      fetchConversationData(item.id)
    }
  }, [item.id])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.phone ? `(${item.phone.toString().slice(0, 3)}) ${item.phone.toString().slice(3, 6)}-${item.phone.toString().slice(6)}` : item.phone}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="gap-1">
          <SheetTitle>{item.phone}</SheetTitle>
          {item.status == "blocked_needs_human" && <SheetDescription className="text-red-500">{`Blocked: ${item.reason}`}</SheetDescription>}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : conversationData ? (
            <div className="space-y-4">
              {conversationData.messages?.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.senderType === 'customer' ? 'justify-start' : 'justify-end'
                    }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${message.senderType === 'customer'
                      ? 'bg-muted text-foreground'
                      : 'bg-primary text-primary-foreground'
                      }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No conversation data available
            </div>
          )}

        </div>
        <div className="border-t border-border mt-4 pt-4">
          <h3 className="text-lg font-semibold mb-3">Actions Taken</h3>
          <div className="space-y-2">
            {conversationData?.actions?.map((action, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{action.type}</span>
                  <span className="text-xs text-muted-foreground">
                    Status: {action.result} • {new Date(action.createdAt).toLocaleString()}
                  </span>
                  {action.error && (
                    <span className="text-xs text-destructive">Error: {action.error}</span>
                  )}
                  {action.metadata && (
                    <span className="text-xs text-muted-foreground">
                      Metadata: {action.metadata}
                    </span>
                  )}
                </div>
              </div>
            )) || (
                <div className="text-sm text-muted-foreground">
                  No actions recorded for this conversation
                </div>
              )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

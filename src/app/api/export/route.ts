import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { conversations, actions, messages } from '@/db/schema'
import { inArray } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const { conversationIds } = await request.json()

    if (!conversationIds || !Array.isArray(conversationIds) || conversationIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid conversation IDs provided' },
        { status: 400 }
      )
    }

    // Fetch conversations with their associated data
    const conversationsData = await db
      .select()
      .from(conversations)
      .where(inArray(conversations.id, conversationIds))

    // Fetch actions for these conversations
    const actionsData = await db
      .select()
      .from(actions)
      .where(inArray(actions.conversationId, conversationIds))

    // Fetch messages for these conversations
    const messagesData = await db
      .select()
      .from(messages)
      .where(inArray(messages.conversationId, conversationIds))

    // Group actions and messages by conversation ID
    const actionsByConversation = actionsData.reduce((acc, action) => {
      if (!acc[action.conversationId]) {
        acc[action.conversationId] = []
      }
      acc[action.conversationId].push(action)
      return acc
    }, {} as Record<number, typeof actionsData>)

    const messagesByConversation = messagesData.reduce((acc, message) => {
      if (!acc[message.conversationId]) {
        acc[message.conversationId] = []
      }
      acc[message.conversationId].push(message)
      return acc
    }, {} as Record<number, typeof messagesData>)

    // Combine all data
    const exportData = conversationsData.map(conversation => ({
      conversation: {
        id: conversation.id,
        phone: conversation.phone,
        jobType: conversation.jobType,
        status: conversation.status,
        urgency: conversation.urgency,
        operatorId: conversation.operatorId,
        reason: conversation.reason,
        customerName: conversation.customerName,
        customerAddress: conversation.customerAddress,
        jobDescription: conversation.jobDescription,
        estimatedValue: conversation.estimatedValue,
        scheduledDate: conversation.scheduledDate,
        createdAt: conversation.createdAt,
        completedAt: conversation.completedAt,
      },
      actions: actionsByConversation[conversation.id] || [],
      messages: messagesByConversation[conversation.id] || [],
    }))

    // Create export metadata
    const exportMetadata = {
      exportedAt: new Date().toISOString(),
      totalConversations: exportData.length,
      totalActions: actionsData.length,
      totalMessages: messagesData.length,
      conversationIds: conversationIds,
    }

    const fullExport = {
      metadata: exportMetadata,
      data: exportData,
    }

    // Convert to JSON string
    const jsonString = JSON.stringify(fullExport, null, 2)
    
    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]
    const filename = `conversations-export-${timestamp}.json`

    // Return as downloadable file
    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export conversations' },
      { status: 500 }
    )
  }
} 
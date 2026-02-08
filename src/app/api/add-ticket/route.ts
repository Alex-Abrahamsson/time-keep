import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/firebase-admin';
import { AssignmentType } from '@/types/types';

/**
 * API Endpoint för att lägga till tickets från Jira Extension
 * POST /api/add-ticket
 *
 * Använder Firebase Admin SDK för att skriva till Firestore (bypass security rules)
 */
export async function POST(req: NextRequest) {
    try {
        console.log('Add-ticket API: Mottog request');

        // Kontrollera att Admin SDK är initierat
        if (!adminDb) {
            return NextResponse.json(
                { error: 'Firebase Admin SDK is not initialized' },
                { status: 500 },
            );
        }

        // Parse body
        const assignment: AssignmentType = await req.json();

        // Validera att vi har nödvändiga fält
        if (!assignment.UserId) {
            return NextResponse.json(
                { error: 'UserId är obligatoriskt' },
                { status: 400 },
            );
        }

        if (!assignment.Id) {
            return NextResponse.json(
                { error: 'Id är obligatoriskt' },
                { status: 400 },
            );
        }

        if (!assignment.TicketName) {
            return NextResponse.json(
                { error: 'TicketName är obligatoriskt' },
                { status: 400 },
            );
        }

        console.log('Add-ticket API: Sparar assignment', {
            userId: assignment.UserId,
            id: assignment.Id,
            ticketName: assignment.TicketName,
        });

        // Spara till Firestore med subcollection struktur (via Admin SDK)
        // Struktur: /userProfiles/{userId}/assignments/{assignmentId}
        const assignmentRef = adminDb
            .collection('userProfiles')
            .doc(assignment.UserId)
            .collection('assignments')
            .doc(assignment.Id.toString());

        await assignmentRef.set({
            Id: assignment.Id,
            UserId: assignment.UserId,
            Costumer: assignment.Costumer || 'Okänd kund',
            TicketName: assignment.TicketName,
            Status: assignment.Status || 'Stopped',
            Date: assignment.CreatedDate || new Date().toISOString(),
            Description: assignment.Description || '',
            Time: assignment.ActualTime || 0,
            Sessions: assignment.Sessions || [],
            Category: assignment.Category || 'Utveckling',
            Completed: assignment.Completed || false,
            // Extra metadata från Jira (optional)
            JiraKey:
                'JiraKey' in assignment
                    ? (assignment as AssignmentType & { JiraKey?: string })
                          .JiraKey
                    : undefined,
            JiraUrl:
                'JiraUrl' in assignment
                    ? (assignment as AssignmentType & { JiraUrl?: string })
                          .JiraUrl
                    : undefined,
        });

        console.log('Add-ticket API: Assignment sparad framgångsrikt');

        return NextResponse.json({
            success: true,
            id: assignment.Id,
            message: 'Ticket tillagd i TimeKeep',
        });
    } catch (error: unknown) {
        console.error('Add-ticket API: Fel uppstod', error);

        return NextResponse.json(
            {
                error: 'Kunde inte lägga till ticket',
                details: error instanceof Error ? error.message : 'Okänt fel',
            },
            { status: 500 },
        );
    }
}

// OPTIONS för CORS (om du behöver det senare)
export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        },
    );
}

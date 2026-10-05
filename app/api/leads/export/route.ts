import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import MarketingLead from '@/models/MarketingLead';

function escapeCsvCell(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET() {
  try {
    await connectToDatabase();
    const leads = await MarketingLead.find({}).sort({ createdAt: -1 }).lean();

    const headers = [
      'Lead ID',
      'Full Name',
      'WhatsApp Number',
      'Email Address',
      'District',
      'Preferred Medium',
      'Interested in Training',
      'Learning Mode',
      'Marketing Source',
      'Guide Name',
      'Downloaded',
      'Submitted At'
    ];

    const rows = leads.map((lead: any) => [
      escapeCsvCell(lead.id),
      escapeCsvCell(lead.fullName),
      escapeCsvCell(lead.phone),
      escapeCsvCell(lead.email || 'N/A'),
      escapeCsvCell(lead.district),
      escapeCsvCell(lead.medium),
      escapeCsvCell(lead.counsellingInterest),
      escapeCsvCell(lead.learningMode),
      escapeCsvCell(lead.source),
      escapeCsvCell(lead.guideName),
      escapeCsvCell(lead.downloaded ? 'Yes' : 'No'),
      escapeCsvCell(
        lead.submittedAt
          ? new Date(lead.submittedAt).toLocaleString('en-GB')
          : new Date(lead.createdAt).toLocaleString('en-GB')
      )
    ]);

    const csvContent = [headers.map(escapeCsvCell).join(','), ...rows.map((r: any) => r.join(','))].join('\r\n');

    const filename = `helping_hearts_leads_${new Date().toISOString().split('T')[0]}.csv`;

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (err: any) {
    console.error('Error generating CSV export:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to generate CSV export' },
      { status: 500 }
    );
  }
}

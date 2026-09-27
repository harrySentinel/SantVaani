import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Entry {
  date: string;
  count: number;
  notes?: string;
}

// entry.date is a plain "YYYY-MM-DD" string. `new Date(dateString)` parses that as UTC
// midnight, then .getMonth()/.getDate() read it back in local time — which silently
// shifts the date by a day for anyone not in UTC. Parse from local parts instead.
const parseLocalDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export async function downloadMonthlyNaamJapReport(entries: Entry[], language: string, userName?: string) {
  const HI = language === 'HI';
  const now = new Date();

  const monthEntries = entries
    .filter(e => {
      const d = parseLocalDate(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .sort((a, b) => parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime());

  const totalCount = monthEntries.reduce((sum, e) => sum + e.count, 0);
  const daysPracticed = monthEntries.length;
  const best = monthEntries.reduce<Entry | null>((max, e) => (!max || e.count > max.count ? e : max), null);
  const avgPerDay = daysPracticed ? Math.round(totalCount / daysPracticed) : 0;
  const monthLabel = now.toLocaleDateString(HI ? 'hi-IN' : 'en-US', { month: 'long', year: 'numeric' });

  const rows = monthEntries
    .map(
      e => `
      <tr>
        <td style="padding:9px 0;border-bottom:1px solid rgba(36,26,18,0.08);font-size:13px;">
          ${parseLocalDate(e.date).toLocaleDateString(HI ? 'hi-IN' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
        </td>
        <td style="padding:9px 0;border-bottom:1px solid rgba(36,26,18,0.08);font-size:13px;color:#7a6a5c;">
          ${e.notes ? e.notes.slice(0, 60) : ''}
        </td>
        <td style="padding:9px 0;border-bottom:1px solid rgba(36,26,18,0.08);font-size:14px;font-weight:600;text-align:right;color:#c2410c;">
          ${e.count.toLocaleString()}
        </td>
      </tr>`
    )
    .join('');

  const statCard = (value: string, label: string) => `
    <div style="flex:1;background:#fff;border:1px solid rgba(36,26,18,0.1);border-radius:16px;padding:16px;text-align:center;">
      <div style="font-family:var(--font-tiro),serif;font-size:24px;font-weight:400;color:#241a12;">${value}</div>
      <div style="font-size:11px;color:#7a6a5c;margin-top:4px;">${label}</div>
    </div>`;

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.fontFamily = 'var(--font-mukta), sans-serif';
  container.style.background = '#faf8f5';
  container.style.padding = '48px';
  container.style.color = '#241a12';

  container.innerHTML = `
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-family:var(--font-tiro),serif;font-size:32px;color:#c2410c;">ॐ</div>
      <div style="font-size:12px;letter-spacing:0.08em;color:#ea580c;margin-top:10px;font-weight:600;">SANTVAANI</div>
      <div style="font-family:var(--font-tiro),serif;font-size:28px;font-weight:400;margin-top:6px;">
        ${HI ? 'नाम जप — मासिक रिपोर्ट' : 'Naam Jap — Monthly Report'}
      </div>
      <div style="font-size:15px;color:#7a6a5c;margin-top:4px;">${monthLabel}${userName ? ` · ${userName}` : ''}</div>
    </div>
    <div style="display:flex;gap:14px;margin-bottom:36px;">
      ${statCard(totalCount.toLocaleString(), HI ? 'कुल गिनती' : 'Total count')}
      ${statCard(String(daysPracticed), HI ? 'दिन साधना की' : 'Days practiced')}
      ${statCard(String(avgPerDay), HI ? 'औसत/दिन' : 'Avg / day')}
      ${statCard(best ? best.count.toLocaleString() : '—', HI ? 'सर्वश्रेष्ठ दिन' : 'Best day')}
    </div>
    ${
      monthEntries.length
        ? `<table style="width:100%;border-collapse:collapse;">
            <thead><tr>
              <th style="text-align:left;font-size:11px;color:#7a6a5c;font-weight:500;padding-bottom:8px;">${HI ? 'तारीख' : 'Date'}</th>
              <th style="text-align:left;font-size:11px;color:#7a6a5c;font-weight:500;padding-bottom:8px;">${HI ? 'नोट्स' : 'Notes'}</th>
              <th style="text-align:right;font-size:11px;color:#7a6a5c;font-weight:500;padding-bottom:8px;">${HI ? 'गिनती' : 'Count'}</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>`
        : `<p style="text-align:center;color:#7a6a5c;font-size:14px;">${HI ? 'इस महीने अभी कोई प्रविष्टि नहीं है।' : 'No entries yet this month.'}</p>`
    }
    <div style="text-align:center;margin-top:40px;font-size:12px;color:#7a6a5c;">
      ${HI ? 'संतवाणी डिजिटल आश्रम से' : 'From Santvaani Digital Ashram'} · santvaani.com
    </div>
  `;

  document.body.appendChild(container);
  try {
    const canvas = await html2canvas(container, { scale: 2, backgroundColor: '#faf8f5', useCORS: true, logging: false });
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = 210;
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save(`santvaani-naam-jap-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}

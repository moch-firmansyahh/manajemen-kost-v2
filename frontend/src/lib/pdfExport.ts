import { Kamar, Penghuni, Pembayaran } from "@/types";
import { formatRupiah, formatDate } from "./utils";

// Timezone-safe local date parser
const parseAsLocalDate = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr || dateStr === "null" || dateStr === "undefined" || dateStr.trim() === "") return null;
  
  // If it is an ISO string with T (e.g. "2026-07-04T12:34:56.789Z" or "2026-07-04T00:00:00.000Z")
  if (dateStr.includes('T')) {
    const datePart = dateStr.split('T')[0];
    const parts = datePart.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m, d);
      }
    }
  }
  
  // If it is "YYYY-MM-DD"
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      return new Date(y, m, d);
    }
  }
  
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

export const exportKamarPenghuniToPDF = (
  dataKamar: Kamar[],
  dataPenghuni: Penghuni[],
  dataPembayaran: Pembayaran[],
  selectedBulan: string,
  selectedTahun: number
) => {
  // Sort kamar naturally by room number
  const sortedKamar = [...dataKamar].sort((a, b) => {
    return a.nomorKamar.localeCompare(b.nomorKamar, undefined, { numeric: true, sensitivity: 'base' });
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Gagal membuka jendela cetak. Pop-up blocker terdeteksi. Silakan nonaktifkan pop-up blocker Anda.");
    return;
  }

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const namaBulanList = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  let tableRows = '';
  const isFilterBulan = selectedBulan !== "semua";

  sortedKamar.forEach((kamar) => {
    let activePenghuni: Penghuni | undefined = undefined;

    if (isFilterBulan) {
      // Find occupant active during selected month & year
      const monthIndex = namaBulanList.indexOf(selectedBulan);
      const monthStart = new Date(selectedTahun, monthIndex, 1);
      const monthEnd = new Date(selectedTahun, monthIndex + 1, 0, 23, 59, 59);

      activePenghuni = dataPenghuni.find(p => {
        if (p.kamarId !== kamar.id) return false;
        const tglMasuk = parseAsLocalDate(p.tanggalMasuk);
        const tglKeluar = parseAsLocalDate(p.tanggalKeluar);
        
        if (!tglMasuk) return false;
        return tglMasuk <= monthEnd && (tglKeluar === null || tglKeluar >= monthStart);
      });
    } else {
      // Find current active occupant (no checkout date)
      activePenghuni = dataPenghuni.find(p => p.kamarId === kamar.id && p.tanggalKeluar === null);
    }

    // Dynamic monthly room status determination
    let statusLabel = '';
    let statusBadgeStyle = '';

    if (isFilterBulan) {
      if (activePenghuni) {
        statusLabel = 'Terisi';
        statusBadgeStyle = 'background-color: #e5e7eb; color: #1f2937;';
      } else {
        if (kamar.status === 'maintenance') {
          statusLabel = 'Maintenance';
          statusBadgeStyle = 'background-color: #ffffff; border: 1px solid #d1d5db; color: #6b7280;';
        } else {
          statusLabel = 'Tersedia';
          statusBadgeStyle = 'background-color: #f3f4f6; color: #1f2937;';
        }
      }
    } else {
      // Standard current room status
      if (kamar.status === 'tersedia') {
        statusLabel = 'Tersedia';
        statusBadgeStyle = 'background-color: #f3f4f6; color: #1f2937;';
      } else if (kamar.status === 'terisi') {
        statusLabel = 'Terisi';
        statusBadgeStyle = 'background-color: #e5e7eb; color: #1f2937;';
      } else {
        statusLabel = 'Maintenance';
        statusBadgeStyle = 'background-color: #ffffff; border: 1px solid #d1d5db; color: #6b7280;';
      }
    }

    // Payment status block (only visible in monthly report)
    let paymentCellHTML = '';
    if (isFilterBulan) {
      let paymentLabel = '-';
      let paymentBadgeStyle = '';

      if (activePenghuni) {
        const payment = dataPembayaran.find(
          pay => pay.penghuniId === activePenghuni!.id && 
                 pay.bulan === selectedBulan && 
                 pay.tahun === selectedTahun
        );

        if (payment) {
          if (payment.status === 'lunas') {
            paymentLabel = 'Lunas';
            paymentBadgeStyle = 'background-color: #f3f4f6; color: #111827; border: 1px solid #111827;';
          } else {
            paymentLabel = payment.status === 'terlambat' ? 'Terlambat' : 'Belum Bayar';
            paymentBadgeStyle = 'background-color: #111827; color: #ffffff;';
          }
        } else {
          paymentLabel = 'Belum Bayar';
          paymentBadgeStyle = 'background-color: #111827; color: #ffffff;';
        }
      }

      paymentCellHTML = `
        <td>
          ${activePenghuni ? `<span class="badge" style="${paymentBadgeStyle}">${paymentLabel}</span>` : '-'}
        </td>
      `;
    }

    tableRows += `
      <tr>
        <td style="font-weight: 700; text-align: center; color: #111827; font-size: 14px;">${kamar.nomorKamar}</td>
        <td>${kamar.tipe}</td>
        <td style="text-align: center;">${kamar.lantai}</td>
        <td>
          <span class="badge" style="${statusBadgeStyle}">
            ${statusLabel}
          </span>
        </td>
        <td style="font-weight: 600; color: #374151;">${formatRupiah(kamar.hargaPerBulan)}</td>
        <td style="font-weight: 600; color: ${activePenghuni ? '#111827' : '#9ca3af'};">
          ${activePenghuni ? activePenghuni.nama : 'Kosong'}
        </td>
        <td>${activePenghuni ? activePenghuni.noTelepon : '-'}</td>
        <td>${activePenghuni ? formatDate(activePenghuni.tanggalMasuk) : '-'}</td>
        ${paymentCellHTML}
      </tr>
    `;
  });

  const logoUrl = `${window.location.origin}/Logo-Kost.png`;
  const reportTitle = isFilterBulan 
    ? `Laporan Data Kamar & Penghuni - ${selectedBulan} ${selectedTahun}`
    : "Laporan Data Kamar & Penghuni Aktif";

  const tableHeaderHTML = `
    <tr>
      <th style="width: 10%; text-align: center;">No. Kamar</th>
      <th style="width: 10%;">Tipe</th>
      <th style="width: 8%; text-align: center;">Lantai</th>
      <th style="width: 12%;">Status</th>
      <th style="width: 14%;">Harga / Bulan</th>
      <th style="width: 16%;">Nama Penghuni</th>
      <th style="width: 12%;">No. Telepon</th>
      <th style="width: 10%;">Tgl Masuk</th>
      ${isFilterBulan ? `<th style="width: 12%;">Status Bayar</th>` : ''}
    </tr>
  `;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${reportTitle}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          color: #374151;
          margin: 0;
          padding: 40px;
          background-color: #ffffff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .header-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 20px;
          gap: 20px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .logo-img {
          height: 90px;
          width: auto;
          object-fit: contain;
          display: block;
        }

        .kost-details {
          display: flex;
          flex-direction: column;
        }

        .kost-details h1 {
          margin: 0;
          font-size: 26px;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }

        .kost-details .address {
          margin: 6px 0 0 0;
          font-size: 13px;
          color: #6b7280;
          line-height: 1.4;
          max-width: 520px;
        }

        .meta-info {
          text-align: right;
          font-size: 12px;
          color: #6b7280;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .meta-info .date-label {
          text-transform: uppercase;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #9ca3af;
        }

        .meta-info .date-val {
          font-weight: 600;
          color: #111827;
          margin-top: 2px;
          font-size: 13px;
        }

        .divider-bar {
          height: 3px;
          background-color: #111827;
          width: 100%;
          margin-bottom: 24px;
          border-radius: 2px;
        }

        .report-header {
          margin-bottom: 24px;
        }

        .report-title {
          margin: 0;
          font-size: 15px;
          font-weight: 700;
          color: #111827;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border-left: 4px solid #111827;
          padding-left: 10px;
          line-height: 1;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        th {
          background-color: #f9fafb;
          color: #4b5563;
          font-weight: 700;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 12px 14px;
          border-top: 1px solid #e5e7eb;
          border-bottom: 2px solid #e5e7eb;
          text-align: left;
        }

        td {
          padding: 12px 14px;
          font-size: 13px;
          border-bottom: 1px solid #f3f4f6;
          color: #4b5563;
          vertical-align: middle;
        }

        tr:nth-child(even) {
          background-color: #fafafa;
        }

        .badge {
          display: inline-block;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 6px;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        @media print {
          body {
            padding: 0;
          }
          tr {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header-wrapper">
        <div class="logo-section">
          <img src="${logoUrl}" alt="Logo Kost" class="logo-img" onerror="this.style.display='none';" />
          <div class="kost-details">
            <h1>KONTRAKAN PA IMAN</h1>
            <p class="address">
              Jl. Kenanga No.5, Tanjungsari, Kec. Tanjungsari, Kabupaten Sumedang, Jawa Barat 45362
            </p>
          </div>
        </div>
        <div class="meta-info">
          <span class="date-label">Tanggal Cetak</span>
          <span class="date-val">${currentDate}</span>
        </div>
      </div>

      <div class="divider-bar"></div>

      <div class="report-header">
        <h2 class="report-title">${reportTitle}</h2>
      </div>

      <table>
        <thead>
          ${tableHeaderHTML}
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

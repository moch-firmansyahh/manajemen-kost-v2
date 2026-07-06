import { Kamar, Penghuni } from "@/types";
import { formatRupiah, formatDate } from "./utils";

export const exportKamarPenghuniToPDF = (dataKamar: Kamar[], dataPenghuni: Penghuni[]) => {
  // Sort kamar naturally by room number
  const sortedKamar = [...dataKamar].sort((a, b) => {
    return a.nomorKamar.localeCompare(b.nomorKamar, undefined, { numeric: true, sensitivity: 'base' });
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Gagal membuka jendela cetak. Pastikan pop-up blocker Anda dinonaktifkan.");
    return;
  }

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let tableRows = '';
  sortedKamar.forEach((kamar) => {
    // Find active occupant
    const activePenghuni = dataPenghuni.find(p => p.kamarId === kamar.id && p.tanggalKeluar === null);

    const statusBadgeColor = 
      kamar.status === 'tersedia' ? '#def7ec' : 
      kamar.status === 'terisi' ? '#e1effe' : '#fde8e8';
    
    const statusTextColor = 
      kamar.status === 'tersedia' ? '#03543f' : 
      kamar.status === 'terisi' ? '#1e429f' : '#9b1c1c';

    const statusLabel = 
      kamar.status === 'tersedia' ? 'Tersedia' : 
      kamar.status === 'terisi' ? 'Terisi' : 'Maintenance';

    tableRows += `
      <tr>
        <td style="font-weight: 700; text-align: center; color: #111827; font-size: 14px;">${kamar.nomorKamar}</td>
        <td>${kamar.tipe}</td>
        <td style="text-align: center;">${kamar.lantai}</td>
        <td>
          <span class="badge" style="background-color: ${statusBadgeColor}; color: ${statusTextColor};">
            ${statusLabel}
          </span>
        </td>
        <td style="font-weight: 600; color: #374151;">${formatRupiah(kamar.hargaPerBulan)}</td>
        <td style="font-weight: 600; color: ${activePenghuni ? '#111827' : '#9ca3af'};">
          ${activePenghuni ? activePenghuni.nama : 'Kosong'}
        </td>
        <td>${activePenghuni ? activePenghuni.noTelepon : '-'}</td>
        <td>${activePenghuni ? formatDate(activePenghuni.tanggalMasuk) : '-'}</td>
      </tr>
    `;
  });

  const logoUrl = `${window.location.origin}/Logo-Kost.png`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Laporan Data Kamar dan Penghuni - Kontrakan Pa Iman</title>
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
          background-color: #567134;
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
          color: #374151;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border-left: 4px solid #567134;
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
        <h2 class="report-title">Laporan Data Kamar & Penghuni Aktif</h2>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 10%; text-align: center;">No. Kamar</th>
            <th style="width: 12%;">Tipe</th>
            <th style="width: 8%; text-align: center;">Lantai</th>
            <th style="width: 12%;">Status</th>
            <th style="width: 16%;">Harga / Bulan</th>
            <th style="width: 18%;">Nama Penghuni</th>
            <th style="width: 12%;">No. Telepon</th>
            <th style="width: 12%;">Tgl Masuk</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <script>
        window.onload = function() {
          // Sedikit jeda untuk memastikan logo gambar dimuat penuh sebelum memicu print
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

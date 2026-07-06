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
        <td style="font-weight: 600; text-align: center;">${kamar.nomorKamar}</td>
        <td>${kamar.tipe}</td>
        <td style="text-align: center;">${kamar.lantai}</td>
        <td>
          <span class="badge" style="background-color: ${statusBadgeColor}; color: ${statusTextColor};">
            ${statusLabel}
          </span>
        </td>
        <td style="font-weight: 500;">${formatRupiah(kamar.hargaPerBulan)}</td>
        <td style="font-weight: 500; color: ${activePenghuni ? '#111827' : '#9ca3af'};">
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
      <title>Laporan Data Kamar dan Penghuni</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          color: #1f2937;
          margin: 0;
          padding: 40px;
          background-color: #ffffff;
        }

        .header-container {
          display: flex;
          align-items: center;
          border-bottom: 3px double #e5e7eb;
          padding-bottom: 24px;
          margin-bottom: 30px;
          gap: 24px;
        }

        .logo-img {
          height: 80px;
          width: 80px;
          object-fit: cover;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          padding: 4px;
          background-color: #f9fafb;
        }

        .kost-details {
          flex-grow: 1;
        }

        .kost-details h1 {
          margin: 0;
          font-size: 22px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.02em;
        }

        .kost-details .address {
          margin: 6px 0 0 0;
          font-size: 13px;
          color: #4b5563;
          line-height: 1.4;
          max-width: 600px;
        }

        .kost-details .report-sub {
          margin: 8px 0 0 0;
          font-size: 14px;
          font-weight: 600;
          color: #567134;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .meta-info {
          text-align: right;
          font-size: 12px;
          color: #6b7280;
          white-space: nowrap;
        }

        .meta-info strong {
          color: #374151;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        th {
          background-color: #f9fafb;
          color: #374151;
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 12px 16px;
          border-top: 1px solid #e5e7eb;
          border-bottom: 2px solid #e5e7eb;
          text-align: left;
        }

        td {
          padding: 14px 16px;
          font-size: 13px;
          border-bottom: 1px solid #f3f4f6;
          color: #4b5563;
        }

        tr:nth-child(even) {
          background-color: #fafafa;
        }

        .badge {
          display: inline-block;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 600;
          border-radius: 9999px;
          text-align: center;
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
      <div class="header-container">
        <img src="${logoUrl}" alt="Logo Kost" class="logo-img" onerror="this.style.display='none';" />
        <div class="kost-details">
          <h1>KOST KENANGA</h1>
          <p class="address">
            <strong>Alamat:</strong> Jl. Kenanga No.5, Tanjungsari, Kec. Tanjungsari, Kabupaten Sumedang, Jawa Barat 45362
          </p>
          <p class="report-sub">Laporan Data Kamar dan Penghuni</p>
        </div>
        <div class="meta-info">
          <div>Tanggal Cetak:</div>
          <div style="font-weight: 600; color: #111827; margin-top: 4px;">${currentDate}</div>
        </div>
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

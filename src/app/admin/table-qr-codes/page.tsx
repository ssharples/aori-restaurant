'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, QrCode, Table } from 'lucide-react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

interface TableQRData {
  tableNumber: number;
  url: string;
  qrCodeDataUrl: string;
}

export default function TableQRCodesPage() {
  const [qrCodes, setQrCodes] = useState<TableQRData[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const printAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generateQRCodes();
  }, []);

  const generateQRCodes = async () => {
    setIsGenerating(true);
    const baseUrl = window.location.origin;
    const tableData: TableQRData[] = [];

    for (let tableNumber = 1; tableNumber <= 6; tableNumber++) {
      const tableUrl = `${baseUrl}/table/${tableNumber}`;
      
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(tableUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#2C3E2C', // Dark green
            light: '#FFFFFF', // White
          },
          errorCorrectionLevel: 'H'
        });

        tableData.push({
          tableNumber,
          url: tableUrl,
          qrCodeDataUrl
        });
      } catch (error) {
        console.error(`Failed to generate QR code for table ${tableNumber}:`, error);
      }
    }

    setQrCodes(tableData);
    setIsGenerating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadQRCode = async (tableNumber: number, dataUrl: string) => {
    const link = document.createElement('a');
    link.download = `aori-table-${tableNumber}-qr-code.png`;
    link.href = dataUrl;
    link.click();
  };

  const downloadAllQRCodes = () => {
    qrCodes.forEach((qr) => {
      downloadQRCode(qr.tableNumber, qr.qrCodeDataUrl);
    });
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-aori-cream flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-aori-green border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-aori-dark">Generating QR codes for 6 tables...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Screen-only controls */}
      <div className="print:hidden">
        <div className="min-h-screen bg-aori-cream">
          {/* Header */}
          <header className="bg-aori-green text-aori-white shadow-lg">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Logo variant="dark-bg" width={100} height={50} />
                  <div>
                    <h1 className="text-2xl font-bold">Table QR Code Generator</h1>
                    <p className="text-aori-cream/80">Print and place QR codes on restaurant tables</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={downloadAllQRCodes}
                    variant="outline"
                    className="bg-aori-white text-aori-green border-aori-white hover:bg-aori-cream"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                  <Button 
                    onClick={handlePrint}
                    className="bg-aori-white text-aori-green hover:bg-aori-cream"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print All
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* QR Code Grid */}
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {qrCodes.map((qr) => (
                <motion.div
                  key={qr.tableNumber}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: qr.tableNumber * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                >
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Table className="w-5 h-5 text-aori-green" />
                      <h3 className="text-xl font-bold text-aori-dark">Table {qr.tableNumber}</h3>
                    </div>
                    <p className="text-sm text-gray-600">Scan to order from your phone</p>
                  </div>

                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                      <img 
                        src={qr.qrCodeDataUrl} 
                        alt={`QR Code for Table ${qr.tableNumber}`}
                        className="w-48 h-48"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 break-all">{qr.url}</p>
                    </div>
                    <Button
                      onClick={() => downloadQRCode(qr.tableNumber, qr.qrCodeDataUrl)}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PNG
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Print-only layout */}
      <div className="hidden print:block" ref={printAreaRef}>
        <div className="grid grid-cols-2 gap-8 p-8">
          {qrCodes.map((qr) => (
            <div key={qr.tableNumber} className="break-inside-avoid page-break-inside-avoid">
              <div className="border-2 border-dashed border-gray-300 p-8 text-center bg-white rounded-lg">
                {/* Header */}
                <div className="mb-6">
                  <Logo variant="light-bg" width={120} height={60} className="mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-aori-dark mb-2">Table {qr.tableNumber}</h2>
                  <p className="text-lg text-gray-600">Scan to Order</p>
                </div>

                {/* QR Code */}
                <div className="mb-6">
                  <img 
                    src={qr.qrCodeDataUrl} 
                    alt={`QR Code for Table ${qr.tableNumber}`}
                    className="w-64 h-64 mx-auto border border-gray-200 rounded-lg"
                  />
                </div>

                {/* Instructions */}
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="font-semibold">How to order:</p>
                  <p>1. Scan this QR code with your phone camera</p>
                  <p>2. Browse our authentic Greek menu</p>
                  <p>3. Add items to your cart and checkout</p>
                  <p>4. We'll serve your order to this table</p>
                  <p className="text-xs text-gray-500 mt-4">Pay when your food arrives</p>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-aori-dark">Aori Restaurant</p>
                  <p className="text-xs text-gray-600">78 Old Mill St, Manchester M4 6LW</p>
                  <p className="text-xs text-gray-500 mt-1">Please inform staff of any allergies</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          
          .page-break-inside-avoid {
            page-break-inside: avoid;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </>
  );
}
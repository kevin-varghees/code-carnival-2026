import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function TicketQRCode({ qrToken, eventName, attendeeName }) {
  const qrRef = useRef();

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `${eventName}-ticket-${attendeeName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md max-w-sm mx-auto">
      <h3 className="text-lg font-bold text-gray-800 mb-2">{eventName}</h3>
      <p className="text-sm text-gray-500 mb-4">Attendee: {attendeeName}</p>

      <div ref={qrRef} className="p-4 bg-gray-50 border rounded-lg">
        <QRCodeCanvas
          value={qrToken}
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>

      <button
        onClick={downloadQRCode}
        className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 shadow"
      >
        Download QR Code
      </button>
    </div>
  );
}

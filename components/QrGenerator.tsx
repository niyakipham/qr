
import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { ColorPicker } from './ColorPicker';
import { TextInput } from './TextInput';
import { UploadIcon } from './icons';

export const QrGenerator: React.FC = () => {
  const [url, setUrl] = useState<string>('https://google.com');
  const [title, setTitle] = useState<string>('My QR Code');
  const [description, setDescription] = useState<string>('Scan this code to visit the link!');
  const [qrColor, setQrColor] = useState<string>('#86A8E7');
  const [logo, setLogo] = useState<string | null>(null);
  
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<QRCodeStyling | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (qrRef.current) {
      qrCodeInstance.current = new QRCodeStyling({
        width: 300,
        height: 300,
        type: 'svg',
        data: url,
        image: logo || undefined,
        dotsOptions: {
          color: qrColor,
          type: 'rounded',
        },
        cornersSquareOptions: {
          color: qrColor,
          type: 'extra-rounded',
        },
        backgroundOptions: {
          color: 'transparent',
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 8,
          imageSize: 0.4,
        },
      });
      qrRef.current.innerHTML = '';
      qrCodeInstance.current.append(qrRef.current);
    }
  }, []);

  useEffect(() => {
    if (qrCodeInstance.current) {
      qrCodeInstance.current.update({
        data: url,
        dotsOptions: { color: qrColor },
        cornersSquareOptions: { color: qrColor },
        image: logo || undefined,
      });
    }
  }, [url, qrColor, logo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (qrCodeInstance.current) {
      qrCodeInstance.current.download({ name: 'qrcode', extension: 'png' });
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-6 md:p-10 text-gray-800">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Left Side - Controls */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">Generate your QR Code</h1>
          <p className="text-gray-600">Enter your link, add some flair with colors and a logo, and download your custom QR code in seconds.</p>
          
          <TextInput id="url" label="Your URL" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
          <TextInput id="title" label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., My Website" />
          <TextInput id="description" label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short description" isTextarea={true} />
          
          <ColorPicker selectedColor={qrColor} onColorChange={setQrColor} />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Logo</label>
            <div className="mt-1 flex items-center space-x-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group relative w-full flex justify-center items-center px-4 py-3 border border-dashed border-gray-400 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-500 transition-all duration-300"
              >
                <UploadIcon className="w-6 h-6 mr-2 text-gray-500 group-hover:text-gray-700" color={qrColor} />
                <span>Click to upload logo</span>
              </button>
              {logo && (
                <button
                  onClick={handleRemoveLogo}
                  className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/svg+xml"
              onChange={handleFileChange}
            />
          </div>

        </div>
        
        {/* Right Side - QR Code Preview */}
        <div className="flex flex-col items-center justify-center bg-white/50 rounded-2xl p-6 shadow-inner border border-white/50 space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 text-center">{title}</h3>
            <p className="text-gray-600 text-center text-sm max-w-xs">{description}</p>
            <div ref={qrRef} className="p-4 bg-white rounded-xl shadow-md" />
            <button
                onClick={handleDownload}
                className="w-full mt-4 px-6 py-4 rounded-xl text-white font-semibold shadow-lg transition-transform transform hover:scale-105"
                style={{ backgroundColor: qrColor }}
            >
                Download PNG
            </button>
        </div>
      </div>
    </div>
  );
};

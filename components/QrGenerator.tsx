
import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { ColorPicker } from './ColorPicker';
import { TextInput } from './TextInput';
import { UploadIcon, BankIcon, LinkIcon } from './icons';

const BANKS = [
    { bin: '970415', name: 'Ngân hàng TMCP Công thương Việt Nam', shortName: 'VietinBank' },
    { bin: '970418', name: 'Ngân hàng TMCP Ngoại thương Việt Nam', shortName: 'Vietcombank' },
    { bin: '970405', name: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam', shortName: 'Agribank' },
    { bin: '970436', name: 'Ngân hàng TMCP Kỹ thương Việt Nam', shortName: 'Techcombank' },
    { bin: '970422', name: 'Ngân hàng TMCP Quân đội', shortName: 'MB Bank' },
    { bin: '970407', name: 'Ngân hàng TMCP Á Châu', shortName: 'ACB' },
    { bin: '970403', name: 'Ngân hàng TMCP Sài Gòn Thương Tín', shortName: 'Sacombank' },
    { bin: '970423', name: 'Ngân hàng TMCP Tiên Phong', shortName: 'TPBank' },
    { bin: '970448', name: 'Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh', shortName: 'HDBank' },
    { bin: '970419', name: 'Ngân hàng TMCP Quốc tế Việt Nam', shortName: 'VIB' },
    { bin: '970409', name: 'Ngân hàng TMCP Bưu điện Liên Việt', shortName: 'LienVietPostBank' },
    { bin: '970432', name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng', shortName: 'VPBank' },
    { bin: '970454', name: 'Ngân hàng TMCP Việt Á', shortName: 'VietABank' },
];

function crc16ccitt(data: string): string {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
        crc ^= data.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
        }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

function buildTLV(id: string, value: string): string {
    if (value === null || value === undefined || value === '') return '';
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
}

function generateVietQRData(
    bankBin: string, 
    accountNumber: string, 
    amount: string, 
    memo: string
): string {
    if (!bankBin || !accountNumber) return '';

    const consumerInfo = 
        buildTLV('00', 'A000000727') + 
        buildTLV('01', buildTLV('00', bankBin) + buildTLV('01', accountNumber));
  
    let payload = 
        '000201' +
        (amount ? '010212' : '010211') +
        buildTLV('38', consumerInfo) + 
        '5303704';

    if (amount) {
        payload += buildTLV('54', amount.replace(/,/g, ''));
    }

    payload += '5802VN';

    if (memo) {
        payload += buildTLV('62', buildTLV('08', memo));
    }
    
    payload += '6304';
    
    const crc = crc16ccitt(payload);
    return payload + crc;
}


export const QrGenerator: React.FC = () => {
  // Common State
  const [qrType, setQrType] = useState<'url' | 'bank'>('url');
  const [qrColor, setQrColor] = useState<string>('#86A8E7');
  const [logo, setLogo] = useState<string | null>(null);

  // URL State
  const [url, setUrl] = useState<string>('https://google.com');
  const [title, setTitle] = useState<string>('My QR Code');
  const [description, setDescription] = useState<string>('Scan this code to visit the link!');

  // Bank State
  const [bankBin, setBankBin] = useState<string>(BANKS[0].bin);
  const [accountNumber, setAccountNumber] = useState<string>('123456789');
  const [accountName, setAccountName] = useState<string>('NGUYEN VAN A');
  const [amount, setAmount] = useState<string>('');
  const [memo, setMemo] = useState<string>('Payment');
  
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<QRCodeStyling | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedBank = BANKS.find(b => b.bin === bankBin);
  const qrData = qrType === 'url' ? url : generateVietQRData(bankBin, accountNumber, amount, memo);

  useEffect(() => {
    if (qrRef.current) {
      qrCodeInstance.current = new QRCodeStyling({
        width: 300,
        height: 300,
        type: 'svg',
        data: qrData,
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
        data: qrData,
        dotsOptions: { color: qrColor },
        cornersSquareOptions: { color: qrColor },
        image: logo || undefined,
      });
    }
  }, [qrData, qrColor, logo]);

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
  
  const TabButton: React.FC<{
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }> = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
        active
          ? 'bg-white/70 shadow-md'
          : 'bg-transparent text-gray-600 hover:bg-white/40'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full max-w-5xl bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-6 md:p-10 text-gray-800">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Left Side - Controls */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">Generate your QR Code</h1>
          <p className="text-gray-600">Create a QR code for a website link or a bank transfer. Customize it with colors and your logo.</p>
          
          <div className="flex bg-gray-500/10 p-1 rounded-xl space-x-1">
            <TabButton active={qrType === 'url'} onClick={() => setQrType('url')}>
              <LinkIcon className="w-5 h-5 mr-2" color={qrColor} /> URL Link
            </TabButton>
            <TabButton active={qrType === 'bank'} onClick={() => setQrType('bank')}>
              <BankIcon className="w-5 h-5 mr-2" color={qrColor} /> Bank Transfer
            </TabButton>
          </div>
          
          {qrType === 'url' ? (
            <div className="flex flex-col space-y-6 animate-fade-in">
              <TextInput id="url" label="Your URL" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
              <TextInput id="title" label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., My Website" />
              <TextInput id="description" label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short description" isTextarea={true} />
            </div>
          ) : (
            <div className="flex flex-col space-y-4 animate-fade-in">
                <div>
                  <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
                  <select id="bank" value={bankBin} onChange={e => setBankBin(e.target.value)} className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition duration-300 shadow-sm" style={{ '--tw-ring-color': qrColor } as React.CSSProperties}>
                    {BANKS.map(bank => <option key={bank.bin} value={bank.bin}>{bank.shortName} - {bank.name}</option>)}
                  </select>
                </div>
                <TextInput id="accountNumber" label="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="e.g., 123456789" />
                <TextInput id="accountName" label="Account Holder Name" value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="e.g., NGUYEN VAN A" />
                <TextInput id="amount" label="Amount (Optional)" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} placeholder="e.g., 50000" />
                <TextInput id="memo" label="Memo (Optional)" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="e.g., Payment for order" />
            </div>
          )}
          
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
            {qrType === 'url' ? (
              <>
                <h3 className="text-2xl font-bold text-gray-900 text-center">{title}</h3>
                <p className="text-gray-600 text-center text-sm max-w-xs">{description}</p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-900 text-center uppercase">{accountName}</h3>
                <p className="text-gray-600 text-center text-sm max-w-xs">
                  {selectedBank?.shortName} - {accountNumber}
                </p>
                {amount && <p className="text-gray-800 text-lg font-semibold">Amount: {Number(amount).toLocaleString('vi-VN')} VNĐ</p>}
              </>
            )}
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

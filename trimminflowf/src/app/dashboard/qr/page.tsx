'use client';

import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { QrCode, Copy, ExternalLink, Check, Download, Share2, Printer } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function QRPage() {
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);
    const [shopName, setShopName] = useState('');

    useEffect(() => {
        // Fetch barbershop name from API if available
        if (user?.barbershopId) {
            // For now, we'll use a placeholder - you can fetch from API
            setShopName('My Barbershop');
        }
    }, [user]);

    if (!user?.barbershopId) {
        return (
            <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
                <DashboardSidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                </div>
            </div>
        );
    }

    const bookingUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/book/${user.barbershopId}`
        : `http://localhost:3000/book/${user.barbershopId}`;

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(bookingUrl)}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(bookingUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadQR = () => {
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = `barbershop-qr-${user.barbershopId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Book an Appointment',
                    text: 'Book your appointment with us!',
                    url: bookingUrl,
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            handleCopy();
        }
    };

    return (
        <>
            <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-qr, #printable-qr * {
            visibility: visible;
          }
          #printable-qr {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: black !important;
          }
        }
      `}</style>

            {/* Printable Version (Hidden on screen) */}
            <div id="printable-qr" className="hidden print:block print:w-full print:h-screen print:flex print:items-center print:justify-center" style={{ background: 'black', pageBreakAfter: 'always' }}>
                <div className="text-center" style={{ padding: '60px' }}>
                    {/* Shop Name */}
                    <div style={{ marginBottom: '40px' }}>
                        <h1 style={{
                            fontSize: '48px',
                            fontWeight: 'bold',
                            background: 'linear-gradient(to right, #FBBF24, #F59E0B)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '16px'
                        }}>
                            {shopName || 'TRIMMINFLOW'}
                        </h1>
                        <p style={{ color: '#D1D5DB', fontSize: '24px', fontWeight: '600' }}>
                            Book Your Appointment
                        </p>
                    </div>

                    {/* QR Code */}
                    <div style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '24px',
                        display: 'inline-block',
                        marginBottom: '40px'
                    }}>
                        <img
                            src={qrCodeUrl}
                            alt="Booking QR Code"
                            style={{ width: '400px', height: '400px' }}
                        />
                    </div>

                    {/* Instructions */}
                    <div style={{ marginTop: '40px' }}>
                        <p style={{ color: '#9CA3AF', fontSize: '20px', marginBottom: '12px' }}>
                            Scan the QR code to book online
                        </p>
                        <p style={{
                            color: '#6B7280',
                            fontSize: '16px',
                            fontFamily: 'monospace',
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            display: 'inline-block'
                        }}>
                            {bookingUrl}
                        </p>
                    </div>

                    {/* Decorative Elements */}
                    <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '2px solid rgba(251, 191, 36, 0.2)' }}>
                        <p style={{ color: '#6B7280', fontSize: '14px' }}>
                            Powered by TrimminFlow
                        </p>
                    </div>
                </div>
            </div>

            {/* Screen Version */}
            <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white print:hidden">
                <DashboardSidebar />

                <main className="flex-1 p-8 overflow-y-auto">
                    {/* Header */}
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-yellow-200 bg-clip-text text-transparent">
                            QR Code & Booking Link
                        </h1>
                        <p className="text-gray-400 mt-1">Share your booking page with customers</p>
                    </header>

                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
                        {/* QR Code Card */}
                        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-yellow-400/20 flex items-center justify-center">
                                    <QrCode className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">QR Code</h2>
                                    <p className="text-gray-400 text-sm">Scan to book</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl mb-6 flex items-center justify-center">
                                <img
                                    src={qrCodeUrl}
                                    alt="Booking QR Code"
                                    className="w-full max-w-[300px] h-auto"
                                />
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handlePrint}
                                    className="w-full px-4 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-yellow-400/20"
                                >
                                    <Printer className="w-5 h-5" />
                                    Print Professional Poster
                                </button>

                                <button
                                    onClick={handleDownloadQR}
                                    className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all border border-white/10"
                                >
                                    <Download className="w-5 h-5" />
                                    Download QR Code
                                </button>
                            </div>

                            <div className="mt-6 p-4 bg-blue-400/10 border border-blue-400/20 rounded-xl">
                                <p className="text-blue-400 text-xs">
                                    <strong className="block mb-1">💡 Tip:</strong>
                                    Click "Print Professional Poster" to create a beautiful, print-ready design with your shop name!
                                </p>
                            </div>
                        </div>

                        {/* Booking Link Card */}
                        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-yellow-400/20 flex items-center justify-center">
                                    <ExternalLink className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Booking Link</h2>
                                    <p className="text-gray-400 text-sm">Share anywhere</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="text-sm text-gray-400 mb-2 block">Your Public Booking URL</label>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <p className="text-gray-300 text-sm break-all font-mono">{bookingUrl}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <button
                                    onClick={handleCopy}
                                    className="w-full px-4 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-yellow-400/20"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Copied to Clipboard!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-5 h-5" />
                                            Copy Link
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleShare}
                                    className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all border border-white/10"
                                >
                                    <Share2 className="w-5 h-5" />
                                    Share Link
                                </button>

                                <a
                                    href={bookingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all border border-white/10"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                    Preview Booking Page
                                </a>
                            </div>

                            <div className="space-y-3">
                                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                    <p className="text-gray-400 text-xs mb-1">Barbershop ID</p>
                                    <code className="text-white text-sm font-mono block break-all">{user.barbershopId}</code>
                                </div>

                                <div className="p-4 bg-green-400/10 border border-green-400/20 rounded-xl">
                                    <p className="text-green-400 text-xs">
                                        <strong className="block mb-1">✅ How to use:</strong>
                                        Share this link on social media, your website, or send it directly to customers via WhatsApp, email, or SMS!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Usage Guide */}
                    <div className="max-w-6xl mx-auto mt-8 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                        <h3 className="text-lg font-bold text-white mb-4">📱 Where to Share Your Booking Link</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="text-2xl mb-2">🌐</div>
                                <h4 className="font-semibold text-white mb-1">Website</h4>
                                <p className="text-gray-400 text-sm">Add a "Book Now" button linking to this URL</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="text-2xl mb-2">📱</div>
                                <h4 className="font-semibold text-white mb-1">Social Media</h4>
                                <p className="text-gray-400 text-sm">Share on Instagram, Facebook, or Google Business</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="text-2xl mb-2">💬</div>
                                <h4 className="font-semibold text-white mb-1">Direct Messaging</h4>
                                <p className="text-gray-400 text-sm">Send via WhatsApp, SMS, or email to customers</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

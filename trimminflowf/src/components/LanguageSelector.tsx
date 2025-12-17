'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import ReactCountryFlag from 'react-country-flag';

export default function LanguageSelector() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
            <button
                onClick={() => setLanguage('en')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${language === 'en'
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                title="English"
            >
                <ReactCountryFlag
                    countryCode="GB"
                    svg
                    style={{
                        width: '1.5em',
                        height: '1.5em',
                    }}
                />
                <span className="text-sm font-medium hidden sm:inline">EN</span>
            </button>

            <button
                onClick={() => setLanguage('pt')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${language === 'pt'
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                title="Português"
            >
                <ReactCountryFlag
                    countryCode="PT"
                    svg
                    style={{
                        width: '1.5em',
                        height: '1.5em',
                    }}
                />
                <span className="text-sm font-medium hidden sm:inline">PT</span>
            </button>
        </div>
    );
}

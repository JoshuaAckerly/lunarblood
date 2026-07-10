import React from 'react';

interface CookiesProps {
    content: string;
}

const Cookies: React.FC<CookiesProps> = ({ content }) => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <section className="border-b border-gray-800 bg-[#1a0a0a] py-12 text-center">
                <h1 className="text-4xl font-bold text-[#dc2626]">Cookie Policy</h1>
            </section>

            <section className="px-6 py-12">
                <div className="legal-prose mx-auto max-w-3xl" dangerouslySetInnerHTML={{ __html: content }} />
            </section>
        </div>
    );
};

export default Cookies;

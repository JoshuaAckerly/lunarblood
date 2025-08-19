import React from 'react';

const Footer: React.FC = () => (
    <footer className='text-center p-4 text-white'>
        <p>&copy; {new Date().getFullYear()} LunarBlood. All rights reserved.</p>
    </footer>
);

export default Footer;
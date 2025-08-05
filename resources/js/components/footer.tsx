import React from 'react';

const Footer: React.FC = () => (
    <footer style={{ padding: '1rem', textAlign: 'center', background: '#222', color: '#fff' }}>
        <p>&copy; {new Date().getFullYear()} LunarBlood. All rights reserved.</p>
    </footer>
);

export default Footer;
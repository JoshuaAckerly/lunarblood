import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

const Main: React.FC<React.PropsWithChildren> = ({ children }) => (
    <div>
        <Header />
        <main style={{ padding: '1rem' }}>
            {children}
        </main>
        <Footer />
    </div>
);

export default Main;

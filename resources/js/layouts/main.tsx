import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

const Main: React.FC<React.PropsWithChildren> = ({ children }) => (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
        <Header />
        <main className="flex-grow p-4">
            {children}
        </main>
        <Footer />
    </div>
);

export default Main;

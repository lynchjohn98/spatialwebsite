"use client";

export default function MainContent({ pageTitle, pageContent }) {
  return (
    <main
      className={`transition-all duration-300 p-6 overflow-y-auto h-screen `}
    >
      <h1 className="text-2xl font-bold mb-4">{pageTitle}</h1>
      <p>
         {pageContent}
      </p>
    </main>
  );
}

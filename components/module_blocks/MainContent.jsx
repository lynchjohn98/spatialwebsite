"use client";

export default function MainContent({ pageTitle, pageContent }) {
  return (
    <main
      className="transition-all duration-300 p-6 overflow-y-auto h-screen flex-1"
    >
      <h1 className="text-2xl font-bold mb-4">{pageTitle}</h1>
      
      {/* If pageContent is a string, render it as a paragraph */}
      {typeof pageContent === 'string' ? (
        <p>{pageContent}</p>
      ) : (
        /* Otherwise, render it as a React element */
        pageContent
      )}
    </main>
  );
}

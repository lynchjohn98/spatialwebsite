// components/module/SuccessCriteria.jsx
export default function SuccessCriteria({ iHavePoints, iCanPoints }) {
    return (
      <section className="bg-gray-900 rounded-lg p-6 shadow-md mb-8 border border-gray-800">
        <h2 className="text-xl font-bold mb-4 text-blue-300 border-b border-gray-700 pb-2">
          Success Criteria
        </h2>
        
        <p className="font-medium mb-2 text-blue-200">I have:</p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          {iHavePoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
        
        <p className="font-medium mb-2 text-blue-200">I can:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          {iCanPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </section>
    );
  }
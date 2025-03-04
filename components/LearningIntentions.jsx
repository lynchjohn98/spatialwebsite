export default function LearningIntentions({ dailyIntention, bulletPoints }) {
    return (
      <section className="bg-gray-900 rounded-lg p-6 shadow-md mb-8 border border-gray-800">  
        <h2 className="text-xl font-bold mb-3 text-blue-300 border-b border-gray-700 pb-2">
          Learning Intentions
        </h2>
        {dailyIntention && (
          <p className="italic mb-4 text-gray-300">
            {dailyIntention}
          </p>
        )}
        <p className="mb-4">By the end of this module, I will be able to:</p>
        
        <ul className="list-disc pl-6 space-y-2 mb-4">
          {bulletPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </section>
    );
  }
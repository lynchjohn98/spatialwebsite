// components/GetStarted.jsx
export default function GetStarted({ 
  steps = [], 
  testButtons = [],
  videoLinks = []
}) {
  return (
    <section className="bg-gray-900 rounded-lg p-6 shadow-md mb-8 border border-gray-800">
      <h2 className="text-xl font-bold mb-4 text-blue-300 border-b border-gray-700 pb-2">
        Let's Get Started
      </h2>
      
      <ol className="list-decimal pl-6 space-y-4 mb-4">
        {steps.map((step, index) => {
          // Filter for links associated with this step
          const associatedLinks = videoLinks.filter(link => link.stepIndex === index + 1);
          
          return (
            <li key={index} className="pl-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="font-medium">{step}</span>
                
                {associatedLinks.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0 ml-0 sm:ml-4">
                    {associatedLinks.map((link, linkIndex) => {
                      return (
                        <a
                          key={linkIndex}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-700 hover:bg-green-600 text-white py-2 px-3 rounded text-sm transition-colors text-center"
                        >
                          {link.label}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      
      {testButtons.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-4">
          {testButtons.map((button, index) => (
            <button 
              key={index}
              onClick={button.onClick}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
            >
              {button.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
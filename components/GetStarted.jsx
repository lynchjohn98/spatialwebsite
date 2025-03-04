// components/module/GetStarted.jsx
export default function GetStarted({ steps, testButtons = [] }) {
    return (
      <section className="bg-gray-900 rounded-lg p-6 shadow-md mb-8 border border-gray-800">
        <h2 className="text-xl font-bold mb-4 text-blue-300 border-b border-gray-700 pb-2">
          Let's Get Started
        </h2>
        
        <ol className="list-decimal pl-6 space-y-4 mb-4">
          {steps.map((step, index) => (
            <li key={index} className="pl-2">
              <span className="font-medium">{step}</span>
            </li>
          ))}
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
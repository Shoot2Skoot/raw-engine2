import { useState } from 'react';

interface NumberInputProps {
  onSubmit: (value: number) => void;
  onCancel: () => void;
  min?: number;
  max?: number;
}

export function NumberInput({ onSubmit, onCancel, min = 0, max = 999 }: NumberInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= min && num <= max) {
      onSubmit(num);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Enter Number</h3>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyPress}
          min={min}
          max={max}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-2xl text-center focus:border-blue-500 focus:outline-none"
          autoFocus
        />
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            OK
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>

        {/* Number pad for mobile */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <button
              key={num}
              onClick={() => setValue((prev) => prev + num)}
              className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-xl font-medium"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setValue((prev) => prev.slice(0, -1))}
            className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-xl font-medium col-span-2"
          >
            ←
          </button>
        </div>
      </div>
    </div>
  );
}

interface ColorPickerProps {
  colors: string[];
  onSelect: (color: string) => void;
  onCancel: () => void;
}

export function ColorPicker({ colors, onSelect, onCancel }: ColorPickerProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Choose Color</h3>
        <div className="grid grid-cols-4 gap-3">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => onSelect(color)}
              className="w-16 h-16 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:scale-110 transition-all shadow-md"
              style={{ backgroundColor: color }}
              aria-label={color}
            />
          ))}
        </div>
        <button
          onClick={onCancel}
          className="w-full mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

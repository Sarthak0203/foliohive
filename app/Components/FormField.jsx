export default function FormField({ label, type, value, onChange }) {
    return (
      <div className="mb-4">
        <label className="block text-gray-700">{label}</label>
        <input
          type={type}
          className="w-full px-4 py-2 border rounded-lg"
          value={value}
          onChange={onChange}
          required
        />
      </div>
    );
  }
  
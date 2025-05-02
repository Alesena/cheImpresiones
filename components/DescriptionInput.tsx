import { ChangeEvent } from 'react';

interface DescriptionInputProps {
  placeholderText: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function DescriptionInput({ placeholderText, value, onChange }: DescriptionInputProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor="description">Descripción:</label>
      <textarea
        id="description"
        name="description"
        value={value}
        onChange={onChange}
        placeholder={placeholderText}
        rows={4}
        cols={50}
        className="mt-2 rounded border border-gray-300 p-2"
      />
    </div>
  );
}

import { useState, ChangeEvent } from 'react';
interface DescriptionInputProps {
  placeholderText: string;
}
export default function DescriptionInput({placeholderText}:DescriptionInputProps){
  const [description, setDescription] = useState('');

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  return (
    <div className='flex flex-col'>
      <label htmlFor="description">Descripción:</label>
      <textarea
      className='mt-2 rounded border border-gray-300 p-2'
        id="description"
        name="description"
        value={description}
        onChange={handleDescriptionChange}
        rows={4} // Número de filas visibles
        cols={50} // Número de columnas visibles
        placeholder={placeholderText}
      />
    </div>
  );
}

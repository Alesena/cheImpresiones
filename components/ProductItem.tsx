// components/ProductItem.tsx
import Image from 'next/image';

interface ProductItemProps {
  name: string;
  imageUrl: string;
  price: number;
}

export default function ProductItem({ name, imageUrl, price }: ProductItemProps) {
  return (
    <div className="border rounded p-4 flex flex-col items-center">
      <div className="w-32 h-32 relative mb-2">
        <Image
          src={imageUrl}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded"
        />
      </div>
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">Precio: ${price}</p>
    </div>
  );
}

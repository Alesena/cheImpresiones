// app/catalog/page.tsx
import ProductItem from '@/components/ProductItem';

export const revalidate = 0; 
// (Opcional) Desactiva la caché para fines de ejemplo, o ajusta según tu necesidad.

type Product = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
};

// Ejemplo de un listado "falso" de productos
const allProducts: Product[] = [
  { id: 1, name: 'Producto 1', imageUrl: '/images/prod1.jpg', price: 100 },
  { id: 2, name: 'Producto 2', imageUrl: '/images/prod2.jpg', price: 120 },
  { id: 3, name: 'Producto 3', imageUrl: '/images/prod3.jpg', price: 90 },
  // ... Agrega más productos
  { id: 4, name: 'Producto 4', imageUrl: '/images/prod4.jpg', price: 150 },
  { id: 5, name: 'Producto 5', imageUrl: '/images/prod5.jpg', price: 200 },
  { id: 6, name: 'Producto 6', imageUrl: '/images/prod6.jpg', price: 75 },
  { id: 7, name: 'Producto 7', imageUrl: '/images/prod7.jpg', price: 180 },
  { id: 8, name: 'Producto 8', imageUrl: '/images/prod8.jpg', price: 210 },
  { id: 9, name: 'Producto 9', imageUrl: '/images/prod9.jpg', price: 95 },
  { id: 10, name: 'Producto 10', imageUrl: '/images/prod10.jpg', price: 110 },
  // ... y así hasta que quieras.
];

interface CatalogPageProps {
  searchParams?: {
    page?: string;
  };
}

export default function CatalogPage({ searchParams }: CatalogPageProps) {
  // 1. Determinar la página actual y los productos por página
  const currentPage = parseInt(searchParams?.page || '1', 10);
  const pageSize = 6; // cuantos productos quieres mostrar por página

  // 2. Calcular total de productos y total de páginas
  const totalProducts = allProducts.length;
  const totalPages = Math.ceil(totalProducts / pageSize);

  // 3. Asegurar que currentPage esté dentro de rangos válidos
  const validPage = currentPage < 1 ? 1 : currentPage > totalPages ? totalPages : currentPage;

  // 4. Obtener los productos de la página actual
  const startIndex = (validPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const productsOnPage = allProducts.slice(startIndex, endIndex);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Catálogo de Productos</h2>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {productsOnPage.map((product) => (
          <ProductItem
            key={product.id}
            name={product.name}
            imageUrl={product.imageUrl}
            price={product.price}
          />
        ))}
      </div>

      {/* Controles de paginación */}
      <div className="flex justify-center items-center gap-4 mt-8">
        {/* Botón "Anterior" */}
        {validPage > 1 && (
          <a
            href={`/catalog?page=${validPage - 1}`}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
          >
            Anterior
          </a>
        )}

        <span>
          Página {validPage} de {totalPages}
        </span>

        {/* Botón "Siguiente" */}
        {validPage < totalPages && (
          <a
            href={`/catalog?page=${validPage + 1}`}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
          >
            Siguiente
          </a>
        )}
      </div>
    </section>
  );
}

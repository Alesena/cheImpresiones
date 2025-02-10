export default function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-white py-4 text-center mt-auto">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} - Mi Sitio. Todos los derechos reservados.
      </p>
    </footer>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div>
          <p>Teatro Dislocador &copy; {new Date().getFullYear()}</p>
          <p>Desarrollado por [Tu Nombre]</p>
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:underline">Instagram</a>
          <a href="#" className="hover:underline">Facebook</a>
          <a href="#" className="hover:underline">YouTube</a>
        </div>
      </div>
    </footer>
  );
}
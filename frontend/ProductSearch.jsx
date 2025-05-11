function ProductSearch({ onAddToCart }) {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <input 
      type="text" 
      placeholder="Scan/Search product..." 
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}
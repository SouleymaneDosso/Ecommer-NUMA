import { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import styled from "styled-components";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/* ===============================
   STYLES LUXE RESPONSIVE FIX
================================ */
const Wrapper = styled.div`
  padding: 24px 16px;
  max-width: 1400px;
  margin: auto;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 32px;
  font-weight: 500;
  color: #111;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 24px;
  }
`;

const Filters = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;

  select, input {
    padding: 10px 16px;
    border-radius: 50px;
    border: 1px solid #ddd;
    background: #fafafa;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  select:hover, input:hover {
    border-color: #bbb;
  }

  input[type="number"] {
    width: 100px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;

    select, input {
      width: 100%;
    }

    input[type="number"] {
      width: 100%;
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  background: #fff;
  width: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 32px rgba(0,0,0,0.12);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  overflow: hidden;
  background: #f8f8f8;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  ${Card}:hover & {
    transform: scale(1.07);
  }
`;

const CardBody = styled.div`
  padding: 12px 8px;
  text-align: center;
`;

const ProductTitle = styled.h3`
  font-size: 0.95rem;
  margin: 0 0 6px;
  color: #222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Price = styled.div`
  font-weight: 700;
  color: #111;
`;

const Message = styled.div`
  padding: 40px 0;
  text-align: center;
  font-size: 1.05rem;
  opacity: 0.7;
  color: #555;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  max-width: 400px;
  width: 100%;
  margin-bottom: 24px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  border-radius: 50px;
  border: 1px solid #ddd;
  font-size: 0.95rem;
  outline: none;
  background: #fafafa;
  transition: all 0.2s ease;

  &:focus {
    border-color: #0077ff;
    box-shadow: 0 0 12px rgba(0,119,255,0.3);
  }
`;

const Suggestions = styled.ul`
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #ddd;
  max-height: 240px;
  overflow-y: auto;
  z-index: 1000;
  padding: 0;
  margin: 0;
  list-style: none;
`;

const SuggestionItem = styled.li`
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #f0f0f0;
  }
`;

/* ===============================
   HELPERS
================================ */
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/* ===============================
   COMPONENT
================================ */
export default function Search() {
  const queryParams = useQuery();
  const initialQuery = queryParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [genreFilter, setGenreFilter] = useState("");
  const [categorieFilter, setCategorieFilter] = useState("");
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    const fetchProduits = async () => {
      if (!query.trim()) {
        setProduits([]);
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        let url = `${API_URL}/api/produits?search=${encodeURIComponent(query)}`;
        if (categorieFilter) url += `&categorie=${encodeURIComponent(categorieFilter)}`;
        if (genreFilter) url += `&genre=${encodeURIComponent(genreFilter)}`;
        if (prixMin) url += `&minPrice=${prixMin}`;
        if (prixMax) url += `&maxPrice=${prixMax}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Erreur serveur");

        const data = await res.json();
        setProduits(data);

        const cats = [...new Set(data.map(p => p.categorie))];
        setCategories(cats);

        const sugg = data.map(p => p.title).slice(0, 5);
        setSuggestions(sugg);
        setShowSuggestions(true);

      } catch (err) {
        console.error("❌ Search error:", err);
        setError("Une erreur est survenue lors de la recherche.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, [query, categorieFilter, genreFilter, prixMin, prixMax]);

  const handleSuggestionClick = (title) => {
    setQuery(title);
    setShowSuggestions(false);
  };

  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <Wrapper>
      <Title>Résultats pour : <strong>“{query}”</strong></Title>

      <SearchInputWrapper ref={inputRef}>
        <SearchInput
          type="text"
          placeholder="Rechercher un produit…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query && setShowSuggestions(true)}
        />
        {showSuggestions && suggestions.length > 0 && (
          <Suggestions>
            {suggestions.map((s, i) => (
              <SuggestionItem key={i} onClick={() => handleSuggestionClick(s)}>
                {s}
              </SuggestionItem>
            ))}
          </Suggestions>
        )}
      </SearchInputWrapper>

      <Filters>
        <select value={categorieFilter} onChange={e => setCategorieFilter(e.target.value)}>
          <option value="">Toutes catégories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <select value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
          <option value="">Tous genres</option>
          <option value="homme">Homme</option>
          <option value="femme">Femme</option>
          <option value="unisex">Unisex</option>
        </select>

        <input type="number" placeholder="Prix min" value={prixMin} onChange={e => setPrixMin(e.target.value)} />
        <input type="number" placeholder="Prix max" value={prixMax} onChange={e => setPrixMax(e.target.value)} />
      </Filters>

      {loading && <Message>Recherche en cours…</Message>}
      {!loading && error && <Message>{error}</Message>}
      {!loading && !error && produits.length === 0 && <Message>Aucun produit trouvé.</Message>}

      {!loading && !error && produits.length > 0 && (
        <Grid>
          {produits.map(p => {
            const mainImage = p.images?.find(img => img.isMain)?.url || p.images?.[0]?.url;
            return (
              <Card key={p._id} to={`/produit/${p._id}`}>
                <ImageWrapper>
                  {mainImage && <Image src={mainImage} alt={p.title} />}
                </ImageWrapper>
                <CardBody>
                  <ProductTitle>{p.title}</ProductTitle>
                  <Price>{p.price} FCFA</Price>
                </CardBody>
              </Card>
            );
          })}
        </Grid>
      )}
    </Wrapper>
  );
}

import { useState, useEffect } from "react";
import styled from "styled-components";

// ===============================
// STYLES
// ===============================
const Container = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: #f9fafb;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #2c3e50;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 12px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #0056b3;
  }
`;

const ProductList = styled.div`
  margin-top: 40px;
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  margin-bottom: 10px;
  align-items: center;
`;

const ImagePreview = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 10px;
  border: ${(props) => (props.isMain ? "2px solid #007bff" : "1px solid #ccc")};
  cursor: pointer;
`;

// ===============================
// COMPOSANT
// ===============================
function AdminProducts() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [stock, setStock] = useState({});
  const [images, setImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [genre, setGenre] = useState("homme");
  const [categorie, setCategorie] = useState("haut");
  const [badge, setBadge] = useState(null);

  const token = localStorage.getItem("adminToken");

  // ===============================
  // FETCH PRODUITS EXISTANTS
  // ===============================
  useEffect(() => {
    console.log(token);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // GESTION IMAGES
  // ===============================
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setMainImageIndex(0);
  };

  // ===============================
  // GESTION STOCK
  // ===============================
  const handleStockChange = (color, size, value) => {
    setStock((prev) => ({
      ...prev,
      [`${color}_${size}`]: parseInt(value) || 0,
    }));
  };

  // ===============================
  // AJOUT PRODUIT
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !price || images.length === 0) {
      alert("Tous les champs sont obligatoires !");
      return;
    }

    const stockObj = {};
    colors.forEach((color) => {
      stockObj[color] = {};
      sizes.forEach((size) => {
        stockObj[color][size] = stock[`${color}_${size}`] || 0;
      });
    });

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("couleurs", JSON.stringify(colors));
    formData.append("tailles", JSON.stringify(sizes));
    formData.append("stockParVariation", JSON.stringify(stockObj));
    formData.append("genre", genre);
    formData.append("categorie", categorie);
    formData.append("badge", badge);
    formData.append("mainImageIndex", mainImageIndex);

    images.forEach((img) => formData.append("images", img));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Erreur lors de l'ajout");
        return;
      }

      alert("Produit ajouté !");
      setTitle("");
      setDescription("");
      setPrice("");
      setColors([]);
      setSizes([]);
      setStock({});
      setImages([]);
      setMainImageIndex(0);
      setGenre("homme");
      setCategorie("haut");
      setBadge(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <Container>
      <Title>Admin Produits</Title>

      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Prix"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <Select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="homme">Homme</option>
          <option value="femme">Femme</option>
          <option value="enfant">Enfant</option>
        </Select>

        <Select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
        >
          <option value="haut">Haut</option>
          <option value="bas">Bas</option>
          <option value="robe">Robe</option>
          <option value="chaussure">Chaussure</option>
          <option value="tout">Tout</option>
        </Select>

        <Select
          value={badge || ""}
          onChange={(e) => setBadge(e.target.value || null)}
        >
          <option value="">Aucun</option>
          <option value="new">New</option>
          <option value="promo">Promo</option>
        </Select>

        <Input
          type="text"
          placeholder="Couleurs (séparées par ,)"
          value={colors.join(",")}
          onChange={(e) =>
            setColors(e.target.value.split(",").map((c) => c.trim()))
          }
        />
        <Input
          type="text"
          placeholder="Tailles (séparées par ,)"
          value={sizes.join(",")}
          onChange={(e) =>
            setSizes(e.target.value.split(",").map((s) => s.trim()))
          }
        />

        {colors.length > 0 && sizes.length > 0 && (
          <div>
            {colors.map((color) => (
              <div key={color}>
                <strong>{color}</strong>
                {sizes.map((size) => (
                  <Input
                    key={`${color}_${size}`}
                    type="number"
                    placeholder={`${color} / ${size}`}
                    value={stock[`${color}_${size}`] || ""}
                    onChange={(e) =>
                      handleStockChange(color, size, e.target.value)
                    }
                    style={{ width: "80px", marginRight: "5px" }}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />

        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          {images.map((img, idx) => (
            <ImagePreview
              key={idx}
              src={URL.createObjectURL(img)}
              isMain={idx === mainImageIndex}
              onClick={() => setMainImageIndex(idx)}
            />
          ))}
        </div>

        <Button type="submit">Ajouter Produit</Button>
      </Form>

      <ProductList>
        {products.map((p) => (
          <ProductItem key={p._id}>
            <div>{p.title}</div>
            <Button
              onClick={async () => {
                if (!window.confirm("Supprimer ce produit ?")) return;
                await fetch(
                  `${import.meta.env.VITE_API_URL}/api/produits/${p._id}`,
                  {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
                setProducts(products.filter((prod) => prod._id !== p._id));
              }}
              style={{ background: "#e74c3c" }}
            >
              Supprimer
            </Button>
          </ProductItem>
        ))}
      </ProductList>
    </Container>
  );
}

export default AdminProducts ;

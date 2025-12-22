import { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import { API_URL } from "../../render";
Modal.setAppElement("#root");

/* ================= STYLES ================= */
const Container = styled.div`
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  background: #f5f7fa;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const Title = styled.h2`
  color: #2c3e50;
  font-size: 32px;
`;

const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "bg" && prop !== "outline",
})`
  padding: 10px 16px;
  background: ${({ bg, outline }) =>
    outline ? "transparent" : bg || "#007bff"};
  color: ${({ outline }) => (outline ? "#2c3e50" : "white")};
  font-weight: bold;
  border: ${({ outline }) => (outline ? "1px solid #ccc" : "none")};
  border-radius: 6px;
  cursor: pointer;
  margin-right: ${({ marginRight }) => marginRight || "8px"};
  transition: 0.2s all;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  &:hover {
    opacity: ${({ disabled }) => (disabled ? 0.6 : 0.85)};
  }
`;

const TableContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 14px;
  background: #ecf0f1;
  border-bottom: 1px solid #ddd;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
  vertical-align: middle;
`;

const ProductImagesWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ProductImage = styled.img.withConfig({
  shouldForwardProp: (prop) => prop !== "isMain",
})`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: ${({ isMain }) => (isMain ? "3px solid #007bff" : "1px solid #ccc")};
  cursor: pointer;
`;

const ImageRemoveButton = styled.button`
  position: relative;
  top: -10px;
  right: 5px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  cursor: pointer;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 12px;
  font-weight: 500;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Section = styled.div`
  background: #f9fafb;
  padding: 15px;
  border-radius: 10px;
`;

const SectionTitle = styled.h4`
  margin-bottom: 10px;
  color: #34495e;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 4px;
  font-weight: 500;
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

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  border-top: 1px solid #eee;
  padding-top: 15px;
`;

const VariationTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

const VariationTh = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  background: #ecf0f1;
`;

const VariationTd = styled.td`
  border: 1px solid #ddd;
  padding: 6px;
  text-align: center;
`;

/* ================= COMPONENT ================= */

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    hero: false,
    badge: "",
    genre: "",
    categorie: "haut",
    tailles: [],
    couleurs: [],
    stockParVariation: {},
    commentaires: [],
  });

  const token = localStorage.getItem("adminToken");

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/produits`);
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.error("Erreur récupération produits", err);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (product = null) => {
    setEditingProduct(product);
    setErrorMessage("");
    setImageFiles([]);
    setExistingImages([]);

    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        stock: product.stock,
        hero: product.hero || false,
        badge: product.badge || "",
        genre: product.genre || "",
        categorie: product.categorie || "haut",
        tailles: product.tailles || [],
        couleurs: product.couleurs || [],
        stockParVariation: product.stockParVariation || {},
        commentaires: product.commentaires || [],
      });
      setExistingImages(product.imageUrl || []);
    } else {
      setFormData({
        title: "",
        description: "",
        price: "",
        stock: "",
        hero: false,
        badge: "",
        genre: "",
        categorie: "haut",
        tailles: [],
        couleurs: [],
        stockParVariation: {},
        commentaires: [],
      });
    }

    setMainImageIndex(0);
    setModalOpen(true);
  };

  const handleRemoveExistingImage = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const handleVariationChange = (size, color, value) => {
    const updated = { ...formData.stockParVariation };
    if (!updated[size]) updated[size] = {};
    updated[size][color] = Number(value);
    setFormData({ ...formData, stockParVariation: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    console.log("ADMIN TOKEN =", token);
    if (!formData.genre || !formData.categorie) {
      return setErrorMessage("Genre et catégorie obligatoires");
    }

    try {
      const data = new FormData();
      data.append("produits", JSON.stringify(formData));

      imageFiles.forEach((img) => {
        console.log("Image envoyée :", img);
        data.append("image", img);
      });

      data.append("existingImages", JSON.stringify(existingImages));

      const url = editingProduct
        ? `${API_URL}/api/produits/${editingProduct._id}`
        : `${API_URL}/api/produits`;

      console.log("URL :", url);

      const res = await fetch(url, {
        method: editingProduct ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // ⚠️ NE PAS mettre Content-Type avec FormData
        },
        body: data,
      });

      const responseText = await res.text(); // 🔥 clé du debug
      console.log("Réponse serveur brute :", responseText);

      if (!res.ok) {
        throw new Error(responseText || "Erreur serveur");
      }

      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Erreur upload produit :", err);
      setErrorMessage(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    setDeletingId(id);

    await fetch(`${API_URL}/api/produits/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setProducts(products.filter((p) => p._id !== id));
    setDeletingId(null);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categorie?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.reload();
  };

  return (
    <Container>
      <Header>
        <Title>Gestion des produits</Title>
      </Header>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <Button onClick={() => openModal()}>+ Ajouter</Button>
        <Input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Images</Th>
              <Th>Nom</Th>
              <Th>Prix</Th>
              <Th>Stock</Th>
              <Th>Hero</Th>
              <Th>Tailles</Th>
              <Th>Couleurs</Th>
              <Th>Stock par variation</Th>
              <Th>Commentaires</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p._id}>
                <Td>
                  <ProductImagesWrapper>
                    {p.imageUrl?.map((img, i) => (
                      <ProductImage key={i} src={img} isMain={i === 0} />
                    ))}
                  </ProductImagesWrapper>
                </Td>
                <Td>{p.title}</Td>
                <Td>{p.price} FCFA</Td>
                <Td>{p.stock}</Td>
                <Td>
                  <input type="checkbox" checked={!!p.hero} readOnly />
                </Td>
                <Td>{(p.tailles || []).join(", ")}</Td>
                <Td>{(p.couleurs || []).join(", ")}</Td>
                <Td>
                  {Object.entries(p.stockParVariation || {}).map(
                    ([size, colors]) =>
                      Object.entries(colors).map(([color, stock]) => (
                        <div
                          key={`${size}-${color}`}
                          style={{ marginBottom: "3px" }}
                        >
                          {size}-{color}: {stock}
                        </div>
                      ))
                  )}
                </Td>
                <Td>{(p.commentaires || []).length}</Td>
                <Td style={{ display: "flex", gap: "8px" }}>
                  <Button bg="#f39c12" onClick={() => openModal(p)}>
                    Modifier
                  </Button>
                  <Button
                    bg="#e74c3c"
                    disabled={deletingId === p._id}
                    onClick={() => handleDelete(p._id)}
                  >
                    {deletingId === p._id ? "..." : "Supprimer"}
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={{
          content: {
            maxWidth: "700px",
            margin: "auto",
            borderRadius: "14px",
            padding: "25px",
            maxHeight: "85vh",
            overflow: "auto",
          },
        }}
      >
        <h2>{editingProduct ? "Modifier le produit" : "Ajouter un produit"}</h2>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

        <form onSubmit={handleSubmit}>
          <ModalContent>
            {/* --- Informations générales --- */}
            <Section>
              <SectionTitle>Informations générales</SectionTitle>
              <Field>
                <Label>Titre</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </Field>
              <Field>
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </Field>
              <Field>
                <Label>Prix (FCFA)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </Field>
              <Field>
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                />
              </Field>
            </Section>

            {/* --- Organisation --- */}
            <Section>
              <SectionTitle>Organisation</SectionTitle>
              <Field>
                <Label>Genre</Label>
                <Select
                  value={formData.genre}
                  onChange={(e) =>
                    setFormData({ ...formData, genre: e.target.value })
                  }
                >
                  <option value="">—</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="enfant">Enfant</option>
                </Select>
              </Field>
              <Field>
                <Label>Catégorie</Label>
                <Select
                  value={formData.categorie}
                  onChange={(e) =>
                    setFormData({ ...formData, categorie: e.target.value })
                  }
                >
                  <option value="haut">Haut</option>
                  <option value="bas">Bas</option>
                  <option value="robe">Robe</option>
                  <option value="chaussure">Chaussure</option>
                  <option value="tout">Tout</option>
                </Select>
              </Field>
            </Section>

            {/* --- Options --- */}
            <Section>
              <SectionTitle>Options</SectionTitle>
              <Field>
                <Label>Badge</Label>
                <Select
                  value={formData.badge}
                  onChange={(e) =>
                    setFormData({ ...formData, badge: e.target.value })
                  }
                >
                  <option value="">—</option>
                  <option value="new">New</option>
                  <option value="promo">Promo</option>
                </Select>
              </Field>
              <label>
                <input
                  type="checkbox"
                  checked={formData.hero}
                  onChange={(e) =>
                    setFormData({ ...formData, hero: e.target.checked })
                  }
                />{" "}
                Afficher en Hero
              </label>
            </Section>

            {/* --- Variations & Stock --- */}
            <Section>
              <SectionTitle>Variations et Stock par variation</SectionTitle>
              <Field>
                <Label>Tailles (séparées par une virgule)</Label>
                <Input
                  value={formData.tailles.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tailles: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                />
              </Field>
              <Field>
                <Label>Couleurs (séparées par une virgule)</Label>
                <Input
                  value={formData.couleurs.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      couleurs: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                />
              </Field>

              <Field>
                <Label>Stock par variation</Label>
                <VariationTable>
                  <thead>
                    <tr>
                      <VariationTh>Taille</VariationTh>
                      {formData.couleurs.map((c) => (
                        <VariationTh key={c}>{c}</VariationTh>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {formData.tailles.map((size) => (
                      <tr key={size}>
                        <VariationTd>{size}</VariationTd>
                        {formData.couleurs.map((color) => (
                          <VariationTd key={color}>
                            <Input
                              type="number"
                              min={0}
                              value={
                                formData.stockParVariation?.[size]?.[color] || 0
                              }
                              onChange={(e) =>
                                handleVariationChange(
                                  size,
                                  color,
                                  e.target.value
                                )
                              }
                            />
                          </VariationTd>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </VariationTable>
              </Field>
            </Section>

            {/* --- Images --- */}
            <Section>
              <SectionTitle>Images</SectionTitle>
              <Input
                type="file"
                multiple
                onChange={(e) => setImageFiles([...e.target.files])}
                required={!editingProduct && existingImages.length === 0}
              />
              {existingImages.length > 0 && (
                <ProductImagesWrapper>
                  {existingImages.map((img, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <ProductImage src={img} isMain={i === mainImageIndex} />
                      <ImageRemoveButton
                        onClick={() => handleRemoveExistingImage(i)}
                      >
                        ×
                      </ImageRemoveButton>
                    </div>
                  ))}
                </ProductImagesWrapper>
              )}
              {imageFiles.length > 0 && (
                <ProductImagesWrapper>
                  {imageFiles.map((file, i) => (
                    <ProductImage
                      key={i}
                      src={URL.createObjectURL(file)}
                      isMain={i === mainImageIndex}
                      onClick={() => setMainImageIndex(i)}
                    />
                  ))}
                </ProductImagesWrapper>
              )}
            </Section>

            <Footer>
              <Button outline type="button" onClick={() => setModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {editingProduct ? "Enregistrer" : "Ajouter"}
              </Button>
            </Footer>
          </ModalContent>
        </form>
      </Modal>
    </Container>
  );
}

export default AdminProducts;

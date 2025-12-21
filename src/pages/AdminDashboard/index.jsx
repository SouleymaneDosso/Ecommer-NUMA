import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartTooltip, ResponsiveContainer } from "recharts";
import Modal from "react-modal";

Modal.setAppElement("#root");

/* ===== Styles ===== */
const Container = styled.div`
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f9fafb;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  flex: 1;
  min-width: 250px;
  max-width: 400px;
`;

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  justify-content: center;
`;

const StatCard = styled.div`
  background: #fff;
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  text-align: center;
  min-width: 120px;
  max-width: 180px;
  flex: 0 1 auto;
`;

const StatNumber = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  color: #555;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const TableContainer = styled.div`
  min-width: 1400px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  tbody tr:hover {
    background: #f1f3f6;
    cursor: pointer;
    transition: background 0.2s;
  }
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  background: #f1f3f6;
  font-weight: 600;
  color: #2c3e50;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
  color: #4a5568;
  vertical-align: top;
`;

const ProductImagesWrapper = styled.div`
  display: flex;
  gap: 5px;
`;

const ProductImage = styled.img`
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const SmallTag = styled.span`
  display: inline-block;
  background: #f0f0f0;
  padding: 2px 6px;
  margin: 2px 2px 2px 0;
  border-radius: 4px;
  font-size: 12px;
`;

const Pagination = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const PageButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #007bff;
  background: ${(props) => (props.active ? "#007bff" : "#fff")};
  color: ${(props) => (props.active ? "#fff" : "#007bff")};
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ModalSection = styled.div`
  background: #f9fafb;
  padding: 15px;
  border-radius: 10px;
`;

const ModalSectionTitle = styled.h4`
  margin-bottom: 10px;
  color: #34495e;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #eee;
  padding-top: 15px;
`;

/* ===== Composant ===== */
function TableauDeBord() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [filterCategorie, setFilterCategorie] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/produits");
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.error("Erreur récupération produits", err);
      setProducts([]);
    }
  };

  const filteredProducts = products
    .filter(p =>
      (p.title?.toLowerCase().includes(search.toLowerCase()) ||
       p.userId?.toLowerCase().includes(search.toLowerCase()))
    )
    .filter(p => !filterGenre || (Array.isArray(p.genre) ? p.genre.includes(filterGenre) : p.genre === filterGenre))
    .filter(p => !filterCategorie || p.categorie === filterCategorie);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const stats = useMemo(() => {
    const total = products.length;
    const epuises = products.filter(p => p.stock <= 0).length;
    const promos = products.filter(p => p.badge === "promo").length;
    const nouveaux = products.filter(p => p.badge === "new").length;

    const byGenre = ["homme","femme","enfant"].map(g => ({
      genre: g,
      count: products.filter(p => Array.isArray(p.genre) ? p.genre.includes(g) : p.genre === g).length
    }));

    const byCategorie = ["haut","bas","tout"].map(c => ({
      categorie: c,
      count: products.filter(p => p.categorie === c).length
    }));

    return { total, epuises, promos, nouveaux, byGenre, byCategorie };
  }, [products]);

  return (
    <Container>
      <Title>Tableau de bord</Title>

      <StatsContainer>
        <StatCard>
          <StatNumber>{stats.total}</StatNumber>
          <StatLabel>Total produits</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.epuises}</StatNumber>
          <StatLabel>Épuisés</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.promos}</StatNumber>
          <StatLabel>Promos</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.nouveaux}</StatNumber>
          <StatLabel>Nouveaux</StatLabel>
        </StatCard>
      </StatsContainer>

      <Controls>
        <SearchInput
          placeholder="Rechercher par titre ou utilisateur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)}>
          <option value="">Tous les genres</option>
          <option value="homme">Homme</option>
          <option value="femme">Femme</option>
          <option value="enfant">Enfant</option>
        </Select>
        <Select value={filterCategorie} onChange={(e) => setFilterCategorie(e.target.value)}>
          <option value="">Toutes les catégories</option>
          <option value="haut">Haut</option>
          <option value="bas">Bas</option>
          <option value="tout">Tout</option>
        </Select>
      </Controls>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "30px", marginBottom: "30px" }}>
        <div style={{ width: "100%", maxWidth: "800px", height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.byGenre}>
              <XAxis dataKey="genre" />
              <YAxis allowDecimals={false} />
              <RechartTooltip />
              <Bar dataKey="count" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ width: "100%", maxWidth: "800px", height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.byCategorie}>
              <XAxis dataKey="categorie" />
              <YAxis allowDecimals={false} />
              <RechartTooltip />
              <Bar dataKey="count" fill="#28a745" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <TableWrapper>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>Images</Th>
                <Th>Titre</Th>
                <Th>Prix</Th>
                <Th>Stock</Th>
                <Th>Utilisateur</Th>
                <Th>Catégorie</Th>
                <Th>Commentaires</Th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((p) => (
                <tr key={p._id} onClick={() => { setModalProduct(p); setModalOpen(true); }}>
                  <Td>
                    <ProductImagesWrapper>
                      {Array.isArray(p.imageUrl) && p.imageUrl.length > 0
                        ? p.imageUrl.map((img, idx) => <ProductImage key={idx} src={img} alt={p.title} />)
                        : <ProductImage src="https://via.placeholder.com/60x40?text=No+Image" alt="Pas d'image" />}
                    </ProductImagesWrapper>
                  </Td>
                  <Td>{p.title || "—"}</Td>
                  <Td>{p.price ?? "—"} FCFA</Td>
                  <Td style={{ color: p.stock <= 0 ? "#e74c3c" : "#2c3e50", fontWeight: p.stock <= 0 ? "bold" : "normal" }}>
                    {p.stock <= 0 ? "Épuisé" : p.stock ?? "—"}
                  </Td>
                  <Td>{p.userId || "—"}</Td>
                  <Td>{p.categorie || "—"}</Td>
                  <Td>{p.commentaires?.length || 0}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </TableWrapper>

      <Pagination>
        {Array.from({ length: totalPages }, (_, i) => (
          <PageButton
            key={i}
            active={currentPage === i + 1}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </PageButton>
        ))}
      </Pagination>

      {/* ===== Modal produit détaillé ===== */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={{
          content: {
            maxWidth: "800px",
            margin: "auto",
            borderRadius: "14px",
            padding: "25px",
            maxHeight: "85vh",
            overflow: "auto",
          },
        }}
      >
        {modalProduct && (
          <ModalContent>
            <h2>{modalProduct.title}</h2>
            <ModalSection>
              <ModalSectionTitle>Images</ModalSectionTitle>
              <ProductImagesWrapper>
                {modalProduct.imageUrl?.map((img, idx) => (
                  <ProductImage key={idx} src={img} alt={modalProduct.title} />
                ))}
              </ProductImagesWrapper>
            </ModalSection>

            <ModalSection>
              <ModalSectionTitle>Description</ModalSectionTitle>
              <p>{modalProduct.description}</p>
            </ModalSection>

            <ModalSection>
              <ModalSectionTitle>Commentaires ({modalProduct.commentaires?.length || 0})</ModalSectionTitle>
              {modalProduct.commentaires?.length > 0 ? (
                modalProduct.commentaires.map(c => (
                  <div key={c._id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", alignItems: "center" }}>
                    <div>
                      <strong>{c.user || "Anonyme"}</strong> : {c.message} — <span style={{ color: "#f59e0b" }}>{c.rating}★</span>
                    </div>
                    <button
                      style={{
                        background: "#e74c3c",
                        color: "#fff",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem("token");
                          const res = await fetch(`http://localhost:3000/api/produits/${modalProduct._id}/commentaires/${c._id}`, {
                            method: "DELETE",
                            headers: { "Authorization": `Bearer ${token}` }
                          });
                          if (!res.ok) throw new Error("Erreur suppression commentaire");

                          setModalProduct(prev => ({
                            ...prev,
                            commentaires: prev.commentaires.filter(comm => comm._id !== c._id)
                          }));

                          setProducts(prev =>
                            prev.map(p =>
                              p._id === modalProduct._id
                                ? { ...p, commentaires: p.commentaires.filter(comm => comm._id !== c._id) }
                                : p
                            )
                          );
                        } catch (err) {
                          console.error(err);
                          alert("Impossible de supprimer le commentaire");
                        }
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                ))
              ) : (
                <p>Aucun commentaire</p>
              )}
            </ModalSection>

            <ModalFooter>
              <button onClick={() => setModalOpen(false)}>Fermer</button>
            </ModalFooter>
          </ModalContent>
        )}
      </Modal>
    </Container>
  );
}

export default TableauDeBord;

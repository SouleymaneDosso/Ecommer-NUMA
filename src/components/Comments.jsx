// src/components/Comments.jsx
import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

// ---------- ANIMATIONS ----------
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ---------- STYLES ----------
const Wrapper = styled.div`
  margin-top: 2rem;
  font-family: 'Arial', sans-serif;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid ${({ active }) => (active ? "#007bff" : "#ccc")};
  background: ${({ active }) => (active ? "#007bff" : "#f5f5f5")};
  color: ${({ active }) => (active ? "#fff" : "#333")};
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;

  &:hover {
    background: ${({ active }) => (active ? "#0056b3" : "#e0e0e0")};
  }
`;

const CommentCard = styled.div`
  display: flex;
  gap: 1rem;
  padding: 12px 16px;
  margin-bottom: 1rem;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  animation: ${fadeIn} 0.3s ease;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 18px rgba(0,0,0,0.1);
  }
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f0f0f0;
  color: #555;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CommentContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 700;
  color: #222;
`;

const Stars = styled.div`
  margin-top: 2px;
  color: #f59e0b;
  font-size: 0.9rem;
`;

const Message = styled.p`
  margin-top: 4px;
  color: #444;
  font-size: 0.95rem;
`;

const Form = styled.form`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  @media(min-width: 480px) {
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
  }
`;

const Textarea = styled.textarea`
  flex: 1;
  resize: vertical;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  min-height: 60px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.15);
  }
`;

const Select = styled.select`
  width: 100px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-weight: 600;
  cursor: pointer;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: #007bff;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadMore = styled(Button)`
  margin-top: 1rem;
  background: #555;
  &:hover { background: #333; }
`;

// ---------- COMPONENT ----------
export default function Comments({ commentaires, produitId, userId }) {
  const [commentList, setCommentList] = useState(commentaires || []);
  const [texte, setTexte] = useState("");
  const [note, setNote] = useState(5);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(0); // 0 = tous, 5-1 = notes
  const [visibleCount, setVisibleCount] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!texte) return;

    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/produits/${produitId}/commentaires`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ message: texte, rating: note, user: userId || "Anonyme" }),
        }
      );
      if (!res.ok) throw new Error("Erreur lors de l'envoi du commentaire");

      const newComment = await res.json();
      setCommentList((prev) => [newComment, ...prev]);
      setTexte("");
      setNote(5);
      setVisibleCount((v) => v + 1);
    } catch (err) {
      console.error(err);
      alert("Impossible d'envoyer le commentaire");
    } finally {
      setLoading(false);
    }
  };

  const filteredComments = filter
    ? commentList.filter(c => c.rating === filter)
    : commentList;

  return (
    <Wrapper>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Commentaires ({filteredComments.length})
      </h3>

      {/* FILTRE PAR NOTE */}
      <FilterRow>
        <FilterButton active={filter === 0} onClick={() => setFilter(0)}>Tous</FilterButton>
        {[5,4,3,2,1].map(n => (
          <FilterButton key={n} active={filter === n} onClick={() => setFilter(n)}>{n}★</FilterButton>
        ))}
      </FilterRow>

      {/* LISTE COMMENTAIRES */}
      {filteredComments.slice(0, visibleCount).map((c, i) => (
        <CommentCard key={i}>
          <Avatar>{(c.user || "A")[0]}</Avatar>
          <CommentContent>
            <UserName>{c.user || "Anonyme"}</UserName>
            <Stars>{"★".repeat(c.rating) + "☆".repeat(5 - c.rating)}</Stars>
            <Message>{c.message}</Message>
          </CommentContent>
        </CommentCard>
      ))}

      {/* BOUTON CHARGER PLUS */}
      {visibleCount < filteredComments.length && (
        <LoadMore onClick={() => setVisibleCount(prev => prev + 5)}>
          Charger plus
        </LoadMore>
      )}

      {/* FORMULAIRE */}
      <Form onSubmit={handleSubmit}>
        <Textarea
          placeholder="Écrire un commentaire..."
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          required
        />
        <Select value={note} onChange={(e) => setNote(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n}★
            </option>
          ))}
        </Select>
        <Button type="submit" disabled={loading}>
          {loading ? "Envoi..." : "Envoyer"}
        </Button>
      </Form>
    </Wrapper>
  );
}

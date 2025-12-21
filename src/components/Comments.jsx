import styled from "styled-components";
import { useState } from "react";
import {API_URL } from "../render"
const Wrapper = styled.div`
  margin-top: 2rem;
`;

const Comment = styled.div`
  padding: 8px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.border || "#ccc"};
`;

const UserName = styled.span`
  font-weight: 700;
  margin-right: 0.5rem;
`;

const Note = styled.span`
  font-weight: 600;
  color: #f59e0b;
`;

const Form = styled.form`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Textarea = styled.textarea`
  resize: vertical;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.border || "#ccc"};
  font-size: 1rem;
`;

const Select = styled.select`
  width: 100px;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.border || "#ccc"};
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  background: ${({ theme }) => theme.primary || "#4caf50"};
  color: ${({ theme }) => theme.buttonText || "white"};
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function Comments({ commentaires, produitId, userId }) {
  const [commentList, setCommentList] = useState(commentaires || []);
  const [texte, setTexte] = useState("");
  const [note, setNote] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!texte) return;

    const token = localStorage.getItem("token"); // Récupère ton JWT

    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL }/api/produits/${produitId}/commentaires`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // JWT ici
          },
          body: JSON.stringify({ message: texte, rating: note, user: userId || "Anonyme" }),
        }
      );

      if (!res.ok) throw new Error("Erreur lors de l'envoi du commentaire");

      const newComment = await res.json();
      setCommentList((prev) => [...prev, newComment]);
      setTexte("");
      setNote(5);
    } catch (err) {
      console.error(err);
      alert("Impossible d'envoyer le commentaire");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <h3>Commentaires ({commentList?.length || 0})</h3>

      {commentList?.map((c, i) => (
        <Comment key={i}>
          <UserName>{c.user || "Anonyme"} :</UserName>
          {c.message} — <Note>{c.rating}★</Note>
        </Comment>
      ))}

      <Form onSubmit={handleSubmit}>
        <Textarea
          rows={3}
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

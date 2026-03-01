// src/components/Comments.jsx
import { useState } from "react";
import styled from "styled-components";
import { FiStar, FiUser } from "react-icons/fi";

/* =============================
   WRAPPER
============================= */

const Wrapper = styled.section`
  margin-top: 5rem;
  padding-top: 3rem;
  border-top: 1px solid #eee;
  width: 100%;
`;

const Heading = styled.h3`
  font-size: 1.2rem;
  font-weight: 400;
  letter-spacing: 1px;
  margin-bottom: 2.5rem;
`;

/* =============================
   COMMENT LIST
============================= */

const CommentCard = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.8rem 0;
  border-bottom: 1px solid #f2f2f2;
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 50%;
  background: #f4f4f4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const TopRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
`;

const UserName = styled.span`
  font-weight: 500;
  font-size: 0.9rem;
`;

const DateText = styled.span`
  font-size: 0.75rem;
  color: #888;
`;

const Stars = styled.div`
  display: flex;
  gap: 4px;
`;

const Message = styled.p`
  margin-top: 8px;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #444;
`;

/* =============================
   FORM
============================= */

const Form = styled.form`
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: stretch;
  }
`;

const InputContainer = styled.div`
  flex: 1;
  width: 100%;
`;

const Textarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ddd;
  padding: 14px;
  font-size: 16px; /* IMPORTANT anti-zoom mobile */
  resize: vertical;
  min-height: 100px;
  background: #fff;

  &:focus {
    outline: none;
    border-color: #111;
  }
`;

const StarSelector = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 10px;
`;

const Button = styled.button`
  min-width: 140px;
  white-space: nowrap;
  padding: 14px 24px;
  border: 1px solid #111;
  background: #111;
  color: #fff;
  font-size: 0.85rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #000;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* =============================
   COMPONENT
============================= */

export default function Comments({ commentaires = [], produitId, userId }) {
  const [commentList, setCommentList] = useState(commentaires);
  const [texte, setTexte] = useState("");
  const [note, setNote] = useState(0);
  const [hover, setHover] = useState(null);
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!texte || note === 0) return;

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/produits/${produitId}/commentaires`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: texte,
            rating: note,
            user: userId || "Anonyme",
          }),
        }
      );

      const newComment = await res.json();
      setCommentList((prev) => [newComment, ...prev]);
      setTexte("");
      setNote(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Heading>Commentaires ({commentList.length})</Heading>

      {commentList.map((c, i) => (
        <CommentCard key={i}>
          <Avatar>
            <FiUser size={18} />
          </Avatar>

          <Content>
            <TopRow>
              <UserName>{c.user || "Anonyme"}</UserName>
              <DateText>
                {c.createdAt ? formatDate(c.createdAt) : ""}
              </DateText>
              <Stars>
                {[...Array(5)].map((_, index) => (
                  <FiStar
                    key={index}
                    size={14}
                    fill={index < c.rating ? "#111" : "transparent"}
                  />
                ))}
              </Stars>
            </TopRow>

            <Message>{c.message}</Message>
          </Content>
        </CommentCard>
      ))}

      {/* FORMULAIRE */}
      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <Textarea
            placeholder="Écrire un commentaire..."
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
          />

          <StarSelector>
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <FiStar
                  key={index}
                  size={22}
                  style={{ cursor: "pointer" }}
                  onClick={() => setNote(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                  fill={
                    ratingValue <= (hover || note)
                      ? "#111"
                      : "transparent"
                  }
                />
              );
            })}
          </StarSelector>
        </InputContainer>

        <Button type="submit" disabled={loading}>
          {loading ? "Envoi..." : "Publier"}
        </Button>
      </Form>
    </Wrapper>
  );
}
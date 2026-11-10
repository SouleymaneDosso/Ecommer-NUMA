import { useState } from "react";
import styled from "styled-components";
import { FiStar, FiUser, FiMessageCircle, FiSend } from "react-icons/fi";
import { Link } from "react-router-dom";

/* =============================
   WRAPPER
============================= */

const Wrapper = styled.section`
  width: 100%;
  margin-top: 5rem;
  padding: 3rem 0;
  border-top: 1px solid #e9e4dc;
  color: #211f1b;
`;

/* =============================
   HEADER
============================= */

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 2.5rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const Eyebrow = styled.span`
  color: #a58a68;
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 600;
`;

const Heading = styled.h3`
  margin: 0;
  font-family: Georgia, serif;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 400;
  letter-spacing: -0.04em;
`;

const ReviewCount = styled.span`
  color: #9a9287;
  font-size: 0.8rem;
`;

/* =============================
   COMMENT CARD
============================= */

const CommentCard = styled.article`
  display: flex;
  gap: 1.2rem;
  padding: 1.7rem 0;
  border-bottom: 1px solid #eeeae4;

  @media (max-width: 480px) {
    gap: 0.8rem;
  }
`;

const Avatar = styled.div`
  width: 43px;
  height: 43px;
  min-width: 43px;
  border-radius: 50%;
  background: #eee9e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8c7557;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const TopRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.7rem;
`;

const UserName = styled.span`
  color: #24221e;
  font-size: 0.87rem;
  font-weight: 600;
`;

const DateText = styled.span`
  color: #a39c92;
  font-size: 0.72rem;
`;

const Stars = styled.div`
  display: flex;
  gap: 3px;
  color: #b18e5d;
`;

const Message = styled.p`
  margin: 0.8rem 0 0;
  color: #5f5a52;
  font-size: 0.9rem;
  line-height: 1.8;
  overflow-wrap: anywhere;
`;

/* =============================
   EMPTY STATE
============================= */

const EmptyState = styled.div`
  padding: 2.5rem 1.5rem;
  background: #faf9f6;
  border: 1px solid #eee9e0;
  text-align: center;
  color: #898176;

  svg {
    color: #b18e5d;
    margin-bottom: 0.8rem;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    line-height: 1.7;
  }
`;

/* =============================
   FORM
============================= */

const FormContainer = styled.div`
  margin-top: 3.5rem;
  padding: 2rem;
  background: #faf9f6;
  border: 1px solid #eee9e0;

  @media (max-width: 600px) {
    padding: 1.3rem;
  }
`;

const FormHeading = styled.div`
  margin-bottom: 1.5rem;

  h4 {
    margin: 0 0 0.5rem;
    font-family: Georgia, serif;
    font-size: 1.35rem;
    font-weight: 400;
  }

  p {
    margin: 0;
    color: #91897e;
    font-size: 0.8rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  min-height: 125px;
  padding: 1rem;
  resize: vertical;
  border: 1px solid #e5dfd5;
  background: #fff;
  color: #25231f;
  font-family: inherit;
  font-size: 16px;
  line-height: 1.7;
  outline: none;
  transition: border 0.25s ease;

  &::placeholder {
    color: #aaa399;
  }

  &:focus {
    border-color: #a58a68;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;

const RatingLabel = styled.span`
  font-size: 0.78rem;
  color: #777066;
`;

const StarSelector = styled.div`
  display: flex;
  gap: 7px;
`;

const StarButton = styled.button`
  display: flex;
  padding: 2px;
  border: none;
  background: transparent;
  color: #b18e5d;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.15);
  }

  &:focus-visible {
    outline: 2px solid #a58a68;
    outline-offset: 3px;
  }
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.7rem;
  min-width: 170px;
  padding: 14px 22px;
  border: 1px solid #171714;
  background: #171714;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #a58a68;
    border-color: #a58a68;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AlertMessage = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${({ $success }) => ($success ? "#edf3eb" : "#f8eee8")};
  border: 1px solid ${({ $success }) => ($success ? "#d5e4d0" : "#ead6c9")};
  color: ${({ $success }) => ($success ? "#476343" : "#87543d")};
  font-size: 0.83rem;
  line-height: 1.6;

  a {
    color: inherit;
    font-weight: 600;
    text-decoration: underline;
  }
`;

/* =============================
   COMPONENT
============================= */

export default function Comments({ commentaires = [], produitId, userId }) {
  const [commentList, setCommentList] = useState(commentaires);
  const [texte, setTexte] = useState("");
  const [note, setNote] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");
  const [success, setSuccess] = useState(false);

  const formatDate = (date) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    setAlert("");
    setSuccess(false);

    if (!token) {
      setAlert(
        <>
          Vous devez être connecté pour publier un avis.{" "}
          <Link to="/login">Se connecter</Link> ou{" "}
          <Link to="/signup">créer un compte</Link>.
        </>,
      );
      return;
    }

    if (!texte.trim() || note === 0) {
      setAlert("Veuillez écrire votre avis et sélectionner une note.");
      return;
    }

    if (!produitId) {
      setAlert("Impossible d'identifier ce produit.");
      return;
    }

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
            message: texte.trim(),
            rating: note,
            user: userId || "Anonyme",
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Impossible de publier votre avis.");
      }

      setCommentList((prev) => [data, ...prev]);
      setTexte("");
      setNote(0);
      setSuccess(true);
      setAlert("Merci pour votre avis ! Votre commentaire a bien été publié.");
    } catch (err) {
      console.error(err);
      setAlert(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Header>
        <HeaderLeft>
          <Eyebrow>Votre expérience</Eyebrow>
          <Heading>Avis & commentaires</Heading>
          <ReviewCount>
            {commentList.length} avis client{commentList.length > 1 ? "s" : ""}
          </ReviewCount>
        </HeaderLeft>
      </Header>

      {/* LISTE DES AVIS */}

      {commentList.length > 0 ? (
        commentList.map((c, i) => (
          <CommentCard key={c._id || i}>
            <Avatar>
              <FiUser size={19} />
            </Avatar>

            <Content>
              <TopRow>
                <UserName>{c.user || "Client NUMA"}</UserName>

                {c.createdAt && <DateText>{formatDate(c.createdAt)}</DateText>}

                <Stars aria-label={`Note : ${c.rating} sur 5`}>
                  {[...Array(5)].map((_, index) => (
                    <FiStar
                      key={index}
                      size={13}
                      fill={
                        index < Number(c.rating)
                          ? "currentColor"
                          : "transparent"
                      }
                    />
                  ))}
                </Stars>
              </TopRow>

              <Message>{c.message}</Message>
            </Content>
          </CommentCard>
        ))
      ) : (
        <EmptyState>
          <FiMessageCircle size={25} />
          <p>
            Aucun avis pour le moment.
            <br />
            Soyez le premier à partager votre expérience.
          </p>
        </EmptyState>
      )}

      {/* FORMULAIRE */}

      <FormContainer>
        <FormHeading>
          <h4>Partagez votre expérience</h4>
          <p>Votre avis aide les autres clients à faire leur choix.</p>
        </FormHeading>

        <Form onSubmit={handleSubmit}>
          <Textarea
            placeholder="Que pensez-vous de cet article ?"
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
            maxLength={1500}
          />

          <RatingContainer>
            <RatingLabel>Votre note</RatingLabel>

            <StarSelector>
              {[1, 2, 3, 4, 5].map((value) => (
                <StarButton
                  key={value}
                  type="button"
                  aria-label={`Donner ${value} étoile${value > 1 ? "s" : ""}`}
                  aria-pressed={note === value}
                  onClick={() => setNote(value)}
                  onMouseEnter={() => setHover(value)}
                  onMouseLeave={() => setHover(0)}
                >
                  <FiStar
                    size={25}
                    fill={
                      value <= (hover || note) ? "currentColor" : "transparent"
                    }
                  />
                </StarButton>
              ))}
            </StarSelector>
          </RatingContainer>

          {alert && <AlertMessage $success={success}>{alert}</AlertMessage>}

          <FormFooter>
            <span style={{ color: "#a39c92", fontSize: "0.72rem" }}>
              {texte.length}/1500 caractères
            </span>

            <Button type="submit" disabled={loading}>
              {loading ? "Publication..." : "Publier mon avis"}
              {!loading && <FiSend size={15} />}
            </Button>
          </FormFooter>
        </Form>
      </FormContainer>
    </Wrapper>
  );
}

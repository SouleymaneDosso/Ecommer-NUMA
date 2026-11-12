
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock } from "react-icons/fi";

// ===== STYLES =====

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0;
  padding: 0;
  display: flex;
  background: #f8f6f0;
  font-family: "Inter", sans-serif;
  overflow-x: hidden;
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }
`;

const FormWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0;
  padding: 55px clamp(22px, 8vw, 120px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background:
    radial-gradient(
      circle at 90% 10%,
      rgba(190, 165, 112, 0.10),
      transparent 30%
    ),
    #f8f6f0;

  @media (max-width: 600px) {
    padding: 35px 22px;
  }
`;

const Brand = styled.div`
  text-align: center;
  margin-bottom: 42px;

  h2 {
    margin: 0;
    color: #173d32;
    font-family: Georgia, serif;
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 500;
    letter-spacing: 9px;
  }

  span {
    display: block;
    margin-top: 10px;
    color: #a58a56;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 4px;
  }

  @media (max-width: 600px) {
    margin-bottom: 32px;

    h2 {
      font-size: 2.5rem;
    }
  }
`;

const FormContent = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
`;

const Eyebrow = styled.p`
  margin: 0 0 12px;
  text-align: center;
  color: #a58a56;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 0 0 12px;
  text-align: center;
  color: #173d32;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2rem, 4vw, 2.7rem);
  font-weight: 400;
  letter-spacing: -0.8px;
`;

const Subtitle = styled.p`
  margin: 0 0 35px;
  text-align: center;
  color: #85857c;
  font-size: 0.9rem;
  line-height: 1.7;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 18px;

  label {
    display: block;
    margin-bottom: 9px;
    color: #3d5047;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .field-icon {
    position: absolute;
    left: 17px;
    bottom: 17px;
    color: #a58a56;
    font-size: 1.05rem;
    pointer-events: none;
  }
`;

const Input = styled.input`
  display: block;
  width: 100%;
  height: 54px;
  padding: 0 48px;
  border: 1px solid #e6e1d5;
  border-radius: 7px;
  outline: none;
  background: #fffefa;
  color: #173d32;
  font-family: inherit;
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;

  &::placeholder {
    color: #b5b3aa;
  }

  &:hover {
    border-color: #c9b991;
  }

  &:focus {
    border-color: #a58a56;
    box-shadow: 0 0 0 3px rgba(165, 138, 86, 0.10);
  }
`;

const EyeButton = styled.button`
  position: absolute;
  right: 15px;
  bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  border: none;
  background: transparent;
  color: #85857c;
  cursor: pointer;
  font-size: 1.1rem;
  transition: color 0.2s ease;

  &:hover {
    color: #173d32;
  }
`;

const Button = styled.button`
  width: 100%;
  min-height: 56px;
  margin-top: 12px;
  border: 1px solid #173d32;
  border-radius: 6px;
  background: #173d32;
  color: #fff;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #245445;
    border-color: #245445;
    box-shadow: 0 8px 20px rgba(23, 61, 50, 0.15);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  padding: 13px 15px;
  margin: 0 0 22px;
  border: 1px solid
    ${(props) => (props.error ? "#e8caca" : "#c8dfd1")};
  border-radius: 6px;
  background: ${(props) => (props.error ? "#fff4f2" : "#f0f8f2")};
  color: ${(props) => (props.error ? "#b33c32" : "#28734a")};
  text-align: center;
  font-size: 0.85rem;
  line-height: 1.5;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 30px 0 22px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e8e2d6;
  }

  span {
    color: #b0a58e;
    font-size: 0.65rem;
    letter-spacing: 2px;
  }
`;

const SwitchLink = styled.p`
  margin: 0;
  text-align: center;
  color: #88877f;
  font-size: 0.86rem;

  a {
    margin-left: 5px;
    color: #173d32;
    font-weight: 700;
    text-decoration: none;
    border-bottom: 1px solid #b49a67;
    padding-bottom: 2px;
    transition: color 0.2s ease;

    &:hover {
      color: #a58a56;
    }
  }
`;

const Footer = styled.p`
  margin: 42px 0 0;
  text-align: center;
  color: #aaa69a;
  font-size: 0.65rem;
  letter-spacing: 1.5px;
`;

// ===== COMPOSANT =====

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [paddingTop, setPaddingTop] = useState("10vh");

  const wrapperRef = useRef(null);

  // Gestion animation clavier mobile
  useEffect(() => {
    let initialHeight = window.innerHeight;

    const handleResize = () => {
      const currentHeight = window.innerHeight;

      if (currentHeight < initialHeight - 100) {
        // clavier ouvert
        setPaddingTop("5vh");
      } else {
        // clavier fermé
        setPaddingTop("10vh");
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      localStorage.setItem("token", data.token);
      navigate("/compte");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <FormWrapper
        ref={wrapperRef}
        style={{ paddingTop }}
      >
        <FormContent>
          <Brand>
            <h2>NUMA</h2>
            <span>ÉLÉGANCE & AUTHENTICITÉ</span>
          </Brand>

          <Eyebrow>Bienvenue chez NUMA</Eyebrow>

          <Title>Créer un compte</Title>

          <Subtitle>
            Rejoignez notre univers et découvrez une expérience
            pensée pour vous.
          </Subtitle>

          {message && (
            <Message error={message.toLowerCase().includes("erreur")}>
              {message}
            </Message>
          )}

          <form onSubmit={handleSignup}>
            <InputWrapper>
              <label htmlFor="signup-username">Identifiant</label>
              <FiUser className="field-icon" />
              <Input
                id="signup-username"
                type="text"
                placeholder="Votre identifiant"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </InputWrapper>

            <InputWrapper>
              <label htmlFor="signup-email">Adresse email</label>
              <FiMail className="field-icon" />
              <Input
                id="signup-email"
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </InputWrapper>

            <InputWrapper>
              <label htmlFor="signup-password">Mot de passe</label>
              <FiLock className="field-icon" />
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Choisissez un mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />

              <EyeButton
                type="button"
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </EyeButton>
            </InputWrapper>

            <Button type="submit" disabled={loading}>
              {loading ? "Création en cours..." : "Créer mon compte"}
            </Button>
          </form>

          <Divider>
            <span>OU</span>
          </Divider>

          <SwitchLink>
            Déjà membre ?
            <Link to="/login">Se connecter</Link>
          </SwitchLink>

          <Footer>
            NUMA — ÉLÉGANCE AU QUOTIDIEN
          </Footer>
        </FormContent>
      </FormWrapper>
    </PageWrapper>
  );
}

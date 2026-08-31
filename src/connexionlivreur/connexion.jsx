import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function ConnexionLivreur() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const connexion = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/livreurs/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password, 
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Connexion échouée:", data.message);

        alert(data.message || "La connexion a échoué.");

        return;
      }
      alert("Connexion réussie !");
       localStorage.setItem("tokenLivreur", data.token);
       navigate("/livreur/dashboard");

    } catch (error) {
      console.error("Erreur :", error);
      alert("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <BackgroundGlow className="glow-one" />
      <BackgroundGlow className="glow-two" />

      <LoginCard>

        {/* ================= BRAND ================= */}

        <Brand>
          <Logo>
            <span>🚚</span>
          </Logo>

          <BrandText>
            <BrandName>
              DELIV<span>+</span>
            </BrandName>

            <BrandSubtitle>
              ESPACE LIVREUR
            </BrandSubtitle>
          </BrandText>
        </Brand>

        {/* ================= HEADER ================= */}

        <Header>
          <Badge>
            <BadgeDot />
            ESPACE LIVREUR
          </Badge>

          <Title>
            Bon retour
            <GradientText> !</GradientText>
          </Title>

          <Description>
            Connectez-vous à votre espace pour gérer vos
            livraisons et suivre votre activité.
          </Description>
        </Header>

        {/* ================= FORM ================= */}

        <Form onSubmit={connexion}>

          <InputGroup>
            <Label htmlFor="username">
              Nom d'utilisateur
            </Label>

            <InputWrapper>
              <InputIcon>
                👤
              </InputIcon>

              <Input
                id="username"
                type="text"
                placeholder="Votre nom d'utilisateur"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
              />
            </InputWrapper>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">
              Mot de passe
            </Label>

            <InputWrapper>
              <InputIcon>
                🔒
              </InputIcon>

              <Input
                id="password"
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </InputWrapper>
          </InputGroup>

          <ForgotPassword>
            Mot de passe oublié ?
          </ForgotPassword>

          <SubmitButton
            type="submit"
            disabled={loading}
          >
            <ButtonContent>

              {loading ? (
                <>
                  <Spinner />
                  Connexion...
                </>
              ) : (
                <>
                  Se connecter
                  <Arrow>→</Arrow>
                </>
              )}

            </ButtonContent>
          </SubmitButton>

        </Form>

        {/* ================= REGISTER ================= */}

        <RegisterSection>

          <RegisterText>
            Vous n'avez pas encore de compte ?
          </RegisterText>

          <RegisterButton
            type="button"
            onClick={() =>
              navigate("/inscription-livreur")
            }
          >
            Créer un compte
          </RegisterButton>

        </RegisterSection>

        {/* ================= SECURITY ================= */}

        <Security>
          <SecurityIcon>
            🔐
          </SecurityIcon>

          <span>
            Connexion sécurisée
          </span>
        </Security>

      </LoginCard>
    </PageContainer>
  );
}

/* =====================================================
   PAGE
===================================================== */

const PageContainer = styled.main`
  min-height: 100vh;
  width: 100%;

  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 30px 20px;

  box-sizing: border-box;

  background:
    radial-gradient(
      circle at 15% 20%,
      rgba(255, 179, 0, 0.13),
      transparent 30%
    ),
    radial-gradient(
      circle at 85% 80%,
      rgba(255, 107, 0, 0.12),
      transparent 30%
    ),
    #080a0f;

  color: white;

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
`;

/* =====================================================
   BACKGROUND
===================================================== */

const BackgroundGlow = styled.div`
  position: absolute;

  width: 500px;
  height: 500px;

  border-radius: 50%;

  filter: blur(110px);

  opacity: 0.15;

  pointer-events: none;

  &.glow-one {
    top: -280px;
    left: -200px;

    background: #ffb300;
  }

  &.glow-two {
    right: -220px;
    bottom: -280px;

    background: #ff6b00;
  }
`;

/* =====================================================
   CARD
===================================================== */

const LoginCard = styled.section`
  width: 100%;
  max-width: 500px;

  position: relative;
  z-index: 2;

  padding: 42px;

  box-sizing: border-box;

  border-radius: 28px;

  border: 1px solid rgba(255, 255, 255, 0.08);

  background: rgba(18, 21, 29, 0.84);

  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);

  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  animation: appear 0.6s ease;

  @keyframes appear {
    from {
      opacity: 0;
      transform: translateY(25px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 600px) {
    padding: 32px 22px;

    border-radius: 22px;
  }
`;

/* =====================================================
   BRAND
===================================================== */

const Brand = styled.div`
  display: flex;
  align-items: center;

  gap: 12px;

  margin-bottom: 40px;
`;

const Logo = styled.div`
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;

  background:
    linear-gradient(
      135deg,
      #ffbd2e,
      #ff7600
    );

  box-shadow:
    0 10px 30px rgba(255, 145, 0, 0.25);

  font-size: 22px;
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
`;

const BrandName = styled.div`
  font-size: 20px;

  font-weight: 900;

  letter-spacing: 1px;

  span {
    color: #ffad19;
  }
`;

const BrandSubtitle = styled.div`
  margin-top: 2px;

  color: #707784;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 2px;
`;

/* =====================================================
   HEADER
===================================================== */

const Header = styled.header`
  margin-bottom: 32px;
`;

const Badge = styled.div`
  width: fit-content;

  display: flex;
  align-items: center;

  gap: 8px;

  margin-bottom: 15px;

  padding: 7px 11px;

  border-radius: 50px;

  border: 1px solid rgba(255, 179, 0, 0.18);

  background: rgba(255, 179, 0, 0.07);

  color: #ffb51b;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: 1.2px;
`;

const BadgeDot = styled.span`
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: #ffb51b;

  box-shadow:
    0 0 10px #ffb51b;
`;

const Title = styled.h2`
  margin: 0;

  color: white;

  font-size: clamp(35px, 7vw, 46px);

  line-height: 1.05;

  font-weight: 850;

  letter-spacing: -1.8px;
`;

const GradientText = styled.span`
  background:
    linear-gradient(
      90deg,
      #ffd15a,
      #ff8500
    );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Description = styled.p`
  max-width: 420px;

  margin: 15px 0 0;

  color: #858b98;

  font-size: 14px;

  line-height: 1.65;
`;

/* =====================================================
   FORM
===================================================== */

const Form = styled.form`
  display: flex;

  flex-direction: column;
  

  gap: 19px;
`;

const InputGroup = styled.div`
  display: flex;

  flex-direction: column;

  gap: 8px;
`;

const Label = styled.label`
  color: #b9bec8;

  font-size: 12px;

  font-weight: 650;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.span`
  position: absolute;

  left: 15px;
  top: 50%;

  transform: translateY(-50%);

  font-size: 15px;

  opacity: 0.6;

  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  height: 53px;

  box-sizing: border-box;

  padding:
    0
    15px
    0
    44px;

  border-radius: 13px;

  border: 1px solid
    rgba(255, 255, 255, 0.08);

  outline: none;

  background:
    rgba(255, 255, 255, 0.035);

  color: white;

  font-size: 16px;

  transition:
    0.25s ease;

  &::placeholder {
    color: #555b67;
  }

  &:hover {
    background:
      rgba(255, 255, 255, 0.05);
  }

  &:focus {
    border-color:
      rgba(255, 176, 24, 0.65);

    background:
      rgba(255, 176, 24, 0.035);

    box-shadow:
      0 0 0 3px
        rgba(255, 176, 24, 0.08),
      0 8px 25px
        rgba(0, 0, 0, 0.12);

    transform:
      translateY(-1px);
  }
`;

/* =====================================================
   FORGOT PASSWORD
===================================================== */

const ForgotPassword = styled.button`
  align-self: flex-end;

  margin-top: -7px;

  padding: 0;

  border: none;

  background: transparent;

  color: #8b919c;

  font-size: 11px;

  cursor: pointer;

  transition: 0.2s;

  &:hover {
    color: #ffb21c;
  }
`;

/* =====================================================
   BUTTON
===================================================== */

const SubmitButton = styled.button`
  width: 100%;
  height: 55px;

  margin-top: 4px;

  border: none;

  border-radius: 14px;

  background:
    linear-gradient(
      135deg,
      #ffc43d,
      #ff9d00,
      #ff7200
    );

  color: #111;

  font-size: 14px;

  font-weight: 850;

  cursor: pointer;

  box-shadow:
    0 12px 30px
      rgba(255, 145, 0, 0.2);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    filter 0.25s ease;

  &:hover:not(:disabled) {
    transform:
      translateY(-2px);

    filter:
      brightness(1.08);

    box-shadow:
      0 16px 38px
        rgba(255, 145, 0, 0.3);
  }

  &:active:not(:disabled) {
    transform:
      translateY(0);
  }

  &:disabled {
    opacity: 0.7;

    cursor: not-allowed;
  }
`;

const ButtonContent = styled.span`
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;
`;

const Arrow = styled.span`
  font-size: 20px;

  line-height: 0;

  transition: 0.25s;

  ${SubmitButton}:hover & {
    transform:
      translateX(4px);
  }
`;

const Spinner = styled.span`
  width: 16px;
  height: 16px;

  border: 2px solid
    rgba(0, 0, 0, 0.25);

  border-top-color: #111;

  border-radius: 50%;

  animation:
    spin 0.7s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

/* =====================================================
   REGISTER
===================================================== */

const RegisterSection = styled.div`
  display: flex;

  justify-content: center;

  align-items: center;

  gap: 6px;

  margin-top: 25px;

  @media (max-width: 450px) {
    flex-direction: column;

    gap: 5px;
  }
`;

const RegisterText = styled.span`
  color: #666c78;

  font-size: 12px;
`;

const RegisterButton = styled.button`
  padding: 0;

  border: none;

  background: transparent;

  color: #ffb21c;

  font-size: 12px;

  font-weight: 750;

  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

/* =====================================================
   SECURITY
===================================================== */

const Security = styled.div`
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  margin-top: 27px;

  padding-top: 20px;

  border-top:
    1px solid
    rgba(255, 255, 255, 0.06);

  color: #555b67;

  font-size: 10px;
`;

const SecurityIcon = styled.span`
  font-size: 12px;
`;

export default ConnexionLivreur;

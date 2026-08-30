
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function InscriptionLivreur() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telephone, setTelephone] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/livreurs/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
            password,
            telephone,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert('Inscription réussie !');
      } else {
        console.error('Inscription échouée:', data.message);
        alert(data.message || "L'inscription a échoué.");
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      alert("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <BackgroundGlow className="glow-one" />
      <BackgroundGlow className="glow-two" />

      <RegisterCard>
        <Brand>
          <Logo>
            <span>🚚</span>
          </Logo>

          <BrandText>
            <BrandName>DELIV<span>+</span></BrandName>
            <BrandSubtitle>ESPACE LIVREUR</BrandSubtitle>
          </BrandText>
        </Brand>

        <Header>
          <Badge>
            <BadgeDot />
            REJOIGNEZ-NOUS
          </Badge>

          <Title>
            Devenez
            <GradientText> livreur</GradientText>
          </Title>

          <Description>
            Créez votre compte et commencez à livrer dès aujourd'hui.
          </Description>
        </Header>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="username">Nom d'utilisateur</Label>

            <InputWrapper>
              <InputIcon>👤</InputIcon>

              <Input
                type="text"
                id="username"
                placeholder="Votre nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </InputWrapper>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="email">Adresse email</Label>

            <InputWrapper>
              <InputIcon>✉</InputIcon>

              <Input
                type="email"
                id="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputWrapper>
          </InputGroup>

          <InputRow>
            <InputGroup>
              <Label htmlFor="password">Mot de passe</Label>

              <InputWrapper>
                <InputIcon>🔒</InputIcon>

                <Input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label htmlFor="telephone">Téléphone</Label>

              <InputWrapper>
                <InputIcon>📱</InputIcon>

                <Input
                  type="tel"
                  id="telephone"
                  placeholder="+225 07..."
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  required
                />
              </InputWrapper>
            </InputGroup>
          </InputRow>

          <Terms>
            <CheckBox
              type="checkbox"
              id="terms"
              required
            />

            <TermsText htmlFor="terms">
              J'accepte les conditions d'utilisation et la politique
              de confidentialité.
            </TermsText>
          </Terms>

          <SubmitButton type="submit" disabled={loading}>
            <ButtonContent>
              {loading ? (
                <>
                  <Spinner />
                  Création du compte...
                </>
              ) : (
                <>
                  Créer mon compte
                  <Arrow>→</Arrow>
                </>
              )}
            </ButtonContent>
          </SubmitButton>
        </Form>

        <Footer>
          <FooterText>
            Vous avez déjà un compte ?
          </FooterText>

          <LoginButton
            type="button"
          >
            Se connecter
          </LoginButton>
        </Footer>

        <Security>
          <SecurityIcon>🔐</SecurityIcon>
          <span>Vos données sont protégées et sécurisées</span>
        </Security>
      </RegisterCard>
    </PageContainer>
  );
}

/* =========================
   PAGE
========================= */

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 40px 20px;

  background:
    radial-gradient(
      circle at 15% 20%,
      rgba(255, 179, 0, 0.12),
      transparent 30%
    ),
    radial-gradient(
      circle at 85% 80%,
      rgba(255, 107, 0, 0.12),
      transparent 30%
    ),
    #080a0f;

  color: #fff;

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
`;

const BackgroundGlow = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;

  border-radius: 50%;

  filter: blur(100px);
  opacity: 0.16;

  pointer-events: none;

  &.glow-one {
    top: -250px;
    left: -200px;
    background: #ffb300;
  }

  &.glow-two {
    bottom: -250px;
    right: -200px;
    background: #ff6b00;
  }
`;

/* =========================
   CARD
========================= */

const RegisterCard = styled.div`
  position: relative;
  z-index: 2;

  width: 100%;
  max-width: 600px;

  padding: 42px;

  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 28px;

  background: rgba(18, 21, 29, 0.82);

  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);

  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  animation: cardAppear 0.6s ease forwards;

  @keyframes cardAppear {
    from {
      opacity: 0;
      transform: translateY(25px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 650px) {
    padding: 30px 22px;
    border-radius: 22px;
  }
`;

/* =========================
   BRAND
========================= */

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  margin-bottom: 38px;
`;

const Logo = styled.div`
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;

  background: linear-gradient(
    135deg,
    #ffbd2e,
    #ff7a00
  );

  box-shadow:
    0 8px 25px rgba(255, 145, 0, 0.25);

  font-size: 23px;
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

  color: #737987;

  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
`;

/* =========================
   HEADER
========================= */

const Header = styled.div`
  margin-bottom: 32px;
`;

const Badge = styled.div`
  width: fit-content;

  display: flex;
  align-items: center;
  gap: 8px;

  margin-bottom: 14px;
  padding: 7px 11px;

  border: 1px solid rgba(255, 179, 0, 0.18);
  border-radius: 50px;

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

  box-shadow: 0 0 10px #ffb51b;
`;

const Title = styled.h2`
  margin: 0;

  color: #fff;

  font-size: clamp(34px, 6vw, 46px);
  line-height: 1.05;
  font-weight: 850;
  letter-spacing: -1.8px;
`;

const GradientText = styled.span`
  background: linear-gradient(
    90deg,
    #ffd15a,
    #ff8a00
  );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Description = styled.p`
  max-width: 450px;

  margin: 15px 0 0;

  color: #858b98;

  font-size: 14px;
  line-height: 1.6;
`;

/* =========================
   FORM
========================= */

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 19px;
`;

const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;

  @media (max-width: 550px) {
    grid-template-columns: 1fr;
  }
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

  opacity: 0.65;

  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  height: 52px;

  box-sizing: border-box;

  padding: 0 15px 0 44px;

  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 13px;

  outline: none;

  background: rgba(255, 255, 255, 0.035);

  color: #fff;

  font-size: 13px;

  transition:
    border-color 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;

  &::placeholder {
    color: #555b67;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &:focus {
    border-color: rgba(255, 176, 24, 0.65);

    background: rgba(255, 176, 24, 0.035);

    box-shadow:
      0 0 0 3px rgba(255, 176, 24, 0.08),
      0 8px 25px rgba(0, 0, 0, 0.12);

    transform: translateY(-1px);
  }
`;

/* =========================
   TERMS
========================= */

const Terms = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;

  margin-top: 2px;
`;

const CheckBox = styled.input`
  width: 16px;
  height: 16px;

  margin-top: 1px;

  accent-color: #ffad19;

  cursor: pointer;
`;

const TermsText = styled.label`
  color: #777d89;

  font-size: 11px;
  line-height: 1.5;

  cursor: pointer;
`;

/* =========================
   BUTTON
========================= */

const SubmitButton = styled.button`
  width: 100%;
  height: 55px;

  margin-top: 4px;

  border: none;
  border-radius: 14px;

  background: linear-gradient(
    135deg,
    #ffc43d 0%,
    #ff9d00 50%,
    #ff7200 100%
  );

  color: #111;

  font-size: 14px;
  font-weight: 850;

  cursor: pointer;

  box-shadow:
    0 12px 30px rgba(255, 145, 0, 0.2);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    filter 0.25s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);

    filter: brightness(1.08);

    box-shadow:
      0 16px 38px rgba(255, 145, 0, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
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

  transition: transform 0.25s ease;

  ${SubmitButton}:hover & {
    transform: translateX(4px);
  }
`;

const Spinner = styled.span`
  width: 16px;
  height: 16px;

  border: 2px solid rgba(0, 0, 0, 0.25);
  border-top-color: #111;

  border-radius: 50%;

  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

/* =========================
   FOOTER
========================= */

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;

  margin-top: 25px;

  @media (max-width: 450px) {
    flex-direction: column;
    gap: 4px;
  }
`;

const FooterText = styled.span`
  color: #666c78;
  font-size: 12px;
`;

const LoginButton = styled.button`
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

/* =========================
   SECURITY
========================= */

const Security = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 7px;

  margin-top: 27px;
  padding-top: 20px;

  border-top: 1px solid rgba(255, 255, 255, 0.06);

  color: #555b67;

  font-size: 10px;
`;

const SecurityIcon = styled.span`
  font-size: 12px;
`;

export default InscriptionLivreur;


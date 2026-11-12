
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { FiEye, FiEyeOff } from "react-icons/fi";

// =====================================================
// DESIGN NUMA — CONNEXION PREMIUM
// =====================================================

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background:
    radial-gradient(circle at top left, rgba(190, 160, 100, 0.12), transparent 35%),
    #f8f6f1;
`;

const FormWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 60px 8%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #fff;
  border: none;
  border-radius: 0;
  box-shadow: none;
`;

const Brand = styled.div`
  text-align: center;
  margin-bottom: 35px;
`;

const BrandName = styled.div`
  color: #173f35;
  font-family: Georgia, serif;
  font-size: 35px;
  font-weight: 700;
  letter-spacing: 7px;
`;

const BrandLine = styled.div`
  width: 42px;
  height: 2px;
  margin: 13px auto;
  background: #bd9b65;
`;

const BrandCaption = styled.span`
  color: #9a896f;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 3px;
`;

const Title = styled.h1`
  margin: 0;
  color: #172c25;
  text-align: center;
  font-family: Georgia, serif;
  font-size: 29px;
  font-weight: 600;
`;

const Subtitle = styled.p`
  margin: 12px 0 30px;
  color: #858b85;
  text-align: center;
  font-size: 13px;
  line-height: 1.7;
`;

const Message = styled.div`
  padding: 13px 15px;
  margin-bottom: 20px;
  border-radius: 10px;
  background: ${(props) => props.error ? "#fff1ef" : "#edf6f0"};
  border: 1px solid ${(props) => props.error ? "#f3d0ca" : "#d5e8da"};
  color: ${(props) => props.error ? "#b64035" : "#246644"};
  font-size: 13px;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

const FieldLabel = styled.label`
  color: #394b41;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.4px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  height: 54px;
  padding: 0 48px 0 16px;
  border: 1px solid #e6e5df;
  border-radius: 11px;
  outline: none;
  background: #fbfaf7;
  color: #243a30;
  font-family: inherit;
  font-size: 16px;
  transition: all 0.2s ease;

  &::placeholder {
    color: #a9aaa4;
  }

  &:hover {
    border-color: #c7b18d;
  }

  &:focus {
    background: #fff;
    border-color: #173f35;
    box-shadow: 0 0 0 3px rgba(23, 63, 53, 0.08);
  }
`;

const EyeButton = styled.button`
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: none;
  background: transparent;
  color: #858b85;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #173f35;
  }
`;

const Button = styled.button`
  width: 100%;
  min-height: 55px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: none;
  border-radius: 11px;
  background: #173f35;
  color: #fff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.7px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover:not(:disabled) {
    background: #245b4c;
    box-shadow: 0 9px 22px rgba(23, 63, 53, 0.17);
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const SwitchLink = styled.div`
  margin-top: 27px;
  padding-top: 22px;
  border-top: 1px solid #efeee9;
  text-align: center;
  color: #898e88;
  font-size: 12px;
  line-height: 2.2;

  a {
    color: #173f35;
    font-weight: 700;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #bd9b65;
      text-decoration: underline;
    }
  }
`;

const FooterText = styled.p`
  margin: 28px 0 0;
  color: #aaa69d;
  text-align: center;
  font-size: 10px;
  letter-spacing: 1.5px;
`;

// =====================================================
// COMPOSANT — LOGIQUE CONSERVÉE
// =====================================================

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [attempts, setAttempts] = useState(0);
  const MAX_ATTEMPTS = 3;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= MAX_ATTEMPTS) {
          navigate(`/forgot`);
          return;
        }

        throw new Error(
          `${data.message || "Mot de passe incorrect"} (Tentative ${newAttempts}/${MAX_ATTEMPTS})`
        );
      }

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
      <FormWrapper>
        <Brand>
          <BrandName>NUMA</BrandName>
          <BrandLine />
          <BrandCaption>ÉLÉGANCE & AUTHENTICITÉ</BrandCaption>
        </Brand>

        <Title>Bienvenue</Title>

        <Subtitle>
          Connectez-vous à votre espace personnel
          et retrouvez votre univers NUMA.
        </Subtitle>

        {message && (
          <Message
            error={
              message.toLowerCase().includes("erreur") ||
              message.toLowerCase().includes("incorrect")
            }
          >
            {message}
          </Message>
        )}

        <Form onSubmit={handleLogin}>
          <FieldGroup>
            <FieldLabel htmlFor="username">IDENTIFIANT</FieldLabel>

            <InputWrapper>
              <Input
                id="username"
                type="text"
                placeholder="Votre identifiant"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </InputWrapper>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="password">MOT DE PASSE</FieldLabel>

            <InputWrapper>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />

              <EyeButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </EyeButton>
            </InputWrapper>
          </FieldGroup>

          <Button type="submit" disabled={loading}>
            {loading ? "Connexion en cours..." : "SE CONNECTER"}
          </Button>
        </Form>

        <SwitchLink>
          Nouveau chez NUMA ? <Link to="/signup">Créer un compte</Link>
          <br />
          <Link to="/forgot">Mot de passe oublié ?</Link>
        </SwitchLink>

        <FooterText>
          L'EXPÉRIENCE NUMA
        </FooterText>
      </FormWrapper>
    </PageWrapper>
  );
}

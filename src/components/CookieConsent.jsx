import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

// --- Animations ---
const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// --- Styles ---
const ModalWrapper = styled.div`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  width: 90%;
  max-width: 400px;
  padding: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 15px;
  animation: ${slideUp} 0.4s ease-out;
`;

const Text = styled.p`
  color: #333;
  font-size: 14px;
  line-height: 1.4;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  border: ${({ variant }) => (variant === "primary" ? "none" : "1px solid #ccc")};
  background: ${({ variant }) => (variant === "primary" ? "#007bff" : "#fff")};
  color: ${({ variant }) => (variant === "primary" ? "#fff" : "#333")};
  transition: all 0.2s;

  &:hover {
    background: ${({ variant }) => (variant === "primary" ? "#0056b3" : "#f0f0f0")};
  }
`;

const Preferences = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PreferenceRow = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;

  input {
    cursor: pointer;
  }
`;

// --- Fonctions cookies ---
const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
};

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

// --- Composant ---
export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = getCookie("cookieConsent");
    if (!consent) setShow(true);
    else {
      try {
        const parsed = JSON.parse(consent);
        setPreferences(parsed);
      } catch {
        setShow(true);
      }
    }
  }, []);

  const savePreferences = (prefs) => {
    setCookie("cookieConsent", JSON.stringify(prefs), 365);
    setPreferences(prefs);
    setShow(false);
    setSettingsOpen(false);
    // Ici tu peux activer/désactiver analytics ou marketing
  };

  const handleAcceptAll = () => savePreferences({ essential: true, analytics: true, marketing: true });
  const handleRefuseAll = () => savePreferences({ essential: true, analytics: false, marketing: false });

  if (!show) return null;

  return (
    <ModalWrapper>
      {!settingsOpen ? (
        <>
          <Text>
            Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez accepter tout ou gérer vos préférences.
          </Text>
          <ButtonGroup>
            <Button onClick={handleRefuseAll}>Refuser tout</Button>
            <Button variant="primary" onClick={handleAcceptAll}>Accepter tout</Button>
            <Button onClick={() => setSettingsOpen(true)}>Paramètres</Button>
          </ButtonGroup>
        </>
      ) : (
        <>
          <Text>Choisissez vos préférences :</Text>
          <Preferences>
            <PreferenceRow>
              Essentiels (toujours actifs)
              <input type="checkbox" checked disabled />
            </PreferenceRow>
            <PreferenceRow>
              Analytics
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences((prev) => ({ ...prev, analytics: e.target.checked }))}
              />
            </PreferenceRow>
            <PreferenceRow>
              Marketing
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) => setPreferences((prev) => ({ ...prev, marketing: e.target.checked }))}
              />
            </PreferenceRow>
          </Preferences>
          <ButtonGroup>
            <Button onClick={() => setSettingsOpen(false)}>Annuler</Button>
            <Button variant="primary" onClick={() => savePreferences(preferences)}>Sauvegarder</Button>
          </ButtonGroup>
        </>
      )}
    </ModalWrapper>
  );
}

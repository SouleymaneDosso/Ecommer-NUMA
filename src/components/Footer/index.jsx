import { useState, useContext, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  FiFacebook,
  FiInstagram,
  FiChevronDown,
  FiSend,
  FiX,
  FiArrowUp,
} from "react-icons/fi";
import { ThemeContext } from "../../Utils/Context";
import { useTranslation } from "react-i18next";

/* --- Animations --- */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;
const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;
const glow = keyframes`
  0% { box-shadow: 0 0 0px rgba(0,0,0,0); }
  50% { box-shadow: 0 0 12px rgba(0,0,0,0.6); }
  100% { box-shadow: 0 0 0px rgba(0,0,0,0); }
`;
const popIn = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;
const slideUpFade = keyframes`
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
`;

/* --- Styled Components --- */
const FooterWrapper = styled.footer`
  background: ${({ $isdark }) => ($isdark ? "#000" : "#f4f4f4")};
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#000")};
  padding: 3rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  transition:
    background 0.35s ease,
    color 0.35s ease;
`;

const NewsletterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  text-align: center;
`;

const NewsletterTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  max-width: 450px;
  width: 100%;
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid ${({ $isdark }) => ($isdark ? "#222" : "#ccc")};
  background: ${({ $isdark }) => ($isdark ? "#111" : "#fff")};
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#000")};
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #000;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
  }
`;

const NameInput = styled(EmailInput)``;

const SubmitButton = styled.button`
  padding: 0 16px;
  border-radius: 8px;
  background: #000;
  color: #fff;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 14px;
  &:hover {
    background: #333;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  svg {
    margin-left: 6px;
    font-size: 18px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  opacity: 0;
  animation: ${({ $visible }) => ($visible ? fadeIn : "none")} 0.6s ease
    forwards;
`;

const TitleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  font-size: 1.1rem;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  gap: 6px;
`;

const LinksContainer = styled.div`
  max-height: ${({ $open }) => ($open ? "500px" : "0")};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: max-height 0.4s ease;
`;

const FooterLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition:
    color 0.25s ease,
    transform 0.25s ease,
    box-shadow 0.3s ease;
  &:hover {
    color: ${({ $isdark }) => ($isdark ? "#aaa" : "#333")};
    transform: translateX(4px);
    animation: ${glow} 0.8s ease;
  }
`;

const IconWrapper = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: ${({ $isdark }) => ($isdark ? "#111" : "#e5e7eb")};
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#000")};
  transition: all 0.35s ease;
  font-size: 18px;
  &:hover {
    animation:
      ${bounce} 0.5s,
      ${glow} 0.8s;
    background: ${({ $isdark }) => ($isdark ? "#333" : "#ccc")};
    color: white;
  }
`;

const FooterExtras = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-top: 1px solid ${({ $isdark }) => ($isdark ? "#111" : "#d1d5db")};
  padding-top: 1.5rem;
  align-items: center;
`;

const CookieButton = styled.button`
  background: none;
  border: 1px solid ${({ $isdark }) => "#000"};
  color: ${({ $isdark }) => "#fff"};
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  width: fit-content;
  font-weight: 500;
  transition: all 0.25s ease;
  &:hover {
    background: #000;
    color: #16317aff;
  }
`;

const BottomText = styled.div`
  text-align: center;
  font-size: 0.85rem;
  color: ${({ $isdark }) => ($isdark ? "#aaa" : "#555")};
  transition: color 0.35s ease;
`;

const ScrollTopButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #000;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  font-size: 24px;
  display: ${({ $visible }) => ($visible ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  &:hover {
    background: #333;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: ${({ $visible }) => ($visible ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: #fff;
  color: #000;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  position: relative;
  text-align: center;
  animation: ${slideUpFade} 0.5s ease forwards;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CloseModal = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #000;
`;

const ModalTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const ConsentButton = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  &:hover {
    opacity: 0.85;
  }
`;

const AcceptButton = styled(ConsentButton)`
  background-color: #000;
  color: #fff;
`;

const RejectButton = styled(ConsentButton)`
  background-color: #e5e5e5;
  color: #000;
`;

const SuccessModal = styled(ModalOverlay)``;
const SuccessContent = styled(ModalContent)``;

export default function Footer() {
  const { theme } = useContext(ThemeContext);
  const $isdark = theme === "light";
  const { t } = useTranslation();

  const [openIndex, setOpenIndex] = useState(null);
  const [visible, setVisible] = useState([]);
  const sectionRefs = useRef([]);
  const [scrollVisible, setScrollVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [consent, setConsent] = useState(null);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split("; ").reduce((acc, cur) => {
      const [key, value] = cur.split("=");
      acc[key] = value;
      return acc;
    }, {});
    if (cookies.marketingConsent === undefined) setModalVisible(true);
    else setConsent(cookies.marketingConsent === "true");
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setVisible((prev) => [
              ...new Set([...prev, entry.target.dataset.index]),
            ]);
        });
      },
      { threshold: 0.1 }
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () =>
      setScrollVisible(window.scrollY > window.innerHeight);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleConsent = async (accepted) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/cookies/consent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ marketingConsent: accepted }),
      });

      document.cookie = `marketingConsent=${accepted}; path=/; max-age=${60 * 60 * 24 * 365}`;
      setConsent(accepted);
      setModalVisible(false);
    } catch (err) {
      console.error("Erreur consentement cookie:", err);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!consent)
      return setMessage(
        "Vous devez accepter de recevoir des emails marketing."
      );

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/newsletter`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name, marketingConsent: consent }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setNewsletterSuccess(true);
        setEmail("");
        setName("");
      } else setMessage(data.message || "Erreur lors de l'inscription");
    } catch (error) {
      console.error("Erreur newsletter:", error);
      setMessage("Erreur serveur ❌: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      title: t("about"),
      links: [
        { text: t("ourStory"), to: "/apropo" },
        { text: t("faq"), to: "/faq" },
        { text: t("contact"), to: "/contact" },
      ],
    },
    {
      title: t("services"),
      links: [
        { text: t("returnPolicy"), to: "/politiqueretour" },
        { text: t("shipping"), to: "/livraison" },
        { text: t("terms"), to: "/conditionUtilisation" },
      ],
    },
    {
      title: t("social"),
      links: [
        {
          text: "Facebook",
          href: "https://www.facebook.com",
          icon: <FiFacebook />,
        },
        {
          text: "Instagram",
          href: "https://www.instagram.com",
          icon: <FiInstagram />,
        },
      ],
    },
  ];

  return (
    <FooterWrapper $isdark={$isdark}>
      <NewsletterSection id="newsletterSection">
        <NewsletterTitle>Inscrivez-vous à notre newsletter</NewsletterTitle>
        <NewsletterForm onSubmit={handleNewsletterSubmit}>
          <NameInput
            type="text"
            placeholder="Votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            $isdark={$isdark}
          />
          <EmailInput
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            $isdark={$isdark}
            required
          />
          <SubmitButton type="submit" disabled={loading || !consent}>
            {loading ? "Envoi..." : "Envoyer"} <FiSend />
          </SubmitButton>
        </NewsletterForm>
        {message && (
          <p style={{ marginTop: "0.5rem", color: "white" }}>{message}</p>
        )}
      </NewsletterSection>

      {sections.map((sec, i) => (
        <Section
          key={i}
          $visible={visible.includes(i.toString())}
          ref={(el) => (sectionRefs.current[i] = el)}
          data-index={i}
        >
          <TitleButton onClick={() => setOpenIndex(openIndex === i ? null : i)}>
            {sec.title}{" "}
            <FiChevronDown
              style={{
                transform: openIndex === i ? "rotate(180deg)" : "rotate(0)",
              }}
            />
          </TitleButton>
          <LinksContainer $open={openIndex === i}>
            {sec.links.map((link, j) =>
              link.to ? (
                <FooterLink key={j} to={link.to} $isdark={$isdark}>
                  {link.text}
                </FooterLink>
              ) : (
                <IconWrapper key={j} href={link.href} $isdark={$isdark}>
                  {link.icon}
                </IconWrapper>
              )
            )}
          </LinksContainer>
        </Section>
      ))}

      <FooterExtras $isdark={$isdark}>
        <CookieButton $isdark={$isdark} onClick={() => setModalVisible(true)}>
          Gérer les cookies
        </CookieButton>
      </FooterExtras>

      <BottomText $isdark={$isdark}>
        &copy; {new Date().getFullYear()} NUMA. {t("fashion")}
      </BottomText>

      <ScrollTopButton
        $visible={scrollVisible}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <FiArrowUp />
      </ScrollTopButton>

      <ModalOverlay $visible={modalVisible}>
        <ModalContent>
          <CloseModal onClick={() => setModalVisible(false)}>
            <FiX />
          </CloseModal>
          <ModalTitle>Cookies et consentement</ModalTitle>
          <p>
            Nous utilisons des cookies pour améliorer votre expérience et
            envoyer des emails marketing. Vous pouvez accepter ou refuser.
          </p>
          <ButtonGroup>
            <AcceptButton onClick={() => handleConsent(true)}>
              Accepter
            </AcceptButton>
            <RejectButton onClick={() => handleConsent(false)}>
              Refuser
            </RejectButton>
          </ButtonGroup>
        </ModalContent>
      </ModalOverlay>

      <SuccessModal $visible={newsletterSuccess}>
        <SuccessContent>
          <CloseModal onClick={() => setNewsletterSuccess(false)}>
            <FiX />
          </CloseModal>
          <ModalTitle>Inscription réussie ✅</ModalTitle>
          <p>Merci ! Vous êtes maintenant inscrit à notre newsletter.</p>
        </SuccessContent>
      </SuccessModal>
    </FooterWrapper>
  );
}

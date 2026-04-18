import { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  FiArrowUp,
  FiSend,
  FiFacebook,
  FiInstagram,
  FiChevronDown,
} from "react-icons/fi";
import { ThemeContext } from "../../Utils/Context";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_URL;

/* ---------------- Animations ---------------- */
const fadeIn = keyframes`
  from { opacity: 0; } to { opacity: 1; }
`;

const scaleIn = keyframes`
  from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; }
`;

/* ---------------- Styled Components ---------------- */
const FooterWrapper = styled.footer`
  background: ${({ $isdark }) => ($isdark ? "#000" : "#fff")};
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
  border-radius: 0;
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

const SubmitButton = styled.button`
  padding: 0 16px;
  border-radius: 0;
  background: #000;
  color: #fff;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.3s ease;
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

const Spinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #000;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 0.6s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ConfirmationText = styled.span`
  color: green;
  font-weight: 600;
  margin-left: 10px;
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
  max-height: ${({ $open }) => ($open ? "1000px" : "0")};
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
    transform 0.25s ease;
  &:hover {
    transform: translateX(4px);
  }
`;

const IconWrapper = styled.a.attrs({
  target: "_blank",
  rel: "noopener noreferrer",
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: ${({ $isdark }) => ($isdark ? "#111" : "#f0f0f0")};
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#000")};
  font-size: 18px;
`;

const FooterExtras = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-top: 1px solid ${({ $isdark }) => ($isdark ? "#111" : "#ccc")};
  padding-top: 1.5rem;
  align-items: center;
`;

const BottomText = styled.div`
  text-align: center;
  font-size: 0.85rem;
  color: ${({ $isdark }) => ($isdark ? "#aaa" : "#555")};
`;

const ScrollTopButton = styled.button`
  position: fixed;
  bottom: calc(20px + env(safe-area-inset-bottom));
  right: 20px;
  background: #000;
  color: white;
  border: none;
  border-radius: 50%;
  width: 52px;
  height: 52px;
  cursor: pointer;
  font-size: 24px;
  display: ${({ $visible }) => ($visible ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 30000;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  &:hover {
    background: #333;
  }

  &:active {
    transform: scale(0.96);
  }
`;

/* ---------------- Cookie Banner carré avec rebond ---------------- */
const bounceUp = keyframes`
  0%   { transform: translateX(-50%) translateY(120%); }
  60%  { transform: translateX(-50%) translateY(-10%); }
  80%  { transform: translateX(-50%) translateY(5%); }
  100% { transform: translateX(-50%) translateY(0); }
`;

const CookieBanner = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  width: min(95vw, 420px);
  background: #000;
  color: #fff;
  padding: 1.5rem 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.25);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  z-index: 20000;
  animation: ${({ $visible }) => ($visible ? bounceUp : "none")} 0.6s
    cubic-bezier(0.25, 1, 0.5, 1) forwards;
`;

const CookieTextMinimal = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.4;
`;

const CookieButtonsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
`;

const CookieButtonMinimal = styled.button`
  padding: 0.65rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.25s ease;
`;

const AcceptCookieMinimal = styled(CookieButtonMinimal)`
  background: #fff;
  color: #000;
  &:hover {
    background: #f0f0f0;
  }
`;

const RejectCookieMinimal = styled(CookieButtonMinimal)`
  background: #000;
  color: #fff;
  &:hover {
    background: #111;
  }
`;
/* ---------------- Footer Component ---------------- */
export default function Footer() {
  const { theme } = useContext(ThemeContext);
  const $isdark = theme === "light";
  const { t } = useTranslation();

  const [openIndex, setOpenIndex] = useState(null);
  const [visible, setVisible] = useState([]);
  const sectionRefs = useRef([]);
  const [scrollVisible, setScrollVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [newsletterVisible, setNewsletterVisible] = useState(false);
  const [cookieVisible, setCookieVisible] = useState(false);
  const [consent, setConsent] = useState(null);

useEffect(() => {
  const storedConsent = localStorage.getItem("marketingConsent");
  setConsent(storedConsent);

  if (!storedConsent) {
    setCookieVisible(true);
  } else if (storedConsent === "true") {
    const newsletterSeen = localStorage.getItem("seenNewsletterModal");
    const newsletterSubscribed = localStorage.getItem("newsletterSubscribed");

    if (!newsletterSeen && !newsletterSubscribed) {
      setTimeout(() => setNewsletterVisible(true), 1500);
    }
  }
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
      { threshold: 0.1 },
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

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setSuccess(false);

    const consent = localStorage.getItem("marketingConsent");

   if (consent !== "true") {
      alert("Vous devez accepter les cookies marketing.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("newsletterSubscribed", "true");
        setSuccess(true);
        setEmail("");
      } else alert(data.message || "Erreur");
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNewsletter = () => {
    localStorage.setItem("seenNewsletterModal", "true");
    setNewsletterVisible(false);
  };

const handleCookieConsent = (accepted) => {
  const value = accepted ? "true" : "false";

  localStorage.setItem("marketingConsent", value);
  setConsent(value);
  setCookieVisible(false);

  if (accepted) {
    const newsletterSeen = localStorage.getItem("seenNewsletterModal");
    const newsletterSubscribed = localStorage.getItem("newsletterSubscribed");

    if (!newsletterSeen && !newsletterSubscribed) {
      setTimeout(() => setNewsletterVisible(true), 500);
    }
  }
};

  const sections = [
    {
      title: t("about"),
      links: [
        { text: t("ourStory"), to: "/apropo" },
        { text: t("faqLabel"), to: "/faq" },
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
          <EmailInput
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            $isdark={$isdark}
          />
          <SubmitButton type="submit" disabled={loading}>
            {loading ? (
              <Spinner />
            ) : (
              <>
                Envoyer <FiSend />
              </>
            )}
          </SubmitButton>
          {success && <ConfirmationText>✅ Email envoyé !</ConfirmationText>}
        </NewsletterForm>
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
                pointerEvents: "none",
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
              ),
            )}
          </LinksContainer>
        </Section>
      ))}

      <FooterExtras $isdark={$isdark}>
        <BottomText $isdark={$isdark}>
          &copy; {new Date().getFullYear()} NUMA. {t("fashion")}
        </BottomText>
      </FooterExtras>

      <ScrollTopButton
        $visible={scrollVisible}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
          document.body.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <FiArrowUp />
      </ScrollTopButton>

      {/* Cookie Banner carré noir/blanc */}
      <CookieBanner $visible={cookieVisible}>
        <CookieTextMinimal>
          Nous utilisons des cookies pour améliorer votre expérience et envoyer
          des emails marketing.
        </CookieTextMinimal>
        <CookieButtonsColumn>
          <AcceptCookieMinimal onClick={() => handleCookieConsent(true)}>
            Accepter
          </AcceptCookieMinimal>
          <RejectCookieMinimal onClick={() => handleCookieConsent(false)}>
            Refuser
          </RejectCookieMinimal>
        </CookieButtonsColumn>
      </CookieBanner>
    </FooterWrapper>
  );
}

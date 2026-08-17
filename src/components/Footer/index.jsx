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
import { FaTiktok } from "react-icons/fa6";
import { ThemeContext } from "../../Utils/Context";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_URL;

/* =========================================================
   ANIMATIONS
========================================================= */

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleIn = keyframes`
  from {
    transform: scale(0.94);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const bounceUp = keyframes`
  0% {
    transform: translateX(-50%) translateY(120%);
  }

  60% {
    transform: translateX(-50%) translateY(-10%);
  }

  80% {
    transform: translateX(-50%) translateY(5%);
  }

  100% {
    transform: translateX(-50%) translateY(0);
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

/* =========================================================
   FOOTER
========================================================= */

const FooterWrapper = styled.footer`
  position: relative;
  overflow: hidden;

  background: ${({ $isdark }) =>
    $isdark ? "#080808" : "#f7f7f5"};

  color: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111"};

  padding: 5rem clamp(1.25rem, 5vw, 6rem) 1.5rem;

  transition:
    background 0.4s ease,
    color 0.4s ease;

  &::before {
    content: "";

    position: absolute;

    width: 420px;
    height: 420px;

    border-radius: 50%;

    background: ${({ $isdark }) =>
      $isdark
        ? "rgba(255,255,255,0.035)"
        : "rgba(0,0,0,0.025)"};

    top: -220px;
    right: -120px;

    pointer-events: none;
  }

  &::after {
    content: "NUMA";

    position: absolute;

    right: -20px;
    bottom: -90px;

    font-size: clamp(8rem, 20vw, 20rem);
    font-weight: 900;
    letter-spacing: -0.1em;

    color: ${({ $isdark }) =>
      $isdark
        ? "rgba(255,255,255,0.025)"
        : "rgba(0,0,0,0.025)"};

    pointer-events: none;
    user-select: none;
  }
`;

/* =========================================================
   NEWSLETTER
========================================================= */

const NewsletterSection = styled.div`
  position: relative;
  z-index: 1;

  max-width: 1100px;
  margin: 0 auto 5rem;

  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: end;

  gap: 3rem;

  padding-bottom: 4rem;

  border-bottom: 1px solid
    ${({ $isdark }) =>
      $isdark
        ? "rgba(255,255,255,.12)"
        : "rgba(0,0,0,.1)"};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;

    gap: 2rem;

    margin-bottom: 3rem;

    padding-bottom: 3rem;
  }
`;

const NewsletterContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const NewsletterEyebrow = styled.span`
  margin-bottom: 1rem;

  font-size: 0.7rem;
  font-weight: 800;

  text-transform: uppercase;
  letter-spacing: 0.2em;

  opacity: 0.55;
`;

const NewsletterTitle = styled.h3`
  margin: 0;

  max-width: 600px;

  font-size: clamp(2.2rem, 5vw, 4.5rem);

  line-height: 0.92;

  letter-spacing: -0.065em;

  font-weight: 700;
`;

const NewsletterSubtitle = styled.p`
  max-width: 470px;

  margin: 1.25rem 0 0;

  font-size: 0.92rem;

  line-height: 1.7;

  color: ${({ $isdark }) =>
    $isdark
      ? "rgba(255,255,255,.55)"
      : "rgba(0,0,0,.55)"};
`;

const NewsletterRight = styled.div`
  width: 100%;
`;

const NewsletterForm = styled.form`
  display: flex;

  width: 100%;

  position: relative;

  border-bottom: 1px solid
    ${({ $isdark }) =>
      $isdark
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)"};

  padding-bottom: 8px;

  transition: border-color 0.3s ease;

  &:focus-within {
    border-color: ${({ $isdark }) =>
      $isdark ? "#fff" : "#000"};
  }

  @media (max-width: 500px) {
    flex-direction: column;

    border-bottom: none;

    gap: 10px;
  }
`;

const EmailInput = styled.input`
  flex: 1;

  min-width: 0;

  border: none;
  outline: none;

  background: transparent;

  padding: 14px 4px;

  color: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111"};

  font-size: 15px;

  &::placeholder {
    color: ${({ $isdark }) =>
      $isdark
        ? "rgba(255,255,255,.4)"
        : "rgba(0,0,0,.4)"};
  }

  @media (max-width: 500px) {
    border: 1px solid
      ${({ $isdark }) =>
        $isdark
          ? "rgba(255,255,255,.15)"
          : "#ddd"};

    padding: 14px;
  }
`;

const SubmitButton = styled.button`
  border: none;

  background: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111"};

  color: ${({ $isdark }) =>
    $isdark ? "#111" : "#fff"};

  padding: 0 22px;

  min-height: 46px;

  font-size: 16px;

  font-weight: 700;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  transition:
    transform 0.25s ease,
    opacity 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.85;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    font-size: 17px;
  }

  @media (max-width: 500px) {
    width: 100%;
  }
`;

const Spinner = styled.div`
  width: 17px;
  height: 17px;

  border: 2px solid
    ${({ $isdark }) =>
      $isdark
        ? "rgba(0,0,0,.2)"
        : "rgba(255,255,255,.25)"};

  border-top-color: ${({ $isdark }) =>
    $isdark ? "#000" : "#fff"};

  border-radius: 50%;

  animation: ${spin} 0.7s linear infinite;
`;

const ConfirmationText = styled.span`
  display: block;

  margin-top: 12px;

  color: #299b62;

  font-size: 0.82rem;

  font-weight: 600;
`;

/* =========================================================
   FOOTER GRID
========================================================= */

const FooterGrid = styled.div`
  position: relative;
  z-index: 1;

  max-width: 1100px;

  margin: 0 auto;

  display: grid;

  grid-template-columns: 1.5fr 1fr 1fr;

  gap: 4rem;

  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr;

    gap: 2rem;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;

    gap: 0;
  }
`;

/* =========================================================
   BRAND
========================================================= */

const BrandColumn = styled.div`
  display: flex;

  flex-direction: column;

  gap: 1.2rem;

  @media (max-width: 600px) {
    padding-bottom: 2.5rem;
  }
`;

const Brand = styled.div`
  font-size: clamp(3rem, 7vw, 5.5rem);

  font-weight: 900;

  line-height: 0.8;

  letter-spacing: -0.09em;
`;

const BrandText = styled.p`
  max-width: 310px;

  margin: 0;

  font-size: 0.85rem;

  line-height: 1.8;

  color: ${({ $isdark }) =>
    $isdark
      ? "rgba(255,255,255,.5)"
      : "rgba(0,0,0,.5)"};
`;

const SocialRow = styled.div`
  display: flex;

  gap: 8px;

  margin-top: 0.5rem;
`;

const IconWrapper = styled.a.attrs({
  target: "_blank",
  rel: "noopener noreferrer",
})`
  width: 42px;
  height: 42px;

  display: inline-flex;

  align-items: center;
  justify-content: center;

  border: 1px solid
    ${({ $isdark }) =>
      $isdark
        ? "rgba(255,255,255,.15)"
        : "rgba(0,0,0,.12)"};

  color: inherit;

  font-size: 17px;

  transition:
    background 0.25s ease,
    color 0.25s ease,
    transform 0.25s ease;

  &:hover {
    background: ${({ $isdark }) =>
      $isdark ? "#fff" : "#111"};

    color: ${({ $isdark }) =>
      $isdark ? "#111" : "#fff"};

    transform: translateY(-3px);
  }
`;

/* =========================================================
   SECTIONS
========================================================= */

const Section = styled.div`
  display: flex;

  flex-direction: column;

  gap: 1rem;

  opacity: 0;

  animation: ${({ $visible }) =>
      $visible ? fadeIn : "none"}
    0.6s ease forwards;

  @media (max-width: 600px) {
    border-top: 1px solid
      ${({ $isdark }) =>
        $isdark
          ? "rgba(255,255,255,.1)"
          : "rgba(0,0,0,.08)"};
  }
`;

const TitleButton = styled.button`
  width: 100%;

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 0;

  background: none;

  border: none;

  color: inherit;

  font-size: 0.72rem;

  font-weight: 800;

  text-transform: uppercase;

  letter-spacing: 0.16em;

  cursor: pointer;

  svg {
    display: none;

    transition: transform 0.3s ease;

    @media (max-width: 600px) {
      display: block;
    }
  }

  @media (max-width: 600px) {
    padding: 1.25rem 0;
  }
`;

const LinksContainer = styled.div`
  display: flex;

  flex-direction: column;

  gap: 0.75rem;

  @media (max-width: 600px) {
    max-height: ${({ $open }) =>
      $open ? "300px" : "0"};

    overflow: hidden;

    transition:
      max-height 0.4s ease,
      padding 0.4s ease;

    padding-bottom: ${({ $open }) =>
      $open ? "1.25rem" : "0"};
  }
`;

const FooterLink = styled(Link)`
  width: fit-content;

  position: relative;

  text-decoration: none;

  color: inherit;

  font-size: 0.9rem;

  opacity: 0.6;

  transition:
    opacity 0.25s ease,
    transform 0.25s ease;

  &::after {
    content: "";

    position: absolute;

    left: 0;
    bottom: -3px;

    width: 0;
    height: 1px;

    background: currentColor;

    transition: width 0.25s ease;
  }

  &:hover {
    opacity: 1;

    transform: translateX(3px);

    &::after {
      width: 100%;
    }
  }
`;

/* =========================================================
   FOOTER BOTTOM
========================================================= */

const FooterExtras = styled.div`
  position: relative;

  z-index: 1;

  max-width: 1100px;

  width: 100%;

  margin: 5rem auto 0;

  padding-top: 1.5rem;

  border-top: 1px solid
    ${({ $isdark }) =>
      $isdark
        ? "rgba(255,255,255,.1)"
        : "rgba(0,0,0,.08)"};

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;

    align-items: flex-start;

    margin-top: 3rem;
  }
`;

const BottomText = styled.div`
  font-size: 0.72rem;

  letter-spacing: 0.04em;

  color: ${({ $isdark }) =>
    $isdark
      ? "rgba(255,255,255,.4)"
      : "rgba(0,0,0,.45)"};
`;

const CookiePreferences = styled.div`
  display: flex;

  align-items: center;

  gap: 10px;

  font-size: 0.72rem;

  color: ${({ $isdark }) =>
    $isdark
      ? "rgba(255,255,255,.45)"
      : "rgba(0,0,0,.45)"};

  button {
    border: none;

    background: none;

    padding: 0;

    color: inherit;

    text-decoration: underline;

    text-underline-offset: 3px;

    cursor: pointer;

    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.7;
    }
  }

  @media (max-width: 600px) {
    flex-wrap: wrap;
  }
`;

/* =========================================================
   SCROLL TOP
========================================================= */

const ScrollTopButton = styled.button`
  position: fixed;

  bottom: calc(
    20px + env(safe-area-inset-bottom)
  );

  right: 20px;

  width: 48px;
  height: 48px;

  border: 1px solid
    rgba(255, 255, 255, 0.15);

  border-radius: 50%;

  background: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111"};

  color: ${({ $isdark }) =>
    $isdark ? "#111" : "#fff"};

  display: ${({ $visible }) =>
    $visible ? "flex" : "none"};

  align-items: center;

  justify-content: center;

  cursor: pointer;

  font-size: 20px;

  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.18);

  z-index: 30000;

  transition:
    transform 0.25s ease,
    opacity 0.25s ease;

  &:hover {
    transform: translateY(-4px);
  }

  &:active {
    transform: scale(0.94);
  }
`;

/* =========================================================
   COOKIE BANNER
========================================================= */

const CookieBanner = styled.div`
  position: fixed;

  bottom: 20px;

  left: 50%;

  transform: translateX(-50%);

  width: min(94vw, 430px);

  background: ${({ $isdark }) =>
    $isdark ? "#111" : "#fff"};

  color: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111"};

  padding: 1.5rem;

  display: flex;

  flex-direction: column;

  gap: 1rem;

  box-shadow:
    0 15px 50px rgba(0, 0, 0, 0.25);

  border: 1px solid
    ${({ $isdark }) =>
      $isdark
        ? "rgba(255,255,255,.1)"
        : "rgba(0,0,0,.08)"};

  opacity: ${({ $visible }) =>
    $visible ? 1 : 0};

  pointer-events: ${({ $visible }) =>
    $visible ? "auto" : "none"};

  z-index: 20000;

  animation: ${({ $visible }) =>
      $visible ? bounceUp : "none"}
    0.6s
    cubic-bezier(0.25, 1, 0.5, 1)
    forwards;
`;

const CookieTextMinimal = styled.p`
  margin: 0;

  font-size: 0.85rem;

  line-height: 1.6;

  opacity: 0.75;
`;

const CookieButtonsColumn = styled.div`
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 8px;
`;

const CookieButtonMinimal = styled.button`
  padding: 0.8rem 1rem;

  font-weight: 700;

  font-size: 0.8rem;

  cursor: pointer;

  border: none;

  transition:
    transform 0.2s ease,
    opacity 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const AcceptCookieMinimal = styled(
  CookieButtonMinimal,
)`
  background: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111"};

  color: ${({ $isdark }) =>
    $isdark ? "#111" : "#fff"};
`;

const RejectCookieMinimal = styled(
  CookieButtonMinimal,
)`
  background: transparent;

  color: inherit;

  border: 1px solid
    ${({ $isdark }) =>
      $isdark
        ? "rgba(255,255,255,.2)"
        : "rgba(0,0,0,.15)"};
`;

/* =========================================================
   NEWSLETTER MODAL
========================================================= */

const Overlay = styled.div`
  position: fixed;

  inset: 0;

  background: rgba(0, 0, 0, 0.7);

  backdrop-filter: blur(8px);

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 20px;

  z-index: 25000;

  animation: ${fadeIn} 0.3s ease;
`;

const ModalBox = styled.div`
  width: min(92vw, 480px);

  background: ${({ $isdark }) =>
    $isdark ? "#111" : "#fff"};

  color: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111"};

  padding: 2.5rem;

  display: flex;

  flex-direction: column;

  gap: 1rem;

  animation: ${scaleIn} 0.25s ease;

  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.35);

  @media (max-width: 500px) {
    padding: 1.75rem;
  }
`;

const ModalEyebrow = styled.span`
  font-size: 0.68rem;

  font-weight: 800;

  text-transform: uppercase;

  letter-spacing: 0.2em;

  opacity: 0.5;
`;

const ModalTitle = styled.h3`
  margin: 0;

  font-size: 2rem;

  line-height: 1;

  letter-spacing: -0.04em;
`;

const ModalText = styled.p`
  margin: 0 0 0.5rem;

  font-size: 0.9rem;

  line-height: 1.6;

  opacity: 0.65;
`;

const CloseBtn = styled.button`
  margin-top: 0.5rem;

  padding: 13px;

  border: 1px solid
    ${({ $isdark }) =>
      $isdark
        ? "rgba(255,255,255,.15)"
        : "rgba(0,0,0,.12)"};

  cursor: pointer;

  background: transparent;

  color: inherit;

  font-weight: 700;

  transition:
    background 0.25s ease,
    color 0.25s ease;

  &:hover {
    background: ${({ $isdark }) =>
      $isdark ? "#fff" : "#111"};

    color: ${({ $isdark }) =>
      $isdark ? "#111" : "#fff"};
  }
`;

/* =========================================================
   FOOTER COMPONENT
========================================================= */

export default function Footer() {
  const { theme } = useContext(ThemeContext);

  /*
    Si ton ThemeContext utilise "dark" pour le thème sombre,
    cette condition est correcte.
  */
  const $isdark = theme === "light";

  const { t } = useTranslation();

  const [openIndex, setOpenIndex] = useState(null);

  const [visible, setVisible] = useState([]);

  const sectionRefs = useRef([]);

  const [scrollVisible, setScrollVisible] =
    useState(false);

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [newsletterVisible, setNewsletterVisible] =
    useState(false);

  const [cookieVisible, setCookieVisible] =
    useState(false);

  const [consent, setConsent] = useState(null);

  const [messagevue, setMessagevue] =
    useState(false);

  /* =======================================================
     SUCCESS MESSAGE
  ======================================================= */

  useEffect(() => {
    if (!success) return;

    setMessagevue(true);

    const timer = setTimeout(() => {
      setMessagevue(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [success]);

  /* =======================================================
     COOKIES / NEWSLETTER
  ======================================================= */

  useEffect(() => {
    const storedConsent =
      localStorage.getItem("marketingConsent");

    setConsent(storedConsent);

    if (!storedConsent) {
      setCookieVisible(true);
    } else if (storedConsent === "true") {
      const newsletterSeen =
        localStorage.getItem(
          "seenNewsletterModal",
        );

      const newsletterSubscribed =
        localStorage.getItem(
          "newsletterSubscribed",
        );

      if (
        !newsletterSeen &&
        !newsletterSubscribed
      ) {
        const timer = setTimeout(() => {
          setNewsletterVisible(true);
        }, 1500);

        return () => clearTimeout(timer);
      }
    }
  }, []);

  /* =======================================================
     INTERSECTION OBSERVER
  ======================================================= */

  useEffect(() => {
    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisible((prev) => [
                ...new Set([
                  ...prev,
                  entry.target.dataset.index,
                ]),
              ]);
            }
          });
        },
        {
          threshold: 0.1,
        },
      );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  /* =======================================================
     SCROLL TOP
  ======================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrollVisible(
        window.scrollY > window.innerHeight,
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  /* =======================================================
     NEWSLETTER SUBMIT
  ======================================================= */

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    if (consent !== "true") {
      alert(
        "Vous devez accepter les cookies marketing.",
      );

      return;
    }

    setLoading(true);

    setSuccess(false);

    try {
      const res = await fetch(
        `${API}/api/newsletter`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),

            marketingConsent:
              consent === "true",
          }),

          credentials: "include",
        },
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem(
          "newsletterSubscribed",
          "true",
        );

        setSuccess(true);

        setEmail("");

        setTimeout(() => {
          setNewsletterVisible(false);
        }, 1200);
      } else {
        alert(
          data.message ||
            "Une erreur est survenue.",
        );
      }
    } catch (err) {
      console.error(err);

      alert(
        "Impossible de contacter le serveur.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     CLOSE NEWSLETTER
  ======================================================= */

  const handleCloseNewsletter = () => {
    localStorage.setItem(
      "seenNewsletterModal",
      "true",
    );

    setSuccess(false);

    setEmail("");

    setNewsletterVisible(false);
  };

  /* =======================================================
     COOKIE CONSENT
  ======================================================= */

  const handleCookieConsent = (accepted) => {
    const value = accepted
      ? "true"
      : "false";

    localStorage.setItem(
      "marketingConsent",
      value,
    );

    setConsent(value);

    setCookieVisible(false);

    if (accepted) {
      const newsletterSeen =
        localStorage.getItem(
          "seenNewsletterModal",
        );

      const newsletterSubscribed =
        localStorage.getItem(
          "newsletterSubscribed",
        );

      if (
        !newsletterSeen &&
        !newsletterSubscribed
      ) {
        setTimeout(() => {
          setNewsletterVisible(true);
        }, 500);
      }
    }
  };

  /* =======================================================
     FOOTER SECTIONS
  ======================================================= */

  const sections = [
    {
      title: t("about"),

      links: [
        {
          text: t("ourStory"),
          to: "/apropo",
        },

        {
          text: t("faqLabel"),
          to: "/faq",
        },

        {
          text: t("contact"),
          to: "/contact",
        },
      ],
    },

    {
      title: t("services"),

      links: [
        {
          text: t("returnPolicy"),
          to: "/politiqueretour",
        },

        {
          text: t("shipping"),
          to: "/livraison",
        },

        {
          text: t("terms"),
          to: "/conditionUtilisation",
        },
      ],
    },

    {
      title: t("social"),

      links: [
        {
          text: "Facebook",

          href: "https://www.facebook.com/share/1B6q48Xg3h/?mibextid=wwXIfr",

          icon: <FiFacebook />,
        },

        {
          text: "Instagram",

          href: "https://www.instagram.com/numa12472?igsh=MXUyeDFrM2kzbDczdQ%3D%3D&utm_source=qr",

          icon: <FiInstagram />,
        },

        {
          text: "TikTok",

          href: "https://www.tiktok.com/@numa2255",

          icon: <FaTiktok />,
        },
      ],
    },
  ];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <FooterWrapper $isdark={$isdark}>

      {/* =================================================
          NEWSLETTER
      ================================================= */}

      <NewsletterSection $isdark={$isdark}>
        <NewsletterContent>
          <NewsletterEyebrow>
            NUMA COMMUNITY
          </NewsletterEyebrow>

          <NewsletterTitle>
            Entrez dans l’univers NUMA.
          </NewsletterTitle>

          <NewsletterSubtitle
            $isdark={$isdark}
          >
            Recevez nos nouvelles collections,
            nos inspirations et nos offres
            exclusives directement dans votre
            boîte mail.
          </NewsletterSubtitle>
        </NewsletterContent>

        <NewsletterRight>
          <NewsletterForm
            onSubmit={handleNewsletterSubmit}
            $isdark={$isdark}
          >
            <EmailInput
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              $isdark={$isdark}
              aria-label="Adresse email"
            />

            <SubmitButton
              type="submit"
              disabled={loading}
              $isdark={$isdark}
            >
              {loading ? (
                <Spinner $isdark={$isdark} />
              ) : (
                <>
                  S’inscrire
                  <FiSend />
                </>
              )}
            </SubmitButton>
          </NewsletterForm>

          {messagevue && (
            <ConfirmationText>
              ✓ Inscription réussie
            </ConfirmationText>
          )}
        </NewsletterRight>
      </NewsletterSection>

      {/* =================================================
          FOOTER GRID
      ================================================= */}

      <FooterGrid>

        {/* BRAND */}

        <BrandColumn>
          <Brand>NUMA</Brand>

          <BrandText $isdark={$isdark}>
            Une vision contemporaine de la
            mode, pensée pour celles et ceux
            qui aiment les pièces fortes,
            simples et intemporelles.
          </BrandText>

          <SocialRow>
            {sections[2].links.map(
              (link, index) => (
                <IconWrapper
                  key={index}
                  href={link.href}
                  $isdark={$isdark}
                  aria-label={link.text}
                  title={link.text}
                >
                  {link.icon}
                </IconWrapper>
              ),
            )}
          </SocialRow>
        </BrandColumn>

        {/* ABOUT + SERVICES */}

        {sections
          .slice(0, 2)
          .map((section, index) => (
            <Section
              key={index}
              $visible={visible.includes(
                index.toString(),
              )}
              $isdark={$isdark}
              ref={(el) =>
                (sectionRefs.current[index] =
                  el)
              }
              data-index={index}
            >
              <TitleButton
                onClick={() =>
                  setOpenIndex(
                    openIndex === index
                      ? null
                      : index,
                  )
                }
              >
                {section.title}

                <FiChevronDown
                  style={{
                    transform:
                      openIndex === index
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                  }}
                />
              </TitleButton>

              <LinksContainer
                $open={
                  openIndex === index
                }
              >
                {section.links.map(
                  (link, linkIndex) => (
                    <FooterLink
                      key={linkIndex}
                      to={link.to}
                    >
                      {link.text}
                    </FooterLink>
                  ),
                )}
              </LinksContainer>
            </Section>
          ))}
      </FooterGrid>

      {/* =================================================
          FOOTER BOTTOM
      ================================================= */}

      <FooterExtras $isdark={$isdark}>
        <BottomText $isdark={$isdark}>
          © {new Date().getFullYear()} NUMA
          {" — "}
          {t("fashion")}
        </BottomText>

        <CookiePreferences
          $isdark={$isdark}
        >
          <span>
            Confidentialité & cookies
          </span>

          <button
            type="button"
            onClick={() =>
              setCookieVisible(true)
            }
          >
            Modifier les préférences
          </button>
        </CookiePreferences>
      </FooterExtras>

      {/* =================================================
          COOKIE BANNER
      ================================================= */}

      <CookieBanner
        $visible={cookieVisible}
        $isdark={$isdark}
      >
        <CookieTextMinimal>
          Nous utilisons des cookies pour
          améliorer votre expérience et,
          avec votre accord, envoyer des
          communications marketing.
        </CookieTextMinimal>

        <CookieButtonsColumn>
          <AcceptCookieMinimal
            $isdark={$isdark}
            onClick={() =>
              handleCookieConsent(true)
            }
          >
            Accepter
          </AcceptCookieMinimal>

          <RejectCookieMinimal
            $isdark={$isdark}
            onClick={() =>
              handleCookieConsent(false)
            }
          >
            Refuser
          </RejectCookieMinimal>
        </CookieButtonsColumn>
      </CookieBanner>

      {/* =================================================
          SCROLL TOP
      ================================================= */}

      <ScrollTopButton
        $visible={scrollVisible}
        $isdark={$isdark}
        aria-label="Retour en haut"
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        <FiArrowUp />
      </ScrollTopButton>

      {/* =================================================
          NEWSLETTER MODAL
      ================================================= */}

      {newsletterVisible && (
        <Overlay>
          <ModalBox $isdark={$isdark}>
            <ModalEyebrow>
              NUMA EXCLUSIVE
            </ModalEyebrow>

            <ModalTitle>
              📩 Newsletter exclusive
            </ModalTitle>

            <ModalText>
              Reçois nos nouvelles collections,
              nos inspirations, offres privées
              et promotions exclusives.
            </ModalText>

            <NewsletterForm
              onSubmit={
                handleNewsletterSubmit
              }
              $isdark={$isdark}
            >
              <EmailInput
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                $isdark={$isdark}
                autoFocus
              />

              <SubmitButton
                type="submit"
                disabled={loading}
                $isdark={$isdark}
              >
                {loading ? (
                  <Spinner
                    $isdark={$isdark}
                  />
                ) : (
                  <>
                    S’inscrire
                    <FiSend />
                  </>
                )}
              </SubmitButton>
            </NewsletterForm>

            {messagevue && (
              <ConfirmationText>
                ✓ Inscription réussie
              </ConfirmationText>
            )}

            <CloseBtn
              $isdark={$isdark}
              type="button"
              onClick={
                handleCloseNewsletter
              }
            >
              Fermer
            </CloseBtn>
          </ModalBox>
        </Overlay>
      )}
    </FooterWrapper>
  );
}
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
  0% { box-shadow: 0 0 0px rgba(255,255,255,0.0); }
  50% { box-shadow: 0 0 12px rgba(79,70,229,0.6); }
  100% { box-shadow: 0 0 0px rgba(255,255,255,0.0); }
`;
const popIn = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

/* --- Styled Components --- */
const FooterWrapper = styled.footer`
  background: ${({ $isdark }) => ($isdark ? "#0D192B" : "#f4f4f4")};
  color: ${({ $isdark }) => ($isdark ? "#e6eefc" : "#071230")};
  padding: 3rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  transition:
    background 0.35s ease,
    color 0.35s ease;
`;

/* Newsletter */
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
  border: 1px solid ${({ $isdark }) => ($isdark ? "#334155" : "#ccc")};
  background: ${({ $isdark }) => ($isdark ? "#1f2a44" : "#fff")};
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#000")};
  font-size: 16px; /* Evite zoom mobile */
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 6px rgba(79, 70, 229, 0.5);
  }
`;
const SubmitButton = styled.button`
  padding: 0 16px;
  border-radius: 8px;
  background: #4f46e5;
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
    background: #6366f1;
  }

  svg {
    margin-left: 6px;
    font-size: 18px;
  }
`;

/* Sections */
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
    color: ${({ $isdark }) => ($isdark ? "#a5b4fc" : "#4f46e5")};
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
  background: ${({ $isdark }) => ($isdark ? "#1f2a44" : "#e5e7eb")};
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#071230")};
  transition: all 0.35s ease;
  font-size: 18px;

  &:hover {
    animation:
      ${bounce} 0.5s,
      ${glow} 0.8s;
    background: ${({ $isdark }) => ($isdark ? "#4f46e5" : "#6366f1")};
    color: white;
  }
`;
const FooterExtras = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-top: 1px solid ${({ $isdark }) => ($isdark ? "#1f2a44" : "#d1d5db")};
  padding-top: 1.5rem;
  align-items: center;
`;
const CookieButton = styled.button`
  background: none;
  border: 1px solid ${({ $isdark }) => ($isdark ? "#a5b4fc" : "#4f46e5")};
  color: ${({ $isdark }) => ($isdark ? "#a5b4fc" : "#4f46e5")};
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  width: fit-content;
  font-weight: 500;
  transition: all 0.25s ease;

  &:hover {
    background: ${({ $isdark }) => ($isdark ? "#4f46e5" : "#4f46e5")};
    color: #fff;
  }
`;
const BottomText = styled.div`
  text-align: center;
  font-size: 0.85rem;
  color: ${({ $isdark }) => ($isdark ? "#a5b4fc" : "#374151")};
  transition: color 0.35s ease;
`;

/* Scroll to Top */
const ScrollTopButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #4f46e5;
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
    background: #6366f1;
  }
`;

/* Modal */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ $visible }) => ($visible ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 999;
`;
const ModalContent = styled.div`
  background: ${({ $isdark }) => ($isdark ? "#0D192B" : "#fff")};
  color: ${({ $isdark }) => ($isdark ? "#e6eefc" : "#071230")};
  padding: 2rem 2.5rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  position: relative;
  text-align: center;
  animation: ${popIn} 0.35s ease forwards;
  background: linear-gradient(145deg, #4f46e5, #6366f1);
  color: white;
`;
const CloseModal = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: white;
`;
const ModalTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

/* --- Footer Component --- */
export default function Footer() {
  const { theme } = useContext(ThemeContext);
  const $isdark = theme === "light";
  const { t } = useTranslation();

  const [openIndex, setOpenIndex] = useState(null);
  const [visible, setVisible] = useState([]);
  const sectionRefs = useRef([]);
  const [scrollVisible, setScrollVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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

  /* Intersection Observer for animation */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => [
              ...new Set([...prev, entry.target.dataset.index]),
            ]);
          }
        });
      },
      { threshold: 0.1 }
    );
    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  /* Scroll Button Visibility */
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) setScrollVisible(true);
      else setScrollVisible(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <FooterWrapper $isdark={$isdark}>
      {/* Newsletter Section */}
      <NewsletterSection>
        <NewsletterTitle>Inscrivez-vous à notre newsletter</NewsletterTitle>
        <NewsletterForm
          onSubmit={(e) => {
            e.preventDefault();
            setModalVisible(true);
          }}
        >
          <EmailInput
            type="email"
            placeholder="Votre email"
            $isdark={$isdark}
            required
          />
          <SubmitButton type="submit">
            Envoyer <FiSend />
          </SubmitButton>
        </NewsletterForm>
      </NewsletterSection>

      {/* Sections principales */}
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

      {/* Footer Extras */}
      <FooterExtras $isdark={$isdark}>
        <CookieButton $isdark={$isdark} onClick={() => setModalVisible(true)}>
          Gérer les cookies
        </CookieButton>
      </FooterExtras>

      <BottomText $isdark={$isdark}>
        &copy; {new Date().getFullYear()} NUMA. {t("fashion")}
      </BottomText>

      {/* Scroll to Top Button */}
      <ScrollTopButton $visible={scrollVisible} onClick={scrollToTop}>
        <FiArrowUp />
      </ScrollTopButton>

      {/* Modal */}
      <ModalOverlay $visible={modalVisible}>
        <ModalContent $isdark={$isdark}>
          <CloseModal onClick={() => setModalVisible(false)}>
            <FiX />
          </CloseModal>
          <ModalTitle>Merci pour votre inscription !</ModalTitle>
          <p>
            Vous serez informé de toutes nos nouveautés et offres exclusives.
          </p>
          <SubmitButton onClick={() => setModalVisible(false)}>
            Fermer
          </SubmitButton>
        </ModalContent>
      </ModalOverlay>
    </FooterWrapper>
  );
}

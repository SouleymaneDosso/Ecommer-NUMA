import { useState, useContext, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FiFacebook, FiTwitter, FiInstagram, FiChevronDown, FiHome, FiGrid, FiUser } from "react-icons/fi";
import { ThemeContext } from "../../Utils/Context";
import { useTranslation } from "react-i18next";
import Apropos from './../../pages/apropos';

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

const FooterWrapper = styled.footer`
  background: ${({ $isdark }) => ($isdark ? "#0D192B" : "#f4f4f4")};
  color: ${({ $isdark }) => ($isdark ? "#e6eefc" : "#071230")};
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  transition: background 0.35s ease, color 0.35s ease;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  opacity: 0;
  animation: ${({ $visible }) => ($visible ? fadeIn : "none")} 0.6s ease forwards;
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
  transition: color 0.25s ease, transform 0.25s ease, box-shadow 0.3s ease;

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
    animation: ${bounce} 0.5s, ${glow} 0.8s;
    background: ${({ $isdark }) => ($isdark ? "#4f46e5" : "#6366f1")};
    color: white;
  }
`;

const BottomText = styled.div`
  text-align: center;
  font-size: 0.85rem;
  color: ${({ $isdark }) => ($isdark ? "#a5b4fc" : "#374151")};
  transition: color 0.35s ease;
`;

const FooterNav = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const NavItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  color: ${({ $isdark }) => ($isdark ? "#f3f6fb" : "#071230")};
  text-decoration: none;
  gap: 4px;
`;

export default function Footer() {
  const { theme } = useContext(ThemeContext);
  const $isdark = theme === "light";
  const footerRef = useRef(null);
  const { t } = useTranslation();

  const sections = [
    {
      title: t("about"),
      links: [
        { text: t("ourStory"), to: "/apropo" },
        { text: t("faq"), to: "/faq" },
        { text: t("contact"), to: "/contact" }
      ]
    },
    {
      title: t("services"),
      links: [
        { text: t("returnPolicy"), to: "/politiqueretour" },
        { text: t("shipping"), to: "/livraison" },
        { text: t("terms"), to: "/conditionUtilisation" }
      ]
    },
    {
      title: t("social"),
      links: [
        { text: "Facebook", href: "https://www.facebook.com/share/1E3D5avSoi/?mibextid=wwXIfr", icon: <FiFacebook /> },
        { text: "Instagram", href: "https://www.instagram.com/numa12472?igsh=MXUyeDFrM2kzbDczdQ%3D%3D&utm_source=qr", icon: <FiInstagram /> }
      ]
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const [visible, setVisible] = useState([]);
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => [...new Set([...prev, entry.target.dataset.index])]);
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

  return (
    <FooterWrapper $isdark={$isdark} ref={footerRef}>
      {sections.map((sec, i) => (
        <Section
          key={i}
          $visible={visible.includes(i.toString())}
          ref={(el) => (sectionRefs.current[i] = el)}
          data-index={i}
        >
          <TitleButton onClick={() => setOpenIndex(openIndex === i ? null : i)}>
            {sec.title} <FiChevronDown style={{ transform: openIndex === i ? "rotate(180deg)" : "rotate(0)" }} />
          </TitleButton>
          <LinksContainer $open={openIndex === i}>
            {sec.links.map((link, j) =>
              link.to ? (
                <FooterLink key={j} to={link.to} $isdark={$isdark}>{link.text}</FooterLink>
              ) : (
                <IconWrapper key={j} href={link.href} $isdark={$isdark}>{link.icon}</IconWrapper>
              )
            )}
          </LinksContainer>
        </Section>
      ))}

      <BottomText $isdark={$isdark}>
        &copy; {new Date().getFullYear()} NUMA. {t("fashion")}
      </BottomText>
    </FooterWrapper>
  );
}




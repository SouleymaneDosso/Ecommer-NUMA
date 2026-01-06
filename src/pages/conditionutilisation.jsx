// src/pages/TermsOfUse.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const TermsOfUse = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
        lineHeight: "1.6"
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        {t("termsTitle")}
      </h1>

      <section style={{ marginBottom: "1.5rem" }}>
        <p>{t("termsIntro")}</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>{t("termsSection1Title")}</h2>
        <p>{t("termsSection1Text")}</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>{t("termsSection2Title")}</h2>
        <p>{t("termsSection2Text")}</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>{t("termsSection3Title")}</h2>
        <p>{t("termsSection3Text")}</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>{t("termsSection4Title")}</h2>
        <p>{t("termsSection4Text")}</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>{t("termsSection5Title")}</h2>
        <p>{t("termsSection5Text")}</p>
      </section>

      <section>
        <p style={{ fontStyle: "italic" }}>{t("termsConclusion")}</p>
      </section>
    </div>
  );
};

export default TermsOfUse;

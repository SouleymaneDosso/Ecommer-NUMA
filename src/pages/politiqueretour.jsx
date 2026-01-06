// src/pages/ReturnPolicy.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const ReturnPolicy = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
        lineHeight: "1.6",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        {t("return.title")}
      </h1>

      <section style={{ marginBottom: "1.5rem" }}>
        <p>{t("return.intro")}</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>{t("return.conditionsTitle")}</h2>
        <ul style={{ paddingLeft: "1.5rem" }}>
          <li>{t("return.condition1")}</li>
          <li>{t("return.condition2")}</li>
          <li>{t("return.condition3")}</li>
        </ul>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>{t("return.processTitle")}</h2>
        <ol style={{ paddingLeft: "1.5rem" }}>
          <li>
            {t("return.process1")}{" "}
            <a href="mailto:numa7433@gmail.com">numa7433@gmail.com</a>{" "}
            {t("return.or")}{" "}
            <a
              href="https://wa.me/2250700247693"
              target="_blank"
              rel="noopener noreferrer"
            >
              0700247693
            </a>
          </li>
          <li>{t("return.process2")}</li>
          <li>{t("return.process3")}</li>
        </ol>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>{t("return.refundTitle")}</h2>
        <p>{t("return.refundText")}</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>{t("return.issueTitle")}</h2>
        <p>{t("return.issueText")}</p>
      </section>

      <section>
        <p style={{ fontStyle: "italic" }}>
          {t("return.conclusion")}
        </p>
      </section>
    </div>
  );
};

export default ReturnPolicy;

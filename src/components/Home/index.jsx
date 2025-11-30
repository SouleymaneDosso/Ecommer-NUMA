import Carte from "../../pages/Carte";
import { produits } from "../../data/produits.js";
import styled from "styled-components";
import { useContext } from "react";
import { ThemeContext } from "../../Utils/Context";

const Grid = styled.div`
  width: 100%;
  max-width: 1380px;
  margin: 0 auto;
  padding: 40px 20px;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 42px;

  @media (max-width: 768px) {
    gap: 28px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: center;
  letter-spacing: -0.03em;

  color: ${({ $isdark }) => ($isdark ? "#f5f7fa" : "#0f172a")};
`;

export default function Home() {
  const { theme } = useContext(ThemeContext);
  const $isdark = theme === "light";

  return (
    <>
      <SectionTitle $isdark={$isdark}>Nos Collections</SectionTitle>

      <Grid>
        {produits.map((p) => (
          <Carte
          {...p}
          />
        ))}
      </Grid>
    </>
  );
}


import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import styled from "styled-components";

const Button = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${({ active }) => (active ? "#ef4444" : "#000")};
  font-size: 1.6rem;
  transition: transform 0.2s ease, color 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`;

export default function FavoriteButton() {
  const [active, setActive] = useState(false);

  return (
    <Button active={active} onClick={() => setActive(!active)}>
      <FiHeart />
    </Button>
  );
}

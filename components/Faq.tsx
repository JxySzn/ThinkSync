import React from "react";

interface FaqProps {
  id: string;
}

const Faq = ({ id }: FaqProps) => {
  return <div id={id}>Faq</div>;
};

export default Faq;

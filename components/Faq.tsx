import React from "react";

interface FAQProps {
  id: string;
}

const FAQ = ({ id }: FAQProps) => {
  return <div id={id}>FAQ</div>;
};

export default FAQ;

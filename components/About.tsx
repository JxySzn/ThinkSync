import React from "react";

interface AboutProps {
  id: string;
}

const About = ({ id }: AboutProps) => {
  return <div id={id}>About</div>;
};

export default About;

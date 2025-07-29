function gen4() {
  return Math.random()
    .toString(16)
    .slice(-4);
}

const HtmlContent = ({ html }: { html: string }) => {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export {
  gen4,
  HtmlContent,
}
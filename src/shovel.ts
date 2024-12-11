const html = `<html>
  <head>
    <title>Test title</title>
  </head>
  <body>
    <div class="top-4 w-40 text-black pt-10 pl-4 max-w-[512px] relative z-20 my-class sticky sticky-my-class ptname">
      <span class="mr-5 text-yellow-300">Welcome, {{name}}</span>
    </div>
    <div>
      <a href="{{cta_link}}" class="bg-blue-500">{{cta_text}}</a>
      <div
        class="bg-[url('https://example.com/custom-image.png')] bg-no-repeat"
      ></div>
    </div>
  </body>
</html>
`;

const classesRegex = /\s*class=(['"])(.*?)\1/g;

// TODO:  /\s*class=(['"])((?:\s*(?:bg-|text-|p[lrtb]?-|m[lrtb]?-|min-w|max-w|w-|h-|border-|rounded-|flex|grid|items-|justify-|absolute|relative|block|inline|hidden|opacity-|z-|top-|left-|right-|bottom-)[^\s"]*)*\s*)(\1)/g;
// Replace the class attribute contents
const updatedHtml = html.replace(classesRegex, (match, quote, classContent) => {
  const paddingRegex = /^(p[ltbr]?)-/;
  const marginRegex = /^(m[ltbr]?)-/;
  const displayRegex = /^(relative|absolute|sticky|fixed)$/;
  const widthRegex = /^(min-|max-)?w-/;
  const heightRegex = /^(min-|max-)?h-/;
  const directionRegex = /^(top|left|right|bottom)-/;

  const twPrefixes = [
    'text-',
    'bg-',
    'flex',
    'grid',
    'items-',
    'justify-',
    'content-',
    'self-',
    'place-',
    'gap-',
    'row-',
    'col-',
    'rounded-',
    'z-',
    'border',
  ];

  // 제거
  const filteredClasses = classContent
    .split(/\s+/) // Split by whitespace
    .filter(
      (cls: string) => !twPrefixes.some((prefix) => cls.startsWith(prefix)),
    )
    .filter((cls: string) => !paddingRegex.test(cls))
    .filter((cls: string) => !marginRegex.test(cls))
    .filter((cls: string) => !displayRegex.test(cls))
    .filter((cls: string) => !widthRegex.test(cls))
    .filter((cls: string) => !heightRegex.test(cls))
    .filter((cls: string) => !directionRegex.test(cls))
    .join(' '); // Rejoin the filtered classes with spaces

  // Reconstruct the class attribute
  return ` class=${quote}${filteredClasses}${quote}`;
});

console.log(updatedHtml);

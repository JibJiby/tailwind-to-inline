import { removeOnlyTWClasses } from './utils/makeStylesInline';

const html = `<html>
  <head>
    <title>Test title</title>
  </head>
  <body>
    <div class="top-4 w-40 text-black pt-10 pl-4 max-w-[512px] relative z-20 my-class sticky sticky-my-class ptname inline-flex flex
      grid
      inline-grid
      ">
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

// TODO:  /\s*class=(['"])((?:\s*(?:bg-|text-|p[lrtb]?-|m[lrtb]?-|min-w|max-w|w-|h-|border-|rounded-|flex|grid|items-|justify-|absolute|relative|block|inline|hidden|opacity-|z-|top-|left-|right-|bottom-)[^\s"]*)*\s*)(\1)/g;
// Replace the class attribute contents
const updatedHtml = removeOnlyTWClasses(html);

// tw 제거만 되는지 확인
console.log(updatedHtml);

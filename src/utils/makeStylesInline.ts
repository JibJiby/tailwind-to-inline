import * as fs from 'fs';
import juice from 'juice';
import Handlebars from 'handlebars';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
// @ts-ignore
import postcssRemToPixel from 'postcss-rem-to-pixel';

import { rgbToHex } from './rgbToHex';

type TMakeStylesInline = (
  templatePath: string,
  placeholderValues?: { [key: string]: string },
) => Promise<string>;

const processTailwindCSS = async (html: string): Promise<string> => {
  const tailwindConfig = {
    content: [{ raw: html, extension: 'html' }],
    corePlugins: {
      preflight: false,
    },
  };

  const result = await postcss([
    // plugin
    tailwindcss(tailwindConfig),
    autoprefixer,
    postcssRemToPixel({
      rootValue: 16, // 1rem = 16px,
      propList: ['*'],
    }),
  ]).process('@tailwind components; @tailwind utilities;', {
    from: undefined,
  });

  return result.css;
};

const simplifyColors = (css: string): string => {
  // Remove CSS variables coming from Tailwind (starting with "--tw-...")
  const generalSimplifications = css
    .replace(/rgb\(([^)]+)\) \/ var\(--tw-[^)]+\)/g, 'rgb($1)')
    .replace(
      /rgba\(([^,]+),([^,]+),([^,]+),var\(--tw-[^)]+\)\)/g,
      'rgba($1,$2,$3,1)',
    )
    .replace(/var\(--tw-[^)]+\)/g, '1')
    .replace(/--tw-[^:]+:[^;]+;/g, '');

  // Since email agents like Gmail don't allow using `rgb()` colors, we replace them with their `hex` counterparts
  const hexColorsInsteadOfRgb = generalSimplifications.replaceAll(
    /(rgba?\(\d+\s+\d+\s+\d+\s*\/.*\))/g,
    (match) => {
      return rgbToHex(match);
    },
  );

  return hexColorsInsteadOfRgb;
};

// const removeCssClasses = (css: string) => {
//   // https://claude.ai/chat/9475aaf1-207a-4921-8b7d-f7a2b14c265f
//   const regex = /\s*class=(['"])(?:(?!\1)[^\\]|\\.)*\1/g;

//   return css.replaceAll(regex, '');
// };

const removeOnlyTWClasses = (html: string) => {
  const classesRegex = /\s*class=(['"])(.*?)\1/g; // class="" 색출

  // html.replace(classesRegex, (match, quote, classContent) => {
  const updatedHtml = html.replace(
    classesRegex,
    (match, quote, classContent) => {
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
    },
  );

  return updatedHtml;
};

const inlineStyles = async (html: string): Promise<string> => {
  const tailwindCss = await processTailwindCSS(html);
  const simplifiedCss = simplifyColors(tailwindCss);

  return juice(html, {
    extraCss: simplifiedCss,
    applyStyleTags: true,
    removeStyleTags: true,
    preserveMediaQueries: true,
    preserveFontFaces: true,
    preserveImportant: true,
    inlinePseudoElements: true,
  });
};

export const makeStylesInline: TMakeStylesInline = async (
  templatePath,
  data,
) => {
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(templateSource);
  const html = template(data);

  const htmlWithInlinedStyles = await inlineStyles(html);

  // return htmlWithInlinedStyles;
  // return removeCssClasses(htmlWithInlinedStyles);
  return removeOnlyTWClasses(htmlWithInlinedStyles);
};

import { makeStylesInline } from './makeStylesInline';

describe('renderEmailFromTemplate', () => {
  const templatePath = 'src/mocks/example-template.html';

  test('should render email from template', async () => {
    const placeholderValues = {
      name: 'John Doe',
      thank_you: 'Thank you for signing up!',
      cta_link: 'https://example.com',
      cta_text: 'See all features',
    };

    const inlinedHtml = await makeStylesInline(templatePath, placeholderValues);

    expect(inlinedHtml).toEqual(`<html>
  <head>
    <title>Test title</title>
  </head>
  <body>
    <div class="my-class" style="position: relative; z-index: 20; max-width: 512px; padding-left: 16px; padding-top: 40px;">
      <span class="" style="margin-right: 20px; color: #fde047;">Welcome, John Doe</span>
    </div>
    <div>
      <a href="https://example.com" class="" style="background-color: #3b82f6;">See all features</a>
      <div class="" style="background-image: url('https://example.com/custom-image.png'); background-repeat: no-repeat;"></div>
    </div>
  </body>
</html>
`);
  });
});

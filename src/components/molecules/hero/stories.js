import React from 'react';
import { storiesOf } from '@storybook/react';
import { checkA11y } from '@storybook/addon-a11y';
import { withKnobs, text } from '@storybook/addon-knobs';

import Hero from '.';

storiesOf('Molecules/Hero', module)
  .addDecorator(checkA11y)
  .addDecorator(withKnobs)
  .add('Default', () => (<Hero
    title={text('Title', 'Blog Name')}
    image={text('Image', '../../../../static/hero-cover.jpg')}
    color={text('Color', '#288dc1')}
    tagline={text('Tagline', 'Blog Tagline')}
  />
  ));

# ScoreSwiper Component

A responsive swiper component for displaying game scorecards using Swiper.js.

## Features

- **Responsive Design**: Adapts slides per view based on screen size
- **Custom Navigation**: Styled prev/next buttons matching the design system
- **Smooth Transitions**: Slide effect with 300ms speed
- **Touch Support**: Works on mobile devices
- **Keyboard Navigation**: Accessible with keyboard controls

## Configuration

| Screen Size | Slides Per View | Space Between |
|-------------|----------------|---------------|
| Mobile      | 1              | 8px           |
| Landscape Mobile | 1         | 8px           |
| Landscape Tablet | 3         | 8px           |
| Desktop     | 4              | 8px           |

## Usage

```tsx
import ScoreSwiper from '@/components/swiper/ScoreSwiper';
import { getGames } from '@/lib/api/games/games';

export default async function GamesPage() {
  const gamesData = await getGames({
    limit: 10,
    publishedOnly: true,
    sortDirection: 'desc',
  });

  return (
    <div>
      <h2>Recent Games</h2>
      <ScoreSwiper games={gamesData.docs} />
    </div>
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `games` | `Game[]` | Array of game objects from the API |
| `lsLogoUrl` | `string` (optional) | Custom LS logo URL, defaults to `/images/logo.png` |

## Styling

The component uses CSS modules and follows the project's design system:
- Uses CSS custom properties for colors and spacing
- Responsive breakpoints match the design specifications
- Navigation buttons styled to match the Figma design

## Dependencies

- `swiper` - Swiper.js library
- `ScoreboardCard` - Individual game card component

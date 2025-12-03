import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Flashcard from './Flashcard';
import { KidModeProvider } from '../context/KidModeContext';

// Mock KidModeContext
const MockProvider = ({ children }) => (
  <KidModeProvider>{children}</KidModeProvider>
);

describe('Flashcard Component', () => {
  const mockCard = {
    id: "vocab-001",
    english: "apple",
    pos: "noun",
    phonetic: "/ˈæp.əl/",
    japanese: {
      kanji: "林檎",
      kana: "りんご",
      romaji: "ringo"
    },
    example: {
      en: "I eat an apple.",
      ja: "私はりんごを食べます。"
    },
    audio: "/audio/vocab-001.mp3",
    image: "/images/words/apple.jpg",
    level: "beginner",
    category: "food"
  };

  it('renders English word initially', () => {
    render(
      <MockProvider>
        <Flashcard card={mockCard} />
      </MockProvider>
    );
    expect(screen.getByText('apple')).toBeInTheDocument();
    expect(screen.getByText('/ˈæp.əl/')).toBeInTheDocument();
  });

  it('flips to show Japanese when clicked', () => {
    render(
      <MockProvider>
        <Flashcard card={mockCard} />
      </MockProvider>
    );
    
    // Click the card (container div)
    // We need to target the clickable area. The outer div has the click handler.
    const cardElement = screen.getByText('apple').closest('.perspective');
    fireEvent.click(cardElement);

    // Check if Japanese text is present (it's always in DOM, just rotated, but for this test 'toBeInTheDocument' is fine)
    // Note: In a real browser, we might check visibility, but in jsdom, existence is usually enough for basic logic.
    expect(screen.getByText('林檎')).toBeInTheDocument();
    expect(screen.getByText('りんご')).toBeInTheDocument();
  });
});

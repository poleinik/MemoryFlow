import { ReactNode, useEffect, useState } from 'react';
import ExpandableCard from 'src/components/ExpandableCard';
import FlipCard from 'src/components/FlipCard';

type ExpandableFlipCardProps = {
  renderPreview: (params: { onPress: () => void }) => ReactNode;
  frontContent: ReactNode;
  backContent: ReactNode;
  expandedBottomContent?: ReactNode;
  expandedContentPlacement?: 'bottom' | 'side';
  hidePreviewWhenOpen?: boolean;
  autoOpen?: boolean;
  initialExpanded?: boolean;
  isExpanded?: boolean;
  isFlipped?: boolean;
  showBackdrop?: boolean;
  expandedTopInset?: number;
  expandedBottomInset?: number;
  overlayOpacity?: number;
  width?: number | `${number}%`;
  aspectRatio?: number;
  openDuration?: number;
  flipDuration?: number;
  onOpenChange?: (isOpen: boolean) => void;
  onFlipChange?: (isFlipped: boolean) => void;
};

export default function ExpandableFlipCard({
  renderPreview,
  frontContent,
  backContent,
  expandedBottomContent,
  expandedContentPlacement = 'bottom',
  hidePreviewWhenOpen = false,
  autoOpen = false,
  initialExpanded = false,
  isExpanded,
  isFlipped,
  showBackdrop = true,
  expandedTopInset = 0,
  expandedBottomInset = 0,
  overlayOpacity = 0.5,
  width = '90%',
  aspectRatio = 1.25,
  openDuration = 220,
  flipDuration = 360,
  onOpenChange,
  onFlipChange,
}: ExpandableFlipCardProps) {
  const [internalIsFlipped, setInternalIsFlipped] = useState(isFlipped ?? false);
  const displayedIsFlipped = isFlipped ?? internalIsFlipped;
  const resetFlipState = () => {
    if (isFlipped === undefined) {
      setInternalIsFlipped(false);
    }
    onFlipChange?.(false);
  };

  const handleFlipChange = (nextValue: boolean) => {
    if (isFlipped === undefined) {
      setInternalIsFlipped(nextValue);
    }
    onFlipChange?.(nextValue);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    resetFlipState();
    onOpenChange?.(nextOpen);
  };

  useEffect(() => {
    if (isFlipped === undefined) {
      return;
    }

    setInternalIsFlipped(isFlipped);
  }, [isFlipped]);

  return (
    <ExpandableCard
      renderPreview={renderPreview}
      renderExpandedContent={({ cardWidth, cardHeight }) => (
        <FlipCard
          style={{ width: cardWidth, height: cardHeight }}
          frontContent={frontContent}
          backContent={backContent}
          isFlipped={displayedIsFlipped}
          flipDuration={flipDuration}
          onFlipChange={handleFlipChange}
        />
      )}
      expandedBottomContent={expandedBottomContent}
      expandedContentPlacement={expandedContentPlacement}
      hidePreviewWhenOpen={hidePreviewWhenOpen}
      autoOpen={autoOpen}
      initialExpanded={initialExpanded}
      isExpanded={isExpanded}
      showBackdrop={showBackdrop}
      expandedTopInset={expandedTopInset}
      expandedBottomInset={expandedBottomInset}
      overlayOpacity={overlayOpacity}
      width={width}
      aspectRatio={aspectRatio}
      openDuration={openDuration}
      onOpenChange={handleOpenChange}
    />
  );
}

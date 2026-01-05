import { BlockShape, Position } from '@/lib/gameTypes';
import { BlockPiece } from './BlockPiece';

interface BlockTrayProps {
  blocks: BlockShape[];
  onDragStart: (block: BlockShape) => void;
  onDragEnd: (position: Position | null) => void;
}

export function BlockTray({ blocks, onDragStart, onDragEnd }: BlockTrayProps) {
  return (
    <div className="flex items-center justify-center gap-4 p-4">
      {blocks.map((block) => (
        <BlockPiece
          key={block.id}
          block={block}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ))}
    </div>
  );
}

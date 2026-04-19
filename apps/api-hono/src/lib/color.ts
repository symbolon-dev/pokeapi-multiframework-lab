import { Buffer } from 'node:buffer';
import { getColor } from 'colorthief';

import { logger } from './logger';

export async function extractDominantColor(spriteUrl: string): Promise<string | undefined> {
    try {
        const res = await fetch(spriteUrl);
        if (!res.ok)
            return undefined;

        const arrayBuffer = await res.arrayBuffer();
        const uint8 = new Uint8Array(arrayBuffer);
        const color = await getColor(Buffer.from(uint8));

        return color?.css('oklch') ?? undefined;
    }
    catch (err) {
        logger.warn({ err, spriteUrl }, 'Failed to extract dominant color');
        return undefined;
    }
}

import { Buffer } from 'node:buffer';
import { getColor } from 'colorthief';

import { logger } from '@/utils/logger';

export async function extractDominantColor(spriteUrl: string): Promise<string | undefined> {
    try {
        const res = await fetch(spriteUrl);
        if (!res.ok)
            return undefined;

        const buffer = Buffer.from(await res.arrayBuffer());
        const color = await getColor(buffer);
        return color?.css('oklch') ?? undefined;
    }
    catch (err) {
        logger.warn({ err, spriteUrl }, 'Failed to extract dominant color');
        return undefined;
    }
}

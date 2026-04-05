import { Buffer } from 'node:buffer';
import { getColor } from 'colorthief';

import { logger } from '@/utils/logger';

export async function extractDominantColor(spriteUrl: string): Promise<string | undefined> {
    try {
        const res = await fetch(spriteUrl);
        if (!res.ok)
            return undefined;

        const contentType = res.headers.get('content-type') ?? 'image/png';
        const buffer = Buffer.from(await res.arrayBuffer());
        const color = await getColor({ buffer, type: contentType });
        return color?.css('oklch') ?? undefined;
    }
    catch (err) {
        logger.warn({ err, spriteUrl }, 'Failed to extract dominant color');
        return undefined;
    }
}

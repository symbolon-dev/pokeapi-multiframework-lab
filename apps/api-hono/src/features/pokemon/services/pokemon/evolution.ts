import type { EvolutionChain, EvolutionNode, EvolutionRequirement } from '@repo/types';

const ARTWORK_BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';
const TRAILING_SLASH_RE = /\/$/;

function extractIdFromUrl(url: string): number {
    return Number(url.replace(TRAILING_SLASH_RE, '').split('/').pop());
}

function mapEvolutionRequirement(details: EvolutionChain['evolution_details'][0] | undefined): EvolutionRequirement | undefined {
    if (!details) {
        return undefined;
    }

    const requirement: EvolutionRequirement = {
        trigger: details.trigger.name,
    };

    if (details.item) {
        requirement.item = details.item;
    }
    if (details.min_level != null) {
        requirement.minLevel = details.min_level;
    }
    if (details.location) {
        requirement.location = details.location;
    }
    if (details.min_happiness != null) {
        requirement.minHappiness = details.min_happiness;
    }
    if (details.min_affection != null) {
        requirement.minAffection = details.min_affection;
    }
    if (details.time_of_day != null) {
        requirement.timeOfDay = details.time_of_day;
    }
    if (details.known_move_type) {
        requirement.knownMoveType = details.known_move_type;
    }
    if (details.min_beauty != null) {
        requirement.minBeauty = details.min_beauty;
    }
    if (details.relative_physical_stats != null) {
        requirement.relativePhysicalStats = details.relative_physical_stats;
    }
    if (details.needs_overworld_rain != null) {
        requirement.needsOverworldRain = details.needs_overworld_rain;
    }
    if (details.turn_upside_down != null) {
        requirement.turnUpsideDown = details.turn_upside_down;
    }
    if (details.gender != null) {
        requirement.gender = details.gender;
    }
    if (details.held_item) {
        requirement.heldItem = details.held_item;
    }
    if (details.known_move) {
        requirement.knownMove = details.known_move;
    }
    if (details.party_species) {
        requirement.partySpecies = details.party_species;
    }
    if (details.party_type) {
        requirement.partyType = details.party_type;
    }
    if (details.trade_species) {
        requirement.tradeSpecies = details.trade_species;
    }

    return requirement;
}

export function mapEvolutionChain(chain: EvolutionChain): EvolutionNode {
    const id = extractIdFromUrl(chain.species.url);

    const children = chain.evolves_to?.map((evo: EvolutionChain) =>
        mapEvolutionChain(evo),
    ) ?? [];

    const requirement = mapEvolutionRequirement(chain.evolution_details?.[0]);

    return {
        name: chain.species.name,
        id,
        sprite: `${ARTWORK_BASE_URL}/${id}.png`,
        ...(requirement && { requirement }),
        children,
    };
}

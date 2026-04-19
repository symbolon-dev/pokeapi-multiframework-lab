import type { TypeDetails, TypeDetailsApi } from '@/features/pokemon/schemas/pokemon.types';

export function mapTypeDetails(apiData: TypeDetailsApi): TypeDetails {
    return {
        id: apiData.id,
        name: apiData.name,
        damageRelations: {
            doubleDamageTo: apiData.damage_relations.double_damage_to.map(t => t.name),
            doubleDamageFrom: apiData.damage_relations.double_damage_from.map(t => t.name),
            halfDamageTo: apiData.damage_relations.half_damage_to.map(t => t.name),
            halfDamageFrom: apiData.damage_relations.half_damage_from.map(t => t.name),
            noDamageTo: apiData.damage_relations.no_damage_to.map(t => t.name),
            noDamageFrom: apiData.damage_relations.no_damage_from.map(t => t.name),
        },
    };
}

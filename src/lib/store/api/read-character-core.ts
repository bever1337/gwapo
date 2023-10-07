import { api } from '.';
import { makeSelectIsInScope } from '../selectors';

import { Scope } from '../../types/token';

export interface ReadCharacterCoreArguments {
	characterName: string;
}

export interface ReadCharacterCoreResult {
	name: string;
	race: 'Asura' | 'Charr' | 'Human' | 'Norn' | 'Sylvari';
	gender: 'Female' | 'Male';
	profession:
		| 'Elementalist'
		| 'Engineer'
		| 'Guardian'
		| 'Mesmer'
		| 'Necromancer'
		| 'Ranger'
		| 'Revenant'
		| 'Thief'
		| 'Warrior';
	level: number;
	guild?: string;
	age: number;
	last_modified: string;
	created: string;
	deaths: number;
	title?: string;
}

const scopes = [Scope.Account, Scope.Characters];
const scopeTags = [{ type: 'access_token' as const, id: 'LIST' }].concat(
	scopes.map((scope) => ({
		type: 'access_token' as const,
		id: scope
	}))
);

export const injectedApi = api.injectEndpoints({
	endpoints(build) {
		return {
			readCharactersCore: build.query<ReadCharacterCoreResult, ReadCharacterCoreArguments>({
				extraOptions: {
					baseUrl: 'https://api.guildwars2.com',
					scope: scopes
				},
				providesTags(result, error) {
					const defaultTags = [{ id: 'LIST', type: 'characters' as const }, ...scopeTags];
					if (result && !error) {
						defaultTags.push({ id: result.name, type: 'characters' });
					}
					return defaultTags;
				},
				query(queryArguments) {
					return {
						url: `/v2/characters/${encodeURI(queryArguments.characterName)}/core`,
						validateStatus(response, body) {
							return response.status === 200 && body.name === queryArguments.characterName;
						}
					};
				}
			})
		};
	}
});

export const readCharactersCore = injectedApi.endpoints.readCharactersCore;
export const selectReadCharactersInScope = makeSelectIsInScope(scopes);

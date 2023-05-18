export interface TerrainData {
    id: number;
    data: number;
    type: string;
    year: number;
    terrain_id: number;
}

export  interface Terrain {
    id: number;
    name: string;
    price: number;
    creator_id: number;
    type: string;
    last_change_time: string;
    last_change_id: number;
    terrainsData: TerrainData[];
}
import { RecetteData, rooms } from '~/data/data';
function flatten(arr: any[][]) {
    return [].concat(...arr);
}
const recettes: RecetteData[] = flatten(rooms.map(room => flatten(room.data.sections.map(s => s.recettes)))).filter(r => !!r);

// export class DataItemService {
export function getRecettes() {
    return recettes;
}

export function getRooms() {
    return rooms.map(r => {
        const { data, ...props } = r;
        return props;
    });
}
export function getRoomData(roomTitle: string) {
    const index = rooms.findIndex(r => r.title === roomTitle);
    if (index >= 0) {
        return rooms[index];
    }
}
export function getRecetteData(recetteTitle: string) {
    const index = recettes.findIndex(r => r.title === recetteTitle);
    if (index >= 0) {
        return recettes[index];
    }
}
// }

import { imageAPIData } from "../interfaces/imageAPI"

export const imageAssets = (url = 'https://picsum.photos/v2/list?limit=10') : Promise<imageAPIData[]> => {
    return new Promise((res, rej) => {
        const images = fetch(url).then(response => response.json())
        if(images === undefined) return rej([])

        return res(images)
    })
}
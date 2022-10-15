import {Uploader} from "@milkdown/plugin-upload";
import api from "./Api";
import type { Node } from 'prosemirror-model';

export const MilkdownImageUploader: Uploader = async (files, schema) => {
    const images: File[] = [];

    for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (!file) {
            continue;
        }

        // You can handle whatever the file type you want, we handle image here.
        if (!file.type.includes('image')) {
            continue;
        }

        images.push(file);
    }

    const nodes: Node[] = await Promise.all(
        images.map(async (image) => {
            const src = await api().post('api/tasks/attachImage', image);
            const alt = image.name;
            return schema.nodes.image.createAndFill({
                src,
                alt,
            }) as Node;
        }),
    );

    return nodes;
};

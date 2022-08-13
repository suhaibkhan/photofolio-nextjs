export interface ImageType {
    name: string;
    tags: string[];
    height: number;
    width: number;
    title?: string;
}

export interface Size {
    width: number;
    height: number;
}

export interface Position extends Size {
    top: number;
    left: number;
}